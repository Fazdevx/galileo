(function () {
  'use strict';

  // ---- Config: la escribe WhatsappFloat.astro con los datos del sitio ----
  var nodo = document.getElementById('wa-datos');
  var CFG = { temas: [], envio: '' };
  if (nodo) {
    try {
      CFG = JSON.parse(nodo.textContent || '{}');
    } catch (e) {
      console.warn('[WA Chat] No se pudo leer la configuración', e);
    }
  }
  CFG.temas = Array.isArray(CFG.temas) ? CFG.temas : [];

  var AVATAR = 'GI';

  var BURBUJA_BOT =
    'max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-800 shadow-sm ring-1 ring-slate-200';
  var BURBUJA_USUARIO =
    'max-w-[85%] rounded-2xl rounded-br-sm bg-brand-500 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm';
  var CHIP =
    'rounded-full bg-navy-50 px-3 py-1.5 text-[11px] font-semibold text-navy-700 transition hover:bg-navy-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-300';
  var ACCION =
    'mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3.5 py-1.5 text-[12px] font-bold text-white transition hover:bg-brand-600';

  function start() {
    var toggle = document.getElementById('wa-toggle-btn');
    var cerrar = document.getElementById('wa-close-btn');
    var panel = document.getElementById('wa-chat-panel');
    var overlay = document.getElementById('wa-overlay');
    var lista = document.getElementById('wa-messages');
    var input = document.getElementById('wa-input');
    var enviar = document.getElementById('wa-send-btn');
    var badge = document.getElementById('wa-badge');

    if (!toggle || !panel || !lista || !input) {
      console.warn('[WA Chat] Elementos no encontrados');
      return;
    }

    var abierto = false;
    var contador = 0;
    var saludoHecho = false;
    var digitos = enviar ? enviar.getAttribute('data-digits') : '';

    /**
     * Baja al último mensaje solo si la persona ya estaba abajo. Si subió a
     * leer algo, cada respuesta nueva lo teletransportaba al final y no
     * encontraba lo que estaba leyendo.
     */
    function alFinal() {
      var distancia = lista.scrollHeight - lista.scrollTop - lista.clientHeight;
      if (distancia < 140) lista.scrollTop = lista.scrollHeight;
    }

    function actualizaBadge() {
      if (!badge) return;
      if (contador > 0) {
        badge.textContent = contador > 9 ? '9+' : String(contador);
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    function mensajeBot(html, delay) {
      setTimeout(function () {
        var d = document.createElement('div');
        d.className = 'flex items-end gap-2.5';
        d.innerHTML =
          '<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-800 text-[10px] font-bold text-white">' +
          AVATAR +
          '</span><div class="flex flex-col gap-2"><div class="' +
          BURBUJA_BOT +
          '">' +
          html +
          '</div></div>';
        lista.appendChild(d);
        alFinal();
        contador++;
        actualizaBadge();
      }, delay || 0);
    }

    function mensajeUsuario(texto) {
      var d = document.createElement('div');
      d.className = 'flex justify-end';
      d.innerHTML =
        '<div class="' +
        BURBUJA_USUARIO +
        '">' +
        texto
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n/g, '<br>') +
        '</div>';
      lista.appendChild(d);
      alFinal();
      contador++;
      actualizaBadge();
    }

    function chips() {
      if (!CFG.temas.length) return;
      var f = document.createDocumentFragment();
      var w = document.createElement('div');
      w.className = 'flex flex-wrap gap-2 pt-1';
      CFG.temas.forEach(function (t) {
        if (!t.chip) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = CHIP;
        b.setAttribute('data-wa-chip', t.pregunta || t.chip);
        b.textContent = t.chip;
        w.appendChild(b);
      });
      f.appendChild(w);
      lista.appendChild(f);
      alFinal();
    }

    function botonAccion(accion) {
      if (!accion || !accion.href) return;
      var d = document.createElement('div');
      d.className = 'flex items-end gap-2.5';
      d.innerHTML =
        '<span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-800 text-[10px] font-bold text-white">' +
        AVATAR +
        '</span><div><a class="' +
        ACCION +
        '" href="' +
        accion.href +
        '"' +
        (/^https?:/.test(accion.href) ? ' target="_blank" rel="noopener noreferrer"' : '') +
        '>' +
        accion.texto +
        ' <span aria-hidden="true">&rarr;</span></a></div>';
      lista.appendChild(d);
      alFinal();
    }

    function responder(tema, fallback) {
      mensajeBot(fallback ? CFG.fueraDeLista : tema.respuesta, 450);
      setTimeout(function () {
        if (tema && tema.accion) botonAccion(tema.accion);
        chips();
      }, 950);
    }

    /** Compara sin tildes ni mayúsculas: "Admisión" debe encontrar "admision". */
    function normalizar(texto) {
      return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    }

    /**
     * Gana el tema cuya palabra clave aparece antes en la frase. Con el
     * orden de la lista no bastaba: "cuanto es el pension de primaria" cae en
     * Niveles solo porque "primaria" esta antes en la lista, y lo que la
     * persona pregunta es por el precio.
     */
    function buscarTema(texto) {
      var n = normalizar(texto);
      var mejor = null;
      var mejorPos = Infinity;
      for (var i = 0; i < CFG.temas.length; i++) {
        var t = CFG.temas[i];
        var claves = Array.isArray(t.keywords) ? t.keywords : [];
        for (var j = 0; j < claves.length; j++) {
          var pos = n.indexOf(normalizar(claves[j]));
          if (pos !== -1 && pos < mejorPos) {
            mejorPos = pos;
            mejor = t;
          }
        }
      }
      return mejor;
    }

    /**
     * El botón verde es un enlace a WhatsApp: el texto que se escribió se
     * pega en el wa.me. Si está vacío se queda el saludo por defecto.
     */
    function actualizaEnvio() {
      if (!enviar) return;
      var texto = input.value.trim();
      if (!digitos || !texto) return;
      enviar.setAttribute(
        'href',
        'https://wa.me/' +
          digitos +
          '?text=' +
          encodeURIComponent((CFG.envio || '') + texto)
      );
    }

    function escribe(texto) {
      if (!texto) return;
      mensajeUsuario(texto);
      input.value = '';
      actualizaEnvio();
      var tema = buscarTema(texto);
      responder(tema, !tema);
    }

    function abre() {
      if (abierto) return;
      abierto = true;
      panel.classList.remove('hidden');
      if (overlay) overlay.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (!saludoHecho) {
        saludoHecho = true;
        mensajeBot(CFG.saludo || 'Hola, te puedo informar sobre el colegio.', 80);
        setTimeout(chips, 500);
      }
      try {
        input.focus();
      } catch (e) {
        /* en móvil el teclado puede abrir solo */
      }
    }

    function cierra() {
      if (!abierto) return;
      abierto = false;
      panel.classList.add('hidden');
      if (overlay) overlay.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      input.blur();
    }

    toggle.addEventListener('click', function () {
      abierto ? cierra() : abre();
    });
    if (cerrar) cerrar.addEventListener('click', cierra);
    if (overlay) overlay.addEventListener('click', cierra);

    input.addEventListener('input', actualizaEnvio);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        escribe(input.value.trim());
      }
    });

    // El envío real a WhatsApp no pasa por el panel: el <a> ya lleva el href
    // con la consulta, y target="_blank" lo abre en otra pestaña.
    lista.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-wa-chip]');
      if (chip) escribe(chip.getAttribute('data-wa-chip'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && abierto) cierra();
    });

    actualizaEnvio();
    actualizaBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
