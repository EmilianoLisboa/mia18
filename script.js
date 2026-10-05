
/* =========================================================
   CONFIGURAÇÃO PRINCIPAL
   Altere aqui os dados conforme necessário.
   ========================================================= */
const CONFIG = {
  nome: "Domiana Samuel",
  apelido: "Mia❣️",
  idade: 18,
  anosRelacionamento: 4,
  nomeAutor: "Emiliano",
  cidadeDela: "Sumbe",
  minhaCidade: "Waco-Cungo",
  cidadeEstudos: "Huambo",
  // ⚠️ Formato: "AAAA-MM-DDTHH:MM:SS"
  // Substitua pela data REAL em que começaram a namorar:
  dataRelacionamento: "2022-08-05T00:00:00"
};

/* =========================================================
   UTILITÁRIOS
   ========================================================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* =========================================================
   PARTÍCULAS DE CORAÇÕES
   ========================================================= */
function createHearts(container, count = 20, emojis = ['❤️', '💕', '🌸', '✨', '💗']) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = Math.random() * 100 + '%';
    span.style.animationDuration = (8 + Math.random() * 12) + 's';
    span.style.animationDelay = (Math.random() * 10) + 's';
    span.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
    container.appendChild(span);
  }
}

/* =========================================================
   TELA DE ABERTURA
   ========================================================= */
const introScreen = $('#introScreen');
const openSurpriseBtn = $('#openSurpriseBtn');
const mainSite = $('#mainSite');
const bgMusic = $('#bgMusic');
const enableMusicBtn = $('#enableMusicBtn');
const musicToggle = $('#musicToggle');

createHearts($('#introParticles'), 25);

/* =========================================================
   TELA DE PIN
   ========================================================= */
const PIN_CORRETO = "2008"; // 🔐 Altera aqui se quiseres outro PIN
const pinScreen = $('#pinScreen');
const pinInput = $('#pinInput');
const pinSubmit = $('#pinSubmit');
const pinError = $('#pinError');

function tentarPIN() {
  const valor = pinInput.value.trim();
  if (valor === PIN_CORRETO) {
    pinError.classList.add('hidden');
    pinScreen.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    pinScreen.style.opacity = '0';
    pinScreen.style.transform = 'scale(1.1)';

    setTimeout(() => {
      pinScreen.classList.add('hidden');
      pinScreen.style.opacity = '';
      pinScreen.style.transform = '';
      mainSite.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'instant' });
      initReveal();
      initLetterTyping();
      initHeroCounter();
    }, 800);
  } else {
    pinError.classList.remove('hidden');
    pinInput.classList.add('shake');
    pinInput.value = '';
    setTimeout(() => pinInput.classList.remove('shake'), 500);
    pinInput.focus();
  }
}

pinSubmit?.addEventListener('click', tentarPIN);
pinInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') tentarPIN();
});

/* =========================================================
   BOTÃO ABRIR SURPRESA → MOSTRA PIN
   ========================================================= */
openSurpriseBtn.addEventListener('click', () => {
  introScreen.classList.add('fade-out');
  createHearts(document.body, 30, ['❤️', '💕', '💖', '✨']);

  // Tentar tocar música (respeitando autoplay)
  bgMusic.volume = 0.6;
  const playPromise = bgMusic.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      musicToggle.classList.add('playing');
      $('.waveform')?.classList.add('active');
      $('.vinyl')?.classList.add('playing');
    }).catch(() => {
      enableMusicBtn.classList.remove('hidden');
    });
  } else {
    enableMusicBtn.classList.remove('hidden');
  }

  setTimeout(() => {
    introScreen.style.display = 'none';
    pinScreen.classList.remove('hidden');
    pinInput.focus();
  }, 1000);
});

enableMusicBtn.addEventListener('click', () => {
  bgMusic.play().then(() => {
    enableMusicBtn.classList.add('hidden');
    musicToggle.classList.add('playing');
    $('.waveform')?.classList.add('active');
    $('.vinyl')?.classList.add('playing');
  }).catch(() => {
    alert('Não foi possível tocar a música. Verifique se o arquivo assets/audio/nossa-musica.mp3 existe.');
  });
});

/* =========================================================
   MÚSICA - PLAYER COMPLETO
   ========================================================= */
const playPauseBtn = $('#playPauseBtn');
const progressBar = $('#progressBar');
const volumeBar = $('#volumeBar');
const currentTimeEl = $('#currentTime');
const durationEl = $('#duration');
const vinyl = $('.vinyl');
const waveform = $('#waveform');

function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      playPauseBtn.textContent = '❚❚';
      musicToggle.classList.add('playing');
      waveform?.classList.add('active');
      vinyl?.classList.add('playing');
    }).catch(() => {});
  } else {
    bgMusic.pause();
    playPauseBtn.textContent = '▶';
    musicToggle.classList.remove('playing');
    waveform?.classList.remove('active');
    vinyl?.classList.remove('playing');
  }
}

playPauseBtn?.addEventListener('click', toggleMusic);
musicToggle?.addEventListener('click', toggleMusic);

bgMusic.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(bgMusic.duration);
});

