import { Component, OnInit } from '@angular/core';
import {RpcService} from "../rpc.service";
import {FormControl} from "@angular/forms";
import {WalletService} from "../wallet.service";
import {NotificationService} from "../notification.service";
import {ModalService} from "../modal.service";
import {AddressBookService} from "../address-book.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  accountHistory: any[] = [];

  accounts$ = this.walletService.accounts$;

  constructor(private walletService: WalletService, private notifications: NotificationService, public modal: ModalService, private addressBook: AddressBookService) { }

  async ngOnInit() {
  }

  async getAccountHistory(account) {
    this.accountHistory = [];

    const history = await this.walletService.walletApi.accountHistory(account);
    if (history && history.history && Array.isArray(history.history)) {
      this.accountHistory = history.history.map(h => {
        const addressBookEntry = this.addressBook.getAccountName(h.account);
        h.addressBookName = addressBookEntry ? addressBookEntry.name : null;

        return h;
      });
    }
  }

}
