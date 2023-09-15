export interface StateNode {
  type: 'h1' | 'p' | 'img';
  content: string;
}

export interface State {
  currentState: StateNode[];
  history: StateNode[][];
  pointer: number;
}
