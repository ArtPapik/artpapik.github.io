(() => {
  // Инициализация Telegram Web App
  const tg = window.Telegram.WebApp;
  if (tg) {
    tg.expand();
    tg.setBackgroundColor('#fff0f6');
    tg.MainButton.text = 'Принять ❤️';
    tg.MainButton.color = '#ffffff';
    tg.MainButton.bgColor = '#e85d75';
    tg.MainButton.hide();
  }

  const pages = document.querySelectorAll('.page');
  const toast = document.getElementById('toast');

  function showPage(id) {
    pages.forEach((p) => p.classList.remove('active'));
    const page = document.getElementById(id);
    if (page) page.classList.add('active');

    if (tg && tg.MainButton) {
      tg.MainButton.hide();
    }
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- Экран 1: вопрос ---------- */
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const question = document.getElementById('question');

  let noAttempts = 0;

  function moveBtnNo() {
    const card = document.querySelector('#page1 .card');
    const cardRect = card.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxX = Math.max(20, cardRect.width - btnRect.width - 24);
    const maxY = Math.max(20, cardRect.height - btnRect.height - 24);

    const x = 12 + Math.random() * maxX;
    const y = 40 + Math.random() * maxY;

    btnNo.style.position = 'absolute';
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
    btnNo.style.transition = 'none';
  }

  // Сбрасываем позицию при открытии страницы
  showPage('page1');

  btnYes.addEventListener('click', () => {
    if (tg) tg.HapticFeedback?.impactOccurred?.('light');
    question.textContent = 'Я знал, что ты скажешь «да» 💖';
    setTimeout(() => showPage('page2'), 350);
  });

  // Кнопка «Нет» убегает при наведении и при попытке нажатия
  btnNo.addEventListener('mouseenter', moveBtnNo);
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    noAttempts++;
    if (tg) tg.HapticFeedback?.impactOccurred?.('heavy');
    moveBtnNo();

    if (noAttempts === 1) {
      showToast('Она всё равно тебя любит 😉');
    } else if (noAttempts === 3) {
      showToast('Не бойся признаться, Марфа уже ждёт ❤️');
    } else if (noAttempts === 5) {
      showToast('Марфа, ты точно не можешь сказать «нет»…');
    }
  });

  /* ---------- Экран 2: признание ---------- */
  const btnNext = document.getElementById('btnNext');
  btnNext.addEventListener('click', () => {
    if (tg) tg.HapticFeedback?.impactOccurred?.('light');
    showPage('page3');
    initSurprise();
  });

  /* ---------- Экран 3: сюрприз ---------- */
  const meterFill = document.getElementById('meterFill');
  const meterValue = document.getElementById('meterValue');
  const btnHeart = document.getElementById('btnHeart');
  const btnRestart = document.getElementById('btnRestart');

  let lovePercent = 0;

  function initSurprise() {
    lovePercent = 0;
    meterFill.style.width = '0%';
    meterValue.textContent = '0 %';

    // Анимированное заполнение счетчика любви
    const interval = setInterval(() => {
      lovePercent += 5;
      if (lovePercent >= 100) {
        lovePercent = 100;
        clearInterval(interval);
        if (tg) tg.MainButton.show();
        if (tg) tg.MainButton.onClick(() => {
          tg.sendData('Марфа приняла признание ❤️');
          tg.showAlert('Сообщение отправлено Марфе! Она получила твою любовь. 💌');
        });
      }
      meterFill.style.width = `${lovePercent}%`;
      meterValue.textContent = `${lovePercent} %`;
    }, 40);
  }

  btnHeart.addEventListener('click', () => {
    if (tg) tg.HapticFeedback?.impactOccurred?.('light');
    spawnHeart();
    showToast('Сердце отправлено Марфе 💌');
  });

  btnRestart.addEventListener('click', () => {
    noAttempts = 0;
    showPage('page1');
  });

  function spawnHeart() {
    const container = document.getElementById('floatingHearts');
    const heart = document.createElement('div');
    heart.textContent = '💖';
    heart.style.position = 'absolute';
    heart.style.fontSize = (12 + Math.random() * 18) + 'px';
    heart.style.left = `${20 + Math.random() * 60}%`;
    heart.style.top = '100%';
    heart.style.opacity = '0.9';
    heart.style.pointerEvents = 'none';
    container.appendChild(heart);

    let y = 100;
    const speed = 1.5 + Math.random() * 1.5;
    const drift = (Math.random() - 0.5) * 0.8;

    const anim = setInterval(() => {
      y -= speed;
      heart.style.transform = `translateY(-${y}px) translateX(${Math.sin(y / 20) * 20}px)`;
      heart.style.opacity = Math.max(0, y / 120);
      if (y < -120) {
        clearInterval(anim);
        heart.remove();
      }
    }, 16);
  }
})();