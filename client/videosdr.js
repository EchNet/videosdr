(function() {
  var BUST_CACHE = false;
  var userAgent = navigator.userAgent;

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
    for (var i = 0; i < queryVars.length; ++i) {
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
    // Default options.
    getVideoParamsUrl: "https://almqm0z6kf.execute-api.us-east-1.amazonaws.com/live/getvideoparams",
    projectId: "",
    movieName: "",
    format: "dash",
    region: null,
    salt: "",
    videoElementId: "my-video"
  });

  var prereqs = {};

  function init() {
    // Check for required options AFTER hiding template text.
    if (!options.projectId || !options.movieName) {
      throw("videosdr: missing project ID or movieName")
    }

    if (BUST_CACHE && !options["salt"]) {
      var script = document.createElement("script");
      script.src = currentScript.src + "&salt=" + Math.random().toString(36).substring(2, 15);
      document.head.appendChild(script)
      throw("videosdr: cache bust")
    }

    // Bring in required Javascripts.
    (function(scripts) {
      for (var i = 0; i < scripts.length; ++i) {
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
  }

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

    var container = document.createElement("div");
    container.style.display = "none";
    container.style.position = "absolute";
    container.style.width = "100px";
    container.style.height = "100px";
    container.style.borderRadius = "50%";
    container.style.top = "50%";
    container.style.left = "50%";
    container.style.background = "#555";
    container.style.transform = "translate(-50%, -50%)";
    container.style.transition = "0.2s";
    container.onmouseover = function() {
      container.style.background = "#888";
    }
    container.onmouseleave = function() {
      container.style.background = "#555";
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

    container.appendChild(arrow);
    return container;
  }

  function applyParamsToPageText(params) {
    forEachElementOfClass("videosdr-when-loaded", function(ele) {
      visitDescendantTextNodes(ele, function(node) {
        node.nodeValue = Mustache.render(node.nodeValue, params);
      })
      ele.style.visibility = "visible";
    })
  }

  function isIOS() {
    return !!/iphone|ipod|ipad/i.test(userAgent)
  }

  // Assume that dash format is not supported on all iOS devices.
  function isDashSupported() {
    return !isIOS();
  }

  // Get the specified video format.  Supported values: "hls", "dash", "mp4".
  function getFormat() {
    var format = options.format;
    // Dash is not supported on iOS Chrome.  Fall back on hls.
    if (!isDashSupported() && /^dash$/i.test(format)) {
      format = "hls";
    }
    return format;
  }

  function initializeVideo(params) {
    var videoElement = document.getElementById(options.videoElementId)
    if (videoElement) {
      initializeVideoElement(videoElement, params)
    }
    return videoElement;
  }

  function initializeVideoElement(videoElement, params) {
    videoElement.parentElement.style.position = "relative";
    videoElement.removeAttribute("controls");
    videoElement.autoplay = true;

    var player = fxplayer(videoElement, {format: getFormat()});
    if (options.region) {
      player.region = options.region;
    }
    player.projectid = options.projectId;
    player.movie = options.movieName;
    player.params = params; // Apply params to video.
    player.play();

    var bigPlayButtonControl = createBigPlayButton();
    videoElement.after(bigPlayButtonControl);
    bigPlayButtonControl.addEventListener("click", function() {
      videoElement.play();
    })

    videoElement.onloadeddata = function() {
      // First frame is now available.  Remove placeholder image and show the big play button.
      videoElement.removeAttribute("poster");
      bigPlayButtonControl.style.display = "block";
      // Enable click-to-play on the video itself.
      var wasPaused;
      videoElement.addEventListener("click", function(event) {
        // Detect play/pause state of the video in the capture phase, in case the
        // event bubbles up from a play button control (Safari).
        wasPaused = videoElement.paused;
      }, true);
      videoElement.addEventListener("click", function(event) {
        event.preventDefault()
        if (!wasPaused == !videoElement.paused) {
          videoElement.paused ? videoElement.play() : videoElement.pause();
        }
      });

      // This hack is necessary for Safari, which does not automatically increase height.
      videoElement.style.minHeight = (videoElement.clientWidth * videoElement.videoHeight / videoElement.videoWidth) + "px";
      videoElement.onloadeddata = null;
    }

    videoElement.onerror = function() {
      videoElement.removeAttribute("poster");
      console.log("video error", videoElement.error.code, videoElement.error.message)
    }

    videoElement.onplaying = function() {
      if (!videoElement.paused) {  // Ignore false play events from auto-autoplay on Safari.
        // Video has started to play.  Hide the big play button and enable default controls.
        bigPlayButtonControl.remove();
        videoElement.setAttribute("controls", "controls");
      }
      videoElement.addEventListener("touchstart", function(event) {
        event.preventDefault();  // Suppress mouse click emulation.
      });
    }

    videoElement.pause();  // Deny autoplay.
  }

  // Data and code are ready.  Initialize the video and display custom text.
  function startUp(params) {
    if (!initializeVideo(params)) {
      // If the video is not yet present in the DOM, watch for DOM mutations.
      new MutationObserver(function(mutList, observer) {
        if (initializeVideo(params)) {
          applyParamsToPageText(params);
          observer.disconnect();
        }
      }).observe(document.getElementsByTagName("body")[0], {
        childList: true
      })
    }
    else {
      applyParamsToPageText(params);
    }
  }

  // Gate startup on required conditions.
  function markPrereq(name, value) {
    if (!prereqs[name]) {
      prereqs[name] = value || 1;
      if (prereqs["mustache"] && prereqs["fxplayer"] && prereqs["page"] && prereqs["params"]) {
        startUp(prereqs["params"])
      }
    }
  }

  // Wait for page to load.
  function whenPageLoaded(callback) {
    callback();
    /*** it's not clear that this is necessary, now that we're waiting for the video element to appear before initializing.
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
    ***/
  }

  function hasLocalStorage() {
    try {
      localStorage.setItem("vidvoy-$test", "$test")
      localStorage.removeItem("vidvoy-$test")
      return true;
    }
    catch (e) {
    }
  }

  function clearLocalStorage() {
    for (var k in localStorage) {
      if (k.startsWith("vidvoy-")) {
        localStorage.removeItem(k)
      }
    }
  }

  function getLocalParams() {
    var params = {}
    for (var k in localStorage) {
      if (k.startsWith("vidvoy-")) {
        params[k.substring(7)] = localStorage[k];
      }
    }
    return params;
  }

  function getQueryParams() {
    var url = new URL(window.location.href);
    var queryParams = {}
    url.searchParams.forEach(function(value, key) {
      queryParams[key] = value;
    })
    return queryParams;
  }

  // Fetch the personalization parameter values from the data service, then
  // continue by calling callback, passing a hash of parameters.
  function whenParamsLoaded(callback) {
    //
    // Query string modes
    // 
    // Parameter values in query string
    // Query string example: ?name=Hal&company=HalCo
    // Query string is cleared, parameters are saved in localstorage.
    // 
    // Parameter values through key-value lookup
    // Query string example: ?key=A1B2C3
    // Query string is cleared, key is saved in localstorage.
    // 
    // Parameter values through key-value lookup, no save.
    // Query string example: ?k=A1B2C3
    // Query string is not cleared, localstorage is cleared.
    //
    // Use last parameters
    // Query string is empty.
    //
    var queryParams = getQueryParams()
    var hasLocal = hasLocalStorage()

    var key = queryParams["key"] || queryParams["k"] || (hasLocal && localStorage.getItem("vidvoy-key"))
    if (key) {
      var request = new XMLHttpRequest();
      request.open("GET", options.getVideoParamsUrl + "?key=" + key);
      request.send();
      request.onload = function() {
        if (request.status == 200) {
          var data = JSON.parse(request.response);
          if (data.Items && data.Items.length) {
            finish(data.Items[0]);
          }
        }
      }
    }
    else {
      finish({});
    }

    if (hasLocal) {
      if (queryParams["k"]) {
        clearLocalStorage()
      }
      else {
        // Hide query parameters from address bar.
        history.replaceState("", "", location.origin + location.pathname);
        for (var k in queryParams) {
          localStorage.setItem("vidvoy-" + k, queryParams[k]);
        }
      }
    }

    function finish(kvParams) {
      // URL query string parameters override keyed values.
      callback(Object.assign({}, hasLocal && getLocalParams(), kvParams, queryParams));
    }
  }

  // Main.
  init();
  whenPageLoaded(function() { markPrereq("page") })
  whenParamsLoaded(function(params) { markPrereq("params", params) })
})();
