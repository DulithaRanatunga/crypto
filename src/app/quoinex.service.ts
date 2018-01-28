import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Exchange, CurrencyPair, Currency, FetchState, Currencies } from './app.model';
import { ApiUtils } from './ApiUtils.util';

interface Product {
  id: number;
  market_ask: number;
  market_bid: number;
  currency_pair_code: string;
  last_traded_price: number;
}

@Injectable()
export class QuoinexService {
  private apiURL: string = 'https://api.quoine.com/';

  public constructor(private httpClient: HttpClient) {
  }

  public getExchangeData(): Exchange {
    const exchange: Exchange = {
      name: 'Quoinex',
      url: 'https://www.quoinex.com/home',
      pairs: this.getData(),
      fees: ApiUtils.zeroFees([Currencies.BTC,Currencies.ETH]),
    };
    return exchange;
  }

  private getData(): CurrencyPair[] {
    const pairs: CurrencyPair[] = [];
    const targetPairs: string[] = ['ETHAUD', 'BTCAUD', 'ETHBTC'];
    targetPairs.forEach(pairCode=> {
      const pair: CurrencyPair = {
        from: Currencies.getCurrency(pairCode.slice(0,3)),
        to: Currencies.getCurrency(pairCode.slice(3)),
        fetchState: FetchState.Loading,
      }
      pairs.push(pair);
    });
    this.httpClient.get(`${this.apiURL}/products`).subscribe((data: Product[]) => {
      const products: Product[] = targetPairs.map(pair => data.find(product => product.currency_pair_code === pair));
      for (let i =0; i <products.length; i++) {
        Object.assign(pairs[i], {
          bid: products[i].market_bid ,
          ask: products[i].market_ask,
          last: products[i].last_traded_price,
          fetchState: FetchState.Success,
          fetchTimestamp: new Date(),
        })
      }
    }, error => {
      pairs.forEach(pair => pair.fetchState = FetchState.Error);
    });
    return pairs;
  }
}
