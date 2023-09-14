<script setup lang="ts">
import BackIcon from './icons/IconBack.vue';
import ForwardIcon from './icons/IconForward.vue';
import TitleIcon from './icons/IconTitle.vue';
import ParagraphIcon from './icons/IconParagraph.vue';
import ImageIcon from './icons/IconImage.vue';
</script>

<template>
  <div class="toolbar">
    <button class="toolbar__button">
      <BackIcon />
      <span class="visually-hidden">Back</span>
    </button>
    <button class="toolbar__button">
      <ForwardIcon />
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
    <button class="toolbar__button toolbar__button--no-bg">Скопировать HTML</button>
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

.toolbar__button--no-bg:hover {
  background-color: transparent;
  color: #9ac0ff;
}
</style>
