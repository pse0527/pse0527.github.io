  // ── 카카오 공유 SDK ──
  // ★ Kakao Developers(developers.kakao.com)에서 JavaScript 키 발급 후 아래에 입력
  const KAKAO_JS_KEY = ''; // ← 여기에 입력

  (function initKakao() {
    if (typeof Kakao !== 'undefined' && KAKAO_JS_KEY && !Kakao.isInitialized()) {
      Kakao.init(KAKAO_JS_KEY);
    }
  })();


  // ── 인트로: 한 글자씩 수기 효과 ──
  document.body.style.overflow = 'hidden';
  const introMain = document.getElementById('intro-main');
  const introSub  = document.getElementById('intro-sub');
  const introOverlay = document.getElementById('intro-overlay');
  const text = '저희 결혼합니다.';
  const charDelay = 120; // 글자당 ms

  text.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'intro-char';
    span.textContent = ch === ' ' ? ' ' : ch;
    span.style.animationDelay = (i * charDelay) + 'ms';
    introMain.appendChild(span);
  });

  // sub 라인: 메인 끝난 후 등장
  const subDelay = text.length * charDelay + 200;
  introSub.style.animationDelay = subDelay + 'ms';

  // 전체 인트로 종료
  const totalDuration = subDelay + 900 + 700;
  setTimeout(() => {
    introOverlay.style.animation = 'introOut 0.7s ease forwards';
    setTimeout(() => {
      introOverlay.remove();
      document.body.style.overflow = '';
    }, 700);
  }, subDelay + 1200);

  // ── PC 차단 (개발 중 주석 처리 / 배포 시 아래 주석 해제) ──
  // function isMobile() {
  //   return /Android|iPhone|iPad|iPod|Mobile|BlackBerry|Windows Phone/i.test(navigator.userAgent)
  //     || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  // }
  // if (!isMobile()) {
  //   document.body.innerHTML = `
  //     <div style="
  //       min-height:100vh; display:flex; flex-direction:column;
  //       align-items:center; justify-content:center;
  //       background:#2C2820; color:#F5EDD8; font-family:'Noto Serif KR',serif;
  //       text-align:center; padding:40px;
  //     ">
  //       <div style="font-family:'Cormorant Garamond',serif; font-size:11px; letter-spacing:0.45em; color:#B8975A; margin-bottom:32px; text-transform:uppercase;">Wedding Invitation</div>
  //       <div style="font-family:'Cormorant Garamond',serif; font-size:42px; font-style:italic; font-weight:300; color:#F5EDD8; line-height:1.2; margin-bottom:10px;">Sangeon <span style="color:#B8975A;">&</span> Miji</div>
  //       <div style="width:40px; height:1px; background:#B8975A; margin:28px auto; opacity:0.6;"></div>
  //       <div style="font-weight:300; font-size:15px; color:rgba(245,237,216,0.65); line-height:2.2; word-break:keep-all;">
  //         모바일에서만 열람 가능한 청첩장입니다.<br>
  //         카카오톡 또는 스마트폰 브라우저로 접속해 주세요.
  //       </div>
  //       <div style="margin-top:32px; font-family:'Cormorant Garamond',serif; font-size:12px; letter-spacing:0.25em; color:rgba(184,151,90,0.5);">2026 · 10 · 17</div>
  //     </div>`;
  // }

  // ── 카운트다운 타이머 ──
  function updateCountdown() {
    const weddingDate = new Date('2026-10-17T14:00:00');
    const now = new Date();
    const gap = weddingDate - now;
    if (gap <= 0) {
      ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const days  = Math.floor(gap / (1000 * 60 * 60 * 24));
    const hours = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((gap % (1000 * 60)) / 1000);
    const fmt = n => String(n).padStart(2, '0');
    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    const sEl = document.getElementById('cd-secs');
    if (dEl) dEl.textContent = days;
    if (hEl) hEl.textContent = fmt(hours);
    if (mEl) mEl.textContent = fmt(mins);
    if (sEl) sEl.textContent = fmt(secs);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ── 계좌번호 복사 ──
  function copyAccount(num, btn) {
    navigator.clipboard.writeText(num).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    }).catch(() => {
      alert('계좌번호: ' + num);
    });
  }

  // ── 카카오 공유 ──
  function shareKakao() {
    if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '박상언 ♥ 권미지 결혼식에 초대합니다',
          description: '2026년 10월 17일 오후 2시 · 원주 인터불고',
          imageUrl: '',
          link: { mobileWebUrl: window.location.href, webUrl: window.location.href }
        }
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('링크가 복사되었습니다!\n카카오톡에 붙여넣기 해주세요 😊');
      });
    }
  }

  // ── 사진 확대 방지 ──
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('gesturechange', e => e.preventDefault());
  document.addEventListener('gestureend', e => e.preventDefault());
  let lastTouchEnd = 0;
  document.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });

  // ── BGM ──
  const BGM_SRC = 'bgm.mp3';
  let audio = null;
  let bgmPlaying = true; // 디폴트: 켜진 상태
  const bgmBtn = document.getElementById('bgm-btn');

  // 페이지 로드 시 켜진 상태(♬) 로 시작
  bgmBtn.classList.add('playing');

  // BGM 파일 있으면 자동 재생 시도
  if (BGM_SRC) {
    audio = new Audio(BGM_SRC);
    audio.loop = true;
    audio.volume = 0.4;
    audio.play().catch(() => {
      // 자동재생 차단 시 버튼은 켜진 상태 유지, 첫 터치 시 재생
      document.addEventListener('touchstart', function startBgm() {
        audio.play().catch(() => {});
        document.removeEventListener('touchstart', startBgm);
      }, { once: true });
    });
  }

  function toggleBgm() {
    bgmPlaying = !bgmPlaying;
    if (bgmPlaying) {
      bgmBtn.classList.add('playing');
      if (audio) audio.play().catch(() => {});
    } else {
      bgmBtn.classList.remove('playing');
      if (audio) audio.pause();
    }
  }

  // ── 갤러리 캐러셀 ──
  // images/ 폴더의 파일을 이름순으로 자동 로드
  // 사진 파일명을 여기에 추가하면 자동 반영됩니다
  // GitHub images/ 폴더에 업로드 후 파일명만 추가
  const GALLERY_IMAGES = [
    // 예: 'images/photo01.jpg',
    // 예: 'images/photo02.jpg',
  ];

  let gCurrent = 0;
  const track = document.getElementById('gallery-track');
  const counterCur = document.querySelector('#gallery-counter .cur');
  const counterTotal = document.getElementById('gallery-total');

  function buildGallery() {
    track.innerHTML = '';
    const imgs = GALLERY_IMAGES.length > 0 ? GALLERY_IMAGES : [];
    const total = imgs.length || 1;
    counterTotal.textContent = imgs.length || 0;
    counterCur.textContent = imgs.length ? gCurrent + 1 : 0;

    if (imgs.length === 0) {
      const el = document.createElement('div');
      el.className = 'gallery-slide empty pos-0';
      el.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4B483" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><span>사진을 준비 중입니다</span>';
      track.appendChild(el);
      return;
    }

    imgs.forEach((src, i) => {
      const el = document.createElement('div');
      el.className = 'gallery-slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = '웨딩 사진 ' + (i + 1);
      el.appendChild(img);
      el.addEventListener('click', () => { if (i !== gCurrent) { gCurrent = i; renderGallery(); } });
      track.appendChild(el);
    });
    renderGallery();
  }

  function renderGallery() {
    if (!GALLERY_IMAGES.length) return;
    const slides = track.querySelectorAll('.gallery-slide');
    const total = slides.length;
    counterCur.textContent = gCurrent + 1;
    counterTotal.textContent = total;
    slides.forEach((slide, i) => {
      slide.className = 'gallery-slide';
      const diff = i - gCurrent;
      if (diff === 0) slide.classList.add('pos-0');
      else if (diff === 1 || diff === -(total - 1)) slide.classList.add('pos-1');
      else if (diff === -1 || diff === total - 1) slide.classList.add('pos-m1');
      else if (diff > 1) slide.classList.add('pos-far');
      else slide.classList.add('pos-mfar');
    });
  }

  function goPrev() {
    if (!GALLERY_IMAGES.length) return;
    gCurrent = (gCurrent - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    renderGallery();
  }
  function goNext() {
    if (!GALLERY_IMAGES.length) return;
    gCurrent = (gCurrent + 1) % GALLERY_IMAGES.length;
    renderGallery();
  }

  document.getElementById('gallery-prev').addEventListener('click', goPrev);
  document.getElementById('gallery-next').addEventListener('click', goNext);

  // 스와이프
  let tsX = 0;
  track.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tsX;
    if (Math.abs(dx) > 40) { dx < 0 ? goNext() : goPrev(); }
  }, { passive: true });

  buildGallery();

</script>

  <script charset="UTF-8" class="daum_roughmap_loader_script"
    src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js">
  </script>
  <script charset="UTF-8">
    new daum.roughmap.Lander({
      timestamp : '1768478023932',
      key       : '2y3ok',
      mapWidth  : '100%',
      mapHeight : '300',
      title     : '호텔인터불고원주 컨벤션호텔',
      address   : '강원특별자치도 원주시 동부순환로 200',
      addressType: 'road'
    }).render();
  