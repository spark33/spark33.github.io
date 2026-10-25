# Offload job: copy the repo to <job>/site, copy this to <job>/run.sh, then `uv run python scripts/offload.py <job>` from the bot repo.
set -x
mkdir -p out/shots
TESTHASH=$(printf testkey | sha256sum | cut -d' ' -f1)
sed -i "s/PREVIEW_HASH = '[0-9a-f]*'/PREVIEW_HASH = '$TESTHASH'/" site/src/data/site.ts
cd site && npm install --no-audit --no-fund >../out/npm.txt 2>&1 && npx astro build >../out/build.txt 2>&1; echo "build=$?" >> ../out/summary.txt
(npm i -D --no-audit --no-fund @astrojs/check typescript >/dev/null 2>&1 && npx astro check >../out/check.txt 2>&1) || true
cd ..
(cd site/dist && python3 -m http.server 4321 >/dev/null 2>&1 &)
mkdir -p t && cd t && npm init -y >/dev/null && npm install --no-audit --no-fund puppeteer-core@23 >/dev/null 2>&1
cp ../site/tests/e2e.mjs test.mjs && H="$TESTHASH" node test.mjs > ../out/test.txt 2>&1; echo "test=$?" >> ../out/summary.txt; 
