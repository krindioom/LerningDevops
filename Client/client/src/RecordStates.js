import { atom, selector } from "recoil";

// Хранит "сырые" точки и метки
export const sliderDataState = atom({
  key: "sliderDataState",
  default: [],
});

// Хранит общее время начала записи
export const recordingStartState = atom({
  key: "recordingStartState",
  default: null,
});

// Хранит паузы
export const pauseTimesState = atom({
  key: "pauseTimesState",
  default: [],
});

// Массив меток времени
export const marksState = atom({
    key: "marksState", // уникальный ключ
    default: [],
  });