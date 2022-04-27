import { ReactNode } from 'react';
import './loading.scss';

type LoadingTypes = {
	children?: ReactNode;
};

export function Loading({ children }: LoadingTypes) {
	return (
		<div id="scanner-loading">
			<h1>Loading...</h1>
		</div>
	);
}
