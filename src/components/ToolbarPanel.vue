<script setup lang="ts">
import { inject, ref, Ref } from 'vue';
import { useStateStore } from '@/stores/state';
import { restoreCaretPosition } from '@/utils/caret';
import BackIcon from './icons/IconBack.vue';
import ForwardIcon from './icons/IconForward.vue';
import TitleIcon from './icons/IconTitle.vue';
import ParagraphIcon from './icons/IconParagraph.vue';
import ImageIcon from './icons/IconImage.vue';
import { nextTick } from 'vue';
const editorContainer: Ref<null | HTMLElement> = inject('editorContainerRef', ref(null));
const ensureFocus = inject<() => void>('ensureFocus');

const store = useStateStore();

const historyHandler = async (action: () => void) => {
  action();
  if (!editorContainer.value) return;
  editorContainer.value.innerHTML = store.currentState.content;
  await nextTick();
  if (store.currentState.caretPosition)
    restoreCaretPosition(editorContainer.value, store.currentState.caretPosition);
};

const copyHTMLToClipboard = () => {
  if (editorContainer.value) navigator.clipboard.writeText(editorContainer.value.innerHTML);
};
</script>

<template>
  <div class="toolbar" @click="ensureFocus">
    <button class="toolbar__button" :disabled="!store.canUndo" @click="historyHandler(store.undo)">
      <BackIcon :isDisabled="!store.canUndo" />
      <span class="visually-hidden">Back</span>
    </button>
    <button class="toolbar__button" :disabled="!store.canRedo" @click="historyHandler(store.redo)">
      <ForwardIcon :isDisabled="!store.canRedo" />
      <span class="visually-hidden">Forward</span>
    </button>
    <button class="toolbar__button">
      <TitleIcon />
      <span class="visually-hidden">Transform into title</span>
    </button>
    <button class="toolbar__button">
      <ParagraphIcon />
      <span class="visually-hidden">Transform into paragraph</span>
    </button>
    <button class="toolbar__button">
      <ImageIcon />
      <span class="visually-hidden">Import image</span>
    </button>
    <button class="toolbar__button toolbar__button--no-bg" @click="copyHTMLToClipboard">
      Скопировать HTML
    </button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.toolbar__button {
  display: grid;
  place-items: center;
  width: 42px;
  height: 38px;
  background-color: #282828;
  color: #639eff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.toolbar__button--no-bg {
  background-color: transparent;
  width: auto;
}

.toolbar__button:hover {
  background-color: #444444;
}

.toolbar__button:disabled {
  cursor: default;
}

.toolbar__button:disabled:hover {
  background-color: #282828;
}

.toolbar__button--no-bg:hover {
  background-color: transparent;
  color: #9ac0ff;
}
</style>
