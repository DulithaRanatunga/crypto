import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { TabsModule } from 'ngx-bootstrap';
import { AppComponent } from './app.component';
import { DisplayRawDataComponent } from './display-raw-data/display-raw-data.component';
import { SelectedRoutesComponent } from './selected-routes/selected-routes.component';


@NgModule({
  declarations: [
    AppComponent,
    DisplayRawDataComponent,
    SelectedRoutesComponent
  ],
  imports: [
    TabsModule.forRoot(),
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
