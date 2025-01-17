import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'

import './RichTextEditor.css';

const RichTextEditor = ({ taskDescription, setTaskDescription}) => {
  const colorOptions = [
    '#e81416', '#ffa500', '#faeb36', '#79c314', '#487de7', '#4b369d', '#70369d',
    '#f47474', '#ffd580', '#fff77e','#b2e687', '#8fb9f9', '#9a86cc', '#b27fc6'
  ];
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState('rgba(255, 255, 0, 0)');
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        Blockquote: false,
        Codeblock: false,
        HardBreak: false,
        Horizontal: false,
        Code: false,

      }),
      Highlight.extend({
        addOptions() {
          return {
            multicolor: true,
            defaultColor: '#FFFF00', 
            HTMLAttributes: {},
          };
        },
      }),
      Underline, 
      TextStyle,
    ],
    content: taskDescription,
    onUpdate: ({ editor }) => {
      setTaskDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && taskDescription !== editor.getHTML()) {
      editor.commands.setContent(taskDescription || 'Add a description here...');
    }

  }, [taskDescription, editor]);

  useEffect(() => {
    if (editor) {
      editor.chain().focus().setHighlight({ color }).run();
    }
  }, [editor, color]);

  // Listens if mouse is clicked outside of color sidebar elements.
  useEffect(() => {
    const handleClickOutside = (event, element) => {
      const colorPicker = document.querySelector(element);
      if (colorPicker && !colorPicker.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', (event) => {
      handleClickOutside(event, '.highlight-picker-sidebar');
      handleClickOutside(event, '.form-control form-control-color-sidebar');
    });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handles color changes
  const handleColorChange = (newColor, src) => {
    console.log(newColor)
    setColor(newColor);
    editor.chain().focus().setHighlight({ color: newColor }).run();
    if (src == 1)
      setShowColorPicker(!showColorPicker)
  };

  // Clears textbox
  const handleFocus = () => {
    if (editor && editor.getText() === 'Add a description here...') {
      editor.commands.setContent(''); 
    }
  };

  // Readds flavour text if textbox is blank
  const handleBlur = () => {
    if (editor && editor.getText() === '') {
      editor.commands.setContent('Add a description here...'); 
    }
  };

  // Checks if button(s) are toggled:
  const isBoldActive = editor?.isActive('bold');
  const isItalicActive = editor?.isActive('italic');
  const isUnderlineActive = editor?.isActive('underline');
  const isBulletActive = editor?.isActive('bulletList');
  const isOrderedActive = editor?.isActive('orderedList');
  const isStrikeActive = editor?.isActive('strike');

  return (
    <div className="task-details-body">
      <div id="editor-wrapper">
        {/* Toolbar */}
        <div id="editor-toolbar">
          {/* Undo Button */}
          <button 
          className={`toolbar-btn `}
          onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <i className="fas fa-undo"></i>
          </button>
          {/* Redo Button */}
          <button 
          className={`toolbar-btn `}
          onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <i className="fas fa-redo"></i>
          </button>
          {/* Headings Button */}
          {/* Font Size Button */}

          {/* Bold Button */}
          <button
            className={`toolbar-btn ${isBoldActive ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <div>
            <strong>B</strong>
            </div>

          </button>

          {/* Italics Button */}
          <button
            className={`toolbar-btn ${isItalicActive ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </button>

          {/* Underline Button */}
          <button
            className={`toolbar-btn ${isUnderlineActive ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <u>U</u>
          </button>

          {/* Highlight Button */}
          <div>
          <button
            className={`toolbar-btn`}
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
          <i className="fas fa-eye-dropper"></i>
          </button>

          {/* Color Indicator */}
          <div 
            id="color-indicator-bar" 
            style={{
              backgroundColor: color === 'rgba(255, 255, 0, 0)' ? 'transparent' : color, 
              border: color === 'rgba(255, 255, 0, 0)' ? '2px solid #ccc' : 'none'
            }}
          />
          
        {showColorPicker && (
         <div id="highlight-picker-sidebar" className="highlight-picker-sidebar">
        <div
          className="no-highlight"
          onClick={() => handleColorChange('rgba(255, 255, 0, 0)', 1)}
        >
          None
        </div>
         {colorOptions.map((colorOption) => (
           <div key={colorOption} className="highlight-option-sidebar" style={{ backgroundColor: colorOption }} onClick={() => handleColorChange(colorOption, 1)} />
         ))}
         <div className="highlight-picker-wrapper">
         <i className="fas fa-eye-dropper"></i>
           <input type="color" className="form-control form-control-color-sidebar" id="myColor" value={color} title="Choose a color" onChange={(e) => handleColorChange(e.target.value, 2)} />
         </div>
       </div>
        )}
          </div>
          
          {/* Strikethrough Button */}
          <button
            className={`toolbar-btn ${isStrikeActive ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <s>A</s>
          </button>

          {/* BulletList Button */}
          <button
            className={`toolbar-btn ${isBulletActive ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
          <i className="fas fa-list-ul"></i> 
          </button>

          {/* OrderedList Button */}
          <button
            className={`toolbar-btn ${isOrderedActive ? 'active' : ''}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
          <i className="fas fa-list-ol"></i>
          </button>

          {/* Expand Button */}

        </div>
          
        <EditorContent id="textbox" 
        editor={editor}
        onFocus={handleFocus} 
        onBlur = {handleBlur} />
      </div>
    </div>
  );
};

export default RichTextEditor;