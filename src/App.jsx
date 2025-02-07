import React, { useState, useEffect } from "react";
import axios from "axios";
import Timer from "./components/Timer";
import Snippet from "./components/Snippet";
import Input from "./components/Input";
import Feedback from "./components/feedback";
import "./App.css";
const LOCAL_API = "http://localhost:5000/api/random";
const REMOTE_API = "https://codesist-v1.onrender.com/api/random"

function App() {
  const [snippet, setSnippet] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [errors, setErrors] = useState([]);
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Function to determine time limit based on difficulty
  const getTimeLimit = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return 60;
      case "Intermediate":
        return 45;
      case "Advanced":
        return 30;
      default:
        return 60;
    }
  };

  // Fetch snippet from backend
  const fetchSnippet = async () => {
    if (!language || !difficulty) {
      alert("Please select a language and difficulty level.");
      return;
    }

    try {
      const response = await axios.get(REMOTE_API, {
        params: { language, difficulty },
      });

      setSnippet(response.data.code);
      setUserInput("");
      setAccuracy(0);
      setCpm(0);
      setErrors([]);
      setIsRunning(false); // Timer should only start on keypress
      setTimeLeft(getTimeLimit(difficulty)); // Set timer based on difficulty
    } catch (err) {
      console.error("Error fetching snippet:", err);
    }
  };

  // Start timer only when user types for the first time
  useEffect(() => {
    if (userInput.length === 1 && !isRunning) {
      setIsRunning(true);
    }
  }, [userInput]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      calculateFeedback();
    }
  }, [isRunning, timeLeft]);

  // Calculate feedback (accuracy, CPM, errors)
  const calculateFeedback = () => {
    const snippetLength = snippet.length;
    const userInputLength = userInput.length;
    const correctChars = [...userInput].filter((char, i) => char === snippet[i]).length;
    const newAccuracy = ((correctChars / snippetLength) * 100).toFixed(2);
    const newCpm = ((correctChars / (getTimeLimit(difficulty) - timeLeft)) * 60).toFixed(2);

    // Identify mismatches
    const newErrors = [];
    let currentError = { position: null, expected: "", actual: "" };
    
    for (let i = 0; i < Math.max(snippetLength, userInputLength); i++) {
      if (snippet[i] !== userInput[i]) {
        if (currentError.position === null) {
          // Start a new error block
          currentError.position = i;
        }
        currentError.expected += snippet[i] || "";
        currentError.actual += userInput[i] || "";
      } else if (currentError.position !== null) {
        // Push the accumulated error block and reset
        newErrors.push({ ...currentError });
        currentError = { position: null, expected: "", actual: "" };
      }
    }
    
    // Push the last error block if it exists
    if (currentError.position !== null) {
      newErrors.push({ ...currentError });
    }
    
    console.log(newErrors);
    

    setAccuracy(newAccuracy);
    setCpm(newCpm);
    setErrors(newErrors);
  };

  return (
    <div className="App">
      <h1>Codesist</h1>
      <div className="controls">
        <label>
          Language:
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="">Select Language</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="Go">Go</option>
          </select>
        </label>
        <label>
          Difficulty:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Select Difficulty</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>
        <button onClick={fetchSnippet} disabled={!language || !difficulty}>
          Next Snippet
        </button>
      </div>
      <Timer timeLeft={timeLeft} isRunning={isRunning} />
      <Snippet snippet={snippet} userInput={userInput} errors={errors} />
      <Input userInput={userInput} setUserInput={setUserInput} isRunning={isRunning} />
      {timeLeft === 0 && <Feedback accuracy={accuracy} cpm={cpm} errors={errors} />}
    </div>
  );
}

export default App;
