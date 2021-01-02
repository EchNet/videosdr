chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes("//s3.amazonaws.com/code.videosdr.com/")) {
      var scripts = [ "videosdr", "optin" ];
      for (var i = 0; i < scripts.length; ++i) {
        if (details.url.includes("/" + scripts[i])) {
          return {
            redirectUrl: "http://localhost:3000/client/" + scripts[i] + ".js"
          }
        }
      }
    }
  },
  {
    urls: ["<all_urls>"]
  },
  [
    "blocking"
  ]
)
