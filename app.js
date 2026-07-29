(() => {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  const loader = $('#loadingScreen');
  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add('hidden');
    loader.setAttribute('aria-hidden', 'true');
  };
  window.addEventListener('load', () => setTimeout(hideLoader, 350));
  setTimeout(hideLoader, 2500);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    $$('.reveal').forEach((el) => observer.observe(el));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('visible'));
  }

  const progress = $('#scrollProgress');
  const backTop = $('#backToTop');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    backTop?.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const target = new Date('2026-08-08T09:30:00+07:00').getTime();
  const ids = ['days', 'hours', 'minutes', 'seconds'];
  const updateCountdown = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      ids.forEach((id) => { const el = $('#' + id); if (el) el.textContent = '00'; });
      const message = $('#countdownMessage');
      if (message) message.textContent = '🎉 Hôm nay là ngày tốt nghiệp!';
      return;
    }
    const values = [
      Math.floor(diff / 86400000),
      Math.floor(diff / 3600000) % 24,
      Math.floor(diff / 60000) % 60,
      Math.floor(diff / 1000) % 60
    ];
    ids.forEach((id, i) => {
      const el = $('#' + id);
      if (el) el.textContent = String(values[i]).padStart(2, '0');
    });
  };
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const audio = $('#bgMusic');
  const player = $('#musicPlayer');
  const playBtn = $('#musicToggle');
  const muteBtn = $('#muteToggle');
  const openBtn = $('#openInvitation');
  const syncAudio = () => {
    if (playBtn && audio) playBtn.textContent = audio.paused ? '▶' : '❚❚';
    if (muteBtn && audio) muteBtn.textContent = audio.muted ? '🔇' : '🔊';
  };
  openBtn?.addEventListener('click', async () => {
    player?.classList.add('visible');
    try { await audio?.play(); } catch (error) { console.warn('Không thể tự phát nhạc:', error); }
    syncAudio();
    launchConfetti();
    $('#message')?.scrollIntoView({ behavior: 'smooth' });
  });
  playBtn?.addEventListener('click', async () => {
    if (!audio) return;
    if (audio.paused) await audio.play().catch(() => {}); else audio.pause();
    syncAudio();
  });
  muteBtn?.addEventListener('click', () => {
    if (!audio) return;
    audio.muted = !audio.muted;
    syncAudio();
  });
  audio?.addEventListener('play', syncAudio);
  audio?.addEventListener('pause', syncAudio);

  const lightbox = $('#lightbox');
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('locked');
  };
  $('#openLightbox')?.addEventListener('click', () => {
    if (!lightbox) return;
    lightbox.hidden = false;
    document.body.classList.add('locked');
  });
  $('#closeLightbox')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox();
  });

  function launchConfetti() {
    const canvas = $('#confettiCanvas');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ['#204098', '#ffffff', '#9fb0ef', '#f1d07a'];
    const pieceCount = window.innerWidth <= 640 ? 85 : 150;
    const pieces = Array.from({ length: pieceCount }, () => ({
      x: window.innerWidth / 2, y: window.innerHeight * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 11 - 4,
      g: 0.22, r: Math.random() * 6 + 3, a: 1,
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.25,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pieces.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += p.g; p.rot += p.vr; p.a -= 0.006;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.a); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore();
      });
      if (frame++ < 180) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
    draw();
  }

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrOJMIX2QZ8IdAkey5Dv7X1xzc4D55GRDMC8L43WvnVFFh-NLEb00V9Fk83Rx9Rq6F/exec';
  const rsvpForm = $('#rsvpForm');
  const submitRsvp = $('#submitRsvp');
  const formStatus = $('#formStatus');
  const messageInput = $('#guestMessage');
  const messageCount = $('#messageCount');

  messageInput?.addEventListener('input', () => {
    if (messageCount) messageCount.textContent = String(messageInput.value.length);
  });

  const setFieldError = (selector, message) => {
    const el = $(selector);
    if (el) el.textContent = message;
  };

  window.addEventListener('pageshow', hideLoader);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) hideLoader(); });

  rsvpForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFieldError('#nameError', '');
    setFieldError('#attendanceError', '');
    if (formStatus) { formStatus.textContent = ''; formStatus.className = 'form-status'; }

    const formData = new FormData(rsvpForm);
    const name = String(formData.get('name') || '').trim();
    const attendance = String(formData.get('attendance') || '').trim();
    const message = String(formData.get('message') || '').trim();
    const website = String(formData.get('website') || '').trim();

    let valid = true;
    if (name.length < 2) { setFieldError('#nameError', 'Bạn vui lòng nhập họ và tên.'); valid = false; }
    if (!attendance) { setFieldError('#attendanceError', 'Bạn vui lòng chọn một phương án.'); valid = false; }
    if (!valid || website) return;

    submitRsvp?.classList.add('loading');
    if (submitRsvp) submitRsvp.disabled = true;

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ name, attendance, message })
      });
      if (formStatus) {
        formStatus.textContent = 'Cảm ơn bạn! Mình đã nhận được xác nhận.';
        formStatus.className = 'form-status success';
      }
      rsvpForm.reset();
      if (messageCount) messageCount.textContent = '0';
      launchConfetti();
    } catch (error) {
      console.error('Lỗi gửi form:', error);
      if (formStatus) {
        formStatus.textContent = 'Không gửi được xác nhận. Bạn thử lại giúp mình nhé.';
        formStatus.className = 'form-status error';
      }
    } finally {
      submitRsvp?.classList.remove('loading');
      if (submitRsvp) submitRsvp.disabled = false;
    }
  });
})();
