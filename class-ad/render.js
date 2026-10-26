const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const [,, mode, out] = process.argv; // mode: "frames:1,5,10" or "video"
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve('ad.html'));
  await p.evaluate(async () => { for (const w of [400,500,700,800,900]) await document.fonts.load(`${w} 40px P`, '가나다ABC'); await document.fonts.ready; });
  if (mode.startsWith('frames:')) {
    for (const t of mode.slice(7).split(',').map(Number)) {
      await p.evaluate(t => render(t), t);
      await p.screenshot({ path: `${out}/f_${t}.png` });
    }
  } else {
    const fps = 30, dur = await p.evaluate(() => DURATION);
    const ff = spawn('ffmpeg', ['-y','-f','image2pipe','-framerate',String(fps),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-preset','medium','-movflags','+faststart',out], { stdio: ['pipe','ignore','inherit'] });
    for (let i = 0; i < dur * fps; i++) {
      await p.evaluate(t => render(t), i / fps);
      const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
