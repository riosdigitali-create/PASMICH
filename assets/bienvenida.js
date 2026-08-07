/* ═══════════════════════════════════════════════════════════════
   POP-UP DE BIENVENIDA DEL BOLETÍN

   Reglas que se impuso esta pieza, para que no sea invasiva:

     · Aparece al entrar, con dos segundos de respiro para no caer
       encima de la portada antes de que cargue.
     · Una sola vez. Si lo cierra, se recuerda y no vuelve. Quien lo
       cierre y luego quiera suscribirse tiene el bloque rosa de la
       propia página, que no se movió de ahí.
     · Se cierra con Escape, con el fondo, con la ✕ y con «No, gracias».
     · Devuelve el foco a donde estaba. Mientras está abierto, el foco
       no se escapa de la caja.
     · Si la persona pidió reducir movimiento, entra sin animación.
     · No sale en el checkout ni en el carrito: ahí estorbaría.

   Está en modo demostración, igual que el resto del boletín: no hay
   proveedor de correo conectado y el texto lo dice.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CLAVE = 'mr_bienvenida_vista';
  var caja  = document.querySelector('[data-bienvenida]');
  if (!caja) return;

  /* Donde estorba, no aparece. */
  var ruta = window.location.pathname;
  if (/checkout|carrito|aviso-de-privacidad/.test(ruta)) return;

  try { if (localStorage.getItem(CLAVE)) return; } catch (e) { /* modo privado */ }

  var abierto = false;
  var teniaFoco = null;
  var temporizador = null;

  function recordar() {
    try { localStorage.setItem(CLAVE, '1'); } catch (e) { /* nada */ }
  }

  function focables() {
    return caja.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
  }

  function abrir() {
    if (abierto) return;
    abierto = true;
    teniaFoco = document.activeElement;
    caja.setAttribute('data-abierto', '');
    caja.removeAttribute('aria-hidden');
    var f = focables();
    if (f.length) f[0].focus();
    document.addEventListener('keydown', tecla);
  }

  function cerrar() {
    if (!abierto) return;
    abierto = false;
    caja.removeAttribute('data-abierto');
    caja.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', tecla);
    recordar();
    if (teniaFoco && teniaFoco.focus) teniaFoco.focus();
  }

  function tecla(e) {
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key !== 'Tab') return;
    /* El foco no se sale de la caja mientras está abierta. */
    var f = focables();
    if (!f.length) return;
    var primero = f[0], ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  }

  /* Cierres: la ✕, «No, gracias» y el fondo. */
  caja.querySelectorAll('[data-cerrar]').forEach(function (b) {
    b.addEventListener('click', cerrar);
  });
  caja.addEventListener('mousedown', function (e) {
    if (e.target === caja) cerrar();
  });

  /* El formulario, en modo demostración como el resto del boletín. */
  var form = caja.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var mail = form.querySelector('input[type="email"]');
      var msg  = caja.querySelector('.bienve__msg');
      if (!mail.checkValidity()) {
        msg.textContent = 'Revisa tu correo: parece que falta algo.';
        mail.focus();
        return;
      }
      msg.textContent = 'Gracias. Te escribiremos pronto. (Registro en modo demostración.)';
      recordar();
      setTimeout(cerrar, 2200);
    });
  }

  /* Cuándo aparece: al entrar, tras dos segundos. El respiro es para
     que la portada alcance a dibujarse; salir en el mismo instante de
     la carga se siente como un portazo. */
  function alEntrar() {
    temporizador = setTimeout(abrir, 2000);
  }
  if (document.readyState === 'complete') alEntrar();
  else window.addEventListener('load', alEntrar);
})();
