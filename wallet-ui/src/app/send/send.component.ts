import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {WalletService} from "../wallet.service";
import {RpcService} from "../rpc.service";
import BigNumber from "bignumber.js";
import {NotificationService} from "../notification.service";

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {
  activePanel = 'send';

  accounts = [];
  accounts$ = this.walletService.wallet$.map(w => w.accounts);

  amounts = [
    { name: 'mRai', value: 'mrai'},
    { name: 'kRai', value: 'krai'},
    { name: 'Rai', value: 'rai'},
  ];
  selectedAmount = this.amounts[2];

  toAccountInfo: any = {};

  amount = 0;
  rawAmount: BigNumber|number = 0;
  fromAccount: any = {};
  fromAccountID: any = '';
  toAccount: any = false;
  toAccountID: '';
  toAccountStatus = null;

  constructor(private walletService: WalletService, private walletApi: RpcService, private notificationService: NotificationService) { }

  async ngOnInit() {
    this.accounts = await this.walletService.getAccounts();
  }

  async validateDestination(event) {
    const destAddy = this.toAccountID;
    const accountInfo = await this.walletApi.accountInfo(destAddy);
    if (accountInfo.error) {
      if (accountInfo.error == 'Account not found') {
        this.toAccountStatus = 1;
      } else {
        this.toAccountStatus = 0;
      }
    }
    if (accountInfo && accountInfo.frontier) {
      this.toAccountStatus = 2;
    }
  }

  async confirm() {
    // Do two api requests? or rely on local to save us one call?
    const from = await this.walletService.walletApi.accountInfo(this.fromAccountID);
    const to = await this.walletService.walletApi.accountInfo(this.toAccountID);

    from.balance = new BigNumber(from.balance || 0);
    to.balance = new BigNumber(to.balance || 0);

    this.fromAccount = from;
    this.toAccount = to;

    const rawAmount = await this.getAmountBaseValue(this.amount);
    this.rawAmount = new BigNumber(rawAmount.amount);

    this.activePanel = 'confirm';
  }

  async send() {
    const amount = this.rawAmount;
    const from = this.fromAccountID;
    const to = this.toAccountID;

    if (this.walletService.walletIsLocked()) {
      return this.notificationService.sendWarning(`Wallet must be unlocked`);
    }

    const response = await this.walletApi.send(this.walletService.walletID, from, to, amount);
    if (response && response.block) {
      this.notificationService.sendSuccess(`Successfully sent ${this.amount} ${this.selectedAmount.name}!`);
    } else {
      this.notificationService.sendError(`There was an error sending your transaction: ${response.message}`)
    }

    this.activePanel = 'send';
  }

  async getAmountBaseValue(value) {
    switch (this.selectedAmount.value) {
      default:
      case 'rai': return await this.walletApi.raiToRaw(value);
      case 'mrai': return await this.walletApi.mraiToRaw(value);
      case 'krai': return await this.walletApi.kraiToRaw(value);
    }
  }

}
