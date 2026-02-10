import * as dompurify from 'dompurify';

const DOMPurify = (dompurify as any).default || dompurify;

export const sanitizeInput = (input: string): string => {
  if (typeof window === 'undefined') return input;
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [] 
  }).trim();
};

export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
};
