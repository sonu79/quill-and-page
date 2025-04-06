
import React from 'react';
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
  ImageIcon
} from 'lucide-react';

interface RichTextEditorProps {
  name: string;
  label: string;
  description?: string;
}

const RichTextEditor = ({ name, label, description }: RichTextEditorProps) => {
  const { register, setValue, watch } = useFormContext();
  const content = watch(name) || '';
  const editorRef = React.useRef<HTMLDivElement>(null);

  const handleFormat = (format: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    
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
        }, 0);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      
      <div className="border rounded-md bg-white">
        <div className="bg-muted/20 p-2 border-b flex flex-wrap gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFormat('bold')}
            type="button"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFormat('italic')}
            type="button"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFormat('h1')}
            type="button"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFormat('h2')}
            type="button"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFormat('p')}
            type="button"
            title="Paragraph"
          >
            <Pilcrow className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFormat('ul')}
            type="button"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFormat('ol')}
            type="button"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFormat('blockquote')}
            type="button"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleFormat('image')}
            type="button"
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
        
        <div ref={editorRef} className="p-2 min-h-[300px] relative">
          <textarea
            {...register(name)}
            id={name}
            className="w-full min-h-[300px] p-2 outline-none resize-y border-none bg-transparent"
          />
        </div>
      </div>
      
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      
      <div className="mt-2 p-3 border rounded bg-muted/10">
        <h4 className="font-medium mb-2">Preview</h4>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
