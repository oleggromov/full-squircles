
(async function() {
  if ('paintWorklet' in window.CSS) {
    await (window.CSS as any).paintWorklet.addModule('/src/squircle.js');
    document.body.classList.add('squircles-on');
  }
})()
