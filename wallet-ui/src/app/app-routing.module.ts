import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {AccountsComponent} from "./accounts/accounts.component";
import {HistoryComponent} from "./history/history.component";
import {SendComponent} from "./send/send.component";
import {ReceiveComponent} from "./receive/receive.component";
import {ConfigureComponent} from "./configure/configure.component";
import {WelcomeComponent} from "./welcome/welcome.component";
import {ManageWalletComponent} from "./manage-wallet/manage-wallet.component";
import {ConfigureWalletComponent} from "./configure-wallet/configure-wallet.component";
import {AddressBookComponent} from "./address-book/address-book.component";

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'address-book', component: AddressBookComponent },
  { path: 'configure', component: ConfigureComponent },
  { path: 'configure-wallet', component: ConfigureWalletComponent },
  { path: 'manage-wallet', component: ManageWalletComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'send', component: SendComponent },
  { path: 'receive', component: ReceiveComponent },
  { path: 'welcome', component: WelcomeComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }


