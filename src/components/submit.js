function createSubmitButton() {
  const SubmitButton = document.createElement("button");
  SubmitButton.innerHTML = `Send to Dynalist`;
  SubmitButton.classList.add("dyn-submit-button");
  return SubmitButton;
}

function sendHighlightsToDynalist() {
  const htmlHighlights = document.getElementsByClassName("dyn-highlight");

  const highlights = [];

  for (let highlight of htmlHighlights) {
    highlights.push(highlight.innerText);
  }

  console.log(highlights);
}

export { createSubmitButton, sendHighlightsToDynalist };
