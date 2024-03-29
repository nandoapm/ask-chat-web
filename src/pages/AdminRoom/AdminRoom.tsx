import { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { Question } from '../../components/Question/Question';
import { RoomCode } from '../../components/RoomCode/RoomCode';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import toast, { Toaster } from 'react-hot-toast';
import { Loading } from '../../components/Loading/Loading';
import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';
import '../../styles/room.scss';

type RoomParams = {
	id: string;
};

export function AdminRoom() {
	const navigate = useNavigate();
	const { user, singOutGoogleAccount } = useAuth();
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const { title, questions } = useRoom(roomId);
	const [newQuestion, setNewQuestion] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSendQuestion(event: FormEvent) {
		event.preventDefault();

		if (newQuestion.trim() === '') {
			return;
		}

		if (!user) {
			throw new Error('You must be logged in');
		}

		const question = {
			content: newQuestion,
			author: {
				name: user.name,
				avatar: user.avatar,
			},
			isHighlighted: false,
			isAnswered: false,
		};

		await database.ref(`rooms/${roomId}/questions`).push(question);

		setNewQuestion('');
	}

	async function handleCheckQuestionAsAnswered(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isAnswered: true,
		});
		toast.success('Pergunta respondida!');
	}

	async function handleHighlightQuestion(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isHighlighted: true,
		});
		toast.success('Pergunta sendo verificada!');
	}

	async function handleEndRoom() {
		setLoading(true);
		setTimeout(async () => {
			await database.ref(`rooms/${roomId}`).update({
				endedAt: new Date(),
			});
			setLoading(false);
			navigate('/');
		}, 5000);
	}

	async function handleDeleteQuestion(questionId: string) {
		if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
			toast.error('Pergunta deletada!');
		}
	}

	async function handleLogout() {
		setLoading(true);
		setTimeout(async () => {
			setLoading(false);
			await singOutGoogleAccount();
			navigate('/');
		}, 5000);
	}

	return (
		<div id="page-room">
			<Toaster position="bottom-right" reverseOrder={false} />
			<header>
				<div className="content">
					<img src={logoImg} alt="AskChat" />
					<div>
						<RoomCode code={roomId} />
						<Button isOutlined onClick={handleEndRoom}>
							Encerrar sala
						</Button>
					</div>
				</div>
				<button onClick={handleLogout}>Sair</button>
			</header>
			{loading ? (
				<Loading />
			) : (
				<main>
					<div className="room-title">
						<h1>Administrador - {title}</h1>
						{questions.length > 0 && (
							<span>{questions.length} pergunta(s)</span>
						)}
					</div>

					<form onSubmit={handleSendQuestion}>
						<textarea
							placeholder="O que você quer perguntar?"
							onChange={(event) => setNewQuestion(event.target.value)}
							value={newQuestion}
						/>

						<div className="form-footer">
							{user ? (
								<div className="user-info">
									<img src={user.avatar} alt={user.name} />
									<span>{user.name}</span>
								</div>
							) : (
								<span>
									Para enviar uma pergunta, <button>faça seu login</button>.
								</span>
							)}
							<Button type="submit" disabled={!user}>
								Enviar pergunta
							</Button>
						</div>
					</form>

					<div className="question-list">
						{questions.map((question) => {
							return (
								<Question
									key={question.id}
									content={question.content}
									author={question.author}
									isAnswered={question.isAnswered}
									isHighlighted={question.isHighlighted}
								>
									{!question.isAnswered && (
										<>
											<button
												type="button"
												onClick={() =>
													handleCheckQuestionAsAnswered(question.id)
												}
											>
												<img
													src={checkImg}
													alt="Marcar pergunta como respondida"
												/>
											</button>
											<button
												type="button"
												onClick={() => handleHighlightQuestion(question.id)}
											>
												<img src={answerImg} alt="Dar destaque à pergunta" />
											</button>
										</>
									)}
									<button
										type="button"
										onClick={() => handleDeleteQuestion(question.id)}
									>
										<img src={deleteImg} alt="Remover pergunta" />
									</button>
								</Question>
							);
						})}
					</div>
				</main>
			)}
		</div>
	);
}
