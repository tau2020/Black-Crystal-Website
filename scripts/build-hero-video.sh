#!/usr/bin/env bash
# Reproducible hero video pipeline (see VIDEO_ASSET_LOG.md). Requires FFmpeg with libx264.
# Source (untouched, with audio): assets-source/video/hero-video-original.mp4
# Outputs: public/media/hero/hero-{desktop-1280x720,mobile-960x720}.mp4 and src/assets/images/hero/poster-*.png
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="assets-source/video/hero-video-original.mp4"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
COLOR=(-colorspace smpte170m -color_primaries bt709 -color_trc iec61966-2-1)

# 1. Seamless loop: S(1.0s..15s) with a 23-frame dissolve into S(0..0.96s); output frame 0 = S(1.0s),
#    last frame = S(0.958s), so the wrap is a natural consecutive-frame transition. Audio removed.
ffmpeg -v error -y -i "$SRC" -filter_complex \
  "[0:v]split=2[a][b];[a]trim=start=1.0:end=15.0,setpts=PTS-STARTPTS[main];[b]trim=start=0:end=1.0,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=0.958333:offset=13.041667,format=yuv420p[out]" \
  -map "[out]" -an -c:v libx264 -qp 0 -preset veryfast "${COLOR[@]}" "$WORK/loop.mp4"

# 2. Mobile master: 4:3 crop centred on the elephant (x=300).
ffmpeg -v error -y -i "$WORK/loop.mp4" -vf "crop=960:720:300:0" -an -c:v libx264 -qp 0 -preset veryfast "$WORK/mobile.mp4"

# 3. Delivery encodes. Zone boost keeps the dissolve frames at the same quality as frame 0.
encode() { # in out crf
  ffmpeg -v error -y -i "$1" -an -c:v libx264 -preset veryslow -tune film -crf "$3" \
    -x264-params "zones=308,336,b=3.0" -profile:v high -level:v 3.1 -pix_fmt yuv420p "${COLOR[@]}" \
    -movflags +faststart "$2"
}
mkdir -p public/media/hero src/assets/images/hero
encode "$WORK/loop.mp4" public/media/hero/hero-desktop-1280x720.mp4 24
encode "$WORK/mobile.mp4" public/media/hero/hero-mobile-960x720.mp4 26

# 4. Posters: frame 0 of each lossless master (identical to the first decoded video frame).
ffmpeg -v error -y -i "$WORK/loop.mp4" -frames:v 1 src/assets/images/hero/poster-desktop.png
ffmpeg -v error -y -i "$WORK/mobile.mp4" -frames:v 1 src/assets/images/hero/poster-mobile.png

ls -l public/media/hero src/assets/images/hero
