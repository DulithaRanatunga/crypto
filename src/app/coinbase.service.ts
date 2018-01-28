import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Exchange, CurrencyPair, Currency, FetchState, Currencies } from './app.model';

interface CoinbaseApi {
    data: {
        amount: number,
        currency: string,
    }
}

@Injectable()
export class CoinbaseService {
    private apiURL: string = 'https://api.coinbase.com/v2/prices';
    private coinbaseCCfeeForBuying: number = 1.04;

    public constructor(private httpClient: HttpClient) {
    }

    public getExchangeData(): Exchange {
        const exchange: Exchange = {
            name: 'Coinbase',
            url: 'https://www.coinbase.com/buy',
            pairs: []
        };
        exchange.pairs.push(this.getTickData(Currencies.BTC, Currencies.AUD));
        exchange.pairs.push(this.getTickData(Currencies.LTC, Currencies.AUD));
        exchange.pairs.push(this.getTickData(Currencies.ETH, Currencies.AUD));
        exchange.pairs.push(this.getTickData(Currencies.BCH, Currencies.AUD));
        return exchange;
    }

    private getTickData(from: Currency, to: Currency): CurrencyPair {
        const pair: CurrencyPair = {
            from: from,
            to: to,
            fetchState: FetchState.Loading,
        }
        this.httpClient.get(`${this.apiURL}/${from.code}-${to.code}/buy`).subscribe((data: CoinbaseApi) => {
            Object.assign(pair, {
                bid: data.data.amount * this.coinbaseCCfeeForBuying,
                ask: -1,
                last: data.data.amount * this.coinbaseCCfeeForBuying,
                fetchState: FetchState.Success,
                fetchTimestamp: new Date(),
            });
        }, error => {
            pair.fetchState = FetchState.Error;
        });
        this.httpClient.get(`${this.apiURL}/${from.code}-${to.code}/sell`).subscribe((data: CoinbaseApi) => {
            pair.ask = data.data.amount;
        });
        return pair;
    }
}
