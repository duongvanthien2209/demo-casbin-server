require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("./oauthConfig");
const setupCasbin = require("./casbinConfig");

const app = express();
const port = 3000;

app.use(cors());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res) => {
  res.type("text/html");
  res.status(200);
  res.send("<a href='/'>Login</a>");
});

app.get("/error", (req, res) => res.send("Login failed"));

// Google OAuth routes
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  (req, res) => {
    // Successful login
    res.redirect("/profile");
  }
);

// Profile route (protected by Casbin)
app.get("/profile", async (req, res) => {
  const enforcer = await setupCasbin();
  const user = req.user; // Assuming user info is available after authentication

  res.send(JSON.stringify(user));

  // if (await enforcer.enforce(user.id, "/profile", "GET")) {
  //   // User has access, render profile page
  //   res.render("profile", { user });
  // } else {
  //   // User does not have access
  //   res.status(403).send("Access denied");
  // }
});

// app.post("/add-policy", async (req, res) => {
//   const enforcer = await setupCasbin();
//   const { sub, obj, act } = req.body;

//   // Adding a policy to MongoDB
//   await enforcer.addPolicy(sub, obj, act);

//   res.send("Policy added successfully");
// });

app.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
