/* Galileo icon set - replaces Font Awesome.
   Usage: faIcon('gift', 20) or faIcon('gift', 20, 'animate-spin')
   Icons are 24x24 stroke-based unless listed in FILLED. */
(function () {
  'use strict';

  var FILLED = { whatsapp: true };

  var ICONS = {
    'shopping-bag':
      '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    'clipboard-check':
      '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    'graduation-cap': '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    brain:
      '<path d="M12 5a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5.83A3 3 0 0 0 12 18V5Z"/><path d="M12 5a3 3 0 0 1 3 3v1a3 3 0 0 1 2 5.83A3 3 0 0 1 12 18V5Z"/><path d="M9.5 9.5h1M13.5 13h1"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M20 12v9H4v-9"/><path d="M12 8H7.5a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8Z"/><path d="M12 8h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8Z"/>',
    money:
      '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
    star: '<path d="m12 3 2.6 5.9 6.4.7-4.8 4.3 1.4 6.3L12 17l-5.6 3.2 1.4-6.3L3 9.6l6.4-.7z"/>',
    graduation: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    'book-open':
      '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    notebook:
      '<path d="M4 4a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z"/><path d="M8 2v20"/><path d="M12 7h3M12 11h3"/>',
    times: '<path d="M18 6 6 18M6 6l12 12"/>',
    trophy:
      '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    'paper-plane': '<path d="M22 2 11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    question:
      '<path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/>',
    spinner: '<path d="M21 12a9 9 0 1 1-6.22-8.56"/>',
    dharmachakra:
      '<path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z"/><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18"/>',
    whatsapp:
      '<path d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.7 5.4 2.1 7.8L0 32l8.4-2.4c2.3 1.3 4.9 2 7.6 2 8.6 0 15.6-7 15.6-15.6S24.6.4 16 .4zm0 28.4c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-5 1.4 1.4-4.9-.3-.5C3.7 21 3 18.5 3 16 3 8.3 8.3 3 16 3s13 5.3 13 13-5.8 12.8-13 12.8zm7.2-9.7c-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.3 1.4-.2.3-.5.3-.9.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.2-1.3-3-.3-.8-.7-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.4s1.5 4 1.7 4.3c.2.3 2.9 4.5 7.1 6.3 1 .4 1.8.7 2.4.8 1 .3 1.9.3 2.6.2.8-.1 2.3-.9 2.7-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5z"/>',
  };

  var FALLBACK = 'gift';

  function faIcon(name, size, cls) {
    var key = ICONS[name] ? name : FALLBACK;
    var body = ICONS[key];
    var px = size || 20;
    var viewBox = FILLED[key] ? '0 0 32 32' : '0 0 24 24';
    var paint = FILLED[key]
      ? 'fill="currentColor"'
      : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' +
      viewBox +
      '" width="' +
      px +
      '" height="' +
      px +
      '" ' +
      paint +
      ' aria-hidden="true" focusable="false"' +
      (cls ? ' class="' + cls + '"' : '') +
      '>' +
      body +
      '</svg>'
    );
  }

  if (typeof window !== 'undefined') window.faIcon = faIcon;
  if (typeof globalThis !== 'undefined') globalThis.faIcon = faIcon;
})();
