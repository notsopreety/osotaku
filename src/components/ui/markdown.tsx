import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Pre-process content to handle AniList's special formatting
  const processedContent = preprocessAniListContent(content);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none',
        'prose-headings:font-semibold prose-headings:text-foreground',
        'prose-p:text-muted-foreground prose-p:leading-relaxed',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-em:text-muted-foreground',
        'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-foreground',
        'prose-pre:bg-muted prose-pre:border prose-pre:border-border',
        'prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground',
        'prose-ul:text-muted-foreground prose-ol:text-muted-foreground',
        'prose-li:marker:text-muted-foreground',
        'prose-hr:border-border',
        className
      )}
      components={{
        a: ({ href, children, ...props }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
            {...props}
          >
            {children}
          </a>
        ),
        img: ({ src, alt, ...props }) => (
          <img
            src={src}
            alt={alt || ''}
            loading="lazy"
            className="rounded-lg max-h-96 w-auto object-contain my-2"
            onError={(e) => {
              // Hide broken images
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            {...props}
          />
        ),
        // Handle horizontal rules from ~~~ syntax
        hr: ({ ...props }) => (
          <hr className="my-4 border-border/50" {...props} />
        ),
        // Better paragraph handling
        p: ({ children, ...props }) => (
          <p className="text-muted-foreground leading-relaxed mb-2" {...props}>
            {children}
          </p>
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}

/**
 * Pre-process AniList content to handle special formatting
 * AniList uses some non-standard markdown-like syntax
 */
function preprocessAniListContent(content: string): string {
  if (!content) return '';
  
  let processed = content;
  
  // Convert AniList's img() syntax to standard markdown images
  // img(URL) or img123(URL) -> ![](URL)
  processed = processed.replace(/img\d*\(([^)]+)\)/gi, '![]($1)');
  
  // Convert ~~~text~~~ to horizontal rule + text + horizontal rule (AniList spoiler/section syntax)
  // This creates a visual separator
  processed = processed.replace(/~~~([^~]+)~~~/g, '\n\n---\n\n$1\n\n---\n\n');
  
  // Handle standalone ~~~ as horizontal rules
  processed = processed.replace(/^~~~$/gm, '\n---\n');
  
  // Convert __text__ to **text** (bold) if not already handled
  processed = processed.replace(/__([^_]+)__/g, '**$1**');
  
  // Handle AniList's center alignment syntax ~!text!~
  processed = processed.replace(/~!([^!]+)!~/g, '*$1*');
  
  // Clean up multiple consecutive newlines (max 2)
  processed = processed.replace(/\n{3,}/g, '\n\n');
  
  // Ensure images on their own line render properly
  processed = processed.replace(/(\!\[\]\([^)]+\))/g, '\n$1\n');
  
  return processed.trim();
}
