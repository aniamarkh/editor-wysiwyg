<script setup lang="ts">
import { StateNode } from '@/types';
defineProps<{
  content: StateNode[];
}>();
</script>

<template>
  <div class="content" contenteditable="true" spellcheck="true" ref="contentDiv"></div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  gap: 15px;
  padding: 10px;
}

.content__placeholder {
  color: #444444;
}
</style>
