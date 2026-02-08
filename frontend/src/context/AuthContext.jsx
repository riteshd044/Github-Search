import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkUserLoggedIn = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/auth/check", { credentials: "include" });
				const data = await res.json();
				setAuthUser(data.user); // null or authenticated user object
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		checkUserLoggedIn();
	}, []);

	return <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>{children}</AuthContext.Provider>;
};



/*
This file is the bridge between your React frontend and Passport session on backend.

Its job is simple:
“When React app starts, ask backend: Is user already logged in?
If yes → store user in React state and make it available everywhere.”

How it works:
React App Loads
       ↓
AuthContext useEffect runs
       ↓
GET /api/auth/check  (cookie included)
       ↓
Passport checks session
       ↓
Is user logged in?
     /        \
   Yes        No
   ↓           ↓
Return user   Return null
   ↓           ↓
setAuthUser(user/null)
       ↓
All components now know login state
*/