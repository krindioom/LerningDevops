import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Text, Rect } from "react-konva";

const Timeline = () => {
    const stageRef = useRef(null);
    const [scale, setScale] = useState({ x: 1, y: 1 });
    const [lines, setLines] = useState([]);
    const [rectangleX, setRectangleX] = useState(0); // Позиция прямоугольника
    const step = 10; // Шаг перемещения прямоугольника
    const [isShiftPressed, setIsShiftPressed] = useState(false);

    useEffect(() => {
        // Генерируем данные для таймлайна один раз
        const timelineLines = generateTimelineLines();
        setLines(timelineLines);

        // Добавляем обработчики нажатия клавиш
        const handleKeyDown = (e) => {
            if (e.key === "Shift") {
                setIsShiftPressed(true);
            }
        };

        const handleKeyUp = (e) => {
            if (e.key === "Shift") {
                setIsShiftPressed(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const handleWheel = (e) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        const scaleBy = 1.1;
        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        setScale({ x: newScale, y: 1 });
        stage.scale({ x: newScale, y: 1 });
        stage.batchDraw();
    };

    const generateTimelineLines = () => {
        const width = 10000; // Ширина таймлайна в мс
        const step = 1; // Шаг делений в мс
        const majorStep = 10; // Шаг крупных делений в мс
        const linesArray = [];

        for (let i = 0; i <= width; i += step) {
            const x = i;
            const isMajor = i % majorStep === 0;

            linesArray.push(
                <Line
                    key={`line-${i}`}
                    points={[x, 0, x, isMajor ? 20 : 10]} // Длинные деления для majorStep
                    stroke={isMajor ? "black" : "gray"}
                    strokeWidth={isMajor ? 1.5 : 1}
                />
            );

            if (isMajor) {
                linesArray.push(
                    <Text
                        key={`label-${i}`}
                        x={x - 10}
                        y={25}
                        text={`${i}ms`}
                        fontSize={10}
                        fill="black"
                    />
                );
            }
        }

        return linesArray;
    };

    const handleDragMove = (e) => {
        const newX = isShiftPressed
            ? e.target.x() // Плавное движение при зажатом Shift
            : Math.round(e.target.x() / step) * step; // Ограничиваем движение шагом
        setRectangleX(newX);
    };

    return (
        <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={100}
            scaleX={scale.x}
            scaleY={scale.y}
            onWheel={handleWheel}
        >
            <Layer>
                {lines}

                {/* Прямоугольник */}
                <Rect
                    x={rectangleX}
                    y={50} // Фиксированное положение по Y
                    width={20}
                    height={20}
                    fill="red"
                    draggable
                    dragBoundFunc={(pos) => ({
                        x: isShiftPressed ? pos.x : Math.round(pos.x / step) * step, // Ограничение по X с шагом или плавное движение
                        y: 50, // Фиксируем Y
                    })}
                    onDragMove={handleDragMove}
                />
            </Layer>
        </Stage>
    );
};

export default Timeline;
