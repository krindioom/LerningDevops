import React, { useState, useEffect, useRef } from 'react';

const AutomationClip = () => {
  // Состояние для параметра (например, громкость)
  const [paramValue, setParamValue] = useState(0);

  // Массив значений для автоматизации
  const automationCurve = [0, 0.2, 0.4, 22, 0.6, 0.8, 1, 0.5, 0]; // Пример кривой изменения

  // Ссылка на canvas
  const canvasRef = useRef(null);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      // Обновляем параметр
      setParamValue(automationCurve[currentIndex]);

      // Переход к следующему значению
      currentIndex = (currentIndex + 1) % automationCurve.length;

      // Визуализируем график
      drawGraph();
    }, 500); // Интервал между изменениями (например, каждые 500 мс)

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height); // Очищаем canvas перед каждым перерисовыванием

    // Рисуем оси
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height); // Ось X
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height); // Ось Y
    ctx.strokeStyle = '#000';
    ctx.stroke();

    // Рисуем кривую автоматизации
    ctx.beginPath();
    ctx.moveTo(0, height - paramValue * height); // Начало линии (высота зависит от значения paramValue)
    
    // Прокачиваем все точки автоматизации
    const step = width / automationCurve.length;
    automationCurve.forEach((value, index) => {
      const x = index * step;
      const y = height - value * height;
      ctx.lineTo(x, y);
    });

    ctx.strokeStyle = 'blue'; // Цвет линии
    ctx.stroke();
  };

  return (
    <div>
      <h1>Автоматизация параметра</h1>
      <p>Текущее значение: {paramValue.toFixed(2)}</p>
      <canvas ref={canvasRef} width={500} height={200} />
    </div>
  );
};

export default AutomationClip;
