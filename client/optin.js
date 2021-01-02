(function() {
  var userAgent = navigator.userAgent;

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
    salt: ""
  });

  var prereqs = {};

  function init() {
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

  function isIOS() {
    return !!/iphone|ipod|ipad/i.test(userAgent)
  }

  function initialize(params) {
    return 1;
  }

  // Data and code are ready.  Initialize the video and display custom text.
  function startUp(params) {
    if (!initialize(params)) {
      // If initialization is not yet possible, watch for DOM mutations.
      new MutationObserver(function(mutList, observer) {
        if (initialize(params)) {
          observer.disconnect();
        }
      }).observe(document.getElementsByTagName("body")[0], {
        childList: true
      })
    }
  }

  // Gate startup on required conditions.
  function markPrereq(name, value) {
    if (!prereqs[name]) {
      prereqs[name] = value || 1;
      if (prereqs["page"]) {
        startUp(prereqs["params"])
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
  init();
  whenPageLoaded(function() { markPrereq("page") })
})();
