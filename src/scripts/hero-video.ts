// Hero video controller.
//  - The poster <img> is the LCP element; the video source is attached only after the page has loaded.
//  - Autoplay is skipped for prefers-reduced-motion, Save-Data, prefers-reduced-data and slow (2G/3G) connections;
//    the poster stays and the button offers "Play".
//  - Playback pauses off-screen and in background tabs, and never resumes after a manual pause.
//  - Any media error hides the control and leaves the poster in place.

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: 'change', listener: () => void) => void;
}

export function initHeroVideo(root: HTMLElement): void {
  const video = root.querySelector<HTMLVideoElement>('[data-hero-video]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-hero-toggle]');
  if (!video || !toggle) return;

  const label = toggle.querySelector<HTMLElement>('[data-hero-label]')!;
  const pauseIcon = toggle.querySelector<HTMLElement>('[data-hero-icon="pause"]')!;
  const playIcon = toggle.querySelector<HTMLElement>('[data-hero-icon="play"]')!;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reducedData = window.matchMedia('(prefers-reduced-data: reduce)');
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;

  const constrainedNetwork = () =>
    connection?.saveData === true ||
    /(^|-)(2g|3g)$/.test(connection?.effectiveType ?? '') ||
    reducedData.matches;

  // Intent: what the visitor (or their preferences) want. Reality is reconciled in update().
  let wantPlay = !reducedMotion.matches && !constrainedNetwork();
  let userChose = false;
  let inView = true;
  let pageReady = document.readyState === 'complete';
  let failed = false;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  function attachSource(): void {
    if (video!.src) return;
    const mobile = window.matchMedia(video!.dataset.mobileQuery ?? '(max-width: 599.98px)').matches;
    video!.src = (mobile ? video!.dataset.srcMobile : video!.dataset.srcDesktop) ?? '';
    video!.preload = 'auto';
  }

  function render(): void {
    const playing = wantPlay && !failed;
    label.textContent = playing ? 'Pause background video' : 'Play background video';
    pauseIcon.hidden = !playing;
    playIcon.hidden = playing;
  }

  function update(): void {
    render();
    if (failed) return;
    const shouldPlay = wantPlay && inView && !document.hidden && (pageReady || userChose);
    if (shouldPlay) {
      attachSource();
      video!.play().catch((error: DOMException) => {
        // NotAllowedError: autoplay blocked (e.g. low-power mode). Keep the poster and offer Play.
        if (error.name === 'AbortError') return;
        wantPlay = false;
        render();
      });
    } else if (!video!.paused) {
      video!.pause();
    }
  }

  video.addEventListener('playing', () => root.classList.add('is-video-ready'));
  video.addEventListener('error', () => {
    failed = true;
    wantPlay = false;
    root.classList.remove('is-video-ready');
    root.classList.add('is-video-failed');
    toggle.hidden = true;
  });

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    userChose = true;
    wantPlay = !wantPlay;
    update();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => {
        inView = !!entry?.isIntersecting;
        update();
      },
      { threshold: 0.2 },
    ).observe(root);
  }
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && !userChose) wantPlay = false;
    update();
  });
  connection?.addEventListener?.('change', () => {
    if (constrainedNetwork() && !userChose && !video.src) {
      wantPlay = false;
      update();
    }
  });

  if (pageReady) render();
  else {
    render();
    window.addEventListener(
      'load',
      () => {
        pageReady = true;
        const start = () => update();
        if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1200 });
        else globalThis.setTimeout(start, 200);
      },
      { once: true },
    );
  }
  if (pageReady) update();
}
