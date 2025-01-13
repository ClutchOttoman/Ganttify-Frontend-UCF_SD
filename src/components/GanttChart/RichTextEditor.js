import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';

import './RichTextEditor.css';

// Created a custom extension that handles font size changes.
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
      fontSizes: ['12px', '14px', '16px', '18px', '20px', '24px', '32px'], // Font Sizes
    };
  },

  // Defines command to update attribute to resize font.
  addCommands() {
    return {
      setFontSize: (fontSize) => ({ commands }) => {
        return commands.updateAttributes('textStyle', {
          fontSize,
        });
      },
    };
  },

  // Changes font
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return {
            style: `font-size: ${attributes.fontSize} `,
          };
        },
      },
    };
  },
});

const RichTextEditor = ({ taskDescription, setTaskDescription, editMode }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TextStyle,
      FontSize,
    ],
    content: taskDescription,
    onUpdate: ({ editor }) => {
      setTaskDescription(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && taskDescription !== editor.getHTML()) {
      editor.commands.setContent(taskDescription || ''); // Sets to either task description if exists or blank.
    }

  }, [taskDescription, editor]);

  // Checks if button(s) are toggled:
  const isBoldActive = editor?.isActive('bold');
  const isItalicActive = editor?.isActive('italic');
  const isHighlightActive = editor?.isActive('highlight');
  const isFontSizeActive = editor?.isActive('fontSize');

  // Function to handle font size change
  const handleFontSizeChange = (size) => {
    console.log(`Changing font size to: ${size}`);
    editor.chain().focus().setFontSize(size).run();
  };

  return (
    <div className="task-details-body">
      <div id="description-title">Description</div>
      {editMode ? (
        <div id="editor-wrapper">
          {/* Toolbar */}
          <div id="editor-toolbar">

            {/* Bold Button */}
            <button
              className={`toolbar-btn ${isBoldActive ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              Bold
            </button>
            {/* Italics Button */}
            <button
              className={`toolbar-btn ${isItalicActive ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              Italic
            </button>
            {/* Highlight Button */}
            <button
              className={`toolbar-btn ${isHighlightActive ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              Highlight
            </button>
          </div>
          <EditorContent id="textbox" editor={editor} />
        </div>
      ) : (
        <div id="textbox" dangerouslySetInnerHTML={{ __html: taskDescription || 'Add a description here...' }} />
      )}
    </div>
  );
};

export default RichTextEditor;