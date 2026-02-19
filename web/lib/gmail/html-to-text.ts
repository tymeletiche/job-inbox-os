import { convert } from 'html-to-text';

/**
 * Convert Gmail HTML body to plain text for the classifier.
 * Strips images, styles, scripts. Preserves link text but drops URLs.
 */
export function gmailHtmlToText(html: string): string {
  return convert(html, {
    wordwrap: false,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'style', format: 'skip' },
      { selector: 'script', format: 'skip' },
    ],
  });
}
