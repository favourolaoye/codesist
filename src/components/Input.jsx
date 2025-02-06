import React from "react";

function Input({ userInput, setUserInput }) {
  return (
    <textarea
      className="user-input"
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      placeholder="Start typing..."
      autoFocus
    />
  );
}

export default Input;
