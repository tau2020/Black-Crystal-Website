# Hero video asset log

**Approved footage:** `Website Assets — Hybrid Design/hero-video.mp4` (Google Drive). It shows a sleeping elephant at the right of frame and a warm sunset on the left. **No new video was generated.** All processing is local FFmpeg 9.0.2 (libx264) and reproducible with `npm run video:build` (`scripts/build-hero-video.sh`).

## 1. Source inspection

| Property         | Value                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Container / size | MP4 (isom), 5,986,870 bytes, encoder tag "Google"                                                                                                 |
| Video            | H.264 High @ L3.1, 1280×720, 24 fps, 360 frames, 15.000 s, ~3.04 Mbps                                                                             |
| Colour tags      | matrix smpte170m, primaries bt709, transfer iec61966-2-1. **Preserved** on every derivative so browsers convert colours identically               |
| Audio            | AAC-LC stereo 48 kHz, 128 kbps, 15.02 s. **Removed** from the derivatives; the original is kept untouched in `assets-source/video/`               |
| Composition      | Elephant across x ≈ 45–100%, eye at about (800, 373) in source pixels; sun at the far left on the horizon; the left 40% is open sky and landscape |
| Motion           | Natural and calm: trunk shift around 1.5 s, ear flap around 3–4.5 s. No camera movement (phase correlation of first and last frames: 0,0 px)      |

## 2. Loop quality

Measured as the mean absolute RGB difference at 320×180 between consecutive frames.

| Measurement                                       | Value                                                                                                                   |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Natural frame-to-frame change: median / p95 / max | 0.35 / 1.18 / 1.79                                                                                                      |
| **Original loop seam** (last frame → first frame) | **5.30**, which is 15× the median and a visible jump. The cause is cloud drift and a slight change in breathing posture |

**Treatment.** A crossfade loop was used. Output = source 1.0–15.0 s, with the final 23 frames dissolving into source 0.0–0.96 s (`xfade=fade`).

- Output frame 0 is source t = 1.000 s; the output's last frame is source t = 0.958 s.
- The loop boundary is therefore a genuine consecutive-frame transition of the original.
- Nothing in the scene was altered, retimed or added.

| Result               | Value                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| Seam after treatment | **0.70**, the same as the source's own natural change at that point (0.69)                          |
| Duration             | 14.04 s (337 frames)                                                                                |
| Ghosting check       | 100% crops at 25%, 50% and 75% through the dissolve: skin texture stays crisp, with no double image |

## 3. Encoding ladder (desktop, 1280×720)

Encoded with x264 `veryslow`, `tune film`, High profile @ L3.1, yuv420p and `+faststart`. VMAF (v0.6.1) was measured against the lossless loop master.

| CRF    | Size    | Bitrate    | VMAF mean | VMAF min |
| ------ | ------- | ---------- | --------- | -------- |
| 20     | 3.88 MB | 2,320 kbps | 95.9      | 89.2     |
| 22     | 2.86 MB | 1,711 kbps | 95.0      | 86.6     |
| **24** | 2.04 MB | 1,218 kbps | 93.9      | 83.4     |
| 26     | 1.43 MB | 853 kbps   | 92.5      | 80.0     |
| 28     | 0.99 MB | 593 kbps   | 90.6      | 76.9     |

- **CRF 24 was chosen.** At 100% on the worst frame it keeps the wrinkle and skin texture; CRF 26 visibly softens it.
- The worst frames were the dissolve itself (VMAF fell to 83 on the final frame), because blended frames are expensive for motion-compensated coding. A dip right before the jump back to a sharp keyframe would cause a "texture pop".
- **Fix:** an x264 zone gives the dissolve frames 3× the bitrate (`zones=308,336,b=3.0`). The final frame now scores **94.5, identical to frame 0**.

## 4. Delivered derivatives

