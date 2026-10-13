/* Hotel Selent — interacciones */
(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const WHATSAPP = '5492235310816';
  const EMAIL = 'info@hotelselent.com.ar';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const waUrl = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

  /* ---------- Datos ---------- */
  const AMENITIES = ['Baño privado', 'Sommiers', 'TV LCD por cable', 'Wi-Fi', 'Aire acondicionado', 'Calefacción', 'Ventilador de techo', 'Caja de seguridad', 'Secador de cabello', 'Discado local', 'Desayuno en la habitación sin cargo adicional'];
  const BREAKFAST = ['Café con leche, té, chocolate', 'Jugo de naranja', 'Frutas de estación', 'Medialunas, facturas y budines', 'Tostadas', 'Pan negro y blanco', 'Mermeladas y dulce de leche', 'Manteca', 'Jamón y queso', 'Yogur', 'Cereales'];
  const EXTRAS = ['Estacionamiento propio con cámaras de seguridad', 'Asistencia médica de emergencia', 'Wi-Fi en todo el hotel', 'Conectado a la Red Nikro Central de Alarmas'];

  const ROOMS = {
    'duplex-5': { name: 'Dúplex 5 personas', cap: 'Hasta 5 personas', text: 'Nuestra opción más amplia, pensada para las familias que viajan todas juntas: espacio para que cada uno tenga su lugar y para descansar como en casa después de un día de playa.', imgs: ['hab-duplex-5', 'hab-duplex-5-b', 'hab-duplex-5-c'] },
    'duplex-4': { name: 'Dúplex 4 personas', cap: 'Hasta 4 personas', text: 'La comodidad de un dúplex para una familia de cuatro. Ambientes cálidos y renovados para disfrutar las vacaciones sin apuro.', imgs: ['hab-duplex-4', 'hab-duplex-5-b'] },
    'cuadruple': { name: 'Cuádruple', cap: 'Hasta 4 personas', text: 'Para familias de cuatro que prefieren compartir un mismo ambiente, amplio y luminoso, con cama matrimonial y camas individuales.', imgs: ['hab-cuadruple'] },
    'triple': { name: 'Triple', cap: 'Hasta 3 personas', text: 'Ideal para una pareja con un hijo o para viajar entre amigos. Confortable, renovada y a pasos del mar.', imgs: ['hab-triple'] },
    'doble': { name: 'Doble', cap: '2 personas', text: 'Para escapadas de a dos: cama matrimonial, tranquilidad y el mar a solo 200 metros.', imgs: ['hab-doble', 'hab-habitacion-matrimonial'] },
    'single': { name: 'Single', cap: '1 persona', text: 'Práctica y confortable, para quienes viajan solos por trabajo o por placer.', imgs: ['hab-single', 'hab-single-b'] }
  };

  /* ---------- Header ---------- */
  const header = $('.site-header');
  const hero = $('[data-hero]');
  const waFloat = $('#wa-float');
  const mobileBar = $('#mobile-bar');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    const pastHero = !hero || y > hero.offsetHeight * .7;
    waFloat.classList.toggle('is-visible', pastHero);
    mobileBar.classList.toggle('is-visible', pastHero);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  const toggle = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobileMenu.hidden = !open;
    header.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 960) setMenu(false); });

  /* ---------- Animaciones de entrada ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealObserver.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  $$('.reveal').forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 6) * 0.07}s`);
    revealObserver.observe(el);
  });

  /* ---------- Fechas ---------- */
  const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const fmt = (s) => new Date(s + 'T12:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtLong = (s) => new Date(s + 'T12:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  /* ---------- Buscador de disponibilidad ---------- */
  const booking = $('#disponibilidad');
  if (booking) {
    const inEl = $('#b-llegada');
    const outEl = $('#b-salida');
    const summary = $('#b-summary');
    const today = new Date();
    inEl.min = iso(today);
    outEl.min = iso(addDays(today, 1));

    const nights = () => {
      if (!inEl.value || !outEl.value) return 0;
      return Math.round((new Date(outEl.value) - new Date(inEl.value)) / 86400000);
    };
    const guests = () => ({ a: +$('#b-adultos').value, m: +$('#b-menores').value });
    const updateSummary = () => {
      summary.classList.remove('is-error');
      const n = nights();
      const { a, m } = guests();
      const people = `${a} adulto${a > 1 ? 's' : ''}${m ? ` y ${m} menor${m > 1 ? 'es' : ''}` : ''}`;
      if (n > 0) summary.textContent = `${n} noche${n > 1 ? 's' : ''} · ${fmt(inEl.value)} → ${fmt(outEl.value)} · ${people}`;
      else summary.textContent = `Elegí tus fechas · ${people}`;
    };
    inEl.addEventListener('change', () => {
      if (!inEl.value) return;
      outEl.min = iso(addDays(new Date(inEl.value + 'T12:00'), 1));
      if (!outEl.value || outEl.value <= inEl.value) outEl.value = iso(addDays(new Date(inEl.value + 'T12:00'), 3));
      updateSummary();
    });
    outEl.addEventListener('change', updateSummary);

    $$('.stepper', booking).forEach((st) => {
      const out = $('output', st);
      const min = +st.dataset.min, max = +st.dataset.max;
      const btns = $$('button', st);
      const sync = () => {
        btns[0].disabled = +out.value <= min;
        btns[1].disabled = +out.value >= max;
      };
      btns.forEach((b) => b.addEventListener('click', () => {
        out.value = Math.min(max, Math.max(min, +out.value + +b.dataset.step));
        sync(); updateSummary();
      }));
      sync();
    });
    updateSummary();

    booking.addEventListener('submit', (ev) => {
      ev.preventDefault();
      if (!inEl.value || !outEl.value || nights() < 1) {
        summary.textContent = 'Elegí la fecha de llegada y de salida para consultar.';
        summary.classList.add('is-error');
        (inEl.value ? outEl : inEl).focus();
        return;
      }
      const { a, m } = guests();
      const n = nights();
      const msg = `¡Hola! Quiero consultar disponibilidad en el Hotel Selent.\n• Llegada: ${fmtLong(inEl.value)}\n• Salida: ${fmtLong(outEl.value)} (${n} noche${n > 1 ? 's' : ''})\n• Adultos: ${a}\n• Menores: ${m}`;
      window.open(waUrl(msg), '_blank', 'noopener');
    });

    // En el inicio, el bloque de "confianza" deja lugar para el buscador que sobresale del hero
    const trust = $('.trust');
    if (trust) {
      const setBookingSpace = () => trust.style.setProperty('--booking-h', `${booking.offsetHeight}px`);
      setBookingSpace();
      window.addEventListener('resize', setBookingSpace);
    }
  }

  /* ---------- Habitaciones: filtro ---------- */
  const grid = $('#room-grid');
  if (grid) {
    const cards = $$('.room-card', grid);
    const empty = $('#room-empty');
    $$('.room-filter .chip').forEach((chip) => chip.addEventListener('click', () => {
      $$('.room-filter .chip').forEach((c) => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', String(c === chip)); });
      const n = +chip.dataset.guests;
      let visible = 0;
      cards.forEach((card) => {
        const cap = +card.dataset.capacity;
        // Mostramos las que alcanzan, sin sugerir habitaciones demasiado grandes
        const show = !n || (cap >= n && cap <= n + 2);
        card.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });
      grid.classList.toggle('is-filtered', !!n);
      empty.hidden = visible > 0;
    }));
  }

  // Botones "Consultar" de cada habitación
  $$('[data-wa-room]').forEach((a) => {
    const room = a.dataset.waRoom;
    a.href = waUrl(`¡Hola! Quiero consultar disponibilidad y tarifas para la habitación ${room} en el Hotel Selent.`);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Modal de habitación ---------- */
  const modal = $('#modal');
  const modalInner = $('#modal-inner');
  const list = (items) => `<ul class="modal-list">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  let lastFocus = null;

  const openRoom = (id) => {
    const r = ROOMS[id];
    if (!r) return;
    lastFocus = document.activeElement;
    const imgs = r.imgs.map((i) => `assets/img/${i}.webp`);
    const thumbs = imgs.length > 1
      ? `<div class="modal-thumbs">${imgs.map((src, k) => `<button class="${k ? '' : 'is-active'}" data-src="${src}" aria-label="Foto ${k + 1}"><img src="${src.replace('.webp', '-sm.webp')}" alt=""></button>`).join('')}</div>`
      : '';
    modalInner.innerHTML = `
      <div class="modal-media"><img id="modal-img" src="${imgs[0]}" alt="${r.name}">${thumbs}</div>
      <div class="modal-body">
        <p class="eyebrow">${r.cap}</p>
        <h2 id="modal-title">${r.name}</h2>
        <p>${r.text}</p>
        <h3>En la habitación</h3>${list(AMENITIES)}
        <h3>Desayuno buffet incluido</h3>${list(BREAKFAST)}
        <h3>Más servicios</h3>${list(EXTRAS)}
        <div class="modal-actions">
          <a class="btn btn-primary" target="_blank" rel="noopener" href="${waUrl(`¡Hola! Quiero consultar disponibilidad y tarifas para la habitación ${r.name} en el Hotel Selent.`)}">Consultar por WhatsApp</a>
          <a class="btn btn-ghost" href="reservar.html?habitacion=${encodeURIComponent(r.name)}#contacto">Pre-reservar</a>
        </div>
      </div>`;
    modal.showModal();
    document.body.style.overflow = 'hidden';
    modalInner.scrollTop = 0;
    $$('.modal-thumbs button', modal).forEach((b) => b.addEventListener('click', () => {
      $('#modal-img').src = b.dataset.src;
      $$('.modal-thumbs button', modal).forEach((x) => x.classList.toggle('is-active', x === b));
    }));
  };
  modal.addEventListener('close', () => {
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  });

  document.addEventListener('click', (ev) => {
    const roomBtn = ev.target.closest('[data-open-room]');
    if (roomBtn) { openRoom(roomBtn.dataset.openRoom); return; }
    const closeBtn = ev.target.closest('[data-close]');
    if (closeBtn) closeBtn.closest('dialog').close();
  });
  // Cerrar al hacer clic fuera del contenido
  [modal, $('#lightbox')].forEach((dlg) => dlg.addEventListener('click', (ev) => { if (ev.target === dlg) dlg.close(); }));

  // Al llegar desde "Ver detalles" del inicio (habitaciones.html#doble), abrimos la ficha
  if (grid && ROOMS[location.hash.slice(1)]) {
    window.addEventListener('load', () => openRoom(location.hash.slice(1)));
  }

  /* ---------- Galería / lightbox ---------- */
  const items = $$('#gallery .g-item');
  if (items.length) {
    const lb = $('#lightbox');
    const lbImg = $('#lb-img');
    const lbCap = $('#lb-caption');
    let idx = 0;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const img = $('img', items[idx]);
      lbImg.src = items[idx].dataset.full;
      lbImg.alt = img.alt;
      lbCap.textContent = `${img.alt} · ${idx + 1}/${items.length}`;
    };
    items.forEach((it, i) => {
      it.setAttribute('aria-label', `Ampliar: ${$('img', it).alt}`);
      it.addEventListener('click', () => { lastFocus = it; show(i); lb.showModal(); document.body.style.overflow = 'hidden'; });
    });
    $('.lb-prev').addEventListener('click', () => show(idx - 1));
    $('.lb-next').addEventListener('click', () => show(idx + 1));
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    lb.addEventListener('close', () => { document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); });
    let touchX = null;
    lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      touchX = null;
    });
  }

  /* ---------- Copiar CBU / CUIT ---------- */
  $$('.copy').forEach((b) => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      const label = $('span', b);
      b.classList.add('is-done'); label.textContent = 'Copiado';
      setTimeout(() => { b.classList.remove('is-done'); label.textContent = 'Copiar'; }, 1800);
    } catch (_) { /* el portapapeles puede no estar disponible */ }
  }));

  /* ---------- Formulario de contacto ---------- */
  const form = $('#contact-form');
  if (form) {
    const formMsg = $('#form-msg');
    // Habitación elegida desde la ficha ("Pre-reservar")
    const preset = new URLSearchParams(location.search).get('habitacion');
    if (preset && [...form.habitacion.options].some((o) => o.value === preset)) form.habitacion.value = preset;

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const via = ev.submitter ? ev.submitter.value : 'whatsapp';
      const f = new FormData(form);
      const name = form.nombre, email = form.email;
      let ok = true;
      [name, email].forEach((el) => el.classList.remove('is-invalid'));
      if (!name.value.trim()) { name.classList.add('is-invalid'); ok = false; }
      if (!email.validity.valid || !email.value.trim()) { email.classList.add('is-invalid'); ok = false; }
      if (!ok) {
        formMsg.textContent = 'Completá tu nombre y un email válido.';
        formMsg.classList.add('is-error');
        (name.value.trim() ? email : name).focus();
        return;
      }
      formMsg.classList.remove('is-error');
      const lines = [
        `Nombre: ${f.get('nombre')}`,
        `Email: ${f.get('email')}`,
        f.get('llegada') && `Llegada: ${fmtLong(f.get('llegada'))}`,
        f.get('salida') && `Salida: ${fmtLong(f.get('salida'))}`,
        `Personas: ${f.get('personas')}`,
        f.get('habitacion') && `Habitación: ${f.get('habitacion')}`,
        f.get('mensaje') && `\n${f.get('mensaje')}`
      ].filter(Boolean).join('\n');
      if (via === 'email') {
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Consulta / Pre-reserva desde la web')}&body=${encodeURIComponent(lines)}`;
      } else {
        window.open(waUrl(`¡Hola! Te escribo desde la web del Hotel Selent.\n${lines}`), '_blank', 'noopener');
      }
      formMsg.textContent = '¡Gracias! Te respondemos a la brevedad.';
    });
  }

  /* ---------- Newsletter ---------- */
  const nl = $('#newsletter');
  nl.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const input = $('#nl-email');
    const msg = $('#nl-msg');
    if (!input.validity.valid || !input.value.trim()) { msg.textContent = 'Ingresá un email válido.'; input.focus(); return; }
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Suscripción al newsletter')}&body=${encodeURIComponent(`Quiero suscribirme al newsletter: ${input.value}`)}`;
    msg.textContent = '¡Gracias por suscribirte!';
    nl.reset();
  });

  $('#year').textContent = new Date().getFullYear();
})();
