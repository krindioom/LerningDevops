import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  pauseTimesState,
  recordingStartState,
  sliderDataState,
} from "./RecordStates";

const SliderControl = ({ id }) => {
  const [value, setValue] = useState(0);
  const [data, setData] = useRecoilState(sliderDataState);
  const recordingStart = useRecoilValue(recordingStartState);
  const pauseTimes = useRecoilValue(pauseTimesState);

  useEffect(() => {
    const playHandler = (e) => {
      setValue(e.detail);
    };

    window.addEventListener(`slider-play-${id}`, playHandler);

    return () => {
      window.removeEventListener(`slider-play-${id}`, playHandler);
    };
  }, [id]);

  const handleChange = (e) => {
    if (!recordingStart) return;

    const rawTime = Date.now() - recordingStart;

    const adjustedTime =
      rawTime - pauseTimes.reduce((acc, pause) => acc + pause.duration, 0);

    setData((prev) => [
      ...prev,
      { id, time: adjustedTime, value: e.target.value },
    ]);

    setValue(e.target.value);
  };

  return (
    <input
      type="range"
      min="0"
      max="127"
      step="1"
      value={value}
      onChange={handleChange}
    />
  );
};

export default SliderControl;
