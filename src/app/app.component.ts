import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BtcmarketsService } from './btcmarkets.service';
import { Exchange, FetchState } from './app.model';
import { IndependentReserveService } from './independent-reserve.service';
import { CoinbaseService } from './coinbase.service';
import { QuoinexService } from './quoinex.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BtcmarketsService, IndependentReserveService, CoinbaseService, QuoinexService],
})
export class AppComponent {
  public exchanges: Exchange[] = [];
  public FETCHSTATE = FetchState;

  public constructor(
    private btcmarkets: BtcmarketsService, 
    private independentReserveService: IndependentReserveService,
    private coinbaseService: CoinbaseService,
    private quoinexService: QuoinexService) {
      this.loadData();
      const observable = Observable.create(function subscribe(observer) {
        var id = setInterval(() => {
          observer.next('hi')
        }, 5000);
      }).subscribe(everySecond => {
        this.loadData();
      }); 
     }

  public loadData(): void {
    this.exchanges = [];
    this.exchanges.push(this.btcmarkets.getExchangeData());
    this.exchanges.push(this.independentReserveService.getExchangeData());
    this.exchanges.push(this.coinbaseService.getExchangeData());
    this.exchanges.push(this.quoinexService.getExchangeData());
  }

}
