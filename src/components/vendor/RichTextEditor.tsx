"use client";

import React, { useCallback, useRef } from "react";
import {
  File,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Table,
  Type,
} from "lucide-react";

const toolbarButtons = [
  { icon: <File size={14} />, label: "File", cmd: "" },
  { icon: <Type size={14} />, label: "Insert", cmd: "" },
  { icon: <Type size={14} />, label: "Format", cmd: "" },
  { icon: <Table size={14} />, label: "Table", cmd: "" },
  { icon: <Bold size={14} />, label: "Bold", cmd: "bold" },
  { icon: <Italic size={14} />, label: "Italic", cmd: "italic" },
  { icon: <Underline size={14} />, label: "Underline", cmd: "underline" },
  { icon: <Strikethrough size={14} />, label: "Strikethrough", cmd: "strikeThrough" },
  { icon: <AlignLeft size={14} />, label: "Align Left", cmd: "justifyLeft" },
  { icon: <AlignCenter size={14} />, label: "Align Center", cmd: "justifyCenter" },
  { icon: <AlignRight size={14} />, label: "Align Right", cmd: "justifyRight" },
  { icon: <List size={14} />, label: "Bullet List", cmd: "insertUnorderedList" },
  { icon: <ListOrdered size={14} />, label: "Numbered List", cmd: "insertOrderedList" },
];

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (editorRef.current && value) {
      if (!editorRef.current.innerHTML || editorRef.current.innerHTML === "<br>") {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const handleCommand = useCallback(
    (cmd: string) => {
      if (!cmd) return;
      document.execCommand(cmd, false, undefined);
      editorRef.current?.focus();
      onChange?.(editorRef.current?.innerHTML || "");
    },
    [onChange]
  );

  const handleInput = () => {
    onChange?.(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: "#00C9A7" }}
        >
          <ImageIcon size={12} />
          Add image
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-2 py-1.5">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label={btn.label}
            onMouseDown={(e) => {
              e.preventDefault();
              handleCommand(btn.cmd);
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="min-h-[160px] p-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        suppressContentEditableWarning
        data-placeholder="Write your product description here..."
        onInput={handleInput}
      />
    </div>
  );
}
