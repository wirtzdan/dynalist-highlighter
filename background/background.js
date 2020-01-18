console.log("Background Script Loaded!");

function activateExtension() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(
    tabs,
    sender
  ) {
    chrome.tabs.sendMessage(tabs[0].id, { msg: "activate" }, function(
      response
    ) {
      console.log(response);
    });
  });
}

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.executeScript(
    null,
    { file: "content-script.js" },
    activateExtension
  );
});
