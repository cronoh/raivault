import { Component, OnInit } from '@angular/core';
import {RpcService} from "../rpc.service";
import {BigNumber} from "bignumber.js";
import {WalletService} from "../wallet.service";
import {NotificationService} from "../notification.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts$ = this.walletService.accounts$;

  constructor(private walletService: WalletService, private notificationService: NotificationService) { }

  async ngOnInit() {
  }

  async createAccount() {
    if (this.walletService.walletIsLocked()) {
      return this.notificationService.sendError(`Wallet is locked.`);
    }
    try {
      const newAccount = await this.walletService.walletApi.accountCreate(this.walletService.wallet.id);
      if (!newAccount || newAccount.error) return this.notificationService.sendError(`Error creating account.`);

      await this.walletService.reloadWallet();
      this.notificationService.sendSuccess(`Successfully created new account!`);
    } catch (err) {
      this.notificationService.sendError(`Error creating account. Make sure your node is online`);
    }
  }

}
