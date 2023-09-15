<script setup lang="ts">
import { useStateStore } from './stores/state';
import ToolbarPanel from './components/ToolbarPanel.vue';
// import EditableContent from './components/EditableContent.vue';

const store = useStateStore();
</script>

<template>
  <div class="editor">
    <ToolbarPanel />
    <div class="content" contenteditable="true" spellcheck="true" ref="contentDiv">
      <template v-for="(item, index) in store.currentState">
        <h1 v-if="item.type === 'h1'" :key="`h1-${index}`">{{ item.content }}</h1>
        <p v-else-if="item.type === 'p'" :key="`p-${index}`">{{ item.content }}</p>
        <img v-else-if="item.type === 'img'" :key="`img-${index}`" :src="item.content" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 960px;
  padding: 70px 100px;
  margin: 0 auto;
}

.content {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  gap: 15px;
  padding: 20px;
  border: #639eff solid 2px;
  border-radius: 4px;
}

.content__placeholder {
  color: #444444;
}
</style>
