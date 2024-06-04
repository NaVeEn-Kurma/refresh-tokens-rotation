const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

const users = []; // This is just for demo purposes. Use a database in production.
let refreshTokens = []; // In-memory storage for refresh tokens. Use a persistent storage in production.

const accessTokenSecret = "youraccesstokensecret";
const refreshTokenSecret = "yourrefreshtokensecret";

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
  })
);

// Register endpoint
app.post("/register", (req, res) => {
  console.log("register hit");
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ username, password: hashedPassword });
  res.sendStatus(201);
});

// Login endpoint
app.post("/login", (req, res) => {
  console.log("Login hit");

  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    const accessToken = jwt.sign(
      { username: user.username },
      accessTokenSecret,
      { expiresIn: "1m" } // Access token expires in 1 minute
    );
    const refreshToken = jwt.sign(
      { username: user.username },
      refreshTokenSecret
    );
    refreshTokens.push(refreshToken);
    res.json({ accessToken, refreshToken });
  } else {
    res.sendStatus(403);
  }
});

// Token refresh endpoint
app.post("/token", (req, res) => {
  console.log("Refresh token hit");

  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  if (!refreshTokens.includes(token)) return res.sendStatus(403);
  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: user.username },
      accessTokenSecret,
      { expiresIn: "1m" } // New access token also expires in 1 minute
    );
    const newRefreshToken = jwt.sign(
      { username: user.username },
      refreshTokenSecret
    );

    // Remove the old refresh token and add the new one
    refreshTokens = refreshTokens.filter((t) => t !== token);
    refreshTokens.push(newRefreshToken);

    res.json({ accessToken, refreshToken: newRefreshToken });
  });
});

// Protected endpoint
app.get("/protected", authenticateToken, (req, res) => {
  console.log("Protected api hit");

  res.json({ message: "This is protected data." });
});

// Middleware to authenticate the token
function authenticateToken(req, res, next) {
  console.log("Authentication hit");

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) return res.sendStatus(401); // This should catch expired tokens
    req.user = user;
    next();
  });
}
console.log(users, refreshTokens);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
