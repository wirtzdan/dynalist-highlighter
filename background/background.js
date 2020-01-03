console.log("Background Script Loaded!");

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.insertCSS({ file: "./static/css/content-script.css" });
  chrome.tabs.executeScript(null, { file: "content-script.js" });

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
});
