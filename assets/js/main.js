(() => {
  'use strict';

  // CONFIGURE AQUI: informe DDI + DDD + número, somente dígitos.
  // Exemplo de formato: 5511999999999. Não deixe espaços, parênteses ou sinais.
  const WHATSAPP_NUMBER = '';

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  const body = document.body;

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
      navigation.classList.remove('is-open');
      body.classList.remove('menu-open');
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      navigation.classList.toggle('is-open', !isOpen);
      body.classList.toggle('menu-open', !isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Um único ciclo de scroll controla as entradas e a profundidade em todos os navegadores.
  const revealItems = new Set(document.querySelectorAll('[data-reveal]'));
  const motionPreference = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };
  const motionButton = document.querySelector('.motion-override');
  let forceMotion = false;
  try { forceMotion = window.localStorage.getItem('highform-motion') === 'on'; } catch (_) { /* Armazenamento pode estar bloqueado. */ }

  const motionEnabled = () => !motionPreference.matches || forceMotion;
  const syncMotionPreference = () => {
    document.documentElement.classList.toggle('force-motion', forceMotion);
    body.classList.toggle('motion-ready', motionEnabled());
    if (motionButton) {
      motionButton.hidden = !motionPreference.matches;
      motionButton.textContent = forceMotion
        ? 'Desativar animações neste dispositivo'
        : 'Ativar animações neste dispositivo';
    }
  };
  syncMotionPreference();

  if (motionButton) {
    motionButton.addEventListener('click', () => {
      forceMotion = !forceMotion;
      try { window.localStorage.setItem('highform-motion', forceMotion ? 'on' : 'off'); } catch (_) { /* A escolha vale nesta página. */ }
      syncMotionPreference();
      requestMotionUpdate();
    });
  }

  const depthItems = Array.from(document.querySelectorAll('.scroll-3d[data-depth]'));
  let ticking = false;

  const updateMotion = () => {
    revealItems.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        element.classList.add('is-visible');
        revealItems.delete(element);
      }
    });

    if (motionEnabled()) {
      const viewportCenter = window.innerHeight * 0.5;
      const mobile = window.innerWidth <= 760;
      depthItems.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height * 0.5;
        const distance = (elementCenter - viewportCenter) / Math.max(window.innerHeight, 1);
        const depth = Number(element.dataset.depth) || 0.08;
        const bounded = Math.max(-1, Math.min(1, distance));
        const intensity = mobile ? 0.75 : 1;
        element.style.setProperty('--depth-y', `${(bounded * depth * 220 * intensity).toFixed(1)}px`);
        element.style.setProperty('--depth-rx', `${(-bounded * depth * 42 * intensity).toFixed(2)}deg`);
        element.style.setProperty('--depth-ry', `${(bounded * depth * 30 * intensity).toFixed(2)}deg`);
        element.style.setProperty('--depth-scale', (1 - Math.abs(bounded) * (mobile ? 0.025 : 0.012)).toFixed(3));
      });
    } else {
      depthItems.forEach((element) => {
        ['--depth-y', '--depth-rx', '--depth-ry', '--depth-scale'].forEach((property) => element.style.removeProperty(property));
      });
    }
    ticking = false;
  };

  const requestMotionUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateMotion);
    }
  };

  window.addEventListener('scroll', requestMotionUpdate, { passive: true });
  window.addEventListener('resize', requestMotionUpdate);
  window.addEventListener('pageshow', requestMotionUpdate);
  const handleMotionPreferenceChange = () => {
    syncMotionPreference();
    requestMotionUpdate();
  };
  if (motionPreference.addEventListener) {
    motionPreference.addEventListener('change', handleMotionPreferenceChange);
  } else if (motionPreference.addListener) {
    motionPreference.addListener(handleMotionPreferenceChange);
  }
  updateMotion();

  // Formulário: prepara uma mensagem de orçamento no WhatsApp.
  const quoteForm = document.querySelector('#quote-form');
  const feedback = document.querySelector('#form-feedback');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!quoteForm.reportValidity()) return;

      const formData = new FormData(quoteForm);
      const name = String(formData.get('name') || '').trim();
      const phone = String(formData.get('whatsapp') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const projectType = String(formData.get('projectType') || '').trim();
      const details = String(formData.get('details') || '').trim();

      const message = [
        'Olá, HIGH FORM! Gostaria de solicitar um orçamento personalizado.',
        '',
        `Nome: ${name}`,
        `Meu WhatsApp: ${phone}`,
        email ? `E-mail: ${email}` : '',
        `Tipo de projeto: ${projectType}`,
        '',
        'Sobre minha ideia:',
        details
      ].filter(Boolean).join('\n');

      const encodedMessage = encodeURIComponent(message);
      const configuredNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
      const whatsappUrl = configuredNumber
        ? `https://wa.me/${configuredNumber}?text=${encodedMessage}`
        : `https://wa.me/?text=${encodedMessage}`;

      if (feedback) {
        feedback.textContent = configuredNumber
          ? 'Abrindo o WhatsApp para você concluir o envio da solicitação.'
          : 'O WhatsApp será aberto com a mensagem preenchida. Selecione o contato da HIGH FORM para enviar.';
      }

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
  body.dataset.jsReady = 'true';
})();
