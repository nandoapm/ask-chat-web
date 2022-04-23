import { useNavigate } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';

import '../styles/auth.scss';

export function Home() {
	const navigate = useNavigate(); //v5 useHistory / v6 useNavigate
	const { user, signInWithGoogle } = useAuth();

	async function handleCreateRoom() {
		if (!user) {
			await signInWithGoogle();
		}
		navigate('/rooms/new');
	}

	return (
		<div id="page-auth">
			<aside>
				<img
					src={illustrationImg}
					alt="Ilustração simbolizando perguntas e respostas"
				/>
				<strong>Crie salas ao-vivo</strong>
				<p>Chat de perguntas e respostas em tempo-real</p>
			</aside>
			<main>
				<div className="main-content">
					<img src={logoImg} alt="AskChat" />
					<button onClick={handleCreateRoom} className="create-room">
						<img src={googleIconImg} alt="Logo do Google" />
						Crie sua sala com o Google
					</button>
					<div className="separator">ou entre em uma sala</div>
					<form>
						<input type="text" placeholder="Digite o código da sala" />
						<Button type="submit">Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
