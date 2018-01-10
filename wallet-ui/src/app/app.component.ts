import {Component, OnInit} from '@angular/core';
import {RpcService} from "./rpc.service";
import { BigNumber } from 'bignumber.js';
import {WalletService} from "./wallet.service";
import {AddressBookService} from "./address-book.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  wallet = this.walletService.wallet;
  node = this.walletService.node;

  constructor(private walletApi: RpcService, private walletService: WalletService, private addressBook: AddressBookService) {

  }

  async ngOnInit() {
    await this.walletService.loadWalletID();
    await this.walletService.pollNodeStatus();
    await this.addressBook.loadAddressBook();
    if (this.node.online) {
      await this.walletService.reloadWallet();
      this.wallet = this.walletService.wallet;
    }
    await this.walletService.pollPendingTransactions();
  }
}
