/* Accessible dialog helpers: focus trap, focus restore, Escape to close.
   Loaded with <script src="/js/a11y-modal.js" is:inline> in <head>, before any
   component script, so `window.createDialog` is always defined by the time a
   component runs.

   Usage:
     const dlg = createDialog({
       root,                 // container, must have role="dialog" aria-modal="true"
       close,                // optional custom close (for exit animations)
       initialFocus,         // optional CSS selector or element
     });
     dlg.open();
     dlg.close();            // runs the custom close when provided
     dlg.destroy();          // unhook without closing
*/
(function () {
  'use strict';

  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  /** Nested dialogs must not steal the scroll lock from each other. */
  var openCount = 0;
  var savedOverflow = null;

  function lockScroll() {
    if (openCount === 0) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    openCount++;
  }

  function unlockScroll() {
    openCount = Math.max(0, openCount - 1);
    if (openCount === 0) {
      document.body.style.overflow = savedOverflow || '';
      savedOverflow = null;
    }
  }

  function focusables(root) {
    return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function (el) {
      // Skip anything hidden by a class, [hidden] or an ancestor.
      if (el.closest('[inert]')) return false;
      if (el.hidden) return false;
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  function resolveInitialFocus(root, initialFocus) {
    if (!initialFocus) return focusables(root)[0] || null;
    if (typeof initialFocus === 'string') return root.querySelector(initialFocus) || focusables(root)[0] || null;
    return initialFocus;
  }

  /**
   * Wires a container into dialog behaviour.
   * Expects the container to already carry role="dialog" aria-modal="true".
   */
  function createDialog(opts) {
    var root = opts && opts.root;
    if (!root) {
      return { open: function () {}, close: function () {}, destroy: function () {} };
    }

    var lastFocused = null;
    var listening = false;

    function onKeydown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      var items = focusables(root);
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function open() {
      lastFocused = document.activeElement;
      if (!opts.close) {
        root.classList.remove('hidden');
        root.classList.add('flex');
      }
      lockScroll();
      if (!listening) {
        document.addEventListener('keydown', onKeydown, true);
        listening = true;
      }
      var target = resolveInitialFocus(root, opts.initialFocus);
      if (target) target.focus();
    }

    function close() {
      if (opts.close) {
        opts.close();
      } else {
        root.classList.add('hidden');
        root.classList.remove('flex');
      }
      destroy();
    }

    /** Unhooks the listener and restores scroll/focus, but leaves visibility alone. */
    function destroy() {
      if (listening) {
        document.removeEventListener('keydown', onKeydown, true);
        listening = false;
      }
      unlockScroll();
      if (lastFocused && typeof lastFocused.focus === 'function' && document.contains(lastFocused)) {
        lastFocused.focus();
      }
      lastFocused = null;
    }

    return { open: open, close: close, destroy: destroy };
  }

  if (typeof window !== 'undefined') window.createDialog = createDialog;
})();
