function getMousePosition(e) {
  var mouseX = e.pageX;
  var mouseY = e.pageY;

  if (mouseX === undefined) {
    mouseX =
      e.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    mouseY =
      e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return { mouseX, mouseY };
}

function createTooltip() {
  const Tooltip = document.createElement("div");
  Tooltip.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.37 16.51"><path d="M12.87 16.51a.5.5 0 01-.5-.5v-2.26L9.84 11.2a1 1 0 01-.3-.73V8.79L4 8.76v1.57a1 1 0 01-.3.73L1 13.73V16a.5.5 0 01-.5.5.5.5 0 01-.5-.5v-2.25A1 1 0 01.3 13L3 10.35V8.79a1 1 0 011-1h5.5a1 1 0 011 1v1.68L13.07 13a1 1 0 01.3.73V16a.5.5 0 01-.5.51z" fill="#4e4d4d"/><path d="M10 6H3.48V3a.46.46 0 01.28-.43L9.2.05a.6.6 0 01.8.54z" fill="#F5CD05"/></svg>`;
  Tooltip.classList.add("dyn-tooltip");
  return Tooltip;
}

function showTooltip(e) {
  const { mouseX, mouseY } = getMousePosition(e);
  const element = document.getElementsByClassName("dyn-tooltip");
  element[0].setAttribute(
    "style",
    `display:block; top: ${mouseY}px; left: ${mouseX}px;`
  );
}

function hideTooltip() {
  const element = document.getElementsByClassName("dyn-tooltip");
  element[0].setAttribute("style", `display: none;`);
}

export { createTooltip, showTooltip, hideTooltip };
