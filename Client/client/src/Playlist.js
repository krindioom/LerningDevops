import React, { useState, useEffect } from "react";
import * as Tone from "tone";

const SliderRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedData, setRecordedData] = useState([]);
    const [sliderValue, setSliderValue] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);

    useEffect(() => {
        // Инициализируем Player и Tone.Transport
        const newPlayer = new Tone.Player().toDestination();
        setPlayer(newPlayer);

        Tone.Transport.stop(); // Останавливаем Transport при загрузке

        // Сброс состояния после окончания воспроизведения
        Tone.Transport.on("stop", () => {
            setIsPlaying(false);
        });

        return () => {
            newPlayer.dispose();
            Tone.Transport.stop();
            Tone.Transport.cancel();
        };
    }, []);

    useEffect(() => {
        let recordingInterval;
        if (isRecording) {
            recordingInterval = setInterval(() => {
                setRecordingTime(Tone.Transport.seconds); // Обновляем время записи
            }, 100);
        } else {
            clearInterval(recordingInterval);
            setRecordingTime(0); // Сбрасываем время записи
        }
        return () => clearInterval(recordingInterval);
    }, [isRecording]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            player.load(url).then(() => {
                console.log("Аудиофайл загружен");
            });
        }
    };

    const handleStartRecording = () => {
        setIsRecording(true);
        setRecordedData([]); // Сбрасываем предыдущую запись
        Tone.Transport.start(); // Запускаем Transport
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        Tone.Transport.stop(); // Останавливаем Transport
    };

    const handleSliderChange = (e) => {
        const value = e.target.value;
        setSliderValue(value);

        if (isRecording) {
            // Сохраняем текущее время и значение ползунка
            setRecordedData((prevData) => [
                ...prevData,
                { time: Tone.Transport.now(), value },
            ]);
        }
    };

    const handlePlayRecording = () => {
        if (recordedData.length === 0) return;

        // Сбрасываем Transport и очищаем события
        Tone.Transport.stop();
        Tone.Transport.cancel();

        // Планируем воспроизведение записанных изменений
        recordedData.forEach(({ time, value }) => {
            Tone.Transport.schedule((playTime) => {
                setSliderValue(value);
            }, time);
        });

        // Проигрываем аудио, если загружен
        if (player.loaded) {
            Tone.Transport.schedule(() => {
                player.start();
            }, recordedData[0]?.time || 0); // Начало аудио
        }

        setIsPlaying(true);
        Tone.Transport.start("+1");
    };

    const handleStopPlaying = () => {
        Tone.Transport.stop();
        player?.stop();
        setIsPlaying(false);
    };

    return (
        <div>
            <div>
                <button onClick={handleStartRecording} disabled={isRecording || isPlaying}>
                    Запись
                </button>
                <button onClick={handleStopRecording} disabled={!isRecording}>
                    Остановить
                </button>
                <button onClick={handlePlayRecording} disabled={isRecording || isPlaying}>
                    Воспроизвести
                </button>
                <button onClick={handleStopPlaying} disabled={!isPlaying}>
                    Остановить воспроизведение
                </button>
            </div>
            <div>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    disabled={isRecording || isPlaying}
                />
                <div>{player?.context.currentTime}</div>
            </div>
            <div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    disabled={isPlaying}
                />
            </div>
            <div>
                {isRecording && <p>Время записи: {recordingTime.toFixed(2)} сек</p>}
            </div>
            <div>Текущее значение: {sliderValue}</div>
        </div>
    );
};

export default SliderRecorder;
