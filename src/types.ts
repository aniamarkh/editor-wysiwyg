export interface CurrentState {
  content: string;
}

export interface State {
  currentState: CurrentState;
  history: CurrentState[];
  pointer: number;
}
