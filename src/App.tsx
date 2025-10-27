import React, { useState } from "react";
import Main from "./components/Main";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Main count={count} setCount={setCount} />
    </div>
  );
}

export default App;
