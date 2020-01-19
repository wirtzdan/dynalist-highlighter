function toggleKeyVisibility() {
  var x = document.getElementById("key");
  if (x.type === "password") {
    x.type = "textbox";
  } else {
    x.type = "password";
  }
}

function toggleFilePickerVisbility() {
  var x = document.getElementById("sectioninbox");
  x.style.display = "block";
  /*   if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  } */
}

function updateSelect(files) {
  var x = document.getElementById("inboxselect");
  let options = "";
  for (const file of files) {
    const option = `<option value="${file.id}">${file.title}</option>`;
    options = options + option;
  }

  x.innerHTML = options;
}

function handleSelect() {
  var el = document.getElementById("inboxselect");
  var value = el.options[el.selectedIndex].value;
  console.log("TCL: handleSelect -> value", value);

  chrome.storage.sync.set(
    {
      fileid: value
    },
    function() {
      var status = document.getElementById("status");
      status.textContent = "File ID updated";
      setTimeout(function() {
        status.textContent = "";
      }, 3000);
    }
  );
}

function updateSelect(files) {
  console.log("TCL: updateSelect -> files", files);
  var x = document.getElementById("inboxselect");

  let options = "";

  for (const file of files) {
    const option = `<option value="${file.id}">${file.title}</option>`;
    options = options + option;
  }

  x.innerHTML = options;
  x.value = "rzziRHrgExreMYh88rvrwOft";
}

async function getFiles(key) {
  const response = await fetch("https://dynalist.io/api/v1/file/list", {
    method: "POST",
    body: JSON.stringify({
      token: key
    })
  });

  const body = await response.json();

  chrome.storage.sync.set({
    files: body.files
  });

  updateSelect(body.files);
}

function save_key() {
  var key = document.getElementById("key").value;

  chrome.storage.sync.set(
    {
      key: key
    },

    function() {
      var status = document.getElementById("status");
      status.textContent = "Key saved and hidden. ";
      setTimeout(function() {
        status.textContent = "";
      }, 3000);
      toggleKeyVisibility();
      toggleFilePickerVisbility();
      getFiles(key);
    }
  );
}

function restore_options() {
  chrome.storage.sync.get(["key", "files", "fileid"], function(result) {
    console.log("TCL: functionrestore_options -> Google Storage:", result);
    const { key } = result;

    if (!key) {
    } else {
      toggleFilePickerVisbility();
      getFiles(key);
      document.getElementById("key").value = items.key;
    }
  });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save-key").addEventListener("click", save_key);
document.getElementById("save-inbox").addEventListener("click", handleSelect);
