import { useState, useRef, useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3, AlignLeft, AlignCenter, LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

const ToolbarButton = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
  <button
    type="button"
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    title={title}
    className={cn(
      "p-1.5 rounded hover:bg-muted transition-colors",
      active && "bg-muted text-primary"
    )}
  >
    {children}
  </button>
);

const RichTextEditor = ({ value, onChange, placeholder, className, minHeight = '150px' }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveFormats();
  }, []);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
    if (document.queryCommandState('insertOrderedList')) formats.add('ol');
    setActiveFormats(formats);
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  const insertLink = useCallback(() => {
    const url = prompt('URL du lien :');
    if (url) execCommand('createLink', url);
  }, [execCommand]);

  return (
    <div className={cn("border border-input rounded-md overflow-hidden bg-background", className)}>
      <div className="flex items-center gap-0.5 p-1.5 border-b border-input bg-muted/30 flex-wrap">
        <ToolbarButton active={activeFormats.has('bold')} onClick={() => execCommand('bold')} title="Gras">
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={activeFormats.has('italic')} onClick={() => execCommand('italic')} title="Italique">
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={activeFormats.has('underline')} onClick={() => execCommand('underline')} title="Souligné">
          <Underline className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onClick={() => execCommand('formatBlock', '<h2>')} title="Titre 2">
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('formatBlock', '<h3>')} title="Titre 3">
          <Heading3 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton active={activeFormats.has('ul')} onClick={() => execCommand('insertUnorderedList')} title="Liste à puces">
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={activeFormats.has('ol')} onClick={() => execCommand('insertOrderedList')} title="Liste numérotée">
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onClick={() => execCommand('justifyLeft')} title="Aligner à gauche">
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('justifyCenter')} title="Centrer">
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onClick={insertLink} title="Insérer un lien">
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="p-3 text-sm outline-none prose prose-sm max-w-none"
        style={{ minHeight }}
        onInput={handleInput}
        onSelect={updateActiveFormats}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
