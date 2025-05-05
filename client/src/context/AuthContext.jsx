import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch("/api/auth/me", {
					credentials: "include", // important: sends cookies
				});
				const data = await res.json();
				if (res.ok) {
					setAuthUser(data);
				} else {
					console.error("Auth error:", data.error);
					setAuthUser(null);
				}
			} catch (err) {
				console.error("Error fetching auth user", err);
				setAuthUser(null);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	if (loading) return <div>Loading...</div>; // or null/spinner

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};
