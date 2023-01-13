import React from "react";
interface NoUserProps {
  login(): void;
  signUp(): void;
}
export default function NoUser({ login, signUp }: NoUserProps) {
  return (
    <div>
      <p>No user Please login</p>
      <button onClick={login}> Login with a user name </button>
      <button onClick={signUp}> sign up with a user name </button>
    </div>
  );
}
