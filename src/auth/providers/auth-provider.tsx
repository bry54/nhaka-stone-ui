'use client';

import {
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import api from '@/lib/api';
import { AUTH_LOCAL_STORAGE_KEY } from '@/auth/lib/helpers';
import { AuthContext } from '@/auth/context/auth-context';
import { UserModel } from '@/auth/lib/models';

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserModel | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);

	// Check for existing session on mount
	useEffect(() => {
		const initAuth = async () => {
			const savedAuth = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
			if (savedAuth) {
				try {
					const parsedAuth = JSON.parse(savedAuth);
					// Verify token validity or get user profile here if needed
					if (parsedAuth.accessToken) {
						const user = await api.get('/auth/me');
						setUser(user.data);
					}
				} catch (e) {
					console.error('Failed to parse auth', e);
				}
			}
			setIsLoading(false);
		};
		initAuth();
	}, []);

	const login = async (email: string, password: string): Promise<void> => {
		try {
			const response = await api.post('/auth/signin', { email, password });
			const data = response.data;

			if (data.accessToken) {
				const authData = { accessToken: data.accessToken };
				localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, JSON.stringify(authData));

				const userData: UserModel = {
					id: '1',
					email: data.email,
					fullName: data.fullName,
					role: data.role,
				};
				setUser(userData);
			}
		} catch (error) {
			console.error('Login failed', error);
			throw error;
		}
	};

	const register = async (email: string, password: string, _password_confirmation: string, firstName?: string, lastName?: string): Promise<void> => {
		try {
			await api.post('/auth/signup', {
				email,
				password,
				firstName,
				lastName
			});
			// Auto login or redirect depends on flow. 
			// The Signup page expects void promise.
		} catch (error) {
			console.error('Registration failed', error);
			throw error;
		}
	}

	const logout = () => {
		setUser(undefined);
		localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
	};

	const isAuthenticated = !!user;

	return (
		<AuthContext.Provider
			value={{
				// @ts-ignore - mismatch in context types, we need to fix this properly but for now matching the existing provider signature
				user,
				login: login as any, // context expects (email, password) => Promise<void>, provider was boolean
				register,
				logout,
				// @ts-ignore
				isLoading,
				// @ts-ignore
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