bgMusic.addEventListener('timeupdate', () => {
  if (bgMusic.duration) {
    const pct = (bgMusic.currentTime / bgMusic.duration) * 100;
    progressBar.value = pct;
    currentTimeEl.textContent = formatTime(bgMusic.currentTime);
  }
});

bgMusic.addEventListener('ended', () => {
  playPauseBtn.textContent = '▶';
  waveform?.classList.remove('active');
  vinyl?.classList.remove('playing');
});

progressBar?.addEventListener('input', (e) => {
  if (bgMusic.duration) {
    bgMusic.currentTime = (e.target.value / 100) * bgMusic.duration;
  }
});

volumeBar?.addEventListener('input', (e) => {
  bgMusic.volume = e.target.value;
});

/* =========================================================
   MODO ESCURO
   ========================================================= */
const themeToggle = $('#themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* =========================================================
   HERO - PARTÍCULAS
   ========================================================= */
createHearts($('#heroParticles'), 18);

/* =========================================================
   HERO - CONTADOR "18 ANOS"
   ========================================================= */
function initHeroCounter() {
  const el = $('#ageCounter');
  if (!el) return;
  let current = 0;
  const target = CONFIG.idade;
  const step = () => {
    current++;
    el.textContent = current;
    if (current < target) requestAnimationFrame(() => setTimeout(step, 80));
  };
  step();
}

/* =========================================================
   REVEAL ON SCROLL
   ========================================================= */
let revealObserver;
function initReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('fade-in')) {
          entry.target.classList.add('visible');
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  $$('.reveal, .reveal-left, .reveal-right, .fade-in').forEach(el => {
    revealObserver.observe(el);
  });
}

/* =========================================================
   CARTA - EFEITO MÁQUINA DE ESCREVER
   ========================================================= */
function initLetterTyping() {
  const letterBody = $('#letterBody');
  if (!letterBody) return;
  const text = letterBody.dataset.text;
  let index = 0;
  let started = false;

  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        letterBody.textContent = '';
        const speed = 18;
        const type = () => {
          if (index < text.length) {
            letterBody.textContent += text[index];
            index++;
            setTimeout(type, speed);
          } else {
            letterBody.classList.add('done');
          }
        };
        type();
        letterObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  letterObserver.observe(letterBody);
}

/* =========================================================
   CARROSSEL
   ========================================================= */
const carouselData = [
  { img: 'assets/images/principal.jpg', caption: 'Foi aqui que tudo começou ❤️' },
  { img: 'assets/images/mia05.jpg', caption: 'Mais uma memória contigo.' },
  { img: 'assets/images/mia2.jpg', caption: 'Mesmo longe, sempre perto do coração.' },
  { img: 'assets/images/m0.jpg', caption: 'Um sorriso teu vale mais que mil palavras.' },
  { img: 'assets/images/mia4.jpg', caption: '4 anos de nós.' },
  { img: 'assets/images/mia06.jpg', caption: 'E contando... ❤️' }
];

const placeholderSVG = (n) =>
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%23f8c8d4"/><stop offset="1" stop-color="%23b3123b"/></linearGradient></defs><rect fill="url(%23g)" width="800" height="600"/><text x="400" y="300" font-size="40" fill="white" text-anchor="middle" dy=".3em" font-family="serif">foto${n}.jpg</text></svg>`;

