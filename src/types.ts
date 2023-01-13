export interface Account {
  accountState: string;
  fizzAccountBalance: number;
  mainAccountBalance: number;
  spendingLimit: number;
}

export interface User {
  id: string;
  username: string;
  account: Account;
}

export interface Bank {
  transactions: Transaction[];
  account: Account;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  canPerformRefund: Boolean;
  transactionType: string;
}
