import React from "react";

function Timer({ timeLeft, isRunning }) {
  return (
    <div className="timer">
      <h2>Time Left: {timeLeft}s</h2>
      {!isRunning && timeLeft === 0 && <p>Time's up!</p>}
    </div>
  );
}

export default Timer;
