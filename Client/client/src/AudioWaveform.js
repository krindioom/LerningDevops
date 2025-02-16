import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const AudioWaveform = () => {
  const [audioFile, setAudioFile] = useState(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  // Обработчик загрузки файла
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);  // Сохраняем аудиофайл в состояние
    }
  };

  // Инициализация WaveSurfer
  useEffect(() => {
    if (!waveformRef.current) return;

    // Создание экземпляра WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'violet',
      progressColor: 'purple',
      cursorColor: 'navy',
      barWidth: 2,
      barHeight: 1, // Высота бара
      barGap: 3, // Расстояние между барами
      responsive: true,
      height: 150, // Высота визуализации
      normalize: true,
      scrollParent: true, // Прокрутка по мере воспроизведения
    });

    wavesurferRef.current = wavesurfer;

    return () => {
      wavesurfer.destroy(); // Очистка при размонтировании компонента
    };
  }, []);

  // Загружаем файл, если он выбран
  useEffect(() => {
    if (audioFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Загружаем аудиофайл в wavesurfer
        if (wavesurferRef.current) {
          wavesurferRef.current.load(reader.result); // Загружаем в формате ArrayBuffer
        }
      };
      reader.readAsArrayBuffer(audioFile); // Преобразуем файл в ArrayBuffer
    }
  }, [audioFile]);

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept="audio/*" />
      <div ref={waveformRef} style={{ width: '100%', height: '200px' }}></div> {/* Контейнер для волны */}
    </div>
  );
};

export default AudioWaveform;
