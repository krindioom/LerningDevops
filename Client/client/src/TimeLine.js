import React, { useRef, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { useRecoilState } from "recoil";
import { sliderDataState } from "./RecordStates";

const Timeline = () => {
  const [sliderData, setSliderData] = useRecoilState(sliderDataState);
  const [currentTime, setCurrentTime] = useState(0); // Для управления позицией линии
  const chartRef = useRef(null);
  const symbolSize = 10;

  useEffect(() => {
    const chartInstance = chartRef.current.getEchartsInstance();

    const updatePosition = () => {
      chartInstance.setOption({
        graphic: sliderData.map((item, dataIndex) => ({
          position: chartInstance.convertToPixel("grid", [
            item.time,
            item.value,
          ]),
        })),
      });
    };

    window.addEventListener("resize", updatePosition);
    chartInstance.on("dataZoom", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      chartInstance.off("dataZoom", updatePosition);
    };
  }, [sliderData]);

  const options = {
    title: {
      text: "Interactive Slider Timeline",
      left: "center",
    },
    tooltip: {
      triggerOn: "none",
      formatter: (params) =>
        `X: ${params.data[0].toFixed(2)}<br>Y: ${params.data[1].toFixed(2)}`,
    },
    grid: {
      top: "8%",
      bottom: "12%",
    },
    xAxis: {
      type: "time",
      name: "Time (ms)",
      min: 0,
      max: Math.max(...sliderData.map((p) => p.time)) + 1000,
    },
    yAxis: {
      type: "value",
      name: "Slider Value",
      min: 0,
      max: 127,
    },
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: 0,
        filterMode: "weakFilter",
        height: 20,
        bottom: 0,
        start: 0,
        end: 26,
        handleIcon:
          "path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        handleSize: "80%",
        showDetail: false,
      },
      {
        type: "inside",
        id: "insideX",
        xAxisIndex: 0,
        filterMode: "weakFilter",
        start: 0,
        end: 26,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
      },
      {
        type: "slider",
        yAxisIndex: 0,
        zoomLock: true,
        width: 10,
        right: 10,
        top: 70,
        bottom: 20,
        start: 95,
        end: 100,
        handleSize: 0,
        showDetail: false,
      },
      {
        type: "inside",
        id: "insideY",
        yAxisIndex: 0,
        start: 95,
        end: 100,
        zoomOnMouseWheel: false,
        moveOnMouseMove: true,
        moveOnMouseWheel: true,
      },
    ],
    series: [
      {
        id: "a",
        type: "scatter",
        data: sliderData.map((point) => [point.time, point.value]),
        symbolSize: symbolSize,
        itemStyle: {
          color: "red",
        },
      },
    ],
    graphic: [
      ...sliderData.map((item, dataIndex) => ({
        type: "circle",
        position: chartRef.current
          ? chartRef.current
              .getEchartsInstance()
              .convertToPixel("grid", [item.time, item.value])
          : [0, 0],
        shape: {
          cx: 0,
          cy: 0,
          r: symbolSize / 2,
        },
        invisible: true,
        draggable: true,
        ondrag: function (dx, dy) {
          onPointDragging(dataIndex, [this.x, this.y]);
        },
        z: 100,
      })),
    ],
  };

  const onPointDragging = (dataIndex, pos) => {
    const chartInstance = chartRef.current.getEchartsInstance();
    const newPoint = chartInstance.convertFromPixel("grid", pos);

    setSliderData((prev) =>
      prev.map((point, index) =>
        index === dataIndex
          ? { ...point, time: newPoint[0], value: newPoint[1] }
          : point
      )
    );

    chartInstance.setOption({
      series: [
        {
          id: "a",
          data: sliderData.map((point) => [point.time, point.value]),
        },
      ],
    });
  };

  return (
    <div>
      <h3>Interactive Slider Timeline</h3>
      <ReactECharts ref={chartRef} option={options} style={{ height: 400 }} />
    </div>
  );
};

export default Timeline;
