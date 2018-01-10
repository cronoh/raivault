import { Component, OnInit } from '@angular/core';
import {WalletService} from "../wallet.service";
import BigNumber from "bignumber.js";
import {NotificationService} from "../notification.service";
import {AddressBookService} from "../address-book.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {
  activePanel = 'send';

  accounts$ = this.walletService.wallet$.map(w => w.accounts);
  addressBookResults$ = new BehaviorSubject([]);
  showAddressBook = false;

  amounts = [
    { name: 'mRai', value: 'mrai'},
    { name: 'kRai', value: 'krai'},
    { name: 'Rai', value: 'rai'},
  ];
  selectedAmount = this.amounts[2];

  amount = 0;
  rawAmount: BigNumber|number|string = 0;
  fromAccount: any = {};
  fromAccountID: any = '';
  toAccount: any = false;
  toAccountID: '';
  toAccountStatus = null;

  constructor(private walletService: WalletService, private addressBookService: AddressBookService, private notificationService: NotificationService) { }

  async ngOnInit() {
    await this.addressBookService.loadAddressBook();
  }

  searchAddressBook() {
    this.showAddressBook = true;
    const search = this.toAccountID || '';
    const addressBook = this.addressBookService.addressBook;

    const matches = addressBook
      .filter(a => a.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
      .slice(0, 5);

    this.addressBookResults$.next(matches);
  }

  selectBookEntry(account) {
    this.showAddressBook = false;
    this.toAccountID = account;
    this.searchAddressBook();
    this.validateDestination();
  }

  async validateDestination() {
    // The timeout is used to solve a bug where the results get hidden too fast and the click is never registered
    setTimeout(() => this.showAddressBook = false, 400);

    const accountInfo = await this.walletService.walletApi.accountInfo(this.toAccountID);
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

  async sendTransaction() {
    const isValid = await this.walletService.walletApi.validateAccountNumber(this.toAccountID);
    if (!isValid || isValid.valid == '0') return this.notificationService.sendWarning(`To account address is not valid`);
    if (!this.fromAccountID || !this.toAccountID) return this.notificationService.sendWarning(`From and to account are required`);

    const from = await this.walletService.walletApi.accountInfo(this.fromAccountID);
    const to = await this.walletService.walletApi.accountInfo(this.toAccountID);
    if (!from) return this.notificationService.sendError(`From account not found`);

    from.balance = new BigNumber(from.balance || 0);
    to.balance = new BigNumber(to.balance || 0);

    this.fromAccount = from;
    this.toAccount = to;

    const rawAmount = await this.getAmountBaseValue(this.amount || 0);
    if (!rawAmount || rawAmount.error) return this.notificationService.sendError(`Unable to convert amount: ${rawAmount.error}`);

    this.rawAmount = rawAmount.amount;
    const rawAmountBN = new BigNumber(this.rawAmount || 0);

    if (this.amount < 0 || rawAmountBN.lessThan(0)) return this.notificationService.sendWarning(`Amount is invalid`);
    if (from.balance.minus(rawAmountBN).lessThan(0)) return this.notificationService.sendError(`From account does not have enough XRB`);

    this.activePanel = 'confirm';
  }

  async confirmTransaction() {
    if (this.walletService.walletIsLocked()) return this.notificationService.sendWarning(`Wallet must be unlocked`);

    const response = await this.walletService.walletApi.send(this.walletService.wallet.id, this.fromAccountID, this.toAccountID, this.rawAmount);
    if (response && response.block) {
      this.notificationService.sendSuccess(`Successfully sent ${this.amount} ${this.selectedAmount.name}!`);
    } else {
      this.notificationService.sendError(`There was an error sending your transaction: ${response.message}`)
    }

    this.activePanel = 'send';

    await this.walletService.reloadWallet(); // Just sent money, trigger a reload
  }

  async getAmountBaseValue(value) {
    switch (this.selectedAmount.value) {
      default:
      case 'rai': return await this.walletService.walletApi.raiToRaw(value);
      case 'mrai': return await this.walletService.walletApi.mraiToRaw(value);
      case 'krai': return await this.walletService.walletApi.kraiToRaw(value);
    }
  }

}
