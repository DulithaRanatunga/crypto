import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BtcmarketsService } from './btcmarkets.service';
import { Exchange, FetchState, CurrencyPair, Currency, Currencies } from './app.model';
import { IndependentReserveService } from './independent-reserve.service';
import { CoinbaseService } from './coinbase.service';
import { QuoinexService } from './quoinex.service';
import { Route, RouteBuilder } from './route.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BtcmarketsService, IndependentReserveService, CoinbaseService, QuoinexService],
})
export class AppComponent {
  public exchanges: Exchange[] = [];
  public FETCHSTATE = FetchState;

  public ausRoutes: Route[] = [];
  public intlRoutes: Route[] = [];
  public investmentStart: number = 1000;
  public btcExchange: Exchange;

  public constructor(
    private btcmarkets: BtcmarketsService, 
    private independentReserveService: IndependentReserveService,
    private coinbaseService: CoinbaseService,
    private quoinexService: QuoinexService) {
      this.recalculate();
      const observable = Observable.create(function subscribe(observer) {
        var id = setInterval(() => {
          observer.next('hi')
        }, 5000);
      }).subscribe(everySecond => {
        this.recalculate();
      }); 
    }
    
    public recalculate(): void {
      if (this.exchanges.length) {
        this.calculateRoutes();
      }
      this.loadData();
    }
    
  public getBtcmExchangeRate(pairFrom: string): number {
    const pair: CurrencyPair = this.btcExchange.pairs.find(pair => pair.from.code === pairFrom && pair.to === Currencies.AUD);
    return pair ? pair.last : undefined;
  }

  private loadData(): void {
    this.exchanges = [];
    this.btcExchange = this.btcmarkets.getExchangeData();
    this.exchanges.push(this.btcExchange);
    this.exchanges.push(this.independentReserveService.getExchangeData());
    this.exchanges.push(this.coinbaseService.getExchangeData());
    this.exchanges.push(this.quoinexService.getExchangeData());
  }

  private calculateRoutes(): void {
    this.calculateAusRoutes();
    this.calculateIntlRoutes();
  }
  
  private calculateAusRoutes(): void {    
    this.ausRoutes = [];
    this.ausRoutes.push(this.startAt('Independent Reserve').trade('BTC').trade('AUD').build());
    this.ausRoutes.push(this.startAt('Independent Reserve').trade('ETH').trade('AUD').build());
    this.ausRoutes.push(this.startAt('BtcMarkets').trade('BTC').trade('AUD').build());
    this.ausRoutes.push(this.startAt('BtcMarkets').trade('ETH').trade('AUD').build());
    this.ausRoutes.push(this.startAt('BtcMarkets').trade('ETH').transferTo('Independent Reserve').trade('AUD').build());
    this.ausRoutes.push(this.startAt('BtcMarkets').trade('BTC').transferTo('Independent Reserve').trade('AUD').build());
    this.ausRoutes.push(this.startAt('Independent Reserve').trade('ETH').transferTo('BtcMarkets').trade('AUD').build());
    this.ausRoutes.push(this.startAt('Independent Reserve').trade('BTC').transferTo('BtcMarkets').trade('AUD').build());
    this.sortByGain(this.ausRoutes);
  }
  
  private calculateIntlRoutes() {
    this.intlRoutes = [];
    const outExchanges: string[] = ["Independent Reserve", "BtcMarkets"];
    outExchanges.forEach(out => {
      this.intlRoutes.push(this.startAt('Coinbase').trade('BTC').transferTo(out).trade('AUD').build());
      this.intlRoutes.push(this.startAt('Coinbase').trade('ETH').transferTo(out).trade('AUD').build());
      this.intlRoutes.push(this.startAt('Quoinex').trade('BTC').transferTo(out).trade('AUD').build());
      this.intlRoutes.push(this.startAt('Quoinex').trade('ETH').transferTo(out).trade('AUD').build());
      this.intlRoutes.push(this.startAt('Quoinex').trade('BTC').trade('ETH').transferTo(out).trade('AUD').build());
      this.intlRoutes.push(this.startAt('Quoinex').trade('ETH').trade('BTC').transferTo(out).trade('AUD').build());
    });
    this.intlRoutes.push(this.startAt('Quoinex').trade('ETH').trade('BTC').trade('AUD').build());
    this.intlRoutes.push(this.startAt('Quoinex').trade('BTC').trade('ETH').trade('AUD').build());
    this.intlRoutes.push(this.startAt('Quoinex').trade('ETH').trade('AUD').build());
    this.intlRoutes.push(this.startAt('Quoinex').trade('BTC').trade('AUD').build());
    this.sortByGain(this.intlRoutes);
  }


  private sortByGain(routes: Route[]) {
    routes.sort((a,b) => { return b.percentageGain - a.percentageGain });
  }
  
  private startAt(exchange: string): RouteBuilder {
    return new RouteBuilder(this.exchanges).start(this.investmentStart, 'AUD', exchange);
  }
}