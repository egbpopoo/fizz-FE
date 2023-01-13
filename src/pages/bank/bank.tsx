import React, { useEffect, useState } from "react";
import api from "../../api";
import { Bank, Transaction, User } from "../../types";
import { fromNow, validatepaymentAmount } from "../../utils";
import "./bank.css";
import "scrollable-component";
interface BankProps {
  user: User;
}

export default function BankAccount(props: BankProps) {
  const [bank, setBank] = useState<Bank | null>(null);

  const getBank = async () => {
    const updatedBank = await api.getBank(props.user.id);
    setBank(updatedBank);
  };

  useEffect(() => {
    getBank();
  }, []);
  const handlePayment = async () => {
    try {
      const amount = prompt(
        "Enter how much you would like you pay below. Only enter whole numbers greater than 0:"
      );
      const validatedAmount = validatepaymentAmount(amount);
      const bank = await api.makePayment(props.user.id, validatedAmount);
      setBank(bank);
    } catch (err: any) {
      console.log(err.message);
      alert(err);
    }
  };

  const handleRepayment = async () => {
    try {
      const bank = await api.PerformRepayment(props.user.id);
      setBank(bank);
    } catch (err: any) {
      console.log(err.message);
      alert(err);
    }
  };

  const handleRefund = async (transactionId: string) => {
    try {
      const bank = await api.performRefund(props.user.id, transactionId);
      setBank(bank);
    } catch (err: any) {
      console.log(err.message);
      alert(err);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          color: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "white" }}>
          Hi @{props.user.username}! Welcome to Fizz Credit Bank
        </h1>
        <p>Hey @{props.user.username}! Try Fizz out</p>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "black",
          height: "50%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "yellow",
            padding: "10px",
          }}
        >
          <p>
            Fizz Account Balance:{" "}
            {bank?.account.fizzAccountBalance ||
              props.user.account.fizzAccountBalance}
          </p>
          <p className="fizzMainBalance">
            Main Account Balance:{" "}
            {bank?.account.mainAccountBalance ||
              props.user.account.mainAccountBalance}
          </p>
          <p>
            Fizz Spending Limit:{" "}
            {bank?.account.spendingLimit || props.user.account.spendingLimit}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "yellow",
            padding: "10px",
            height: "100%",
          }}
        >
          <p>Make a Payment Transaction</p>
          <button onClick={handlePayment}>Make Payment</button>
        </div>
        {bank !== null && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "yellow",
              padding: "10px",
              height: "100%",
            }}
          >
            <button onClick={handleRepayment}> Repayment</button>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          width: "100%",
        }}
      >
        {bank !== null && (
          <div
            className="transactions"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "black",
              overflow: "scroll",
              height: "100%",
              marginBottom: "300px",
            }}
          >
            {bank.transactions.map((transaction) => {
              const realTransaction: Transaction = {
                id: transaction.id,
                transactionType: transaction.transactionType,
                amount: transaction.amount,
                date: transaction.date,
                canPerformRefund: transaction.canPerformRefund,
              };
              return (
                <Transactions
                  transaction={realTransaction}
                  performRefund={() => handleRefund(realTransaction.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface TransactionProps {
  transaction: Transaction;
  performRefund(): void;
}

const Transactions = (props: TransactionProps) => {
  const shouldShowRefundButton = () => {
    return (
      props.transaction.transactionType === "Payment" &&
      props.transaction.canPerformRefund === true
    );
  };
  return (
    <div
      style={{
        backgroundColor: "yellow",
        marginTop: "10px",
        marginBottom: "10px",
        padding: "10px",
        marginRight: "10px",
        marginLeft: "10px",
      }}
    >
      <p>Transaction ID: {props.transaction.id}</p>
      <p style={{}}>Transaction Type: {props.transaction.transactionType}</p>
      <p>Transaction Date: {fromNow(new Date(props.transaction.date))}</p>
      {shouldShowRefundButton() && (
        <button
          style={{
            color: "green",
            fontSize: "16px",
            fontWeight: "bold",
          }}
          onClick={props.performRefund}
        >
          Refund
        </button>
      )}
      {shouldShowRefundButton() == false && (
        <p style={{ color: "red", fontSize: "12px", fontWeight: "bold" }}>
          {" "}
          Refund not available
        </p>
      )}
    </div>
  );
};
