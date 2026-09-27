#!/usr/bin/env bash
#
# Regenerate the home-screen icons for /games/.
#
# Renders an inline SVG in headless Chromium and screenshots it, so no image
# library or design tool is needed. Re-run after editing the SVG below:
#
#     bash bin/make-games-icon.sh
#
# bin/ is listed under `exclude` in _config.yml, so this never ships to the site.
# The PNGs it writes to assets/games/ do.
set -euo pipefail

CHROME="${CHROME:-/opt/pw-browsers/chromium}"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/assets/games"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

if [[ ! -x "$CHROME" ]]; then
  echo "Chromium not found at $CHROME. Set CHROME=/path/to/chrome and retry." >&2
  exit 1
fi

# Four rounded tiles on a dark field: the launcher grid itself, which stays
# legible masked down to ~60px on a home screen. iOS applies its own corner
# mask, so the artwork is deliberately full-bleed square.
cat > "$WORK/icon.svg" <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b2230"/>
      <stop offset="1" stop-color="#0b0e13"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect x="84"  y="84"  width="150" height="150" rx="38" fill="#7aa2f7"/>
  <rect x="278" y="84"  width="150" height="150" rx="38" fill="#9ece6a"/>
  <rect x="84"  y="278" width="150" height="150" rx="38" fill="#e0af68"/>
  <rect x="278" y="278" width="150" height="150" rx="38" fill="#bb9af7"/>
</svg>
SVG

render() {
  local size="$1" out="$2"
  cat > "$WORK/page.html" <<HTML
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;width:${size}px;height:${size}px;overflow:hidden}
  img{display:block;width:${size}px;height:${size}px}
</style></head><body><img src="icon.svg" alt=""></body></html>
HTML

  "$CHROME" \
    --headless \
    --no-sandbox \
    --disable-gpu \
    --hide-scrollbars \
    --force-device-scale-factor=1 \
    --window-size="${size},${size}" \
    --screenshot="$out" \
    "file://$WORK/page.html" >/dev/null 2>&1

  echo "  $(basename "$out") — $(identify -format '%wx%h' "$out" 2>/dev/null || echo "${size}x${size}")"
}

mkdir -p "$OUT_DIR"
echo "Writing icons to $OUT_DIR"
render 512 "$OUT_DIR/icon-512.png"
render 180 "$OUT_DIR/icon-180.png"
echo "Done."
