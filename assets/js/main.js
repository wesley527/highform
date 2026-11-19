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

  // Reveal suave ao entrar na área visível.
  const revealItems = document.querySelectorAll('[data-reveal]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Profundidade 3D sutil guiada pela posição do elemento durante o scroll.
  const depthItems = Array.from(document.querySelectorAll('.scroll-3d[data-depth]'));
  let ticking = false;

  const updateDepth = () => {
    if (!reduceMotion && window.innerWidth > 760) {
      const viewportCenter = window.innerHeight * 0.5;
      depthItems.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height * 0.5;
        const distance = (elementCenter - viewportCenter) / Math.max(window.innerHeight, 1);
        const depth = Number(element.dataset.depth) || 0.08;
        const bounded = Math.max(-1, Math.min(1, distance));
        const y = bounded * 38 * depth * 10;
        const rotateX = -bounded * 5 * depth * 10;
        const rotateY = bounded * 3.5 * depth * 10;
        element.style.transform = `perspective(1100px) translate3d(0, ${y}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    } else {
      depthItems.forEach((element) => { element.style.transform = ''; });
    }
    ticking = false;
  };

  const requestDepthUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateDepth);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestDepthUpdate, { passive: true });
  window.addEventListener('resize', requestDepthUpdate);
  updateDepth();

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
})();
