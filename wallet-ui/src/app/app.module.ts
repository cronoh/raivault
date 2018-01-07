import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { AccountsComponent } from './accounts/accounts.component';
import { AppRoutingModule } from './app-routing.module';
import {RpcService} from "./rpc.service";
import { SqueezePipe } from './squeeze.pipe';
import { HistoryComponent } from './history/history.component';
import { SendComponent } from './send/send.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WalletService} from "./wallet.service";
import { ReceiveComponent } from './receive/receive.component';
import { ConfigureComponent } from './configure/configure.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RaiPipe } from './rai.pipe';
import { ManageWalletComponent } from './manage-wallet/manage-wallet.component';
import { NotificationsComponent } from './notifications/notifications.component';
import {NotificationService} from "./notification.service";
import { WalletWidgetComponent } from './wallet-widget/wallet-widget.component';
import { ConfigureWalletComponent } from './configure-wallet/configure-wallet.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    SqueezePipe,
    HistoryComponent,
    SendComponent,
    ReceiveComponent,
    ConfigureComponent,
    WelcomeComponent,
    RaiPipe,
    ManageWalletComponent,
    NotificationsComponent,
    WalletWidgetComponent,
    ConfigureWalletComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    RpcService,
    WalletService,
    NotificationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
