"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

interface Props {
  content: string;
  onChange: (value: string) => void;
}

const buttonClass =
  "cursor-pointer rounded border px-3 py-1 text-sm hover:bg-slate-100";

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[420px] p-4 outline-none focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex flex-wrap gap-2 border-b bg-slate-50 p-2">
        <button type="button" className={buttonClass} onClick={() => editor.chain().focus().undo().run()}>Undo</button>
        <button type="button" className={buttonClass} onClick={() => editor.chain().focus().redo().run()}>Redo</button>
        <button type="button" className={buttonClass} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
        <button type="button" className={buttonClass} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
        <button type="button" className={buttonClass} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
        <button type="button" className={buttonClass} onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</button>
        <button type="button" className={buttonClass} onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbered List</button>
        <button type="button" className={buttonClass} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button type="button" className={buttonClass} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}