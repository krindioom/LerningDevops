import React, { useEffect, useRef } from "react";
import * as Tone from "tone";
import * as echarts from "echarts";

const AudioWaveformSegment = ({ audioUrl, startTime = 0, endTime = 5 }) => {
  const chartRef = useRef(null); // Контейнер для графика
  const chartInstance = useRef(null); // Экземпляр ECharts

  useEffect(() => {
    const processAudio = async () => {
      // Загружаем аудио
      const player = new Tone.Player(audioUrl);
      await player.load(audioUrl);

      // Инициализация Waveform с высокой детализацией
      const waveform = new Tone.Waveform(1024); // 1024 точек для большей точности
      player.connect(waveform);

      // Воспроизведение плеера в тихом режиме (чтобы заполнить анализатор данными)
      player.mute = true;
      player.start(0);

      // Ждем окончания анализа для выбранного диапазона
      const sampleRate = Tone.context.sampleRate; // Частота дискретизации (обычно 44100)
      const duration = player.buffer.duration; // Длительность аудио
      const startSample = Math.floor((startTime / duration) * sampleRate);
      const endSample = Math.floor((endTime / duration) * sampleRate);

      // Получение данных амплитуды
      const audioBuffer = player.buffer.getChannelData(0); // Данные для левого канала
      const segment = audioBuffer.slice(startSample, endSample); // Извлечение нужного диапазона

      // Преобразуем данные сегмента в формат для графика
      const data = Array.from(segment);

      // Инициализация ECharts
      if (chartRef.current) {
        chartInstance.current = echarts.init(chartRef.current);
        chartInstance.current.setOption({
          title: {
            text: `Аудиограмма (${startTime}s - ${endTime}s)`,
          },
          xAxis: {
            type: "category",
            data: Array.from({ length: data.length }, (_, i) => i), // Индексы точек
            name: "Сэмплы",
          },
          yAxis: {
            type: "value",
            min: -1,
            max: 1,
            name: "Амплитуда",
          },
          series: [
            {
              type: "line",
              data: data,
              showSymbol: false,
              lineStyle: {
                color: "#007bff",
              },
            },
          ],
        });
      }

      // Освобождение ресурсов
      player.dispose();
    };

    processAudio().then();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [audioUrl, startTime, endTime]);

  return (
    <div>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default AudioWaveformSegment;
