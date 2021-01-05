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

  // Capture the source URL immediately.
  const src = currentScript.src;

  function getRelativeUrl(filePath) {
    const baseSrc = src.match(/^[^\?]+/)[0];
    const path = baseSrc.split("/");
    path.pop()
    path.push(filePath)
    return path.join("/");
  }

  function appendToHead(ele) {
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(ele);
  }

  function selectElement(selector) {
    return selector ? document.querySelector(selector) : document.body;
  }

  const INSTRUCTION_DISPATCH = {
    loadModule: function(instruction) {
      // For future expansion.
    },
    appendStylesheet: function(instruction) {
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = getRelativeUrl(instruction.url);
      appendToHead(link);
    },
    appendStyle: function(instruction) {
      var text = instruction.style || ""
      var styleEle = document.createElement('style');
      styleEle.type = "text/css";
      styleEle.appendChild(document.createTextNode(text));
      appendToHead(styleEle);
    },
    appendHtml: function(instruction) {
      var parent = selectElement(instruction.selector);
      var html = instruction.html || "";
      parent.innerHTML += html;
    },
    addClass: function(instruction) {
      var ele = selectElement(instruction.selector);
      ele.classList.add(instruction["class"]);
    },
    removeClass: function(instruction) {
      var ele = selectElement(instruction.selector);
      ele.classList.remove(instruction["class"]);
    },
    handleEvent: function(instruction) {
      var selector = instruction.selector || "a[href]";
      var targets = document.querySelectorAll(selector);
      var eventType = instruction.eventType || "click";
      var action = instruction.action || []
      for (var i = 0; i < targets.length; ++i) {
        targets[i].addEventListener(eventType, function(e) {
          console.log(e.type, e.target, action);
          e.preventDefault();
          if (instruction.stopPropagation) {
            e.stopPropagation();
          }
          execute(action);
        })
      }
    }
  }

  function execute(instruction) {
    if (instruction) {
      if (Array.isArray(instruction)) {
        instruction.forEach(execute)
      }
      else {
        INSTRUCTION_DISPATCH[instruction.code](instruction)
      }
    }
  }

  // Macros.
  INSTRUCTION_DISPATCH["showModal"] = function(instruction) {
    execute({
      "code": "addClass",
      "class": instruction.name + "-shown"
    })
  }
  
  INSTRUCTION_DISPATCH["closeModal"] = function(instruction) {
    execute({
      "code": "removeClass",
      "class": instruction.name + "-shown"
    })
  }

  INSTRUCTION_DISPATCH["createModal"] = function(instruction) {
    (function(name, html) {
      execute([
        {
          "code": "appendHtml",
          "html": [
            "<div class='optin-modal-screen optin-modal-screen-" + name + " optin-modal-root-" + name + "'>",
              "<div class='optin-modal-frame optin-modal-frame-" + name + "'>",
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
          "code": "handleEvent",
          "selector": "a[href='#" + name + "']",
          "action": {
            "code": "showModal",
            "name": name
          }
        },
        {
          "code": "handleEvent",
          "selector": "div.optin-modal-screen-" + name,
          "action": {
            "code": "closeModal",
            "name": name
          }
        },
        {
          "code": "handleEvent",
          "selector": "div.optin-modal-frame-" + name,
          "stopPropagation": true
        },
        {
          "code": "handleEvent",
          "selector": "div.optin-modal-frame-" + name + " .optin-close-button", 
          "action": {
            "code": "closeModal",
            "name": name
          }
        }
      ]);
    })(instruction.name, instruction.html);
  };

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

  function getConfigFileUrl() {
    const queryString = src.replace(/^[^\?]+\??/, "");
    const fileName = (queryString.split("&")[0] || "demo1") + ".json";
    return getRelativeUrl(fileName);
  }

  // Wait for configuration to load.
  function whenConfigLoaded(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", getConfigFileUrl());
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = function() {
      if (xhr.status === 200) {
        callback(xhr.response)
      }
    }
  }

  execute({
    "code": "appendStylesheet",
    "url": "optin-modal.css"
  })

  // Main.
  whenConfigLoaded(function(config) {
    whenPageLoaded(function() {
      execute(config)
    })
  })
})();
