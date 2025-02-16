import React, { useEffect, useState, useRef } from "react";

const recordObject = {
  startTime: 0,
  recordedValues: [],
};

const ControlElement = () => {
  const [record, setRecord] = useState(recordObject);
  const inputRef = useRef(null);

  useEffect(() => {
    console.log(record);
  }, [record]);

  const handleChange = (e) => {
    setRecord((prevRecord) => ({
      ...prevRecord,
      recordedValues: [
        ...prevRecord.recordedValues,
        {
          time: Date.now(),
          value: e.target.value,
        },
      ],
    }));
  };

  const handleStop = () => {
    setRecord((prevRecord) => ({
      ...prevRecord,
      recordedValues: prevRecord.recordedValues.map((item) => ({
        ...item,
        time: item.time - prevRecord.startTime,
      })),
    }));
  };

  const handlePlay = () => {
    if (record.recordedValues.length === 0) return;

    const startPlayback = Date.now();
    for (const item of record.recordedValues) {
      const targetTime = startPlayback + item.time;
      while (Date.now() < targetTime) {
        // Блокирующий цикл
      }
      console.log("Воспроизводим значение:", item.value);
      if (inputRef.current) {
        inputRef.current.value = item.value; // Устанавливаем значение ползунка
      }
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        min={0}
        max={127}
        type="range"
        onChange={handleChange}
      />
      <button
        onClick={() => {
          setRecord((prev) => ({ ...prev, startTime: Date.now() }));
        }}
      >
        запись
      </button>
      <button onClick={handleStop}>стоп</button>
      <button onClick={handlePlay}>воспроизвести</button>
    </div>
  );
};

export default ControlElement;
