import { useRef } from 'react';
import './RichEditor.css';

export default function RichEditor({ value, onChange }) {
  const ref = useRef(null);

  const exec = (cmd, val) => {
    document.execCommand(cmd, false, val || null);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) exec('createLink', url);
  };

  return (
    <div className="editor-wrap">
      <div className="editor-toolbar">
        <button type="button" onClick={() => exec('bold')} title="Bold"><b>B</b></button>
        <button type="button" onClick={() => exec('italic')} title="Italic"><i>I</i></button>
        <button type="button" onClick={() => exec('underline')} title="Underline"><u>U</u></button>
        <span className="toolbar-sep" />
        <button type="button" onClick={() => exec('formatBlock', 'h2')} title="Heading 2">H2</button>
        <button type="button" onClick={() => exec('formatBlock', 'h3')} title="Heading 3">H3</button>
        <button type="button" onClick={() => exec('formatBlock', 'p')} title="Paragraph">P</button>
        <span className="toolbar-sep" />
        <button type="button" onClick={() => exec('insertUnorderedList')} title="Bullet List">&#8226;</button>
        <button type="button" onClick={() => exec('insertOrderedList')} title="Numbered List">1.</button>
        <button type="button" onClick={insertLink} title="Insert Link">&#128279;</button>
        <button type="button" onClick={() => exec('formatBlock', 'pre')} title="Code Block">&lt;/&gt;</button>
      </div>
      <div
        ref={ref}
        className="rich-editor"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value || '' }}
        onInput={() => onChange(ref.current.innerHTML)}
      />
    </div>
  );
}
