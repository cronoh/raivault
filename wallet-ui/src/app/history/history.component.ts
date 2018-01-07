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
  accountHistory: any[] = [];

  accounts$ = this.walletService.accounts$;

  constructor(private walletService: WalletService) { }

  async ngOnInit() {
  }

  async getAccountHistory(account) {
    this.accountHistory = [];

    const history = await this.walletService.walletApi.accountHistory(account);
    if (history && history.history && Array.isArray(history.history)) {
      this.accountHistory = history.history;
    }
  }

}
