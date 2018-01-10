import { Injectable } from '@angular/core';
import {BigNumber} from "bignumber.js";
import {RpcService} from "./rpc.service";
import * as Rx from 'rxjs'
import {AddressBookService} from "./address-book.service";

export interface RaiWallet {
  id: string|null;
  locked: boolean;
  balance: number|BigNumber;
  pending: number|BigNumber;
  accounts: RaiAccount[];
  pendingTransactions: RaiPendingTransaction[];
}

export interface RaiAccount {
  id: string;
  balance: number|BigNumber;
  pending: number|BigNumber;
  addressBookName: string|null;
}

export interface RaiNode {
  online: boolean;
  count: number|BigNumber;
  unchecked: number|BigNumber;
}

export interface RaiPendingTransaction {
  block: string;
  amount: number|BigNumber;
  source: string;
  account: string;
}

@Injectable()
export class WalletService {
  node: RaiNode = {
    online: false,
    count: 0,
    unchecked: 0,
  };

  kxrb = new BigNumber(1000000000000000000000000000);
  rai = new BigNumber(1000000000000000000000000);
  mxrb = new BigNumber(1000000000000000000000000000000);

  wallet: RaiWallet = {
    id: null,
    locked: false,
    balance: 0,
    pending: 0,
    accounts: [],
    pendingTransactions: [],
  };
  wallet$ = new Rx.BehaviorSubject(this.wallet);
  walletLocked$ = this.wallet$.map(w => w.locked);
  accounts$ = this.wallet$.map(w => w.accounts);

  constructor(public walletApi: RpcService, private addressBook: AddressBookService) { }

  async loadWalletID() {
    try {
      const appConfig = await this.walletApi.getAppConfig();
      const walletID = appConfig.walletID;
      if (walletID && walletID.length) {
        this.wallet.id = walletID;
      }
    } catch (err) {
      // Unable to load app config, or no wallet id.
    }

    return this.wallet.id;
  }

  // async loadWallet() {
  //   const walletID = await this.loadWalletID();
  //
  //   if (!walletID) return;
  //
  //   await this.reloadWallet();
  // }

  async setWalletID(walletID) {
    const updated = await this.walletApi.saveAppConfig({ walletID });

    this.wallet.id = walletID;
    await this.reloadWallet();
  }

  /**
   * Reload the full wallet and accounts
   * @returns {Promise<void>}
   */
  async reloadWallet() {
    // this.accounts = [];
    this.wallet.locked = false;
    this.wallet.balance = 0;
    this.wallet.pending = 0;
    this.wallet.accounts = [];
    this.wallet.pendingTransactions = [];

    if (!this.node.online) return this.pushWalletUpdate(); // Node is offline, can't go much further
    if (!this.wallet.id || !this.wallet.id.length) return this.pushWalletUpdate(); // Wallet ID is not configured yet.

    // Load the accounts for this wallet, compute some totals
    const accounts = await this.walletApi.walletBalances(this.wallet.id);
    for (let account in accounts.balances) {
      this.wallet.balance = new BigNumber(accounts.balances[account].balance).plus(this.wallet.balance);
      this.wallet.pending = new BigNumber(accounts.balances[account].pending).plus(this.wallet.pending);

      const bookEntry = this.addressBook.getAccountName(account);
      const newAccount: RaiAccount = {
        id: account,
        balance: new BigNumber(accounts.balances[account].balance),
        pending: new BigNumber(accounts.balances[account].pending),
        addressBookName: bookEntry ? bookEntry.name : null,
      };
      this.wallet.accounts.push(newAccount);
    }

    // If we have a pending balance, load them so we can get a count
    if (this.wallet.pending > 0) {
      this.wallet.pendingTransactions = await this.loadPendingTransactions();
    }

    // Determine if the wallet is locked
    const locked = await this.walletApi.walletLocked(this.wallet.id);
    this.wallet.locked = locked.locked === '1';

    // Push new wallet information out to subscribers
    this.pushWalletUpdate();

    return this.wallet;
  }

  pushWalletUpdate() {
    this.wallet$.next(this.wallet);
  }

  async pollNodeStatus() {
    await this.checkNodeStatus();
    setTimeout(async () => {
      await this.pollNodeStatus();
    }, 60 * 1000);
  }

  async checkNodeStatus() {
    const previouslyOffline = this.node.online === false;
    try {
      const blockCount = await this.walletApi.blockCount();
      this.node.online = true;
      this.node.count = blockCount.count;
      this.node.unchecked = blockCount.unchecked;
      if (previouslyOffline) {
        await this.reloadWallet();
      }
    } catch (err) {
      this.node.online = false;
    }
  }

  walletIsLocked() {
    return this.wallet.locked;
  }
  walletIsunlocked() {
    return !this.wallet.locked;
  }

  async lockWallet() {
    const locked = await this.walletApi.walletLock(this.wallet.id);
    this.wallet.locked = locked.locked === '1';

    return this.wallet.locked;
  }

  async unlockWallet(password) {
    const res = await this.walletApi.walletPasswordEnter(this.wallet.id, password);
    const success = res.valid === '1';
    this.wallet.locked = !success;

    return success;
  }

  async loadPendingTransactions() {
    const pendingTransactions = [];

    if (!this.node.online || !this.wallet.id) {
      this.wallet.pendingTransactions = pendingTransactions;
      return this.wallet.pendingTransactions;
    }

    const pending = await this.walletApi.walletPending(this.wallet.id, 50);
    if (!pending || !pending.blocks) {
      this.wallet.pendingTransactions = pendingTransactions;
      return this.wallet.pendingTransactions;
    }

    // Redo pending balance
    this.wallet.pending = 0;

    for (let account in pending.blocks) {
      if (!pending.blocks.hasOwnProperty(account)) continue;
      for (let block in pending.blocks[account]) {
        if (!pending.blocks[account].hasOwnProperty(block)) continue;
        this.wallet.pending = new BigNumber(pending.blocks[account][block].amount).plus(this.wallet.pending);

        const pendingTx = {
          block: block,
          amount: pending.blocks[account][block].amount,
          source: pending.blocks[account][block].source,
          account: account,
        };
        pendingTransactions.push(pendingTx);
      }
    }

    this.wallet.pendingTransactions = pendingTransactions;

    return this.wallet.pendingTransactions;
  }

  async pollPendingTransactions() {
    await this.loadPendingTransactions();
    setTimeout(async () => {
      await this.pollPendingTransactions();
    }, 30 * 1000);
  }
}
