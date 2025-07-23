document.addEventListener('DOMContentLoaded', () => {
  // ===================== 🧩 Constants & State =====================
  const ZOOM_SENSITIVITY = 0.001;
  const MAX_SCALE = 5;
  const MIN_SCALE = 0.2;

  const gridLayer = document.querySelector('.grid-layer');
  const contentLayer = document.querySelector('.content-layer');
  const blueprintImage = document.querySelector('.blueprint-img');
  const recenterBtn = document.getElementById('recenterBtn');
  const crosshair = document.querySelector('.crosshair');
  const crossX = document.querySelector('.crosshair-horizontal');
  const crossY = document.querySelector('.crosshair-vertical');
  const activateBtn = document.getElementById('activateCrosshairBtn');
  const cancelBtn = document.getElementById('cancelCrosshairBtn');
  const form = document.querySelector('form[asp-action="UpdateInfo"]');

  let scale = 1;
  let isPanning = false;
  let isDraggingCrosshair = false;
  let crosshairActive = false;
  let hasSavedPins = false;
  let isTouchInput = false;
  let crosshairX = window.innerWidth / 2;
  let crosshairY = window.innerHeight / 2;
  let startX = 0, startY = 0;
  let translateX = 0, translateY = 0;
  let lastTouchDistance = null;
  let lastTouch = { x: 0, y: 0 };
  let pendingPins = [];

  crosshair.style.display = 'none';

  // ---- Mouse pan ----
  contentLayer.addEventListener('mousedown', (e) => {
    isTouchInput = false;
    if (crosshairActive) {
      isDraggingCrosshair = true;
      startX = e.clientX - crosshairX;
      startY = e.clientY - crosshairY;
    } else {
      isPanning = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (isTouchInput) return; // ignore mousemove if touch was used recently
    if (crosshairActive) {
      updateCrosshairPosition(e.clientX, e.clientY);
    } else if (isPanning) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateTransform();
    }
  });

  window.addEventListener('mouseup', () => {
    isDraggingCrosshair = false;
    isPanning = false;
  });

  // ---- Mouse wheel zoom ----
  contentLayer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 0.001;
    scale += e.deltaY * -zoomFactor;
    scale = Math.min(Math.max(0.2, scale), 5);
    updateTransform();
  });

  // ---- Touch pan & pinch zoom ----
  contentLayer.addEventListener('touchstart', (e) => {
    isTouchInput = true;
    if (crosshairActive && e.touches.length === 1) {
      isDraggingCrosshair = true;
      lastTouch.x = e.touches[0].clientX;
      lastTouch.y = e.touches[0].clientY;
    } else if (e.touches.length === 1) {
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
      if (crosshairActive && isDraggingCrosshair && e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastTouch.x;
      const dy = e.touches[0].clientY - lastTouch.y;
      crosshairX += dx;
      crosshairY += dy;
      lastTouch.x = e.touches[0].clientX;
      lastTouch.y = e.touches[0].clientY;
      updateCrosshairPosition(crosshairX, crosshairY);
    } else if (e.touches.length === 1 && isPanning) {
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
    if (e.touches.length === 0){
      isDraggingCrosshair = false;
      isPanning = false;
    }
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

  function updateCrosshairPosition(x, y) {
    const canvasRect = document.querySelector('.editor-canvas').getBoundingClientRect();
    const offsetX = x - canvasRect.left;
    const offsetY = y - canvasRect.top;
    crossX.style.top = `${offsetY}px`;
    crossY.style.left = `${offsetX}px`;
  }

  function getImageRelativeCoordinates(x, y) {
    const canvasRect = contentLayer.getBoundingClientRect();
    
    const imageCenterX = canvasRect.left + canvasRect.width / 2 + translateX;
    const imageCenterY = canvasRect.top + canvasRect.height / 2 + translateY;

    const offsetX = (x - imageCenterX) / scale;
    const offsetY = (y - imageCenterY) / scale;

    return { x: offsetX, y: offsetY };
  }

  document.getElementById('cancelCrosshairBtn').addEventListener('click', () => {
    crosshairActive = false;
    crosshair.style.display = 'none';
    isDraggingCrosshair = false;
    isPanning = false;
  });

  activateBtn.addEventListener('click', () => {
    crosshairActive = true;
    crosshair.style.display = 'block';
    cancelBtn.style.display = 'inline-block'; // show cancel
    isPanning = false;

    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;

    crosshairX = x;
    crosshairY = y;
    updateCrosshairPosition(x, y);
  });

  cancelBtn.addEventListener('click', () => {
    crosshairActive = false;
    crosshair.style.display = 'none';
    cancelBtn.style.display = 'none'; // hide cancel
    isDraggingCrosshair = false;
    isPanning = false;
  });

  contentLayer.addEventListener('click', (e) => {
    if (!crosshairActive) return;

    console.log(`Crosshair screen: (${crosshairX}, ${crosshairY})`);
    const { x: relX, y: relY } = getImageRelativeCoordinates(crosshairX, crosshairY);
    console.log(`Pin image-relative: (${relX.toFixed(2)}, ${relY.toFixed(2)})`);
    
    const pin = { x: relX, y: relY };
    renderPin(pin);
    pendingPins.push(pin);

    // Deactivate crosshair just like cancel button
    crosshairActive = false;
    crosshair.style.display = 'none';
    cancelBtn.style.display = 'none';
  });

  function renderPin(pinData) {
    const { x, y } = pinData;

    const canvasWidth = contentLayer.getBoundingClientRect().width;
    const canvasHeight = contentLayer.getBoundingClientRect().height;

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const el = document.createElement('div');
    el.className = 'pin-marker';
    el.style.position = 'absolute';
    el.style.left = `${centerX + x * scale}px`;
    el.style.top = `${centerY + y * scale}px`;
    el.innerHTML = '📍'; // Or use a styled circle/button/icon
    el.dataset.relX = x;
    el.dataset.relY = y;

    contentLayer.appendChild(el);
  }

  form.addEventListener('submit', function (e) {
    if (hasSavedPins || pendingPins.length === 0) return;

    const blueprintId = parseInt(form.querySelector('input[name="Id"]').value);

    const payload = pendingPins.map(pin => ({
      x: pin.x,
      y: pin.y,
      label: pin.label || "",
      description: pin.description || "",
      blueprintId
    }));

    // Delay a bit to let the form POST happen first
    setTimeout(() => {
      fetch('/Blueprint/SavePins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save pins');
        console.log('✅ Pins saved to DB');
        pendingPins.length = 0;  // Clear pin list
        hasSavedPins = true;     // Prevent double-saving
      })
      .catch(err => {
        console.error('❌ Failed to save pins:', err);
      });
    }, 500);
  });


});
