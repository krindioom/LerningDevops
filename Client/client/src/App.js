import React from 'react';
import useUndoRedo from './useUndoRedo';
import Component from './Component';
import ToneAudioWaveform from './ToneAudioWaveform';
import AudioWaveformSegment from './ToneAudioWaveform';

function App() {
  const { state, set, undo, redo } = useUndoRedo([0, 1]); // Начальное состояние — массив с числом 0

  return (
    <div>
      {/* <button
        type="button"
        onClick={() => set(prev => [...prev, prev[prev.length - 1] + 1])} // Добавляем новое число в массив
      >
        Add
      </button>
      <div>
        <button onClick={undo} disabled={state.length <= 1}>
          Undo
        </button>
        <button onClick={redo} disabled={state[state.length - 1] === 0}>
          Redo
        </button>
      </div>
      <p>Current state: {JSON.stringify(state)}</p>
      <Component state={state}/> */}

      <AudioWaveformSegment startTime={100} endTime={150} audioUrl={"https://storage.yandexcloud.net/autolizer2-file-storage/audios/be45d0f2-8fea-45c2-a896-ccad9a075449?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=YCAJEm63E1QwaK8ct0f_OrWII%2F20250127%2Fru-central1%2Fs3%2Faws4_request&X-Amz-Date=20250127T074149Z&X-Amz-Expires=3600&X-Amz-Signature=6FBD5D94D11F4B1E3FE9F439498782B30D3D2C90AD8A3DF55056D583265AD553&X-Amz-SignedHeaders=host"}/>
    </div>
  );
}

export default App;
