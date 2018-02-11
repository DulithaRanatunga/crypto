import { Component, Input } from '@angular/core';
import { Exchange, Currency, Currencies, CurrencyPair } from '../app.model';
import { Route } from '../route.model';


@Component({
  selector: 'selected-routes',
  templateUrl: './selected-routes.component.html',
  styleUrls: ['./selected-routes.component.css']
})
export class SelectedRoutesComponent {
  @Input()
  public exchanges: Exchange[];

  @Input()
  public routes: Route[] = [];
}
