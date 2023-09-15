export interface StateNode {
  type: 'h1' | 'p' | 'img';
  content: string;
}

export interface State {
  currentState: StateNode[];
}

export interface History {
  history: StateNode[][];
  pointer: number;
}
