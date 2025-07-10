document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.infinite-grid');
  const recenterBtn = document.getElementById('recenterBtn');

  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;

  // Drag to pan
  grid.addEventListener('mousedown', (e) => {
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

  window.addEventListener('mouseup', () => {
    isPanning = false;
  });

  // Wheel to zoom
  grid.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 0.001;
    scale += e.deltaY * -zoomFactor;
    scale = Math.min(Math.max(0.2, scale), 5); // Clamp
    updateTransform();
  });

  // Recenter
  recenterBtn.addEventListener('click', () => {
    translateX = 0;
    translateY = 0;
    scale = 1;
    updateTransform();
  });

  function updateTransform() {
    grid.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    grid.style.transformOrigin = '0 0'; // so it zooms from top-left
  }
});
