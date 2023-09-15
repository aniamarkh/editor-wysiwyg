export interface CaretPosition {
  path: number[];
  offset: number;
}

export interface CurrentState {
  content: string;
  caretPosition: CaretPosition | null;
}

export interface State {
  currentState: CurrentState;
  history: CurrentState[];
  pointer: number;
}
