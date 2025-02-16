import React, { useEffect, useState, useRef } from "react";

const StopWatch = ({ isStart }) => {
  const [time, setTime] = useState(0); // Время в миллисекундах
  const startTime = useRef(0); // Время начала отсчёта
  const lastTime = useRef(0); // Время на последней итерации
  const running = useRef(false); // Флаг работы таймера

  useEffect(() => {
    if (!isStart) return; // Если таймер не запущен, не запускаем логику

    // Инициализация времени при запуске
    if (!running.current) {
      running.current = true;
      startTime.current = performance.now() - time; // Зафиксируем время начала отсчёта
      lastTime.current = performance.now();
    }

    const loop = () => {
      if (!running.current) return;

      const now = performance.now();
      const delta = now - lastTime.current; // Разница времени

      setTime((prevTime) => prevTime + delta); // Обновляем состояние времени
      lastTime.current = now; // Сохраняем текущее время

      requestAnimationFrame(loop); // Запускаем следующий цикл
    };

    requestAnimationFrame(loop); // Начало цикла

    return () => {
      running.current = false; // Останавливаем таймер при размонтировании
    };
  }, [isStart]);

  return <h1>{(time / 1000).toFixed(2)} s</h1>; // Отображаем время в секундах с точностью до 2 знаков
};

export default StopWatch;
