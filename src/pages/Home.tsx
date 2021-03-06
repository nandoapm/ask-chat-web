import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button/Button';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import toast, { Toaster } from 'react-hot-toast';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';

export function Home() {
	const navigate = useNavigate(); //v5 useHistory / v6 useNavigate
	const { user, signInWithGoogle } = useAuth();
	const [roomCode, setRoomCode] = useState('');

	const handleCreateRoom = async () => {
		if (!user) {
			await signInWithGoogle();
		}
		navigate('/rooms/new');
	};

	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault();

		if (roomCode.trim() === '') {
			return;
		}

		const roomRef = await database.ref(`rooms/${roomCode}`).get();

		if (!roomRef.exists()) {
			toast.error('Esta sala não existe no momento');
			setRoomCode('');
			return;
		}

		if (roomRef.val().endedAt) {
			//alert('Room already closed.');
			toast.success('A sala foi encerrada!');
			return;
		}

		navigate(`/rooms/${roomCode}`);
	}

	return (
		<div id="page-auth">
			<Toaster position="bottom-right" reverseOrder={false} />
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
					<form onSubmit={handleJoinRoom}>
						<input
							type="text"
							placeholder="Digite o código da sala"
							onChange={(event) => setRoomCode(event.target.value)}
							value={roomCode}
						/>
						<Button type="submit">Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
