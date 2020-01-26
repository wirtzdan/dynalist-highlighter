// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: "clicked_browser_action"
    });
  });
});

chrome.runtime.onInstalled.addListener(function(object) {
  chrome.tabs.create({
    url: "https://dynalist-highlighter.danielwirtz.com/install/"
  });
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.insertCSS({ file: "/static/css/app.css" });
  chrome.tabs.executeScript(
    null,
    { file: "/static/js/content.js" },
    activateExtension
  );
});

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
