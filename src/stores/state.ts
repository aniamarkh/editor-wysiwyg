import { defineStore } from 'pinia';
import { State, StateNode } from '../types';

const initialState: StateNode[] = [
  {
    tag: 'h1',
    content: 'title'
  },
  {
    tag: 'p',
    content: 'teeeeeeeext'
  },
  {
    tag: 'img',
    content: 'monkeys.jpg'
  }
];

export const useStateStore = defineStore({
  id: 'state',
  state: (): State => ({
    currentState: initialState,
    history: [initialState],
    pointer: 0
  }),
  getters: {
    canUndo(): boolean {
      return this.pointer > 0;
    },
    canRedo(): boolean {
      return this.pointer < this.history.length - 1;
    }
  },
  actions: {
    captureState(currentState: StateNode[]) {
      if (this.canRedo) this.history = this.history.slice(0, this.pointer + 1);

      this.currentState = currentState;
      this.history.push(currentState);
      this.pointer++;
    },
    undo(): void {
      if (this.canUndo) {
        this.pointer--;
        this.currentState = this.history[this.pointer];
      }
    },
    redo(): void {
      if (this.canRedo) {
        this.pointer++;
        this.currentState = this.history[this.pointer];
      }
    }
  }
});
