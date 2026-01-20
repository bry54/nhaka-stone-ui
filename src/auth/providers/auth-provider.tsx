'use client';

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';

interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Check for existing session on mount
	useEffect(() => {
		const savedUser = localStorage.getItem('auth-user');
		if (savedUser) {
			setUser(JSON.parse(savedUser));
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true);

		// Mock authentication - replace with your API call
		await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

		if (email === 'demo@kt.com' && password === 'demo123') {
			const mockUser: User = {
				id: '1',
				email: 'demo@kt.com',
				name: 'Demo User',
				avatar: '/media/avatars/300-2.png',
			};

			setUser(mockUser);
			localStorage.setItem('auth-user', JSON.stringify(mockUser));
			setIsLoading(false);
			return true;
		}

		setIsLoading(false);
		return false;
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('auth-user');
	};

	const isAuthenticated = !!user;

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				isLoading,
				isAuthenticated,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
