import { Currency, Exchange, Currencies, CurrencyPair } from './app.model';

export interface Route {
    start: RouteState,
    end: RouteState,
    profit: number,
    percentageGain: number,
    operations: Operation[],
  }
  
  interface Operation {
    type: 'START' | 'TRADE' | 'TRANSFER';
    fromState?: RouteState,
    toState?: RouteState
  }
  
  interface RouteState {
    ammount: number;
    currency: Currency;
    exchange: Exchange;
  }
  
  export class RouteBuilder {
  
    private currentState: RouteState;
    private operations: Operation[] = [];
  
    public constructor(private exchanges: Exchange[]) { }
  
    public start(price, currencyName: string, exchangeName: string): RouteBuilder {
      const currency: Currency = Currencies.getCurrency(currencyName);
      const exchange: Exchange = this.exchanges.find(ex => ex.name === exchangeName);
      this.storeOperation('START', {
        ammount: price,
        currency: currency,
        exchange: exchange,
      })
      return this;
    }
  
    public trade(currency: string): RouteBuilder {
      const toCurrency: Currency = Currencies.getCurrency(currency);
      const toAmmount: number = this.convert(toCurrency);
      this.storeOperation('TRADE', {
        ammount: toAmmount,
        currency: toCurrency,
        exchange: this.currentState.exchange
      });
      return this;
    }
  
    public transferTo(exchange: string): RouteBuilder {
      const newExchange: Exchange = this.exchanges.find(ex => ex.name === exchange);
      this.storeOperation('TRANSFER', {
        ammount: this.currentState.ammount - this.getTransferFee(),
        currency: this.currentState.currency,
        exchange: newExchange
      });
      return this;
    }
  
    public build(): Route {
      const start: RouteState = this.operations[0].toState;
      return {
        start: start,
        end: this.currentState,
        profit: this.currentState.ammount - start.ammount,
        percentageGain: (this.currentState.ammount/start.ammount - 1) * 100,
        operations: this.operations
      }
    }
  
    private storeOperation(type, newState): void {
      this.operations.push({
        type: type,
        fromState: Object.assign({}, this.currentState),
        toState: newState,
      });
      this.currentState = newState;
    }
  
    private getTransferFee(): number {
      return this.currentState.exchange.fees.find(curr => curr.currency === this.currentState.currency).ammount;
    }
  
    private convert(toCurrency: Currency): number {
      if (!this.currentState.exchange) {
        console.error('unknown exchange/pair');
        debugger;
      }
      const pair: CurrencyPair = this.currentState.exchange.pairs.find(pair =>
        (pair.from === toCurrency && pair.to === this.currentState.currency) ||
        (pair.to === toCurrency && pair.from === this.currentState.currency));
      if (!pair) {
        console.log(`Error:: Currency pair not found:: ${this.currentState.currency.name} -> ${toCurrency.name} in exchange ${this.currentState.exchange.name}`);
      }
      return pair.to === this.currentState.currency ? (this.currentState.ammount / pair.bid) : (this.currentState.ammount * pair.ask);
    }
  }
  