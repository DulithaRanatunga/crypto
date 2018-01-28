import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Exchange, CurrencyPair, Currency, FetchState, Currencies } from './app.model';
import { ApiUtils } from './ApiUtils.util';

interface IndependentReserviceApiTick {
  "CreatedTimestampUtc ": Date ;//UTC timestamp of when the market summary was generated
  "CurrentHighestBidPrice": number ;//Current highest bid on order book
  "CurrentLowestOfferPrice": number ;//Current lowest offer on order book
  "DayAvgPrice": number ;//Weighted average traded price over last 24 hours
  "DayHighestPrice": number ;//Highest traded price over last 24 hours
  "DayLowestPrice": number ;//Lowest traded price over last 24 hours
  "DayVolumeXbt": number ;//Volume of primary currency traded in last 24 hours
  "DayVolumeXbtInSecondaryCurrrency": number ;//Volume of primary currency traded in last 24 hours for chosen secondary currency
  "LastPrice": number ;//Last traded price
  "PrimaryCurrencyCode": string ;//The primary currency being summarised
  "SecondaryCurrencyCode": string ;//The secondary currency being used for pricing
}

@Injectable()
export class IndependentReserveService {

  private apiURL: string = 'https://api.independentreserve.com/Public/';
  private fee: number = 0.5;

  public constructor(private httpClient: HttpClient) {
  }

  public getExchangeData(): Exchange {
    const exchange: Exchange = {
      name: 'Independent Reserve',
      url: 'https://www.independentreserve.com',
      pairs: []
    };

    ["Xbt", "Eth", "Bch"].forEach(primary => {
      ["Usd","Aud", "Nzd"].forEach(secondary => {
        exchange.pairs.push(this.getTickData(primary, secondary));
      })
    })
    
    return exchange;
  }

  private getTickData(from: string, to:string): CurrencyPair {
    const pair: CurrencyPair = {
      from: Currencies.getCurrency(from),
      to:  Currencies.getCurrency(to),
      fetchState: FetchState.Loading,
    }
    this.httpClient.get(`${this.apiURL}GetMarketSummary?primaryCurrencyCode=${from}&secondaryCurrencyCode=${to}`)
    .subscribe((data: IndependentReserviceApiTick) => {
      Object.assign(pair, {
        bid: ApiUtils.applyBuyFee(data.CurrentHighestBidPrice, this.fee),
        ask: ApiUtils.applySellFee(data.CurrentLowestOfferPrice, this.fee),
        last: data.LastPrice,
        fetchState: FetchState.Success,
        fetchTimestamp: new Date(),
      });
    }, error => {
      pair.fetchState = FetchState.Error;
    });
    return pair;
  }
}
