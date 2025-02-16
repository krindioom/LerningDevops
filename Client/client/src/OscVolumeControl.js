import React, { useState } from 'react';
import OSC from 'osc-js';

// Настройки OSC
const config = { 
  udpClient: {
    localAddress: '0.0.0.0',   // IP-адрес локального устройства
    localPort: 9129,            // Локальный порт для приема
    remoteAddress: '127.0.0.1', // IP-адрес получателя
    remotePort: 9000            // Порт получателя
  }
};

// Инициализация OSC
const osc = new OSC({ plugin: new OSC.BridgePlugin(config) });

const OscVolumeControl = () => {
  const [volume, setVolume] = useState(64);  // Значение громкости по умолчанию
  const [isRecording, setIsRecording] = useState(false);
  const [recordedData, setRecordedData] = useState([]);

  // Функция для отправки OSC-сообщения
  const sendOscMessage = (address, value) => {
    const message = new OSC.Message(address, value);
    osc.send(message);
    console.log(`Sent OSC Message: ${address}, Value: ${value}`);
  };

  // Обработка изменения значения ползунка
  const handleVolumeChange = (e) => {
    const newValue = parseInt(e.target.value);
    setVolume(newValue);

    // Отправка OSC-сообщения с изменением громкости
    sendOscMessage('/volume', newValue);

    // Если запись активна, сохраняем изменение
    if (isRecording) {
      setRecordedData((prevData) => [...prevData, { type: 'volume', value: newValue, timestamp: Date.now() }]);
    }
  };

  // Обработка записи
  const startRecording = () => {
    setIsRecording(true);
    setRecordedData([]);  // Очищаем предыдущие данные
    console.log('Recording started');
  };

  const stopRecording = () => {
    setIsRecording(false);
    console.log('Recording stopped');
  };

  const playRecording = () => {
    if (recordedData.length > 0) {
      console.log('Playing recorded actions');
      recordedData.forEach((action, index) => {
        setTimeout(() => {
          if (action.type === 'volume') {
            sendOscMessage('/volume', action.value);
            setVolume(action.value);
          }
        }, index * 500);  // Интервал между действиями (500мс)
      });
    }
  };

  return (
    <div style={{ background: '#333', color: '#fff', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Guitar Rig OSC Volume Control</h1>
      <div>
        <label htmlFor="volume">Volume Control (OSC): </label>
        <input
          type="range"
          id="volume"
          min="0"
          max="127"
          value={volume}
          onChange={handleVolumeChange}
          style={{ margin: '10px 0' }}
        />
        <span>{volume}</span>
      </div>
      
      <div>
        <button onClick={startRecording} disabled={isRecording} style={buttonStyle}>Start Recording</button>
        <button onClick={stopRecording} disabled={!isRecording} style={buttonStyle}>Stop Recording</button>
        <button onClick={playRecording} disabled={recordedData.length === 0} style={buttonStyle}>Play Recording</button>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#444',
  color: '#fff',
  padding: '10px 20px',
  margin: '10px',
  border: 'none',
  cursor: 'pointer'
};

export default OscVolumeControl;
