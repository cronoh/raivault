import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class RpcService {

  rpcUrl = `http://localhost:3000/api`;

  constructor(private http: HttpClient) { }

  private async request(action, data): Promise<any> {
    data.action = action;
    return await this.http.post(this.rpcUrl, data).toPromise();
  }

  async generateNewSeed(): Promise<any> {
    return await this.http.post(`${this.rpcUrl}/generate-seed`, {}).toPromise();
  }

  async getNodeConfig(): Promise<any> {
    return await this.http.get(`${this.rpcUrl}/node-config`).toPromise();
  }
  async saveNodeConfig(config): Promise<any> {
    return await this.http.post(`${this.rpcUrl}/node-config`, config).toPromise();
  }

  async getAppConfig(): Promise<any> {
    return await this.http.get(`${this.rpcUrl}/app-config`).toPromise();
  }
  async saveAppConfig(config): Promise<any> {
    return await this.http.post(`${this.rpcUrl}/app-config`, config).toPromise();
  }

  async blockCount(): Promise<{count: number, unchecked: number }> {
    return await this.request('block_count', { });
  }
  async walletBalances(wallet): Promise<{balances: any }> {
    return await this.request('wallet_balances', { wallet });
  }
  async walletLocked(wallet): Promise<{locked: '0'|'1'}> {
    return await this.request('wallet_locked', { wallet });
  }
  async walletLock(wallet): Promise<{locked: '0'|'1'}> {
    return await this.request('wallet_lock', { wallet });
  }
  async walletPasswordValid(wallet): Promise<{valid: '0'|'1'}> {
    return await this.request('password_valid', { wallet });
  }
  async walletPasswordEnter(wallet, password): Promise<{valid: '0'|'1'}> {
    return await this.request('password_enter', { wallet, password });
  }
  async walletPasswordChange(wallet, password): Promise<{changed: '0'|'1'}> {
    return await this.request('password_change', { wallet, password });
  }
  async walletExport(wallet): Promise<{json: any}> {
    return await this.request('wallet_export', { wallet });
  }
  async walletCreate(): Promise<{wallet: string}> {
    return await this.request('wallet_create', { });
  }
  async accountCreate(wallet): Promise<{account: string}> {
    return await this.request('account_create', { wallet });
  }
  async accountHistory(account): Promise<{history: any }> {
    return await this.request('account_history', { account, count: 25 });
  }
  async accountList(wallet): Promise<{accounts: any }> {
    return await this.request('account_list', { wallet });
  }
  async accountInfo(account): Promise<any> {
    return await this.request('account_info', { account });
  }
  async send(wallet, source, destination, amount): Promise<any> {
    return await this.request('send', { wallet, source, destination, amount });
  }
  async receive(wallet, account, block): Promise<any> {
    return await this.request('receive', { wallet, account, block });
  }
  async searchPending(wallet): Promise<any> {
    return await this.request('search_pending', { wallet });
  }
  async pending(account, count): Promise<any> {
    return await this.request('pending', { account, count, source: true });
  }
  async walletPending(wallet, count): Promise<any> {
    return await this.request('wallet_pending', { wallet, count, source: true });
  }
  async walletChangeSeed(wallet, seed): Promise<any> {
    return await this.request('wallet_change_seed', { wallet, seed });
  }


  async kraiToRaw(amount): Promise<any> {
    return await this.request('krai_to_raw', { amount });
  }
  async kraiFromRaw(amount): Promise<any> {
    return await this.request('krai_from_raw', { amount });
  }
  async mraiToRaw(amount): Promise<any> {
    return await this.request('mrai_to_raw', { amount });
  }
  async mraiFromRaw(amount): Promise<any> {
    return await this.request('mrai_from_raw', { amount });
  }
  async raiToRaw(amount): Promise<any> {
    return await this.request('rai_to_raw', { amount });
  }
  async raiFromRaw(amount): Promise<any> {
    return await this.request('rai_from_raw', { amount });
  }


}
