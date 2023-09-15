import { defineStore } from 'pinia';
import { CaretPosition, State } from '@/types';

export const useStateStore = defineStore({
  id: 'state',
  state: (): State => ({
    currentState: {
      content: '',
      caretPosition: null
    },
    history: [{ content: '', caretPosition: null }],
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
    captureState(currentState: string, caretPosition: CaretPosition) {
      if (this.canRedo) this.history = this.history.slice(0, this.pointer + 1);

      const stateToCapture = {
        content: currentState,
        caretPosition: caretPosition
      };

      this.currentState = stateToCapture;
      this.history.push(stateToCapture);
      this.pointer++;
    },
    undo(): void {
      console.log(this.history);
      if (this.canUndo) {
        this.pointer--;
        this.currentState = this.history[this.pointer];
      }
    },
    redo(): void {
      console.log(this.history);
      if (this.canRedo) {
        this.pointer++;
        this.currentState = this.history[this.pointer];
      }
    }
  }
});
