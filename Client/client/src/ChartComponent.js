import React, { useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(...registerables);

const MyChart = () => {
  const [dataPoints, setDataPoints] = useState([{ x: 0, y: 0 }]); // Начальная точка (0,0)

  const handleCanvasClick = (event) => {
      const canvas = event.chart?.canvas;
      const rect = canvas.getBoundingClientRect();
      const x = event.nativeEvent.clientX - rect.left; // Получаем положение по оси X
      const y = event.nativeEvent.clientY - rect.top; // Получаем положение по оси Y

      // Преобразуем координаты в значения для графика
      const ms = Math.round(x); // Для оси X
      const valueY = Math.floor((rect.height - y) / (rect.height / 128)); // Для оси Y от 0 до 127

      // Добавляем новую точку
      const newPoint = { x: ms, y: valueY };
      setDataPoints((prev) => [...prev, newPoint]); // Обновляем состояние
  };

  const data = {
      datasets: [{
          label: 'Точки на графике',
          data: dataPoints,
          fill: false,
          borderColor: 'blue',
          pointBackgroundColor: 'red', // Цвет точек
          borderWidth: 2,
      }]
  };

  const options = {
      scales: {
          x: {
              title: {
                  display: true,
                  text: 'Милисекунды'
              },
              min: 0,
          },
          y: {
              min: 0,
              max: 127,
              title: {
                  display: true,
                  text: 'Значения'
              }
          }
      },
      onClick: handleCanvasClick
  };

  return (
      <div>
          <Line data={data} options={options} onClick={handleCanvasClick} />
      </div>
  );
};

export default MyChart;
