<script lang="ts">
import { defineComponent } from 'vue';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, Editor } from '@tiptap/vue-3';
import { Image as TiptapImage } from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Selection } from 'prosemirror-state';
import { Node } from '@tiptap/pm/model';

import { initialContent } from './assets/content';
import UndoIcon from './components/icons/IconUndo.vue';
import RedoIcon from './components/icons/IconRedo.vue';
import TitleIcon from './components/icons/IconTitle.vue';
import ParagraphIcon from './components/icons/IconParagraph.vue';
import ImageIcon from './components/icons/IconImage.vue';

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

    transformTo(type: 'h1' | 'p') {
      if (!this.editor) return;

      const selection = this.editor.state.selection;
      if (selection.from >= selection.$from.start() && selection.to <= selection.$from.end()) {
        this.handleSingleNodeSelection(type, selection);
      } else {
        this.handleMultiNodesSelection(type, selection);
      }
    },

    handleSingleNodeSelection(type: 'h1' | 'p', selection: Selection) {
      if (!this.editor) return;

      const parentNode = this.editor.state.selection.$from.parent;
      const validSelection = selection && !selection.empty && parentNode.textContent;

      if (type === 'h1' && validSelection && parentNode.type.name === 'paragraph') {
        this.transformInSingleNode('p', 'h1', selection, parentNode);
      } else if (type === 'p' && validSelection && parentNode.type.name === 'heading') {
        this.transformInSingleNode('h1', 'p', selection, parentNode);
      } else if (!parentNode.textContent.length) {
        const command = type === 'h1' ? 'setHeading' : 'setParagraph';
        this.editor.chain().focus()[command]({ level: 1 }).run();
      } else {
        this.editor.chain().focus().run();
      }
    },

    transformInSingleNode(
      fromType: 'p' | 'h1',
      toType: 'h1' | 'p',
      selection: Selection,
      parentNode: Node
    ) {
      if (!this.editor) return;
      const { from, to } = selection;
      const nodeStart = selection.$from.start();
      const nodeEnd = selection.$from.end();
      const textBefore = parentNode.textBetween(0, from - nodeStart);
      const selectedText = parentNode.textBetween(from - nodeStart, to - nodeStart);
      const textAfter = parentNode.textBetween(to - nodeStart, parentNode.content.size);

      let newContent = '';
      if (textBefore) newContent += `<${fromType}>${textBefore}</${fromType}>`;
      newContent += `<${toType}>${selectedText}</${toType}>`;
      if (textAfter) newContent += `<${fromType}>${textAfter}</${fromType}>`;

      this.editor
        .chain()
        .setTextSelection({ from: nodeStart, to: nodeEnd })
        .deleteSelection()
        .insertContent(newContent)
        .focus(to + 2)
        .run();
    },

    handleMultiNodesSelection(type: 'h1' | 'p', selection: Selection) {
      if (!this.editor) return;

      const state = this.editor.state;
      const { from, to } = selection;

      const startNode = state.doc.nodeAt(from);
      const endNode = state.doc.nodeAt(to - 1);

      let transformedContent = '';

      state.doc.nodesBetween(from, to, (node: Node) => {
        if (node.type.name !== 'text') {
          // handle start node
          if (startNode && (node === startNode || node.firstChild === startNode)) {
            const beforeSelection = startNode.text?.slice(0, from - state.selection.$from.start());
            const selection = startNode.text?.slice(
              from - state.selection.$from.start(),
              state.selection.$from.end()
            );
            const tag = state.doc.resolve(from).parent.type.name === 'heading' ? 'h1' : 'p';

            if (beforeSelection) transformedContent += `<${tag}>${beforeSelection}</${tag}>`;
            if (selection) transformedContent += `<${type}>${selection}`;
          }
          // handle end node
          else if (endNode && (node === endNode || node.firstChild === endNode)) {
            const selection = endNode.text?.slice(0, to - state.selection.$to.start());
            const afterSelection = endNode.text?.slice(
              to - state.selection.$to.start(),
              state.selection.$to.end()
            );
            const tag = state.doc.resolve(to).parent.type.name === 'heading' ? 'h1' : 'p';
            transformedContent += `${selection}</${type}>`;
            if (afterSelection) transformedContent += `<${tag}>${afterSelection}</${tag}>`;
          }
          // handle other nodes based on type
          else if (node.type.name === 'image') {
            transformedContent += `</${type}><img src="${node.attrs.src}" /><${type}>`;
          } else if (node.type.name === 'paragraph' || node.type.name === 'heading') {
            transformedContent += `${node.textContent}`;
          }
        }
      });

      const deleteFromPosition = state.selection.$from.start();
      const deleteToPosition = state.selection.$to.end();

      this.editor
        .chain()
        .setTextSelection({ from: deleteFromPosition, to: deleteToPosition })
        .deleteSelection()
        .insertContent(transformedContent)
        .focus(to + 2)
        .run();
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
      <button class="toolbar__button" @click="transformTo('h1')">
        <TitleIcon />
        <span class="visually-hidden">Преобразовать в заголовок</span>
      </button>
      <button class="toolbar__button" @click="transformTo('p')">
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
