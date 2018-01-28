import { Component, Input } from '@angular/core';
import { Exchange, FetchState } from '../app.model';

@Component({
  selector: 'display-raw-data',
  templateUrl: './display-raw-data.component.html',
  styleUrls: ['./display-raw-data.component.css']
})
export class DisplayRawDataComponent {
  public FETCHSTATE = FetchState;
  @Input()
  public exchanges: Exchange[];
}
