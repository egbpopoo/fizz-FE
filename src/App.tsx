import React, { useState } from "react";
import API from "./api";
import "./App.css";
import BankAccount from "./pages/bank/bank";
import NoUser from "./pages/noUser/noUser";
import { User } from "./types";

function App() {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  const handleLogin = async () => {
    try {
      const username = prompt("Welcome back: Enter your username to sign In");
      if (username) {
        const user = await API.signInWithUserName(username);
        setUser(user);
      } else {
        throw new Error("Error: No username provided");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  const handleSignUp = async () => {
    try {
      const username = prompt("What username would you like");
      if (username) {
        const user = await API.signUpWithUserName(username);

        setUser(user);
      } else {
        throw new Error("Error: No username provided");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      {loading && <p> loading</p>}
      {error && (
        <div className="Error">
          <p> {error}.</p>
          <p> Here is what you can do: Reload the page and try again</p>
        </div>
      )}
      {user ? (
        <BankAccount user={user} />
      ) : (
        <NoUser login={handleLogin} signUp={handleSignUp} />
      )}
    </>
  );
}

export default App;
