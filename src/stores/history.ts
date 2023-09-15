import { defineStore } from 'pinia';
import { History, StateNode } from '@/types';

export const useHistoryStore = defineStore({
  id: 'history',
  state: (): History => ({
    history: [],
    pointer: -1
  }),
  actions: {
    captureHistory(currentState: StateNode[]): void {
      this.history.push(currentState);
      this.pointer++;
    },
    undo(): null | StateNode[] {
      if (this.pointer > 0) {
        this.pointer--;
        return this.history[this.pointer];
      }
      return null;
    },
    redo(): null | StateNode[] {
      if (this.pointer < this.history.length - 1) {
        this.pointer++;
        return this.history[this.pointer];
      }
      return null;
    }
  }
});
