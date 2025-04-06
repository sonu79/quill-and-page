
import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Pilcrow,
  ImageIcon,
  Link as LinkIcon,
  X
} from 'lucide-react';

interface RichTextEditorProps {
  name: string;
  label?: string;
  description?: string;
}

const RichTextEditor = ({ name, label, description }: RichTextEditorProps) => {
  const { register, setValue, watch } = useFormContext();
  const content = watch(name) || '';
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  
  // Handle selection changes to show/hide the toolbar
  useEffect(() => {
    const checkSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') {
        setShowToolbar(false);
        return;
      }

      // Don't show toolbar when selecting within the toolbar itself
      if (toolbarRef.current && toolbarRef.current.contains(selection.anchorNode as Node)) {
        return;
      }

      // Only show toolbar for selections within our editor
      if (editorRef.current && editorRef.current.contains(selection.anchorNode as Node)) {
        setShowToolbar(true);
        
        // Position the toolbar above the selection
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();
        
        // Calculate position relative to the editor
        const top = rect.top - editorRect.top - 50; // 50px above the selection
        const left = rect.left + (rect.width / 2) - editorRect.left - 100; // Center the toolbar
        
        setToolbarPosition({ top, left: Math.max(0, left) });
      }
    };
    
    document.addEventListener('selectionchange', checkSelection);
    document.addEventListener('mouseup', checkSelection);
    
    return () => {
      document.removeEventListener('selectionchange', checkSelection);
      document.removeEventListener('mouseup', checkSelection);
    };
  }, []);

  const handleFormat = (format: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    
    setSelectedFormat(format);
    
    // Save selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    let selectedText = range.toString();
    
    // Skip if nothing is selected and not inserting a block element
    if (!selectedText && !['h1', 'h2', 'p', 'blockquote', 'ul', 'ol'].includes(format)) return;
    
    // Apply formatting
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'h1':
        formattedText = `\n<h1>${selectedText || 'Heading 1'}</h1>\n`;
        break;
      case 'h2':
        formattedText = `\n<h2>${selectedText || 'Heading 2'}</h2>\n`;
        break;
      case 'p':
        formattedText = `\n<p>${selectedText || 'New paragraph'}</p>\n`;
        break;
      case 'blockquote':
        formattedText = `\n<blockquote>${selectedText || 'Quotation'}</blockquote>\n`;
        break;
      case 'ul':
        formattedText = `\n<ul>\n  <li>${selectedText || 'List item'}</li>\n</ul>\n`;
        break;
      case 'ol':
        formattedText = `\n<ol>\n  <li>${selectedText || 'List item'}</li>\n</ol>\n`;
        break;
      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          formattedText = `<a href="${url}" target="_blank">${selectedText || url}</a>`;
        }
        break;
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          formattedText = `\n<figure>\n  <img src="${imageUrl}" alt="Image" />\n  <figcaption>Image caption</figcaption>\n</figure>\n`;
        }
        break;
      default:
        formattedText = selectedText;
    }
    
    // Insert the formatted text
    if (formattedText) {
      const textarea = document.querySelector(`textarea[name="${name}"]`) as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = 
          content.substring(0, start) + 
          formattedText + 
          content.substring(end);
        
        setValue(name, newContent);
        
        // Set cursor position after the inserted text
        setTimeout(() => {
          textarea.focus();
          const newPosition = start + formattedText.length;
          textarea.setSelectionRange(newPosition, newPosition);
          
          // Hide toolbar after applying formatting
          setShowToolbar(false);
        }, 0);
      }
    }
  };

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      {label && <Label htmlFor={name} className="sr-only">{label}</Label>}
      
      <div className="border rounded-lg bg-white shadow-sm">
        {/* Floating formatting toolbar */}
        {showToolbar && (
          <div 
            ref={toolbarRef}
            className="absolute z-10 bg-white rounded-md shadow-lg border border-gray-200 flex items-center p-1 transition-all duration-200 ease-in-out"
            style={{ 
              top: `${toolbarPosition.top}px`, 
              left: `${toolbarPosition.left}px`,
            }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleFormat('bold')}
              className={selectedFormat === 'bold' ? 'bg-gray-100' : ''}
              type="button"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleFormat('italic')}
              className={selectedFormat === 'italic' ? 'bg-gray-100' : ''}
              type="button"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleFormat('h1')}
              className={selectedFormat === 'h1' ? 'bg-gray-100' : ''}
              type="button"
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleFormat('h2')}
              className={selectedFormat === 'h2' ? 'bg-gray-100' : ''}
              type="button"
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleFormat('link')}
              className={selectedFormat === 'link' ? 'bg-gray-100' : ''}
              type="button"
              title="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowToolbar(false)}
              type="button"
              title="Close"
              className="ml-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Plus button toolbar that appears when typing new lines */}
        <div className="py-6 px-6 relative">
          {/* Title field styled like Medium */}
          <textarea 
            placeholder="Title"
            className="w-full text-4xl font-serif leading-tight mb-4 p-0 border-none bg-transparent outline-none resize-none placeholder:text-gray-300 placeholder:opacity-80 font-bold"
            style={{ height: '60px' }}
            {...register('title')}
          ></textarea>

          {/* Subtitle field styled like Medium */}
          <textarea 
            placeholder="Subtitle"
            className="w-full text-xl font-serif leading-tight mb-8 p-0 border-none bg-transparent outline-none resize-none placeholder:text-gray-300 placeholder:opacity-80 text-gray-500"
            style={{ height: '40px' }}
            {...register('subtitle')}
          ></textarea>

          {/* Main article content */}
          <div ref={editorRef} className="relative min-h-[400px]">
            <textarea
              {...register(name)}
              id={name}
              placeholder="Tell your story..."
              className="w-full min-h-[400px] p-0 outline-none resize-none border-none bg-transparent font-serif text-lg leading-relaxed"
            />
          </div>
        </div>
      </div>
      
      {/* Side formatting toolbar */}
      <div className="fixed left-4 top-1/3 bg-white rounded-full shadow-lg border border-gray-200 p-1 flex flex-col gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('p')}
          type="button"
          title="Paragraph"
        >
          <Pilcrow className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('image')}
          type="button"
          title="Add Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('blockquote')}
          type="button"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('ul')}
          type="button"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleFormat('ol')}
          type="button"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      {/* Preview section */}
      <div className="mt-8 p-5 border rounded-lg bg-gray-50">
        <h4 className="font-medium mb-3 text-gray-700 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> Preview
        </h4>
        <div 
          className="prose max-w-none font-serif"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
