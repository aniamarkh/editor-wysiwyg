export interface StateNode {
  tag: 'p' | 'h1' | 'img';
  content: string;
}

export interface State {
  currentState: StateNode[];
  history: StateNode[][];
  pointer: number;
}
