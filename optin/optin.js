(function() {
  var userAgent = navigator.userAgent;

  // Polyfill for document.currentScript:
  const currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  // Because Array.forEach isn't everywhere and isn't a member of NodeList.
  function forEach(indexable, callback) {
    if (indexable) {
      if (typeof indexable.length === "undefined") {
        indexable = [ indexable ]
      }
      for (var i = 0; i < indexable.length; ++i) {
        callback(indexable[i]);
      }
    }
  }

  // Capture the source URL immediately.
  const SRC = currentScript.src;

  function getText(obj) {
    if (!obj) {
      return "";
    }
    if (Array.isArray(obj)) {
      return obj.join("");
    }
    return obj.toString();
  }

  function getRelativeUrl(filePath) {
    const baseSrc = SRC.match(/^[^\?]+/)[0];
    const path = baseSrc.split("/");
    path.pop()
    path.push(filePath)
    return path.join("/");
  }

  function getQueryString() {
    return SRC.replace(/^[^\?]+\??/, "");
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
    addStylesheet: function(instruction) {
      var is_inline = instruction.text != null;
      var ele = document.createElement(is_inline ? "style" : "link");
      if (is_inline) {
        ele.appendChild(document.createTextNode(getText(instruction.text)));
      }
      else {
        ele.rel = "stylesheet";
        ele.href = getRelativeUrl(instruction.url);
      }
      ele.type = "text/css";
      appendToHead(ele);
    },
    applyStyles: function(instruction) {
      var selector = instruction.selector || "";
      var styles = instruction.styles || {};
      forEach(document.querySelectorAll(selector), function(ele) {
        for (var style in styles) {
          ele.style[style] = styles[style];
        }
      })
    },
    appendHtml: function(instruction) {
      var parent = selectElement(instruction.selector);
      var html = getText(instruction.html);
      var temp = document.createElement("div");
      temp.innerHTML = html;
      while (temp.childNodes.length > 0) {
        parent.appendChild(temp.childNodes[0]);
      }
    },
    addClass: function(instruction) {
      var ele = selectElement(instruction.selector);
      forEach(instruction["class"], function(cls) {
        ele.classList.add(cls);
      });
    },
    removeClass: function(instruction) {
      var ele = selectElement(instruction.selector);
      forEach(instruction["class"], function(cls) {
        ele.classList.remove(cls);
      })
    },
    handleEvent: function(instruction) {
      var selector = instruction.selector || "a[href]";
      var targets = document.querySelectorAll(selector);
      var eventType = instruction.eventType || "click";
      var action = instruction.action || []

      forEach(targets, function(target) { 
        target.addEventListener(eventType, function(e) {
          //e.preventDefault();
          if (instruction.stopPropagation) {
            e.stopPropagation();
          }
          execute(action);
        })
      });
    }
  }

  function execute(instruction) {
    if (instruction) {
      if (Array.isArray(instruction)) {
        forEach(instruction, execute)
      }
      else {
        INSTRUCTION_DISPATCH[instruction.code](instruction)
      }
    }
  }

  // ======= module optin-modal ============

  execute({
    "code": "addStylesheet",
    "url": "optin-modal.css"
  })

  INSTRUCTION_DISPATCH["showModal"] = function(instruction) {
    var name = instruction.name;
    execute({
      "code": "addClass",
      "class": [ "optin-modal-shown-" + name, "optin-modal-shown" ]
    })
  }
  
  INSTRUCTION_DISPATCH["closeModal"] = function(instruction) {
    execute({
      "code": "removeClass",
      "class": [ "optin-modal-shown-" + instruction.name, "optin-modal-shown" ]
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
          "code": "addStylesheet",
          "text": [
            "body:not(.optin-modal-shown-" + name + ") .optin-modal-root-" + name + " {",
              "visibility: hidden;",
              "opacity: 0;",
            "}"
          ]
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
    })(instruction.name, getText(instruction.html));
  };

  // ======= module optin-hover ============

  execute({
    "code": "addStylesheet",
    "url": "optin-hover.css"
  })

  INSTRUCTION_DISPATCH["createHover"] = function(instruction) {
    (function(name, html, styles) {
      execute([
        {
          "code": "appendHtml",
          "html": [
            "<div class='optin-hover-frame optin-hover-frame-" + name + "'>",
              "<button class='optin-hover-button optin-hover-button-" + name + "'>",
              "</button>",
            "</div>"
          ].join("")
        },
        {
          "code": "appendHtml",
          "selector": ".optin-hover-button-" + name,
          "html": html
        }
      ]);
    })(instruction.name, getText(instruction.html), instruction.styles || {});
  };

  // ======= end module optin-hover ============

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
    const fileName = (getQueryString().split("&")[0] || "demo1") + ".json";
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

  // Main.
  whenConfigLoaded(function(config) {
    whenPageLoaded(function() {
      execute(config)
    })
  })
})();
