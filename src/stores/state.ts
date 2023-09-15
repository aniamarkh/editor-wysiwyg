import { defineStore } from 'pinia';

export interface State {
  currentState: string;
  history: string[];
  pointer: number;
}

export const useStateStore = defineStore({
  id: 'state',
  state: (): State => ({
    currentState: '',
    history: [''],
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
    captureState(currentState: string) {
      if (this.canRedo) this.history = this.history.slice(0, this.pointer + 1);
      this.currentState = currentState;
      this.history.push(currentState);
      this.pointer++;
    },
    undo(): null | string {
      if (this.canUndo) {
        this.pointer--;
        return this.history[this.pointer];
      }
      return null;
    },
    redo(): null | string {
      if (this.canRedo) {
        this.pointer++;
        return this.history[this.pointer];
      }
      return null;
    }
  }
});
