<script setup lang="ts">
import { ref, provide, Ref, onMounted } from 'vue';
import { useStateStore } from './stores/state';
import ToolbarPanel from './components/ToolbarPanel.vue';
// import EditableContent from './components/EditableContent.vue';
const editorContainer: Ref<null | HTMLElement> = ref(null);

const store = useStateStore();

const ensureFocus = () => {
  if (editorContainer.value) editorContainer.value.focus();
};
provide('ensureFocus', ensureFocus);
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
    >
      <template v-for="(item, index) in store.currentState">
        <h1 v-if="item.type === 'h1'" :key="`h1-${index}`">{{ item.content }}</h1>
        <p v-else-if="item.type === 'p'" :key="`p-${index}`">{{ item.content }}</p>
        <img v-else-if="item.type === 'img'" :key="`img-${index}`" :src="item.content" />
      </template>
    </div>
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
