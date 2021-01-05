(function() {
  var userAgent = navigator.userAgent;

  // Polyfill for document.currentScript:
  const currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  // Polyfill for Array.prototype.forEach:
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    }
  }

  // Get options.
  const options = (function(defaultOptions) {
    const queryVars = currentScript.src.replace(/^[^\?]+\??/, "").split("&");
    const queryStringOptions = {};
    queryVars.forEach(function(qv) {
      const pair = qv.split("=");
      queryStringOptions[pair[0]] = decodeURI(pair[1]).replace(/\+/g, ' ');
    })
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

  function isIOS() {
    return !!/iphone|ipod|ipad/i.test(userAgent) }

  function initialize() {
    executeInstruction([
      {
        "code": "appendStyle",
        "style": [
          "div.optin-modal-screen {",
            "position: fixed;",
            "top: 0;",
            "left: 0;", 
            "width: 100%;", 
            "height: 100%;", 
            "background: rgba(192,192,192,0.5);", 
            "z-index: 2000000;",
          "}",
          "div.optin-modal-frame {",
            "position: relative;",
            "width: 100%;",
            "max-width: 480px;",
            "min-height: 300px;",
            "top: 50%;",
            "padding: 3px;",
            "text-align: center;",
            "margin: auto;",
            "margin-top: -150px;",
            "border: solid 2px white;",
            "background: white;",
            "z-index: 2000001;",
          "}",
          "div.optin-modal-content {",
            "font-family: \"Helvetica Neue\",Helvetica,Arial,sans-serif;",
            "font-size: 12px;",
          "}",
          "button.optin-close-button {",
            "padding: 0 3px 0 4px;",
            "display: block;",
            "font-size: 20px;",
            "line-height: 20px;",
            "position: absolute;",
            "top: -11px;",
            "right: -9px;",
            "z-index: 2000002;",
            "color: white;",
            "text-align: center;",
            "text-decoration: none;",
            "vertical-align: baseline;",
            "cursor: pointer;",
            "background: black;",
            "border: solid 2px white;",
            "border-radius: 22px;",
          "}"
        ].join("\n")
      },
      {
        "code": "createPopup",
        "name": "popup1",
        "html": "<div><h2>POPUP1</h2></div>"
      }
    ])
  }

  const INSTRUCTION_DISPATCH = {
    appendStyle: function(instruction) {
      appendStyle(instruction.style);
    },
    appendHtml: function(instruction) {
      appendHtml(instruction.selector, instruction.html)
    },
    addClass: function(instruction) {
      addClass(instruction.selector, instruction["class"])
    },
    removeClass: function(instruction) {
      removeClass(instruction.selector, instruction["class"])
    },
    createPopup: function(instruction) {
      createPopup(instruction.name, instruction.html)
    },
    handleClick: function(instruction) {
      handleClick(instruction.selector, instruction.action)
    }
  }

  function executeInstruction(instruction) {
    if (instruction) {
      if (Array.isArray(instruction)) {
        instruction.forEach(executeInstruction)
      }
      else {
        INSTRUCTION_DISPATCH[instruction.code](instruction)
      }
    }
  }

  function appendHtml(selector, html) {
    var parent = selector ? document.querySelector(selector) : document.body;
    parent.innerHTML += html;
  }

  function addClass(selector, _class) {
    var ele = selector ? document.querySelector(selector) : document.body;
    ele.classList.add(_class);
  }

  function removeClass(selector, _class) {
    var ele = selector ? document.querySelector(selector) : document.body;
    ele.classList.remove(_class);
  }

  function createPopup(name, html) {
    executeInstruction([
      {
        "code": "appendHtml",
        "html": [
          "<div class='optin-modal-screen optin-modal-screen-" + name + " optin-modal-root-" + name + "'>",
            "<div class='optin-modal-frame " + name + "'>",
              "<button class='optin-close-button'>×</button>",
              "<div class='optin-modal-content optin-modal-content-" + name + "'>",
              "</div>",
            "</div>",
          "</div>"
        ].join("")
      },
      {
        "code": "appendHtml",
        "selector": "div.optin-modal-content-" + name,
        "html": html
      },
      {
        "code": "appendStyle",
        "style": [
          "body:not(." + name + "-shown) .optin-modal-root-" + name + " {",
            "display: none;",
          "}"
        ].join(" ")
      },
      {
        "code": "handleClick",
        "selector": "a[href='#" + name + "']",
        "action": {
          "code": "addClass",
          "class": name + "-shown"
        }
      },
      {
        "code": "handleClick",
        "selector": "div.optin-modal-screen-" + name,
        "action": {
          "code": "removeClass",
          "class": name + "-shown"
        }
      },
      {
        "code": "handleClick",
        "selector": "div.optin-modal-frame." + name + " div.optin-close-container", 
        "action": {
          "code": "removeClass",
          "class": name + "-shown"
        }
      }
    ])
  }

  function appendStyle(style) {
    var head = document.getElementsByTagName('head')[0];
    var styles  = document.createElement('style');
    styles.appendChild(document.createTextNode(style));
    head.appendChild(styles);
  }

  function handleClick(selector, action) {
    var links = document.querySelectorAll(selector);
    for (var i = 0; i < links.length; ++i) {
      links[i].addEventListener("click", function(e) {
        e.preventDefault();
        executeInstruction(action);
      })
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
  whenPageLoaded(initialize)
})();
