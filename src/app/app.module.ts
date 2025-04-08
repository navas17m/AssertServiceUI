//import 'pace';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing';
import { AppConfig } from './app.config';
import { AppComponent } from './app.component';
import { ErrorComponent } from './pages/error/error.component';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common'; //import 'pace';
import { DevExtremeModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ModalModule,
    AppRoutingModule,
    CommonModule,

  ],
  providers: [AppConfig,BsModalService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
