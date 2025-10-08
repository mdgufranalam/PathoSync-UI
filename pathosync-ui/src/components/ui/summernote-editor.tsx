import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Link,
    Image,
    Table,
    Quote,
    Undo,
    Redo,
    Type
} from 'lucide-react';

interface SummernoteEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SummernoteEditor({ value, onChange, placeholder = "Start typing...", className = "" }: SummernoteEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            onChange(content);
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    const insertHtml = (html: string) => {
        if (editorRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const div = document.createElement('div');
                div.innerHTML = html;
                const fragment = document.createDocumentFragment();
                while (div.firstChild) {
                    fragment.appendChild(div.firstChild);
                }
                range.insertNode(fragment);
                range.collapse();
            }
            handleInput();
        }
    };

    const insertLink = () => {
        if (linkUrl && linkText) {
            insertHtml(`<a href="${linkUrl}" target="_blank">${linkText}</a>`);
            setLinkUrl('');
            setLinkText('');
            setIsLinkModalOpen(false);
        }
    };

    const insertTable = () => {
        const tableHtml = `
      <table style="border-collapse: collapse; width: 100%; margin: 10px 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">Header 1</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">Header 2</th>
            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 1</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 2</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 3</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 4</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 5</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Cell 6</td>
          </tr>
        </tbody>
      </table>
    `;
        insertHtml(tableHtml);
    };

    const formatOptions = [
        { value: 'p', label: 'Paragraph' },
        { value: 'h1', label: 'Heading 1' },
        { value: 'h2', label: 'Heading 2' },
        { value: 'h3', label: 'Heading 3' },
        { value: 'h4', label: 'Heading 4' },
        { value: 'pre', label: 'Pre-formatted' }
    ];

    const formatBlock = (tag: string) => {
        execCommand('formatBlock', `<${tag}>`);
    };

    return (
        <div className={`border rounded-lg ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
                {/* Format Dropdown */}
                <Select onValueChange={formatBlock}>
                    <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                        {formatOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Text Formatting */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('bold')}
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('italic')}
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('underline')}
                >
                    <Underline className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Alignment */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('justifyLeft')}
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('justifyCenter')}
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('justifyRight')}
                >
                    <AlignRight className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('insertUnorderedList')}
                >
                    <List className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('insertOrderedList')}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Quote */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('formatBlock', '<blockquote>')}
                >
                    <Quote className="h-4 w-4" />
                </Button>

                {/* Link */}
                <Popover open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                        >
                            <Link className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium">Link Text</label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Enter link text"
                                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">URL</label>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsLinkModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={insertLink}
                                >
                                    Insert Link
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Table */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={insertTable}
                >
                    <Table className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Undo/Redo */}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('undo')}
                >
                    <Undo className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => execCommand('redo')}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <div
                ref={editorRef}
                contentEditable
                className="min-h-[200px] p-4 focus:outline-none"
                onInput={handleInput}
                dangerouslySetInnerHTML={{ __html: value }}
                style={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
                data-placeholder={placeholder}
            />

            <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
        </div>
    );
}