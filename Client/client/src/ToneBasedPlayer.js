import React, { useRef, useState } from 'react';
import * as Tone from 'tone';

const ToneBasedPlayer = () => {
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const transportRef = useRef(Tone.Transport);

    const audioUrl = "https://autolizer2-file-storage.storage.yandexcloud.net/audios/912eb049-b0c0-438e-bcb1-fa99ac3f5bb8?X-Amz-Expires=60000&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YCAJErSrIyFqGUBmj6lmaY9C9%2F20250126%2Fru-central1%2Fs3%2Faws4_request&X-Amz-Date=20250126T112408Z&X-Amz-SignedHeaders=host&X-Amz-Signature=b627b0a7e4a333686dc75eb81d326ace91775106b45cb04458859ca96fefcad4"; // Замените на вашу ссылку

    const handlePlay = async () => {
        if (!player) {
            await Tone.start();
            const newPlayer = new Tone.Player(audioUrl).toDestination();
            setPlayer(newPlayer);
            await Tone.loaded(); // Ждем загрузки аудио
            newPlayer.sync();
            newPlayer.start(0, 10, 10); // Начинаем с 10-й секунды и играем 10 секунд
            transportRef.current.start();
            setIsPlaying(true)
        } else {
            transportRef.current.start();
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        if (isPlaying) {
            transportRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleStop = () => {
        if (player) {
            player.stop();
            transportRef.current.stop();
            setIsPlaying(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Audio Player</h1>
            <div>
                <button onClick={handlePlay} disabled={isPlaying}>
                    Play
                </button>
                <button onClick={handlePause} disabled={!isPlaying}>
                    Pause
                </button>
                <button onClick={handleStop} disabled={!isPlaying}>
                    Stop
                </button>
            </div>
        </div>
    );
}

export default ToneBasedPlayer;
