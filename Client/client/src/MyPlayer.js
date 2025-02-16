import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";

const MyPlayer = () => {
  const waveformRef = useRef(null);
  const timelineRef = useRef(null);
  const [waveform, setWaveform] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1); // Состояние для скорости воспроизведения

  useEffect(() => {
    if (!waveformRef.current || !timelineRef.current) return;

    const wave = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ddd",
      progressColor: "#007BFF",
      cursorColor: "#FF0000",
      responsive: true,
      height: 100,
      plugins: [
        TimelinePlugin.create({
          container: timelineRef.current,
          height: 20,
          notchPercentHeight: 1,
          primaryColor: "#000",
          secondaryColor: "#ddd",
          primaryFontColor: "#000",
          secondaryFontColor: "#aaa",
          formatTimeCallback: (seconds) => {
            const milliseconds = Math.floor(seconds * 1000);
            return `${milliseconds} ms`;
          },
        }),
      ],
    });

    setWaveform(wave);

    return () => {
      wave.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform && audioFile) {
      waveform.load(audioFile);
    }
  }, [waveform, audioFile]);

  useEffect(() => {
    if (waveform) {
      waveform.setPlaybackRate(playbackRate); // Обновляем скорость воспроизведения
    }
  }, [playbackRate, waveform]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(URL.createObjectURL(file));
    }
  };

  const togglePlayPause = () => {
    if (waveform) {
      waveform.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaybackRateChange = (e) => {
    setPlaybackRate(parseFloat(e.target.value)); // Обновляем состояние скорости
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <div ref={waveformRef} style={{ width: "100%", height: "100px" }}></div>
      <div ref={timelineRef} style={{ width: "100%", height: "20px" }}></div>
      <button onClick={togglePlayPause}>
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div style={{ marginTop: "20px" }}>
        <label htmlFor="playbackRate">
          Playback Speed: {playbackRate}x
        </label>
        <input
          id="playbackRate"
          type="range"
          min="0.09"
          max="10"
          step="0.1"
          value={playbackRate}
          onChange={handlePlaybackRateChange}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default MyPlayer;
