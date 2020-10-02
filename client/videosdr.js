(function() {

  // Hide template text.
  (function() {
    var stylesheet = document.createElement("style");
    stylesheet.innerHTML = ".videosdr-when-loaded { visibility: hidden; }";
    document.head.appendChild(stylesheet);
  })();

  // Polyfill for document.currentScript:
  const currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  // Get options.
  const options = (function(defaultOptions) {
    const queryVars = currentScript.src.replace(/^[^\?]+\??/, "").split("&");
    const queryStringOptions = {};
    for (var i in queryVars) {
      const pair = queryVars[i].split("=");
      queryStringOptions[pair[0]] = decodeURI(pair[1]).replace(/\+/g, ' ');
    }

    const options = {};
    for (var key in defaultOptions) {
      options[key] = currentScript.getAttribute("data-" + key)
          || queryStringOptions[key] || defaultOptions[key];
    }
    return options;
  })({
    getVideoParamsUrl: "https://almqm0z6kf.execute-api.us-east-1.amazonaws.com/live/getvideoparams",
    projectId: "",
    movieName: "",
    videoElementId: "my-video"
  });

  // Check for required options AFTER hiding template text.
  if (!options.projectId || !options.movieName) {
    throw("videosdr: missing project ID or movieName")
  }

  var prereqs = {};

  // Bring in required Javascripts.
  (function(scripts) {
    for (var i in scripts) {
      (function(ss) {
        var script = document.createElement("script");
        script.src = ss.src;
        script.addEventListener("load", function() {
          markPrereq(ss.name);
        });
        document.head.appendChild(script)
      })(scripts[i])
    }
  })([
    {
      name: "mustache",
      src: "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js"
    },
    {
      name: "fxplayer",
      src: "https://cdn.impossible.io/support/fxplayer.js"
    }
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

  function createBigPlayButton() {
    var SIZE = 1024;

    var videoControls = document.createElement("div");
    videoControls.style.display = "none";
    videoControls.style.position = "absolute";
    videoControls.style.width = "80px";
    videoControls.style.height = "80px";
    videoControls.style.borderRadius = "50%";
    videoControls.style.top = "50%";
    videoControls.style.left = "50%";
    videoControls.style.background = "#555";
    videoControls.style.transform = "translate(-50%, -50%)";
    videoControls.style.transition = "0.2s";
    videoControls.onmouseover = function() {
      videoControls.style.background = "#777";
    }
    videoControls.onmouseleave = function() {
      videoControls.style.background = "#555";
    }

    var arrow = document.createElement("canvas");
    arrow.width = SIZE;
    arrow.height = SIZE;
    arrow.style.width = "100%";
    arrow.style.height = "100%";

    var context = arrow.getContext("2d");
    context.beginPath();
    context.moveTo(SIZE / 3, SIZE / 4);
    context.lineTo(SIZE * 3/4, SIZE / 2);
    context.lineTo(SIZE / 3, SIZE * 3/4);
    context.fillStyle = "white";
    context.fill();

    videoControls.appendChild(arrow);
    return videoControls;
  }

  function applyParams(params) {
    if (params) {
      // Apply params to video.
      var player = fxplayer(options.videoElementId, {format: "hls"});
      player.projectid = options.projectId;
      player.movie = options.movieName;
      player.params = params;
      player.play();

      var videoElement = document.getElementById(options.videoElementId)
      videoElement.removeAttribute("controls");
      videoElement.parentElement.style.position = "relative";
      videoElement.onclick = function() {
        videoElement.paused && videoElement.play();
      }

      var videoControls = createBigPlayButton();
      videoElement.after(videoControls);
      videoControls.onclick = function() {
        videoElement.paused && videoElement.play();
      }

      videoElement.onloadeddata = function() {
        // First frame is now available.  Remove placeholder image.
        videoElement.removeAttribute("poster");
        videoControls.style.display = "block";
        // This hack is necessary for Safari, which does not automatically increase height.
        videoElement.style.minHeight = (videoElement.clientWidth * videoElement.videoHeight / videoElement.videoWidth) + "px";
        videoElement.onloadeddata = null;
      }
      videoElement.onplay = function () {
        videoControls.style.display = "none";
        videoElement.setAttribute("controls", "controls");
      }

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

  // Gate startup on required conditions.
  function markPrereq(name) {
    if (!prereqs[name]) {
      prereqs[name] = true;
      if (prereqs["mustache"] && prereqs["fxplayer"] && prereqs["page"]) {
        getAndApplyParams()
      }
    }
  }

  // Wait for page to load.
  function whenPageLoaded(callback) {
    if (document.readyState != "loading") {
      // The document is already loaded.
      callback();
    }
    else if (document.addEventListener) {
      // Modern browsers support DOMContentLoaded.
      document.addEventListener("DOMContentLoaded", callback);
    }
    else {
      // Old browsers don't.
      document.attachEvent("onreadystatechange", function() {
        if (document.readyState == "complete") {
          callback();
        }
      })
    }
  }

  // Main.
  whenPageLoaded(function() { markPrereq("page") })
})();
