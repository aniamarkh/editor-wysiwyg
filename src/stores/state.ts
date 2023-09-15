import { defineStore } from 'pinia';
import { State, StateNode } from '@/types';

export const useStateStore = defineStore({
  id: 'state',
  state: (): State => ({
    currentState: [
      // {
      //   type: 'p',
      //   content:
      //     'Таким образом консультация с широким активом представляет собой интересный эксперимент проверки позиций, занимаемых участниками в отношении поставленных задач. С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой интересный эксперимент проверки форм развития. Идейные соображения высшего порядка, а также укрепление и развитие структуры влечет за собой процесс внедрения и модернизации соответствующий условий активизации. Задача организации, в особенности же реализация намеченных плановых заданий играет важную роль в формировании дальнейших направлений развития. Повседневная практика показывает, что постоянное информационно-пропагандистское обеспечение нашей деятельности играет важную роль в формировании существенных финансовых и административных условий.'
      // },
      // { type: 'h1', content: 'Смотрите какие обезьянки' },
      // { type: 'img', content: 'monkeys.jpg' },
      // {
      //   type: 'p',
      //   content:
      //     'Таким образом консультация с широким активом представляет собой интересный эксперимент проверки позиций, занимаемых участниками в отношении поставленных задач. С другой стороны постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой инйцу шо шщйоц ущойц ущошцщйуо йцщуо йщцоу щйоу шщйцош ущйтересный эксперимент проверки форм развития. Идейные соображения высшего порядка, а также укрепление и развитие структуры влечет за собой процесс внедрения и модернизации соответствующий условий активизации. Задача организации, в особенности же реализация намеченных плановых заданий играет важную роль в формировании дальнейших направлений развития. Повседневная практика показывает, что постоянное информационно-пропагандистское обеспечение нашей деятельности играет важную роль в формировании существенных финансовых и административных условий.'
      // },
      // {
      //   type: 'p',
      //   content:
      //     'Товарищи! новая модель организационной деятельности требуют от нас анализа направлений прогрессивного развития. Задача организации, в особенности же постоянный количественный рост и сфера нашей активности требуют от нас анализа позиций, занимаемых участниками в отношении поставленных задач. Задача организации, в особенности же реализация намеченных плановых заданий требуют от нас анализа системы обучения кадров, соответствует насущным потребностям.'
      // }
    ],
    history: [],
    pointer: -1
  }),
  actions: {
    captureState(currentState: StateNode[]) {
      this.currentState = currentState;
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
