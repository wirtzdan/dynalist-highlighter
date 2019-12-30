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
  Tooltip.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.37 16.51"><path d="M12.87 16.51a.5.5 0 01-.5-.5v-2.26L9.84 11.2a1 1 0 01-.3-.73V8.79L4 8.76v1.57a1 1 0 01-.3.73L1 13.73V16a.5.5 0 01-.5.5.5.5 0 01-.5-.5v-2.25A1 1 0 01.3 13L3 10.35V8.79a1 1 0 011-1h5.5a1 1 0 011 1v1.68L13.07 13a1 1 0 01.3.73V16a.5.5 0 01-.5.51z" fill="#4e4d4d"/><path d="M10 6H3.48V3a.46.46 0 01.28-.43L9.2.05a.6.6 0 01.8.54z" fill="#FFD43B"/></svg>`;
  Tooltip.classList.add("dyn-tooltip");
  return Tooltip;
}

function createOptionTooltip() {
  const OptionTooltip = document.createElement("div");
  OptionTooltip.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-trash-2" viewBox="0 0 24 24">
  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
</svg>`;
  OptionTooltip.classList.add("dyn-tooltip-options");
  return OptionTooltip;
}

function showOptions(e) {
  const { mouseX, mouseY } = getMousePosition(e);
  const element = document.getElementsByClassName("dyn-tooltip-options");
  element[0].setAttribute(
    "style",
    `display:block; top: ${mouseY - 45}px; left: ${mouseX - 15}px;`
  );
}

function hideOptions(e) {
  const element = document.getElementsByClassName("dyn-tooltip-options");
  element[0].setAttribute("style", `display: none;`);
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

export {
  createTooltip,
  showTooltip,
  hideTooltip,
  createOptionTooltip,
  showOptions,
  hideOptions
};
