import React, { useState, useEffect, useRef } from 'react';
import './MidiVolumeControl.css'; // Добавим сюда стили

const MidiVolumeControl = () => {
    const [midiAccess, setMidiAccess] = useState(null);
    const [midiOutput, setMidiOutput] = useState(null);
    const [volume, setVolume] = useState(64); // Значение громкости по умолчанию (от 0 до 127)
    const [isRecording, setIsRecording] = useState(false); // Статус записи
    const [recordings, setRecordings] = useState([]); // Хранилище записанных движений ползунка и кнопки
    const [isPlaying, setIsPlaying] = useState(false); // Статус воспроизведения
    const [isEffectOn, setIsEffectOn] = useState(false); // Статус эффекта (вкл/выкл)
    const playbackIndex = useRef(0); // Индекс воспроизведения

    // Инициализация MIDI при загрузке компонента
    useEffect(() => {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
                .then(onMIDISuccess)
                .catch(onMIDIFailure);
        } else {
            console.error("Web MIDI API is not supported by this browser.");
        }
    }, []);

    const onMIDISuccess = (access) => {
        setMidiAccess(access);
        const outputs = Array.from(access.outputs.values());
        if (outputs.length > 0) {
            setMidiOutput(outputs[0]); // Используем первый доступный выход
            console.log("MIDI Output selected:", outputs[0]);
        } else {
            console.error("No MIDI output devices found.");
        }
    };

    const onMIDIFailure = () => {
        console.error("Failed to get MIDI access.");
    };

    // Функция для отправки изменения громкости
    const sendVolumeChange = (value) => {
        if (midiOutput) {
            const controlChangeMessage = [0xB0, 7, value]; // CC 7 - управление громкостью
            midiOutput.send(controlChangeMessage);
            console.log(`Sent Control Change: Volume ${value}`);
        }
    };

    // Функция для переключения эффекта (вкл/выкл)
    const toggleEffect = () => {
        if (midiOutput) {
            const controlChangeMessage = [0xB0, 12, isEffectOn ? 0 : 127]; // CC 12 - произвольный контроллер для эффекта
            midiOutput.send(controlChangeMessage);
            setIsEffectOn(!isEffectOn);
            console.log(`Effect ${isEffectOn ? "Off" : "On"}`);

            if (isRecording) {
                recordEffectToggle(!isEffectOn); // Записываем изменение состояния кнопки
            }
        }
    };

    // Обработка изменения значения ползунка
    const handleVolumeChange = (e) => {
        const newValue = parseInt(e.target.value);
        setVolume(newValue);
        sendVolumeChange(newValue); // Отправляем новое значение громкости

        if (isRecording) {
            recordVolumeChange(newValue); // Записываем изменение громкости, если идет запись
        }
    };

    // Запись изменения громкости
    const recordVolumeChange = (value) => {
        const timestamp = Date.now();
        setRecordings((prev) => [...prev, { type: 'volume', value, time: timestamp }]);
    };

    // Запись изменения состояния эффекта
    const recordEffectToggle = (effectState) => {
        const timestamp = Date.now();
        setRecordings((prev) => [...prev, { type: 'effect', value: effectState, time: timestamp }]);
    };

    // Остановка записи
    const stopRecording = () => {
        setIsRecording(false);
    };

    // Запуск записи
    const startRecording = () => {
        setIsRecording(true);
        setRecordings([]); // Очищаем предыдущие записи
    };

    // Воспроизведение записанных значений
    const playRecording = () => {
        if (recordings.length === 0 || isPlaying) return;

        setIsPlaying(true);
        playbackIndex.current = 0;
        const startTime = recordings[0].time; // Время начала записи

        const interval = setInterval(() => {
            if (playbackIndex.current >= recordings.length) {
                clearInterval(interval);
                setIsPlaying(false); // Заканчиваем воспроизведение
                return;
            }

            const elapsed = Date.now() - startTime;
            const nextRecording = recordings[playbackIndex.current];
            
            if (elapsed >= nextRecording.time - startTime) {
                if (nextRecording.type === 'volume') {
                    setVolume(nextRecording.value);
                    sendVolumeChange(nextRecording.value); // Отправляем значение громкости
                } else if (nextRecording.type === 'effect') {
                    setIsEffectOn(nextRecording.value);
                    const controlChangeMessage = [0xB0, 12, nextRecording.value ? 127 : 0]; // Воспроизводим переключение эффекта
                    midiOutput.send(controlChangeMessage);
                    console.log(`Effect ${nextRecording.value ? "On" : "Off"}`);
                }
                playbackIndex.current += 1;
            }
        }, 50); // Обновление каждые 50 мс для плавного воспроизведения
    };

    return (
        <div className="midi-control-container">
            <h1 className="metal-title">Guitar Rig MIDI Volume Control</h1>
            <div className="slider-container">
                <label htmlFor="volume" className="metal-label">Volume Control (CC 7): </label>
                <input
                    type="range"
                    id="volume"
                    className="metal-slider"
                    min="0"
                    max="127"
                    value={volume}
                    onChange={handleVolumeChange}
                    disabled={isPlaying} // Отключаем ползунок во время воспроизведения
                />

<input
                    type="range"
                    id="volume"
                    className="metal-slider"
                    min="0"
                    max="127"
                    value={volume}
                    onChange={handleVolumeChange}
                    disabled={isPlaying} // Отключаем ползунок во время воспроизведения
                />
                <span className="volume-display">{volume}</span>
            </div>
            <div className="button-container">
                <button className="metal-button" onClick={startRecording} disabled={isRecording || isPlaying}>
                    Start
                </button>
                <button className="metal-button" onClick={stopRecording} disabled={!isRecording}>
                    Stop
                </button>
                <button className="metal-button" onClick={playRecording} disabled={isRecording || isPlaying || recordings.length === 0}>
                    Play
                </button>
                <button className="metal-button toggle-effect" onClick={toggleEffect}>
                    {isEffectOn ? "Turn Effect Off" : "Turn Effect On"}
                </button>
            </div>
            {recordings.length > 0 && (
                <div className="recordings-list">
                    <h2 className="metal-subtitle">Recorded Movements:</h2>
                    <ul>
                        {recordings.map((record, index) => (
                            <li key={index}>
                                {record.type === 'volume' 
                                    ? `Volume: ${record.value}, Time: ${new Date(record.time).toLocaleTimeString()}`
                                    : `Effect: ${record.value ? "On" : "Off"}, Time: ${new Date(record.time).toLocaleTimeString()}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MidiVolumeControl;
