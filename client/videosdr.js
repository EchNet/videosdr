(function() {
  // Polyfill for document.currentScript:
  document.currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  // Get options.
  const options = (function(defaultOptions) {
    const options = {};
    for (var key in defaultOptions) {
      options[key] = document.currentScript.getAttribute(key) || defaultOptions[key];
    }
    return options;
  })({
    getVideoParamsUrl: "https://almqm0z6kf.execute-api.us-east-1.amazonaws.com/live/getvideoparams",
    projectId: "76a79067-e3df-4acc-9fbc-2cddf8f19740",
    movieName: "final_product_demo",
    videoElementId: "my-video"
  });

  // Create required styles.
  (function() {
    var stylesheet = document.createElement("style");
    stylesheet.innerHTML = ".videosdr-when-loaded { visibility: hidden; }";
    document.head.appendChild(stylesheet);
  })();

  // Bring in required Javascripts.
  (function(sources) {
    for (var i in sources) {
      var script = document.createElement("script")
      script.src = sources[i];
      document.head.appendChild(script)
    }
  })([
    "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js",
    "https://cdn.impossible.io/support/fxplayer.js"
  ])

  // DOM utility.
  function forEachElementOfClass(className, func) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; ++i) {
      func(elements[i]);
    }
  }

  // DOM utility.
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

  function applyParams(params) {
    if (params) {
      // Apply params to video.
      var player = fxplayer(options.videoElementId, {format: "hls"});
      player.projectid = options.projectId;
      player.movie = options.movieName;
      player.params = params;
      player.play();

      // Apply params to page text.
      forEachElementOfClass("videosdr-when-loaded", function(ele) {
        visitDescendantTextNodes(ele, function(node) {
          node.nodeValue = Mustache.render(node.nodeValue, params);
        })
        ele.style.visibility = "visible";
      })
    }
  }

  // Fetch the personalization parameter values from the data service.
  function getAndApplyParams() {
    var url = new URL(window.location.href);
    var key = url.searchParams.get("key") || localStorage.getItem("key");
    if (key) {
      var request = new XMLHttpRequest();
      request.open("GET", options.getVideoParamsUrl + "?key=" + key);
      request.send();
      request.onload = function() {
        if (request.status == 200) {
          var data = JSON.parse(request.response);
          if (data.Items && data.Items.length) {
            applyParams(data.Items[0]);
          }
        }
      }
      localStorage.setItem("key", key);
    }
    else {
      // Backward compatibility mode.
      applyParams({
        first_name: url.searchParams.get("first_name") || "",
        company: url.searchParams.get("company") || "",
        city: url.searchParams.get("city") || "",
        screenshot: url.searchParams.get("screenshot") || ""
      })
    }
    // Wipe out query parameters.
    history.replaceState("", "", location.origin + location.pathname);
  }

  // Main.
  getAndApplyParams()
})();
