import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BtcmarketsService } from './btcmarkets.service';
import { Exchange, FetchState } from './app.model';
import { IndependentReserveService } from './independent-reserve.service';
import { CoinbaseService } from './coinbase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BtcmarketsService, IndependentReserveService, CoinbaseService],
})
export class AppComponent {
  public exchanges: Exchange[] = [];
  public FETCHSTATE = FetchState;

  public constructor(btcmarkets: BtcmarketsService, 
    independentReserveService: IndependentReserveService,
    coinbaseService: CoinbaseService) {
    this.exchanges.push(btcmarkets.getExchangeData());
    this.exchanges.push(independentReserveService.getExchangeData());
    this.exchanges.push(coinbaseService.getExchangeData());
  }

}
