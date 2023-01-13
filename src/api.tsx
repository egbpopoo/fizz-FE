import axios from "axios";
import { Bank, Transaction, User } from "./types";
import { validateUsername } from "./utils";

class API {
  private localBaseHostUrl = "http://localhost:3999/v0/api";
  private baseUrl = "https://egb-fizz-backend.herokuapp.com/v0/api";
  private homeRoute = "/home";
  private userRoute = "/user";
  private bankRoute = "/bank";
  private repaymentRoute = "/repayment";
  private test = false;

  constructor() {}
  async signUpWithUserName(username: string): Promise<User> {
    try {
      const strippedUserName = validateUsername(username);
      const url = this.test
        ? this.localBaseHostUrl + this.userRoute
        : this.baseUrl + this.userRoute;
      const data = {
        username: strippedUserName,
      };
      const response = await axios.post(url, data);
      return this.getUserFromData(response.data.user);
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  async signInWithUserName(username: string): Promise<User> {
    try {
      const strippedUserName = validateUsername(username);
      const url = this.test
        ? this.localBaseHostUrl + this.userRoute
        : this.baseUrl + this.userRoute;
      const response = await axios.get(url, {
        params: {
          username: strippedUserName,
        },
      });
      return this.getUserFromData(response.data.user);
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  async makePayment(userId: string, amount: Number): Promise<Bank> {
    try {
      const data = { userId: userId, amount: amount, refund: false };
      const url = this.test
        ? this.localBaseHostUrl + this.bankRoute
        : this.baseUrl + this.bankRoute;

      const response = await axios.post(url, data);
      const user = this.getUserFromData(response.data.bank._userAccount);
      console.log(response.data.bank._transactions);
      const transactions = response.data.bank._transactions.map(
        (transaction: any) => {
          return this.getTransactionFromData(transaction);
        }
      );
      const bank: Bank = {
        account: user.account,
        transactions: transactions,
      };

      return bank;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  async getBank(userId: string) {
    try {
      const url = this.test
        ? this.localBaseHostUrl + this.bankRoute
        : this.baseUrl + this.bankRoute;
      const response = await axios.get(url, {
        params: {
          userId: userId,
        },
      });
      const user = this.getUserFromData(response.data.bank._userAccount);
      const transactions = response.data.bank._transactions.map(
        (transaction: any) => {
          return this.getTransactionFromData(transaction);
        }
      );
      const bank: Bank = {
        account: user.account,
        transactions: transactions,
      };
      return bank;
    } catch (error: any) {
      console.log(error.response.data.message);
      throw new Error(error.response.data.message);
    }
  }

  async performRefund(userId: string, transactionId: string) {
    try {
      const data = {
        userId: userId,
        refund: true,
        transactionId: transactionId,
        amount: 0,
      };
      const url = this.test
        ? this.localBaseHostUrl + this.bankRoute
        : this.baseUrl + this.bankRoute;

      const response = await axios.post(url, data);
      const user = this.getUserFromData(response.data.bank._userAccount);
      const transactions = response.data.bank._transactions.map(
        (transaction: any) => {
          return this.getTransactionFromData(transaction);
        }
      );
      const bank: Bank = {
        account: user.account,
        transactions: transactions,
      };
      console.log(bank);
      return bank;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  async PerformRepayment(userId: string): Promise<Bank> {
    try {
      const data = { userId: userId };
      const url = this.test
        ? this.localBaseHostUrl + this.repaymentRoute
        : this.baseUrl + this.repaymentRoute;

      const response = await axios.post(url, data);
      const user = this.getUserFromData(response.data.info.user);

      const transactions = response.data.info.bank._transactions.map(
        (transaction: any) => {
          return this.getTransactionFromData(transaction);
        }
      );
      const bank: Bank = {
        account: user.account,
        transactions: transactions,
      };
      console.log(bank);
      return bank;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  }

  private getUserFromData(data: any): User {
    const accountStatus = data.accountStatus;
    const id: string = data._id;
    const username: string = data.username;
    const fizzAccountBalance: number = accountStatus.fizzAccountBalance;
    const MainAccountBalance: number = accountStatus.mainAccountBalance;
    const spendingLimit: number = accountStatus.spendingLimit;
    const accountState = accountStatus.accountState;
    const user: User = {
      id: id,
      username: username,
      account: {
        accountState: accountState,
        fizzAccountBalance: fizzAccountBalance,
        mainAccountBalance: MainAccountBalance,
        spendingLimit: spendingLimit,
      },
    };
    return user;
  }

  private getTransactionFromData(data: any): Transaction {
    const amount = data._amount;
    const date = data._date;
    const id = data._id;
    const canPerformRefund = data._canPerformRefund;
    const transactionType = data._transcationType;
    const transaction: Transaction = {
      amount: amount,
      date: date,
      id: id,
      canPerformRefund: canPerformRefund,
      transactionType: transactionType,
    };
    return transaction;
  }
}

export default new API();
