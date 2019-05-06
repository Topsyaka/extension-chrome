chrome.runtime.onMessage.addListener(function (msg, sender) {
  // First, validate the message's structure
  chrome.runtime.sendMessage({html: document.body.innerHTML}, function(response) {
    console.log(response.farewell);
  });
});