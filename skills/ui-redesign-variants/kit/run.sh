# Run the kit's browser tools (needs Node 18+ and Chrome or Chromium). Uncomment the lines you need.
set -uo pipefail
# Hangul (or other CJK) in captures renders as boxes without CJK fonts; on Debian/Ubuntu:
# sudo apt-get install -y -qq fonts-noto-cjk
[ -d node_modules/playwright ] || npm i --no-audit --no-fund --loglevel=error playwright@1
npx playwright install chromium >/dev/null 2>&1 || true
mkdir -p out
status=0

# node tools/capture.mjs refs.json || status=1                                   # references + current app
# node tools/shot.mjs --sizes 1440x900,1280x800 pages/*/*.html || status=1       # every variant
# node tools/shot.mjs pages/list/a-x.html#menu-open || status=1                  # key interaction states
# node tools/probe.mjs --sizes 1280x800 pages/*/*.html || status=1               # red-team numbers

exit $status
