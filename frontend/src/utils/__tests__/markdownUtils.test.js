import { markdownToHtml, createMarkup } from '$/utils/markdownUtils';

describe('markdownToHtml', () => {
  it('converts markdown to HTML', () => {
    expect(markdownToHtml('**bold**')).toContain('<strong>bold</strong>');
  });

  it('starts headers at h3', () => {
    expect(markdownToHtml('# Title')).toContain('<h3');
  });

  it('handles empty input', () => {
    expect(markdownToHtml('')).toBe('');
    expect(markdownToHtml(undefined)).toBe('');
  });
});

describe('createMarkup', () => {
  it('keeps the markup a reading is allowed to contain', () => {
    const { __html } = createMarkup(
      '<h3>The Fool</h3><p>A <strong>new</strong> beginning.</p><ul><li>one</li></ul>',
    );

    expect(__html).toContain('<strong>new</strong>');
    expect(__html).toContain('<li>one</li>');
    expect(__html).toContain('<h3>The Fool</h3>');
  });

  it('strips script tags', () => {
    const { __html } = createMarkup('<p>hi</p><script>alert(1)</script>');

    expect(__html).toContain('<p>hi</p>');
    expect(__html).not.toContain('script');
  });

  it('strips event handler attributes', () => {
    const { __html } = createMarkup('<img src="x" onerror="alert(1)">');

    expect(__html).not.toContain('onerror');
  });

  it('strips javascript: URLs', () => {
    const { __html } = createMarkup('<a href="javascript:alert(1)">click</a>');

    expect(__html).not.toContain('javascript:');
    expect(__html).toContain('click');
  });

  it('strips embedded frames', () => {
    const { __html } = createMarkup(
      '<iframe src="https://evil.test"></iframe>',
    );

    expect(__html).not.toContain('iframe');
  });

  // Regression guard. A hand-written ALLOWED_TAGS/ALLOWED_ATTR pair used to sit
  // here and silently ate the checkbox and the class the styles hang off, while
  // adding nothing the defaults don't already cover.
  it('leaves Showdown output intact', () => {
    const { __html } = createMarkup(markdownToHtml('- [x] done\n- [ ] todo'));

    expect(__html).toContain('type="checkbox"');
    expect(__html).toContain('class="task-list-item"');
  });

  it('keeps link and image attributes', () => {
    const { __html } = createMarkup(
      '<a href="https://example.test" title="t">x</a><img src="/a.png" alt="a">',
    );

    expect(__html).toContain('href="https://example.test"');
    expect(__html).toContain('alt="a"');
  });

  it('handles empty input', () => {
    expect(createMarkup('')).toEqual({ __html: '' });
    expect(createMarkup(undefined)).toEqual({ __html: '' });
  });
});
