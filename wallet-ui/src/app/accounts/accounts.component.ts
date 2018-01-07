import { Component, OnInit } from '@angular/core';
import {RpcService} from "../rpc.service";
import {BigNumber} from "bignumber.js";
import {WalletService} from "../wallet.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  walletID = `3B81D47609AB9961587620DADF99AEA1586800BA6F99E110A6D36DA406E6BE5F`;
  mxrb = 1000000000000000000000000000000;

  // accounts: any[] = [];

  accounts = this.walletService.wallet.accounts;

  accounts$ = this.walletService.wallet$.map(w => w.accounts);

  constructor(private walletApi: RpcService, private walletService: WalletService) { }

  async ngOnInit() {
    this.accounts = this.walletService.wallet.accounts;

    this.walletService.wallet$.subscribe(newWallet => {
      console.log('got a new wallet? ', newWallet);
    })
  }

  async createAccount() {
    const newAccount = await this.walletService.walletApi.accountCreate(this.walletService.wallet.id);

    await this.walletService.reloadWallet();
    this.accounts = this.walletService.wallet.accounts;
  }


}
