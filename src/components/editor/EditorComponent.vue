<script lang="ts">
import { defineComponent } from 'vue';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, Editor } from '@tiptap/vue-3';
import { Image as TiptapImage } from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

import { initialContent } from '@/assets/content';
import * as formatter from './formatter';
import UndoIcon from './icons/IconUndo.vue';
import RedoIcon from './icons/IconRedo.vue';
import TitleIcon from './icons/IconTitle.vue';
import ParagraphIcon from './icons/IconParagraph.vue';
import ImageIcon from './icons/IconImage.vue';

export default defineComponent({
  components: {
    EditorContent,
    UndoIcon,
    RedoIcon,
    TitleIcon,
    ParagraphIcon,
    ImageIcon
  },

  data() {
    return {
      editor: null,
      copied: false
      // https://github.com/ueberdosis/tiptap/issues/1344
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as { editor: any; copied: boolean };
  },

  computed: {
    canUndo(): boolean {
      return this.editor ? this.editor.can().chain().focus().undo().run() : false;
    },
    canRedo(): boolean {
      return this.editor ? this.editor.can().chain().focus().redo().run() : false;
    }
  },

  methods: {
    undo() {
      if (this.canUndo && this.editor) this.editor.chain().focus().undo().run();
    },

    redo() {
      if (this.canRedo && this.editor) this.editor.chain().focus().redo().run();
    },

    formatSelectionTo(type: 'h1' | 'p') {
      if (!this.editor) return;

      let formatedHTML = '';
      const selection = this.editor.state.selection;
      const selectionInSingleNode =
        selection.from >= selection.$from.start() && selection.to <= selection.$from.end();

      if (selectionInSingleNode) {
        const validSelection =
          selection && !selection.empty && this.editor.state.selection.$from.parent.textContent;

        if (validSelection) formatedHTML = formatter.formatInSingleNode(type, this.editor);
      } else {
        formatedHTML = formatter.formatInMultiNodes(type, this.editor);
      }

      if (formatedHTML) {
        this.editor
          .chain()
          .setTextSelection({ from: selection.$from.start(), to: selection.$to.end() })
          .deleteSelection()
          .insertContent(formatedHTML)
          .focus(selection.to + 2)
          .run();
      } else if (!this.editor.state.selection.$from.parent.textContent.length) {
        const command = type === 'h1' ? 'setHeading' : 'setParagraph';
        this.editor.chain().focus()[command]({ level: 1 }).run();
      } else {
        this.editor.chain().focus().run();
      }
    },

    addImage() {
      const url = window.prompt('Укажите ссылку на изображение');

      if (url && this.editor) {
        const img = new Image();
        img.onload = () => {
          if (!this.editor) return;
          this.editor.chain().focus().setImage({ src: url }).run();
        };
        img.onerror = () => {
          alert('Упс! Ссылка на изображение неверна или такого изображения не существует');
        };

        img.src = url;
      }
    },

    copyToClipboard() {
      if (this.editor && this.editor.options.content)
        navigator.clipboard.writeText(this.editor.getHTML()).then(() => {
          this.copied = true;
          setTimeout(() => {
            this.copied = false;
          }, 1500);
        });
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        TiptapImage,
        Placeholder.configure({
          placeholder: 'Введите текст...'
        })
      ],
      content: initialContent,
      editorProps: {
        attributes: {
          class: 'editor'
        }
      }
    });
    this.editor.chain().focus().run();
  },

  beforeUnmount() {
    if (this.editor) this.editor.destroy();
  }
});
</script>

<template>
  <div class="editor-wrapper">
    <div class="toolbar">
      <button class="toolbar__button" @click="undo" :disabled="!canUndo">
        <UndoIcon :isDisabled="!canUndo" />
        <span class="visually-hidden">Отменить</span>
      </button>
      <button class="toolbar__button" @click="redo" :disabled="!canRedo">
        <RedoIcon :isDisabled="!canRedo" />
        <span class="visually-hidden">Повторить</span>
      </button>
      <button class="toolbar__button" @click="formatSelectionTo('h1')">
        <TitleIcon />
        <span class="visually-hidden">Преобразовать в заголовок</span>
      </button>
      <button class="toolbar__button" @click="formatSelectionTo('p')">
        <ParagraphIcon />
        <span class="visually-hidden">Преобразовать в параграф</span>
      </button>
      <button class="toolbar__button" @click="addImage">
        <ImageIcon />
        <span class="visually-hidden">Импортировать изображение</span>
      </button>
      <Transition name="fade" mode="out-in">
        <p v-if="copied" class="toolbar__notification">Скопировано! 👌</p>
        <button v-else class="toolbar__button toolbar__button--no-bg" @click="copyToClipboard">
          Скопировать HTML
        </button>
      </Transition>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>

<style>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 960px;
  padding: 70px 100px;
  margin: 0 auto;
}

.editor {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  gap: 15px;
  padding: 20px;
  border-radius: 4px;
}

.toolbar {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
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

.toolbar__button:hover {
  background-color: #444444;
}

.toolbar__button:disabled {
  cursor: default;
}

.toolbar__button:disabled:hover {
  background-color: #282828;
}

.toolbar__button--no-bg {
  background-color: transparent;
  width: auto;
}

.toolbar__button--no-bg:hover {
  background-color: transparent;
  color: #9ac0ff;
}

.tiptap p.is-editor-empty:first-child::before {
  color: #444444;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.toolbar__notification {
  color: #639eff;
  line-height: 38px;
}

@media (max-width: 768px) {
  .editor-wrapper {
    padding: 40px 30px;
  }
}
</style>
