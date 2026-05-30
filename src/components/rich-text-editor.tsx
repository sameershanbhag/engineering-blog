"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Rich-text (WYSIWYG) editor built on TipTap. Emits HTML via onChange; the
 * content is styled with `.prose-article` so the editor matches the published
 * article view. The submitted HTML is sanitized server-side.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
}: {
  value?: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  // Keep the latest onChange without re-creating the editor.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    immediatelyRender: false, // required for Next.js SSR
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      Placeholder.configure({ placeholder }),
      Image,
    ],
    content: value ?? "",
    editorProps: {
      attributes: {
        class:
          "prose-article ec-editor max-w-none min-h-[26rem] px-5 py-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChangeRef.current(editor.getHTML()),
  });

  // If the parent resets the value (e.g. after publishing), sync it in.
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-outline-variant/40 px-2 py-1.5">
      <Btn editor={editor} onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} label="Bold">
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn editor={editor} onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} label="Italic">
        <Italic className="h-4 w-4" />
      </Btn>
      <Divider />
      <Btn editor={editor} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} label="Heading 2">
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn editor={editor} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive("heading", { level: 3 })} label="Heading 3">
        <Heading3 className="h-4 w-4" />
      </Btn>
      <Divider />
      <Btn editor={editor} onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} label="Bullet list">
        <List className="h-4 w-4" />
      </Btn>
      <Btn editor={editor} onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} label="Numbered list">
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn editor={editor} onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive("blockquote")} label="Quote">
        <Quote className="h-4 w-4" />
      </Btn>
      <Btn editor={editor} onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive("codeBlock")} label="Code block">
        <Code2 className="h-4 w-4" />
      </Btn>
      <Divider />
      <Btn editor={editor} onClick={setLink} active={editor?.isActive("link")} label="Link">
        <Link2 className="h-4 w-4" />
      </Btn>
      <Btn editor={editor} onClick={addImage} label="Image">
        <ImageIcon className="h-4 w-4" />
      </Btn>
      <Divider />
      <Btn editor={editor} onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()} label="Undo">
        <Undo2 className="h-4 w-4" />
      </Btn>
      <Btn editor={editor} onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()} label="Redo">
        <Redo2 className="h-4 w-4" />
      </Btn>
    </div>
  );
}

function Btn({
  editor,
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  editor: Editor | null;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={!editor || disabled}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded transition-colors disabled:opacity-40",
        active
          ? "bg-primary-container text-on-primary-container"
          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-outline-variant/50" />;
}
