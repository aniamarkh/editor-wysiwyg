<script setup lang="ts">
import ToolbarPanel from './components/ToolbarPanel.vue';
import EditableContent from './components/EditableContent.vue';
</script>

<template>
  <div class="editor">
    <ToolbarPanel />
    <EditableContent />
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
</style>
