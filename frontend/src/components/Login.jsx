import React, { useState } from "react";

const Login = ({ funcMethod }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    funcMethod(username, password);
  };
  return (
    <form>
      <div>
        <label>username: </label>
        <input
          type="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>password: </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
};

export default Login;
