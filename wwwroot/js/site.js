document.addEventListener('DOMContentLoaded', () => {
  const gridLayer = document.querySelector('.grid-layer');
  const contentLayer = document.querySelector('.content-layer');
  const recenterBtn = document.getElementById('recenterBtn');

  let isPanning = false;
  let startX = 0, startY = 0;
  let translateX = 0, translateY = 0;
  let scale = 1;

  // ---- Mouse pan ----
  contentLayer.addEventListener('mousedown', (e) => {
    isPanning = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => isPanning = false);

  // ---- Mouse wheel zoom ----
  contentLayer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 0.001;
    scale += e.deltaY * -zoomFactor;
    scale = Math.min(Math.max(0.2, scale), 5);
    updateTransform();
  });

  // ---- Touch pan & pinch zoom ----
  let lastTouchDistance = null;

  contentLayer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isPanning = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    } else if (e.touches.length === 2) {
      isPanning = false;
      lastTouchDistance = getTouchDistance(e.touches);
    }
  });

  contentLayer.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isPanning) {
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      updateTransform();
    } else if (e.touches.length === 2) {
      const newDistance = getTouchDistance(e.touches);
      const diff = newDistance - lastTouchDistance;
      const zoomFactor = 0.005;
      scale += diff * zoomFactor;
      scale = Math.min(Math.max(0.2, scale), 5);
      lastTouchDistance = newDistance;
      updateTransform();
    }
  });

  contentLayer.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) lastTouchDistance = null;
    if (e.touches.length === 0) isPanning = false;
  });

  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ---- Recenter ----
  recenterBtn.addEventListener('click', () => {
    translateX = 0;
    translateY = 0;
    scale = 1;
    updateTransform();
  });

  function updateTransform() {
    scale = Math.max(Math.min(scale, 5), 0.2);
    
    contentLayer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    contentLayer.style.transformOrigin = '0 0';
    
    gridLayer.style.backgroundPosition = `${translateX}px ${translateY}px`; // only pan grid, don't scale it

    const baseGridSize = 40;
    gridLayer.style.backgroundSize = `${baseGridSize * scale}px ${baseGridSize * scale}px`;
  }
});
