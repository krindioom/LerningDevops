import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DotsChartWithDrag = () => {
  const svgRef = useRef(null);

  // Данные
  const initialData = {
    dots: [
      { time: 0, value: 10 },
      { time: 100, value: 20 },
      { time: 200, value: 40 },
      { time: 300, value: 80 },
      { time: 400, value: 127 },
      { time: 500, value: 100 },
      { time: 600, value: 90 },
      { time: 700, value: 50 },
      { time: 800, value: 30 },
      { time: 900, value: 20 },
      { time: 1000, value: 10 },
      { time: 1100, value: 0 },
    ],
  };

  useEffect(() => {
    // Размеры SVG
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Очистка предыдущего содержимого SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Создание SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const data = initialData.dots;

    // Создание шкал
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.time)]) // Диапазон времени
      .range([margin.left, width - margin.right]); // Диапазон координат

    const yScale = d3
      .scaleLinear()
      .domain([0, 127]) // Диапазон значений
      .range([height - margin.bottom, margin.top]); // Диапазон координат

    // Создание осей
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(width / 10) // Шаг деления оси X (каждый 1 мс)
      .tickFormat((d) => `${d} ms`);
    const yAxis = d3.axisLeft(yScale);

    // Отрисовка осей
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    // Линия
    const line = d3
      .line()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.value));

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Обработчик перетаскивания точек
    const dragHandler = d3
      .drag()
      .on("start", function (event, d) {
        d3.select(this).attr("fill", "orange");
      })
      .on("drag", function (event, d) {
        // Ограничение значений в пределах шкал
        d.time = Math.max(0, Math.min(xScale.invert(event.x), xScale.domain()[1]));
        d.value = Math.max(0, Math.min(yScale.invert(event.y), yScale.domain()[1]));

        // Перемещение точки
        d3.select(this)
          .attr("cx", xScale(d.time))
          .attr("cy", yScale(d.value));

        // Обновление линии
        svg.select("path").attr("d", line);
      })
      .on("end", function () {
        d3.select(this).attr("fill", "red");
      });

    // Точки
    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => xScale(d.time))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 6)
      .attr("fill", "red")
      .call(dragHandler); // Привязка обработчика перетаскивания
  }, [initialData]);

  return <svg ref={svgRef}></svg>;
};

export default DotsChartWithDrag;
