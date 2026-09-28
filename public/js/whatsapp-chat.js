/**
 * Asistente de WhatsApp del Colegio y Academia Galileo.
 *
 * Los temas y las respuestas NO están aquí: vienen en un <script
 * type="application/json" id="wa-datos"> que genera src/components/
 * WhatsappFloat.astro con los datos reales del sitio. Si este bot se inventa
 * algo, es porque alguien lo escribió en ese componente, no en este fichero.
 *
 * Dos reglas que este fichero respeta siempre:
 *
 *   1. No finge ser una persona. La cabecera dice "asistente" y el panel
 *      lleva un aviso visible de que es automático. Antes decía "En línea",
 *      que era mentira: detrás no hay nadie.
 *   2. Si la pregunta no está en la lista, no la inventa. Pasa el turno al
 *      equipo por WhatsApp, que es lo único honesto que puede hacer.
 */
(function () {
  'use strict';

  function alListo(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  alListo(function () {
    var btn = document.getElementById('wa-toggle-btn');
    var cerrar = document.getElementById('wa-close-btn');
    var panel = document.getElementById('wa-chat-panel');
    var overlay = document.getElementById('wa-overlay');
    var caja = document.getElementById('wa-messages');
    var input = document.getElementById('wa-input');
    var enviar = document.getElementById('wa-send-btn');
    var badge = document.getElementById('wa-badge');
    var datosEl = document.getElementById('wa-datos');

    if (!btn || !panel || !caja || !input || !datosEl) {
      console.warn('[WA] Faltan elementos del asistente.');
      return;
    }

    var datos;
    try {
      // El JSON lleva HTML con comillas dobles: hay que proteger el < para
      // que no lo interprete el navegador al escribirlo en el documento.
      datos = JSON.parse(datosEl.textContent || '{}');
    } catch (e) {
      console.warn('[WA] No se pudo leer la configuración.', e);
      return;
    }

    var abierto = false;
    var arrancado = false;
    var sinLeer = 0;
    var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function esc(texto) {
      return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function alFinal() {
      caja.scrollTop = caja.scrollHeight;
    }

    function marcaSinLeer() {
      if (!badge) return;
      if (sinLeer > 0) {
        badge.textContent = sinLeer > 9 ? '9+' : String(sinLeer);
        badge.classList.remove('hidden');
        badge.classList.add('flex');
      } else {
        badge.classList.add('hidden');
        badge.classList.remove('flex');
      }
    }

    function actualizarFoco() {
      btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      btn.setAttribute(
        'aria-label',
        abierto ? 'Cerrar asistente de información' : 'Abrir asistente de información del colegio'
      );
    }

    /** Burbuja del asistente: a la izquierda, con el avatar del colegio. */
    function burbujaBot(html) {
      var fila = document.createElement('div');
      fila.className = 'flex items-end gap-2';
      fila.innerHTML =
        '<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-800 text-[9px] font-bold text-white">GI</div>' +
        '<div class="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm ring-1 ring-slate-200">' +
        html +
        '</div>';
      caja.appendChild(fila);
      alFinal();
    }

    /** Burbuja de la persona: a la derecha, en verde, como en WhatsApp. */
    function burbujaTuyo(texto) {
      var fila = document.createElement('div');
      fila.className = 'flex justify-end';
      fila.innerHTML =
        '<div class="max-w-[85%] rounded-2xl rounded-br-md bg-[#25D366] px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm">' +
        esc(texto).replace(/\n/g, '<br>') +
        '</div>';
      caja.appendChild(fila);
      alFinal();
    }

    /** Chips de temas. Se vuelven a dibujar en cada respuesta. */
    function dibujarChips() {
      var quitar = caja.querySelector('[data-wa-chips]');
      if (quitar) quitar.remove();

      var cont = document.createElement('div');
      cont.setAttribute('data-wa-chips', '');
      cont.className = 'flex flex-wrap gap-2 pt-1';

      (datos.temas || []).forEach(function (tema) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className =
          'rounded-full border border-navy-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300';
        b.textContent = tema.chip;
        b.addEventListener('click', function () {
          responder(tema);
        });
        cont.appendChild(b);
      });

      caja.appendChild(cont);
      alFinal();
    }

    function pintarAccion(accion) {
      if (!accion) return;
      var a = document.createElement('a');
      a.href = accion.href;
      a.className =
        'mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300';
      a.textContent = accion.texto;
      var fila = document.createElement('div');
      fila.className = 'flex items-end gap-2';
      fila.innerHTML =
        '<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-800 text-[9px] font-bold text-white">GI</div>';
      fila.appendChild(a);
      caja.appendChild(fila);
      alFinal();
    }

    function responder(tema) {
      burbujaTuyo(tema.pregunta);
      setTimeout(
        function () {
          burbujaBot(tema.respuesta);
          if (tema.accion) pintarAccion(tema.accion);
          dibujarChips();
        },
        reducido ? 0 : 500
      );
    }

    function arrancar() {
      if (arrancado) return;
      arrancado = true;
      burbujaBot(datos.saludo);
      dibujarChips();
    }

    function abrir() {
      if (abierto) return;
      abierto = true;
      panel.classList.remove('hidden');
      if (overlay) overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      sinLeer = 0;
      marcaSinLeer();
      actualizarFoco();
      arrancar();
      if (!reducido) {
        setTimeout(function () {
          input.focus();
        }, 250);
      }
    }

    function cerra() {
      if (!abierto) return;
      abierto = false;
      panel.classList.add('hidden');
      if (overlay) overlay.classList.add('hidden');
      document.body.style.overflow = '';
      actualizarFoco();
      btn.focus();
    }

    btn.addEventListener('click', function () {
      abierto ? cerra() : abrir();
    });
    if (cerrar) cerrar.addEventListener('click', cerra);
    if (overlay) overlay.addEventListener('click', cerra);

    // Escribir no finge una conversación: arma el enlace de WhatsApp real.
    if (input && enviar) {
      var actualizar = function () {
        if (input.value.trim()) {
          enviar.href =
            'https://wa.me/' +
            (enviar.dataset.digits || '') +
            '?text=' +
            encodeURIComponent((datos.envio || '') + ' ' + input.value.trim());
        }
      };
      input.addEventListener('input', actualizar);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && input.value.trim()) {
          e.preventDefault();
          enviar.click();
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && abierto) cerra();
    });

    actualizarFoco();
    marcaSinLeer();
  });
})();
