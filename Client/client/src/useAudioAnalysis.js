import React, { useEffect, useState } from "react";
import * as Tone from "tone";

export const useAudioAnalysis = (audioUrl) => {
  const [waveform, setWaveform] = useState([]);

  useEffect(() => {
    const analyzeAudio = async () => {
      await Tone.start();
      const player = new Tone.Player(audioUrl).toDestination();
      const waveformData = await player.buffer.get();
      const leftChannel = waveformData._left;
      const sampleRate = waveformData.sampleRate;

      // Преобразование данных в массив амплитуд
      const amplitudes = [];
      for (let i = 0; i < leftChannel.length; i += sampleRate / 100) {
        amplitudes.push(leftChannel[i]);
      }

      setWaveform(amplitudes);
    };

    analyzeAudio();
  }, [audioUrl]);

  return waveform;
};
