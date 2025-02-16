import React, { useState } from 'react';
import { Stage, Layer, Line, Circle } from 'react-konva';

const AutomationCurve = () => {
  // Начальная точка
  const [points, setPoints] = useState([{ x: 50, y: 150 }]);

  // Добавление новой точки при клике справа от последней
  const handleStageClick = (event) => {
    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    // Убедимся, что новая точка добавляется справа от последней точки
    const lastPoint = points[points.length - 1];
    if (pointerPosition.x > lastPoint.x) {
      setPoints([...points, { x: pointerPosition.x, y: pointerPosition.y }]);
    }
  };

  // Перемещение точки по вертикали
  const handleDragMove = (e, index) => {
    const newPoints = points.slice();
    const { x, y } = e.target.position();

    // Ограничим перемещение только по Y, чтобы X оставался неизменным
    if (index > 0) {
      newPoints[index] = { x: newPoints[index].x, y };
      setPoints(newPoints);
    }
  };

  return (
    <Stage
      width={600}
      height={300}
      style={{ background: '#2b2b2b' }}
      onClick={handleStageClick} // Обработчик для добавления новых точек
    >
      <Layer>
        {/* Линия, соединяющая точки */}
        <Line
          points={points.flatMap(p => [p.x, p.y])}
          stroke="#ffffff"
          strokeWidth={2}
          tension={0.2} // Ограничиваем кривизну, чтобы линии были ближе к FL
          lineCap="round"
        />
        {/* Точки */}
        {points.map((point, index) => (
          <Circle
            key={index}
            x={point.x}
            y={point.y}
            radius={8}
            fill="#4CAF50"
            draggable={index !== 0} // Начальную точку нельзя перемещать
            onDragMove={(e) => handleDragMove(e, index)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default AutomationCurve;
