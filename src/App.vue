<script setup lang="ts">
import { ref, provide, Ref, onMounted } from 'vue';
import { useStateStore } from '@/stores/state';
import { useDebounce } from '@/utils/debounce';
import { saveCaretPosition } from '@/utils/caret';
import ToolbarPanel from '@/components/ToolbarPanel.vue';

const store = useStateStore();
const debounce = useDebounce();
const editorContainer: Ref<null | HTMLElement> = ref(null);

const ensureFocus = () => {
  if (editorContainer.value) editorContainer.value.focus();
};
provide('ensureFocus', ensureFocus);
provide('editorContainerRef', editorContainer);

const writeInput = () => {
  debounce(() => {
    if (!editorContainer.value) return;

    const currentContent = editorContainer.value.innerHTML;
    const caretPosition = saveCaretPosition(editorContainer.value);
    store.captureState(currentContent, caretPosition);
    // console.log('content: ', store.currentState.content);
    // console.log('offset: ', store.currentState.caretPosition?.offset);
    // console.log('path: ', store.currentState.caretPosition?.path);

    // console.log(store.history);
  }, 500);
};

onMounted(ensureFocus);
</script>

<template>
  <div class="editor-wrapper">
    <ToolbarPanel />
    <div
      class="editor"
      contenteditable="true"
      spellcheck="true"
      ref="editorContainer"
      data-placeholder="Enter your text here..."
      @input="writeInput"
    ></div>
  </div>
</template>

<style scoped>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 960px;
  padding: 70px 100px;
  margin: 0 auto;
}

.editor {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  gap: 15px;
  padding: 20px;
}

[contenteditable]:focus {
  outline: 0px solid transparent;
}

[contenteditable]:empty::before {
  content: attr(data-placeholder);
  font-size: 15px;
  color: #444444;
  pointer-events: none;
}
</style>
