import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const AutomationComponent = () => {
  const [points, setPoints] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Настройка  масштабов
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    // Создание  g-элемента  для  графика
    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Отрисовка  осей
    chart
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    chart.append('g').call(d3.axisLeft(yScale));

    // Отрисовка  сетки
    chart.append('g').call(d3.axisBottom(xScale).tickSize(-height).tickFormat(''));
    chart.append('g').call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));

    // Создание  линии
    const line = d3
      .line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX); // Используем  кривую  интерполяцию

    // Отрисовка  линии  и  точек
    const path = chart
      .append('path')
      .datum(points)
      .attr('d', line)
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    // Обработчики  событий
    svg
      .on('click', (event) => {
        const x = event.offsetX;
        const y = event.offsetY;
        const xCoordinate = xScale.invert((x - margin.left) / width * 100);
        const yCoordinate = yScale.invert((y - margin.top) / height * 100);
        setPoints([...points, { x: xCoordinate, y: yCoordinate }]);
      })
      .on('mousemove', (event) => {
        if (event.buttons === 1) {
          const x = event.offsetX;
          const y = event.offsetY;
          const xCoordinate = xScale.invert((x - margin.left) / width * 100);
          const yCoordinate = yScale.invert((y - margin.top) / height * 100);
          const newPoints = [...points];
          newPoints[newPoints.length - 1] = { x: xCoordinate, y: yCoordinate };
          setPoints(newPoints);
        }
      });

    return () => svg.selectAll('*').remove(); // Очистка  графика
  }, [points]);

  return (
    <svg ref={svgRef} width={960} height={500}>
      {/* Содержимое  графика  (оси,  сетка,  линия,  точки)  будет  отрисовано  с  помощью  D3 */}
    </svg>
  );
};

export default AutomationComponent;

