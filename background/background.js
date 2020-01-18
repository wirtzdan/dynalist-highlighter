console.log("Background Script Loaded!");

chrome.contextMenus.create({
  id: "launcher",
  title: "Hotkey",
  contexts: ["launcher"]
});

chrome.contextMenus.onClicked.addListener(({ menuItemId }, tab) => {
  if (menuItemId === "launcher") openHotkeyPage();
});

function openHotkeyPage() {
  console.log("Fired!");
  var newURL = "chrome://extensions/shortcuts";
  chrome.tabs.create({ url: newURL });
}

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
