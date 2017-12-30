import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Exchange, CurrencyPair, Currency, FetchState, Currencies } from './app.model';

interface BtcApiTick {
  bestBid: number,
  bestAsk: number,
  lastPrice: number,
}

@Injectable()
export class BtcmarketsService {
  private apiURL: string = 'https://api.btcmarkets.net/market/';

  public constructor(private httpClient: HttpClient) {
  }

  public getExchangeData(): Exchange {
    const exchange: Exchange = {
      name: 'BtcMarkets',
      url: 'https://www.btcmarkets.net/home',
      pairs: []
    };
    exchange.pairs.push(this.getTickData(Currencies.BTC, Currencies.AUD));
    exchange.pairs.push(this.getTickData(Currencies.LTC, Currencies.AUD));
    exchange.pairs.push(this.getTickData(Currencies.ETH, Currencies.AUD));
    exchange.pairs.push(this.getTickData(Currencies.XRP, Currencies.AUD));
    exchange.pairs.push(this.getTickData(Currencies.BCH, Currencies.AUD));
    exchange.pairs.push(this.getTickData(Currencies.LTC, Currencies.BTC));
    exchange.pairs.push(this.getTickData(Currencies.ETH, Currencies.BTC));
    exchange.pairs.push(this.getTickData(Currencies.XRP, Currencies.BTC));
    exchange.pairs.push(this.getTickData(Currencies.BCH, Currencies.BTC));
    return exchange;
  }

  private getTickData(from: Currency, to:Currency): CurrencyPair {
    const pair: CurrencyPair = {
      from: from,
      to: to,
      fetchState: FetchState.Loading,
    }
    this.httpClient.get(`${this.apiURL}/${from.code}/${to.code}/tick`).subscribe((data: BtcApiTick) => {
      Object.assign(pair, {
        bid: data.bestBid,
        ask: data.bestAsk,
        last: data.lastPrice,
        fetchState: FetchState.Success,
        fetchTimestamp: new Date(),
      });
    }, error => {
      pair.fetchState = FetchState.Error;
    });
    return pair;
  }
}
