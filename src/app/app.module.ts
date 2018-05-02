import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './app-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarService } from './calendar.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [CalendarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
