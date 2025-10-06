import React, { useState, useRef } from 'react';
import { Button } from './button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Type,
  Minus
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertText = (text: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const insertHTML = (html: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const fragment = range.createContextualFragment(html);
        range.insertNode(fragment);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        onChange(editorRef.current.innerHTML);
      } else {
        // If no selection, append to end
        editorRef.current.innerHTML += html;
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', tooltip: 'Bold' },
    { icon: Italic, command: 'italic', tooltip: 'Italic' },
    { icon: Underline, command: 'underline', tooltip: 'Underline' },
    { icon: List, command: 'insertUnorderedList', tooltip: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', tooltip: 'Numbered List' },
    { icon: AlignLeft, command: 'justifyLeft', tooltip: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', tooltip: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', tooltip: 'Align Right' },
  ];

  // Medical templates for quick insertion
  const medicalTemplates = [
    {
      name: 'Clinical Use',
      content: '<h4>CLINICAL USE:</h4><p>1) Diagnosis and monitoring of [condition]. 2) Assessment of [parameter].</p>'
    },
    {
      name: 'Increased In',
      content: '<h4>INCREASED IN:</h4><p>[List conditions where values are elevated]</p>'
    },
    {
      name: 'Decreased In',
      content: '<h4>DECREASED IN:</h4><p>[List conditions where values are decreased]</p>'
    },
    {
      name: 'Interference Factors',
      content: '<h4>INTERFERENCE FACTORS:</h4><p>Various drugs and conditions may affect results.</p>'
    },
    {
      name: 'Test Limitations',
      content: '<h4>TEST LIMITATIONS:</h4><p>Results should be interpreted in conjunction with clinical findings.</p>'
    },
    {
      name: 'Method',
      content: '<h3>Method: [Test Method]</h3>'
    }
  ];

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {/* Formatting Buttons */}
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => execCommand(button.command)}
            title={button.tooltip}
            className="p-1 h-8 w-8"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Heading Buttons */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'H3')}
          title="Heading 3"
          className="px-2 h-8 text-sm"
        >
          H3
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'H4')}
          title="Heading 4"
          className="px-2 h-8 text-sm"
        >
          H4
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'P')}
          title="Paragraph"
          className="px-2 h-8 text-sm"
        >
          P
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Insert Line Break */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertHTML('<br>')}
          title="Line Break"
          className="p-1 h-8 w-8"
        >
          <Minus className="h-4 w-4 rotate-90" />
        </Button>
      </div>

      {/* Medical Templates */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-blue-50">
        <span className="text-xs text-blue-600 font-medium mr-2">Quick Templates:</span>
        {medicalTemplates.map((template, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => insertHTML(template.content)}
            className="text-xs h-6 px-2 border-blue-200 text-blue-600 hover:bg-blue-100"
          >
            {template.name}
          </Button>
        ))}
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[200px] p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        style={{ wordWrap: 'break-word' }}
        dangerouslySetInnerHTML={{ __html: value }}
        placeholder={placeholder}
      />

      {/* Character Count */}
      <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200">
        {editorRef.current?.textContent?.length || 0} characters
      </div>
    </div>
  );
}