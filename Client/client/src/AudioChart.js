import React, { useRef, useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import WaveSurfer from "wavesurfer.js";

const AudioChart = () => {
  const [audioData, setAudioData] = useState([]);
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);

  useEffect(() => {
    waveSurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "violet",
      progressColor: "purple",
      normalize: true,
      height: 100,
    });

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
      }
    };
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      waveSurferRef.current.load(url);

      waveSurferRef.current.on("ready", () => {
        debugger
        const duration = waveSurferRef.current.getDuration();
        const peaks = waveSurferRef.current.exportPCM(1000, 10000, false); // Генерация 1000 точек
        setAudioData(peaks.map((value, index) => [index / 1000 * duration, value]));
      });
    }
  };

  const options = {
    title: {
      text: "Audio Waveform",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "value",
      name: "Time",
    },
    yAxis: {
      type: "value",
      name: "Amplitude",
    },
    series: [
      {
        id: "waveform",
        type: "line",
        data: audioData,
        smooth: true,
        symbol: "none",
        areaStyle: {},
      },
    ],
  };

  return (
    <div>
      <h3>Audio Waveform Visualization</h3>
      <input type="file" accept="audio/mp3" onChange={handleFileUpload} />
      <ReactECharts option={options} style={{ height: 400 }} />
      <div ref={waveformRef} style={{ display: "none" }}></div>
    </div>
  );
};

export default AudioChart;
