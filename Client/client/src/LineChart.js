import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import "./ScrollableChart.css"; // Для стилей

const LineChart = ({ data, width = 600, height = 400 }) => {
    const svgRef = useRef(null);
    const yAxisRef = useRef(null);
  
    useEffect(() => {
      // Установки для графика
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
  
      // Масштаб оси X
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.x) + 10])
        .range([0, innerWidth]);
  
      // Масштаб оси Y
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.y) + 10])
        .range([innerHeight, 0]);
  
      // Рендерим Y-ось отдельно
      const yAxis = d3.axisLeft(yScale).ticks(5);
      const ySvg = d3.select(yAxisRef.current);
      ySvg.selectAll("*").remove(); // Очистить перед рендерингом
      ySvg
        .attr("width", margin.left)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        .call(yAxis);
  
      // Рендерим график
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Очистить перед рендерингом
      const chart = svg
        .attr("width", innerWidth + margin.left + margin.right)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      // Ось X
      const xAxis = d3.axisBottom(xScale).ticks(10);
      chart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(xAxis);
  
      // Линия
      const line = d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))
        .curve(d3.curveMonotoneX);
  
      chart
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
  
      // Сетка по X (необязательно)
      chart
        .append("g")
        .attr("class", "grid")
        .call(
          d3
            .axisBottom(xScale)
            .ticks(10)
            .tickSize(-innerHeight)
            .tickFormat("")
        );
    }, [data, width, height]);
  
    return (
      <div className="scrollable-chart-container">
        <svg ref={yAxisRef} className="y-axis" />
        <div className="chart-scroll-container">
          <svg ref={svgRef} className="line-chart" />
        </div>
      </div>
    );
  };

export default LineChart;
