import { Injectable } from '@angular/core';
import {RpcService} from "./rpc.service";
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class AddressBookService {

  addressBook = [];

  addressBook$ = new BehaviorSubject([]);

  constructor(private walletApi: RpcService) { }

  async loadAddressBook() {
    this.addressBook = await this.walletApi.getAddressBook();
    this.addressBook$.next(this.addressBook);

    return this.addressBook;
  }

  async saveAddress(account, name) {
    this.addressBook = await this.walletApi.saveAddressBook(account, name);
    this.addressBook$.next(this.addressBook);
  }

  async deleteAddress(account) {
    this.addressBook = await this.walletApi.deleteAddressBook(account);
    this.addressBook$.next(this.addressBook);
  }

  getAccountName(account) {
    const match = this.addressBook.find(a => a.account.toLowerCase() === account.toLowerCase());
    return match || null;
  }

  nameExists(name) {
    return this.addressBook.findIndex(a => a.name.toLowerCase() === name.toLowerCase()) !== -1;
  }

}
