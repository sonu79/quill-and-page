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
  X,
  Code,
  CodepenIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RichTextEditorProps {
  name: string;
  label?: string;
  description?: string;
}

const RichTextEditor = ({ name, label, description }: RichTextEditorProps) => {
  const { register, setValue, watch } = useFormContext();
  const content = watch(name) || '';
  const titleValue = watch('title') || '';
  const subtitleValue = watch('subtitle') || '';
  
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  
  useEffect(() => {
    const checkSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') {
        setShowToolbar(false);
        return;
      }

      if (toolbarRef.current && toolbarRef.current.contains(selection.anchorNode as Node)) {
        return;
      }

      if (editorRef.current && editorRef.current.contains(selection.anchorNode as Node)) {
        setShowToolbar(true);
        
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.current.getBoundingClientRect();
        
        const top = rect.top - editorRect.top - 50;
        const left = rect.left + (rect.width / 2) - editorRect.left - 100;
        
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
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    let selectedText = range.toString();
    
    if (!selectedText && !['h1', 'h2', 'p', 'blockquote', 'ul', 'ol', 'code'].includes(format)) return;
    
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
      case 'code':
        formattedText = `\n<pre><code>${selectedText || 'Enter code here'}</code></pre>\n`;
        break;
      case 'embed':
        const embedUrl = prompt('Enter embed URL (YouTube, Twitter, etc):');
        if (embedUrl) {
          formattedText = `\n<div class="embed-container">\n  <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>\n</div>\n`;
        }
        break;
      default:
        formattedText = selectedText;
    }
    
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
        
        setTimeout(() => {
          textarea.focus();
          const newPosition = start + formattedText.length;
          textarea.setSelectionRange(newPosition, newPosition);
          
          setShowToolbar(false);
        }, 0);
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4 w-full max-w-4xl mx-auto">
        {label && <Label htmlFor={name} className="sr-only">{label}</Label>}
        
        <div className="border rounded-lg bg-white shadow-sm">
          {showToolbar && (
            <div 
              ref={toolbarRef}
              className="absolute z-10 bg-[#242424] rounded-md shadow-lg border border-gray-700 flex items-center p-1 transition-all duration-200 ease-in-out"
              style={{ 
                top: `${toolbarPosition.top}px`, 
                left: `${toolbarPosition.left}px`,
              }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFormat('bold')}
                className={`text-white hover:bg-gray-700 ${selectedFormat === 'bold' ? 'bg-gray-700' : ''}`}
                type="button"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFormat('italic')}
                className={`text-white hover:bg-gray-700 ${selectedFormat === 'italic' ? 'bg-gray-700' : ''}`}
                type="button"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFormat('link')}
                className={`text-white hover:bg-gray-700 ${selectedFormat === 'link' ? 'bg-gray-700' : ''}`}
                type="button"
                title="Add Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              
              <Separator orientation="vertical" className="mx-1 h-6 bg-gray-600" />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:bg-gray-700"
                    type="button"
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleFormat('h1')}>
                    Heading 1
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFormat('h2')}>
                    Heading 2
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleFormat('blockquote')}
                className={`text-white hover:bg-gray-700 ${selectedFormat === 'blockquote' ? 'bg-gray-700' : ''}`}
                type="button"
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:bg-gray-700"
                    type="button"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleFormat('ul')}>
                    Bullet List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFormat('ol')}>
                    Numbered List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowToolbar(false)}
                type="button"
                title="Close"
                className="ml-1 text-white hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="py-6 px-6 relative">
            <textarea 
              placeholder="Title"
              className="w-full text-4xl font-serif leading-tight mb-4 p-0 border-none bg-transparent outline-none resize-none placeholder:text-gray-300 placeholder:opacity-80 font-bold"
              style={{ height: '60px' }}
              {...register('title')}
            ></textarea>

            <textarea 
              placeholder="Subtitle"
              className="w-full text-xl font-serif leading-tight mb-8 p-0 border-none bg-transparent outline-none resize-none placeholder:text-gray-300 placeholder:opacity-80 text-gray-500"
              style={{ height: '40px' }}
              {...register('subtitle')}
            ></textarea>

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
        
        <div className="fixed left-4 top-1/3 bg-white rounded-full shadow-lg border border-gray-200 p-1 flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleFormat('p')}
                type="button"
              >
                <Pilcrow className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Add paragraph
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleFormat('image')}
                type="button"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Add image
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleFormat('blockquote')}
                type="button"
              >
                <Quote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Add quote
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleFormat('ul')}
                type="button"
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Add bullet list
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleFormat('ol')}
                type="button"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Add numbered list
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleFormat('code')}
                type="button"
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Add code block
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleFormat('embed')}
                type="button"
              >
                <CodepenIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Add embed (videos, tweets, etc)
            </TooltipContent>
          </Tooltip>
        </div>
        
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
        
        <div className="mt-8 p-5 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-3 text-gray-700 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> Preview
          </h4>
          <div className="prose max-w-none font-serif">
            {titleValue && <h1 className="text-4xl mb-2">{titleValue}</h1>}
            {subtitleValue && <p className="text-xl text-gray-500 mb-6">{subtitleValue}</p>}
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RichTextEditor;