function initCarousel() {
  const track = $('#carouselTrack');
  const indicators = $('#carouselIndicators');
  if (!track) return;

  carouselData.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
      <img src="${item.img}" alt="Momento ${i + 1}" 
           onerror="this.src='${placeholderSVG(i + 1)}'">
      <div class="slide-caption">${item.caption}</div>
    `;
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.addEventListener('click', () => goToSlide(i));
    indicators.appendChild(dot);
  });

  const slides = $$('.slide');
  const dots = indicators.querySelectorAll('button');
  let currentIndex = 0;
  let autoplayTimer;

  function update() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === currentIndex));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function goToSlide(i) {
    currentIndex = (i + slides.length) % slides.length;
    update();
    resetAutoplay();
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  $('#carouselNext')?.addEventListener('click', nextSlide);
  $('#carouselPrev')?.addEventListener('click', prevSlide);

  // Swipe mobile
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) diff > 0 ? prevSlide() : nextSlide();
  });

  update();
  resetAutoplay();
}

/* =========================================================
   ENVELOPES
   ========================================================= */
function initEnvelopes() {
  $$('.envelope').forEach(env => {
    env.addEventListener('click', () => {
      openModal('Uma mensagem para ti ❤️', env.dataset.message);
    });
  });
}

/* =========================================================
   MODAL
   ========================================================= */
const modal = $('#modal');
const modalTitle = $('#modalTitle');
const modalText = $('#modalText');
const modalClose = $('#modalClose');
const modalBackdrop = $('#modalBackdrop');

function openModal(title, text) {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* =========================================================
   4 CARTAS
   ========================================================= */
function initLetters4() {
  $$('.letter4').forEach(letter => {
    letter.addEventListener('click', () => {
      openModal(letter.dataset.title, letter.dataset.text);
    });
  });
}

/* =========================================================
   CONTADOR DE RELACIONAMENTO
   ========================================================= */
function updateCounter() {
  const start = new Date(CONFIG.dataRelacionamento);
  const now = new Date();
  if (isNaN(start.getTime())) return;

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonth;
    months--;
  }
  if (months < 0) { months += 12; years--; }

  $('#cYears').textContent = years;
  $('#cMonths').textContent = months;
  $('#cDays').textContent = days;
  $('#cHours').textContent = hours;
  $('#cMinutes').textContent = minutes;
  $('#cSeconds').textContent = seconds;
}

/* =========================================================
   18 COISAS QUE ADMIRO
   ========================================================= */
const things18 = [
  "O teu sorriso", "A tua inteligência", "A tua calma", "A tua força",
  "O teu carinho", "O teu jeito fofinho", "A tua energia", "A tua sinceridade",
  "A tua personalidade", "A forma como me fazes sorrir", "A maneira como me apoias",
  "As nossas conversas", "Os nossos momentos", "A tua determinação",
  "A tua presença", "A tua forma de amar", "A pessoa que és", "Simplesmente tu ❤️"
];

function initThings18() {
  const grid = $('.things-grid');
  if (!grid) return;
  things18.forEach((text, i) => {
    const card = document.createElement('div');
    card.className = 'thing-card reveal';
    card.innerHTML = `
      <span class="thing-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="thing-text">${text}</span>
    `;
    grid.appendChild(card);
  });
}

/* =========================================================
   ESTRELAS - FUTURO
   ========================================================= */
function initStars() {
  const starsBg = $('#starsBg');
  if (!starsBg) return;
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('span');
    const size = Math.random() * 2.5 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (2 + Math.random() * 3) + 's';
    starsBg.appendChild(star);
  }
}

/* =========================================================
   PRESENTE DIGITAL
   ========================================================= */
function initGift() {
  const openGiftBtn = $('#openGiftBtn');
  const giftOverlay = $('#giftOverlay');
  const giftBox = $('#giftBox');
  const giftMessage = $('#giftMessage');
  if (!openGiftBtn) return;

  openGiftBtn.addEventListener('click', () => {
    giftOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      giftBox.classList.add('open');
      setTimeout(() => {
        giftMessage.classList.remove('hidden');
        launchConfetti(3000, 120);
      }, 700);
    }, 400);
  });

  giftOverlay.addEventListener('click', (e) => {
    if (e.target === giftOverlay && giftBox.classList.contains('open')) {
      giftOverlay.classList.add('hidden');
      giftBox.classList.remove('open');
      giftMessage.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
}

/* =========================================================
   CONFETES
   ========================================================= */
const confettiCanvas = $('#confettiCanvas');
const ctx = confettiCanvas?.getContext('2d');
let confettiParticles = [];
let confettiAnimation = null;

function resizeCanvas() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function launchConfetti(duration = 4000, count = 200) {
  if (!confettiCanvas || !ctx) return;
  resizeCanvas();
  confettiCanvas.classList.add('active');
  confettiParticles = [];

  const colors = ['#b3123b', '#d92048', '#f8c8d4', '#ffb6c9', '#d4af7a', '#ffe4ec', '#ff7b54'];
  const shapes = ['rect', 'circle', 'heart'];

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      size: 6 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      life: 1
    });
  }

  const startTime = Date.now();

  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    const elapsed = Date.now() - startTime;

    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.rotation += p.rotationSpeed;

      if (elapsed > duration - 1000) p.life -= 0.01;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // coração
        const s = p.size / 2;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.5);
        ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.3);
        ctx.fill();
      }
      ctx.restore();
    });

    // filtrar partículas mortas ou fora da tela
    confettiParticles = confettiParticles.filter(p =>
      p.life > 0 && p.y < confettiCanvas.height + 100
    );

    if (elapsed < duration && confettiParticles.length > 0) {
      confettiAnimation = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(confettiAnimation);
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiCanvas.classList.remove('active');
    }
  }

  cancelAnimationFrame(confettiAnimation);
  animate();
}

/* =========================================================
   CELEBRAR 18 ANOS
   ========================================================= */
function initCelebrate() {
  const btn = $('#celebrateBtn');
  const msg = $('#celebrationMessage');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // confetes
    launchConfetti(5000, 250);

    // mensagem
    msg.classList.remove('hidden');
    // reiniciar animação
    msg.style.animation = 'none';
    void msg.offsetWidth;
    msg.style.animation = '';

    setTimeout(() => {
      msg.classList.add('hidden');
    }, 3200);
  });
}

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */
function initAll() {
  initCarousel();
  initEnvelopes();
  initLetters4();
  initThings18();
  initStars();
  initGift();
  initCelebrate();

  // Contador em tempo real
  updateCounter();
  setInterval(updateCounter, 1000);

  // Revelar elementos que já estão visíveis ao carregar
  initReveal();

  // Adicionar fade-in ao hero
  setTimeout(() => {
    $('.hero-content')?.classList.add('visible');
  }, 200);
}

window.addEventListener('load', initAll);
window.addEventListener('resize', resizeCanvas);