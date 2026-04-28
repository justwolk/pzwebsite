// ===== Бургер-меню =====
document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burger-btn');
  const siteNav = document.getElementById('site-nav');

  if (burgerBtn && siteNav) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = burgerBtn.getAttribute('aria-expanded') === 'true';
      burgerBtn.setAttribute('aria-expanded', !isOpen);
      siteNav.classList.toggle('open');
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
      if (!burgerBtn.contains(e.target) && !siteNav.contains(e.target)) {
        burgerBtn.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('open');
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('open')) {
        burgerBtn.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('open');
        burgerBtn.focus();
      }
    });
  }

  // ===== Переключение темы =====
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Загружаем сохранённую тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      let newTheme;

      if (current === 'dark') {
        newTheme = 'light';
      } else if (current === 'light') {
        newTheme = 'dark';
      } else {
        // Определяем текущую системную тему и переключаем
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        newTheme = prefersDark ? 'light' : 'dark';
      }

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'
      );
    }
  }

  // ===== Валидация формы обратной связи =====
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Проверяем обязательные поля
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');

      // Сброс ошибок
      contactForm.querySelectorAll('.error-msg').forEach(el => {
        el.style.display = 'none';
      });

      if (name && name.value.trim().length < 2) {
        showError(name, 'Имя должно содержать минимум 2 символа');
        isValid = false;
      }

      if (email && !isValidEmail(email.value)) {
        showError(email, 'Введите корректный email');
        isValid = false;
      }

      if (message && message.value.trim().length < 10) {
        showError(message, 'Сообщение должно содержать минимум 10 символов');
        isValid = false;
      }

      if (isValid) {
        // Показываем модальное окно об успешной отправке
        openModal('Спасибо!', 'Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.');
        contactForm.reset();
      }
    });
  }

  function showError(input, msg) {
    const errorEl = input.parentElement.querySelector('.error-msg');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ===== Модальное окно =====
  window.openModal = function (title, text) {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

    const modalTitle = overlay.querySelector('.modal-title');
    const modalText = overlay.querySelector('.modal-text');

    if (modalTitle) modalTitle.textContent = title;
    if (modalText) modalText.textContent = text;

    overlay.classList.add('active');
    overlay.querySelector('.modal-close').focus();

    // Закрытие по клику на overlay
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  };

  window.closeModal = function () {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  };

  // Закрытие модалки по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ===== Кнопки запуска анимаций на странице examples =====
  const animBtns = document.querySelectorAll('[data-anim]');
  animBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const animClass = btn.dataset.anim;
      if (target) {
        // Убираем все анимации
        target.className = 'demo-box';
        // Триггерим reflow чтобы анимация перезапустилась
        void target.offsetWidth;
        target.classList.add(animClass);
      }
    });
  });

  // ===== Подписка на рассылку (sidebar) =====
  const subForms = document.querySelectorAll('.subscribe-form');
  subForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && isValidEmail(input.value)) {
        openModal('Подписка оформлена!', 'Спасибо! Вы будете получать новости на ' + input.value);
        input.value = '';
      }
    });
  });
});
