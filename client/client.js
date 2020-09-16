(function(getVideoParamsUrl, projectId, movieName, videoElementId) {
  function applyParamsToVideo(params) {
    var player = fxplayer(videoElementId, {format: "hls"});
    player.projectid = projectId;
    player.movie = movieName;
    player.params = params;
    player.play();
  }
  function forEachElementOfClass(className, func) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; ++i) {
      func(elements[i]);
    }
  }
  function visitDescendantTextNodes(root, func) {
    for (var child = root.firstChild; child; child = child.nextSibling) {
      if (child.nodeType == 3 /* text */) {
        func(child);
      }
      else {
        visitDescendantTextNodes(child, func);
      }
    }
  }
  function applyParamsToText(params) {
    forEachElementOfClass("videosdr-when-loaded", function(ele) {
      visitDescendantTextNodes(ele, function(node) {
        node.nodeValue = Mustache.render(node.nodeValue, params);
      })
    })
    forEachElementOfClass("videosdr-while-loading", function(ele) {
      ele.style.display = "none";
    })
    forEachElementOfClass("videosdr-when-loaded", function(ele) {
      ele.style.visibility = "visible";
    })
  }
  function applyParams(params) {
    applyParamsToVideo(params);
    applyParamsToText(params);
  }
  var url = new URL(window.location.href);
  var key = url.searchParams.get("key");
  if (key) {
    var request = new XMLHttpRequest();
    request.open("GET", getVideoParamsUrl + "?key=" + key);
    request.send();
    request.onload = function() {
      if (request.status == 200) {
        var data = JSON.parse(request.response);
        if (data.Items && data.Items.length) {
          applyParams(data.Items[0]);
        }
      }
    }
  }
  else {
    applyParams({
      first_name: url.searchParams.get("first_name") || "",
      company: url.searchParams.get("company") || "",
      city: url.searchParams.get("city") || "",
      screenshot: url.searchParams.get("screenshot") || ""
    });
    history.replaceState("", "", location.origin + location.pathname);
  }
})(
  "https://almqm0z6kf.execute-api.us-east-1.amazonaws.com/live/getvideoparams",
  "76a79067-e3df-4acc-9fbc-2cddf8f19740",
  "final_product_demo",
  "my-video"
);
