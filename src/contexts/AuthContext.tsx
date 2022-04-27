import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, firebase } from '../services/firebase';

type User = {
	id: string;
	name: string;
	avatar: string;
};

type LoadingProps = {
	loading: boolean;
};

type AuthContextType = {
	user: User | undefined;
	signInWithGoogle: () => Promise<void>;
	singOutGoogleAccount: () => Promise<void>;
	loading: LoadingProps | undefined;
};

type AuthContextProviderProps = {
	children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
	const [user, setUser] = useState<User>();
	const [loading, setLoading] = useState<LoadingProps>();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				const { displayName, photoURL, uid } = user;

				if (!displayName || !photoURL) {
					throw new Error('Missing information from Google Account.');
				}

				setUser({
					id: uid,
					name: displayName,
					avatar: photoURL,
				});
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	const signInWithGoogle = async () => {
		setLoading({ loading: true });
		const provider = new firebase.auth.GoogleAuthProvider();

		const result = await auth.signInWithPopup(provider);

		if (result.user) {
			const { displayName, photoURL, uid } = result.user;

			if (!displayName || !photoURL) {
				throw new Error('Missing information from Google Account.');
			}

			setUser({
				id: uid,
				name: displayName,
				avatar: photoURL,
			});
			setTimeout(() => {
				setLoading({ loading: false });
			}, 3000);
		}
	};

	const singOutGoogleAccount = async () => {
		setLoading({ loading: true });

		setTimeout(() => {
			auth.signOut();
			setLoading({ loading: false });
		}, 3000);
	};

	return (
		<AuthContext.Provider
			value={{ user, signInWithGoogle, singOutGoogleAccount, loading }}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
