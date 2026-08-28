/* ==========================================================================
   redes.js — enlaces oficiales y motor de contenido incrustado
   --------------------------------------------------------------------------
   FUENTE ÚNICA DE VERDAD. Todos los enlaces salen de redes_pastora_michelle.html.
   Si cambia una cuenta, se cambia AQUÍ y en ningún otro lado.

   Regla de la casa: nada de contenido inventado. Si una plataforma no deja
   leer publicaciones sin token (Instagram, TikTok, Facebook), no se simula un
   feed: se muestra una pieza editorial con el enlace real, y queda el hueco
   preparado para conectar la API el día que exista.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     1 · ENLACES OFICIALES
     --------------------------------------------------------------------- */
  const officialLinks = {
    michelle: {
      instagram: 'https://www.instagram.com/mrsmichelleruiz',
      instagramHandle: '@mrsmichelleruiz',
      tiktok: 'https://www.tiktok.com/@mrsmichelleruiz',
      tiktokHandle: '@mrsmichelleruiz',
      facebook: 'https://www.facebook.com/bymichelleruiz',
      facebookHandle: 'bymichelleruiz'
    },
    laBibliaYNosotras: {
      instagram: 'https://www.instagram.com/labibliaynosotras',
      instagramHandle: '@labibliaynosotras'
    },
    rio: {
      mexico: 'https://www.instagram.com/riomxoficial/',
      mexicoHandle: '@riomxoficial',
      sanDiego: 'https://www.instagram.com/riosandiego.usa',
      sanDiegoHandle: '@riosandiego.usa'
    },
    podcast: {
      youtube: 'https://www.youtube.com/@PodcastconEfr%C3%A9nyMichelleruiz',
      // ID real del canal, leído del propio canal de YouTube.
      youtubeChannelId: 'UC9RZw72NwfKn6MyZEc4ccEg',
      // La lista de subidas se deriva del canal: UC… → UU…
      // Así el reproductor siempre muestra los episodios REALES más recientes,
      // sin API, sin token y sin que nadie tenga que actualizar nada a mano.
      youtubeUploads: 'UU9RZw72NwfKn6MyZEc4ccEg',
      spotify: 'https://open.spotify.com/show/70hlwnOcW5YdF2736PB0zb',
      spotifyShowId: '70hlwnOcW5YdF2736PB0zb'
    },
    libro: {
      // «Amor a prueba de todo» — página oficial del producto.
      comprar: 'https://www.espanolwh.com/product/amor-a-prueba-de-todo/?utm_source=ig&utm_medium=social&utm_content=link_in_bio'
    },
    blog: {
      // Blog propio de Michelle (Blogger). Su feed es público: por eso
      // las entradas del sitio se cargan de verdad, sin API ni token.
      sitio: 'https://www.bymichelleruiz.com',
      feed: 'https://www.bymichelleruiz.com/feeds/posts/default',
      blogId: '438368437600195904'
    },
    amazon: {
      // Selección oficial de Michelle.
      seleccion: 'https://www.amazon.com/shop/mrsmichelleruiz/list/181ZKQRC8KUD4?linkCode=spc&tag=bymichellerui-20&domainId=influencer&asc_contentid=amzn1.ideas.181ZKQRC8KUD4&ccs_id=3e9fe70c-7297-4e2f-a7a5-9be0cde5f1be'
    }
  };

  /* Disponible para el resto del sitio y para futuras integraciones. */
  window.officialLinks = officialLinks;

  /* URLs de los reproductores, construidas desde la configuración de arriba. */
  const embedSrc = {
    youtube:
      'https://www.youtube-nocookie.com/embed/videoseries' +
      '?list=' + officialLinks.podcast.youtubeUploads +
      '&rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1',
    spotify:
      'https://open.spotify.com/embed/show/' + officialLinks.podcast.spotifyShowId +
      '?utm_source=generator&theme=0&autoplay=1'
  };

  /* ---------------------------------------------------------------------
     2 · MOTOR DE CONTENIDO INCRUSTADO
     ---------------------------------------------------------------------
     Estados: is-idle → is-loading → is-loaded | is-unavailable
     Nada se carga hasta que el bloque se acerca a la pantalla. Si la
     plataforma tarda o falla, el bloque no se queda en blanco: enseña su
     tarjeta editorial con el enlace real.
     --------------------------------------------------------------------- */

  const ESPERA_MAXIMA = 9000; // ms antes de dar la plataforma por caída

  function marcar(bloque, estado) {
    bloque.classList.remove('is-idle', 'is-loading', 'is-loaded', 'is-unavailable');
    bloque.classList.add(estado);
    if (estado === 'is-loaded' || estado === 'is-unavailable') {
      bloque.removeAttribute('aria-busy');
    } else if (estado === 'is-loading') {
      bloque.setAttribute('aria-busy', 'true');
    }
  }

  function montar(bloque) {
    if (bloque.dataset.montado === 'si') return;
    bloque.dataset.montado = 'si';

    const tipo = bloque.dataset.embed;
    const src = embedSrc[tipo];
    const marco = bloque.querySelector('[data-embed-marco]');
    if (!src || !marco) { marcar(bloque, 'is-unavailable'); return; }

    marcar(bloque, 'is-loading');

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = bloque.dataset.embedTitulo || 'Reproductor';
    iframe.loading = 'eager';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
    );
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

    const reloj = window.setTimeout(function () {
      marcar(bloque, 'is-unavailable');
    }, ESPERA_MAXIMA);

    iframe.addEventListener('load', function () {
      window.clearTimeout(reloj);
      marcar(bloque, 'is-loaded');
    });
    iframe.addEventListener('error', function () {
      window.clearTimeout(reloj);
      marcar(bloque, 'is-unavailable');
    });

    marco.appendChild(iframe);
  }

  function iniciar() {
    const bloques = document.querySelectorAll('[data-embed]');
    if (!bloques.length) return;

    bloques.forEach(function (bloque) {
      marcar(bloque, 'is-idle');

      /* El reproductor queda visible y reproduciéndose en silencio. El clic
         sobre la portada abre además la plataforma oficial. */
      const boton = bloque.querySelector('[data-embed-play]');
      if (boton) {
        boton.addEventListener('click', function () {
          const destino = bloque.dataset.embed === 'youtube'
            ? officialLinks.podcast.youtube
            : officialLinks.podcast.spotify;
          window.open(destino, '_blank', 'noopener');
        });
        montar(bloque);
      }
    });

    /* Los que se cargan solos al acercarse (los que no traen botón). */
    const auto = Array.prototype.filter.call(bloques, function (b) {
      return b.dataset.embedAuto === 'si' || !b.querySelector('[data-embed-play]');
    });
    if (!auto.length) return;

    if (!('IntersectionObserver' in window)) {
      auto.forEach(montar);
      return;
    }

    const vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        vigia.unobserve(e.target);
        montar(e.target);
      });
    }, { rootMargin: '300px 0px' });

    auto.forEach(function (b) { vigia.observe(b); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
