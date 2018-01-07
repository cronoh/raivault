import { Component, OnInit } from '@angular/core';
import {RpcService} from "../rpc.service";
import {FormControl} from "@angular/forms";
import {WalletService} from "../wallet.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  accounts: any[] = [];
  accountHistory: any[] = [];

  constructor(private walletApi: RpcService, private walletService: WalletService) { }

  async ngOnInit() {
    this.accounts = this.walletService.wallet.accounts;
  }

  async getAccountHistory(account) {
    this.accountHistory = [];

    const history = await this.walletApi.accountHistory(account);
    if (history && history.history && Array.isArray(history.history)) {
      this.accountHistory = history.history;
    }
  }

}
