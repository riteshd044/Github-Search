import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import path from "path";

import "./passport/github.auth.js";

import userRoutes from "./routes/user.route.js";
import exploreRoutes from "./routes/explore.route.js";
import authRoutes from "./routes/auth.route.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(session({ secret: "keyboard cat", resave: false, saveUninitialized: false })); // A session lets the server remember a user between requests.
// Initialize Passport!  Also use passport.session() middleware, to support : it create req.isAuthenticated() checks: “Did this request come with a valid session cookie that maps to a logged-in user?”
// persistent login sessions (recommended).
app.use(passport.initialize()); //initializes passport for incoming request
app.use(passport.session()); //reads cookie request reaches server

// Here we can remove the cors, it's not necessary in production because the frontend and backend are on the same domain.
// app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/explore", exploreRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.use((req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


app.listen(PORT, () => {
	console.log(`Server started on http://localhost:${PORT}`);
	connectMongoDB();
});




/* Flow of passport :-
Login → session created → cookie stored
↓
Request to server → cookie sent → session read → user loaded
↓
req.user exists → isAuthenticated() = true
*/