'use client';

// The WYSIWYG control behind schema type 'richtext' — TipTap with a
// deliberately small surface: paragraphs, bold, italic, links, and the two
// list kinds. Anything richer than that has no rendering on the public site,
// so the toolbar does not offer it.
//
// Value contract: HTML when formatted. Plain seeded text (paragraphs split by
// blank lines) is converted to <p> blocks on first load, so legacy content
// opens correctly and only becomes HTML once actually edited. The site's
// <Prose> renderer accepts both shapes.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Plain text with \n\n paragraph breaks → minimal HTML for the editor.
const toEditorHtml = (value) => {
  const text = String(value || '');
  if (!text.trim()) return '';
  if (/<\s*[a-z][^>]*>/i.test(text)) return text; // already HTML
  return text
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block.trim()).replace(/\n/g, '<br>')}</p>`)
    .join('');
};

// The site's icon set has no bold/italic/list glyphs, and borrowing wrong
// icons reads worse than words — so the toolbar is typographic: B, I, Link,
// the two list kinds. Same convention as classic word processors.
const BUTTON_BASE =
  'grid h-8 min-w-8 place-items-center rounded-lg px-1.5 text-[13px] transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none disabled:opacity-35';

function ToolButton({ label, children, active, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      disabled={disabled}
      // Mousedown-preventDefault keeps the selection in the editor alive.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={
        BUTTON_BASE +
        (active
          ? ' bg-navy-900 text-cream-100'
          : ' text-ink-600 hover:bg-cream-200 hover:text-navy-900')
      }
    >
      {children}
    </button>
  );
}

export default function RichTextField({ field, value, onChange, onBlur, error, inputId }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const linkInputRef = useRef(null);

  // onChange identity can change per render (SchemaForm closures); keep the
  // freshest one without re-creating the editor.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          HTMLAttributes: { rel: 'noopener' }
        }
      })
    ],
    content: toEditorHtml(value),
    immediatelyRender: false,
    // v3 stops re-rendering per transaction by default; the toolbar's active
    // states need it, and these documents are small enough not to care.
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        id: inputId,
        class:
          'rich-text-content min-h-40 px-4 py-3 text-base sm:text-[15px] leading-relaxed text-ink-900 focus:outline-none'
      }
    },
    onUpdate: ({ editor: instance }) => {
      onChangeRef.current(instance.isEmpty ? '' : instance.getHTML());
    },
    onBlur: () => onBlur?.()
  });

  // External resets (discard draft, revision restore) push the stored value
  // back into the editor; self-typed updates are already in the document.
  const lastValueRef = useRef(value);
  useEffect(() => {
    if (!editor || value === lastValueRef.current) return;
    lastValueRef.current = value;
    const incoming = toEditorHtml(value);
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [editor, value]);
  useEffect(() => {
    lastValueRef.current = value;
  });

  const openLink = useCallback(() => {
    if (!editor) return;
    setLinkValue(editor.getAttributes('link').href || '');
    setLinkOpen(true);
  }, [editor]);

  const applyLink = () => {
    const href = linkValue.trim();
    if (href) {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setLinkOpen(false);
  };

  useEffect(() => {
    if (linkOpen) linkInputRef.current?.focus();
  }, [linkOpen]);

  if (!editor) {
    // TipTap renders client-side only; hold the layout until it mounts.
    return (
      <div className="min-h-[13.5rem] rounded-xl border border-cream-300 bg-white shadow-xs" />
    );
  }

  return (
    <div
      className={
        'overflow-hidden rounded-xl border bg-white shadow-xs transition-colors focus-within:border-orange-500 ' +
        (error ? 'border-error-500' : 'border-cream-300')
      }
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-cream-200 bg-cream-50 px-1.5 py-1">
        <ToolButton
          label="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <span className="font-black">B</span>
        </ToolButton>
        <ToolButton
          label="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <span className="font-display italic">I</span>
        </ToolButton>
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-cream-300" />
        <ToolButton
          label={editor.isActive('link') ? 'Edit link' : 'Add link'}
          active={editor.isActive('link') || linkOpen}
          disabled={editor.state.selection.empty && !editor.isActive('link')}
          onClick={openLink}
        >
          <span className="underline underline-offset-2">Link</span>
        </ToolButton>
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-cream-300" />
        <ToolButton
          label="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <span aria-hidden="true">•&nbsp;List</span>
        </ToolButton>
        <ToolButton
          label="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <span aria-hidden="true">1.&nbsp;List</span>
        </ToolButton>
        <span className="flex-1" />
        <span className="hidden pr-2 font-mono text-[10px] text-ink-500 sm:block">
          Enter starts a new paragraph
        </span>
      </div>

      {linkOpen && (
        <div className="flex items-center gap-2 border-b border-cream-200 bg-cream-50 px-3 py-2">
          <input
            ref={linkInputRef}
            type="text"
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                applyLink();
              }
              if (event.key === 'Escape') setLinkOpen(false);
            }}
            placeholder="https://… or /a-page-on-this-site"
            className="min-w-0 flex-1 rounded-lg border border-cream-300 bg-white px-3 py-1.5 text-base sm:text-sm focus:border-orange-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={applyLink}
            className="rounded-full bg-navy-900 px-3 py-1.5 text-xs font-bold text-cream-50 hover:bg-navy-800"
          >
            {linkValue.trim() ? 'Set link' : 'Remove link'}
          </button>
          <button
            type="button"
            onClick={() => setLinkOpen(false)}
            className="rounded-full px-2 py-1.5 text-xs font-bold text-ink-600 hover:text-navy-900"
          >
            Cancel
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
