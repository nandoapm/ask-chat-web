import copyImg from '../../assets/images/copy.svg';
import '../RoomCode/room-code.scss';

type RoomCodeProps = {
	code: string | undefined;
};

export function RoomCode(props: RoomCodeProps) {
	function copyRoomCodeToClipboard() {
		props.code && navigator.clipboard.writeText(props.code);
	}

	return (
		<button className="room-code" onClick={copyRoomCodeToClipboard}>
			<div>
				<img src={copyImg} alt="Copy room code" />
			</div>
			<span>{props.code}</span>
		</button>
	);
}