| File                                          | Picture                                       | Encode                 | Size                                    | Quality                                 |
| --------------------------------------------- | --------------------------------------------- | ---------------------- | --------------------------------------- | --------------------------------------- |
| `public/media/hero/hero-desktop-1280x720.mp4` | 1280×720 (native; not upscaled)               | CRF 24 + dissolve zone | **2,627,636 B** (−56% vs. the original) | VMAF 94.4 mean, last frame 94.5         |
| `public/media/hero/hero-mobile-960x720.mp4`   | 960×720 crop at x = 300 (face, trunk and ear) | CRF 26 + dissolve zone | **1,534,336 B**                         | VMAF (phone model) 100.0 mean, 99.2 min |

- **Why a mobile derivative:** below 900px the hero shows the elephant in a 4:3–16:10 block. Phones would download pixels they then crop away, so the crop saves about 1.1 MB per phone visit at equal perceived quality.
- **Why no AV1 or WebM:** H.264 is hardware-decoded on effectively every device (lowest CPU and battery cost), and the files are already modest. Extra encodings would add maintenance without a measurable benefit at this size.
- **Posters:** frame 0 of each lossless master (`src/assets/images/hero/poster-*.png`), delivered by Astro as AVIF/WebP:
  - Desktop: AVIF 87.8 KB / WebP 116.7 KB.
  - Mobile: AVIF 38.7 KB (640w) and 68.4 KB (960w).
  - Poster vs. first decoded video frame: mean difference 2.8/255 (compression noise only), so there is no visible composition change when the video takes over.

## 5. Playback behaviour (`src/scripts/hero-video.ts`)

- **No `src` in the HTML.** The poster `<img>` (`fetchpriority="high"`) is the LCP element. The video source is attached after `window.load` plus an idle callback, so it never competes with first render.
- **Autoplay** is via `play()`. The video is `muted`, `loop`, `playsinline`, has no controls, `disablepictureinpicture` and `disableremoteplayback`, and is `aria-hidden` (decorative).
- **No autoplay** under `prefers-reduced-motion`, `prefers-reduced-data`, Save-Data, or 2G/3G `effectiveType`. The poster stays and the button offers "Play background video".
- The video **pauses when less than 20% visible** (IntersectionObserver) **and when the tab is hidden**. It resumes only if the visitor has not paused it.
- **Manual pause is respected:** scrolling away and back, or switching tabs, never restarts it.
- **The pause/play button** has a 44×44 target and a stateful label ("Pause background video" / "Play background video"). It sits above the copy layer.
- **Failure-safe:** a media error hides the button and leaves the poster. If autoplay is blocked (`NotAllowedError`, e.g. low-power mode), the poster stays and "Play" is offered.
- **Without JavaScript,** the poster is shown and nothing is downloaded.
- **Framing:**
  - ≥ 1200px: copy over a left-to-right shade, elephant on the right.
  - 900–1199px: narrower copy column.
  - Below 900px: media first, then copy on a dark panel (no text over the elephant).
  - Below 600px: the 4:3 mobile crop.
  - The contour rings sit bottom-right at 28% opacity, clear of the eye and face.

## 6. Verification (local, Google Chrome 156 via Playwright)

| Check                                                                                                          | Result                                                        |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Plays muted and looped, correct derivative per viewport                                                        | ✓ (`tests/e2e/home.spec.ts`)                                  |
| Manual pause survives scrolling away and back                                                                  | ✓                                                             |
| Pauses off-screen                                                                                              | ✓                                                             |
| Reduced motion: **zero** `.mp4` requests, poster shown, Play offered                                           | ✓                                                             |
| Four consecutive loops in a live browser: `currentTime` wraps 14.04→1.56, 13.74→1.43, 13.01→0.69 with no stall | ✓                                                             |
| Range requests                                                                                                 | `206 Partial Content`, no compression applied to video        |
| Lighthouse with the video loading                                                                              | Desktop home 100; mobile home 98 (LCP 2.4 s, TBT 0 ms, CLS 0) |

**Limitation, reported honestly.** In this automated Chrome environment, `getVideoPlaybackQuality()` reports about 50% dropped frames. The figure is identical for the site and for **a bare `<video>` of the same file in Chrome's own viewer**, and unchanged when every overlay is removed. That indicates an environment artifact (most likely the automated window being occluded, which makes Chrome throttle compositing) rather than a cost of the page. **Please confirm smoothness by eye** on your own devices during review.
