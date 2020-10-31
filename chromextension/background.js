chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.includes("//s3.amazonaws.com/code.videosdr.com/videosdr")) {
      return {
        redirectUrl: "http://localhost:3000/client/videosdr.js"
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
