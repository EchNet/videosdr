(function() {
  function isMobile() {
    const a = navigator.userAgent || navigator.vendor || window.opera;
    console.log(a);
    return !!(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)));
  }

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

  function getText(obj) {
    if (!obj) {
      return "";
    }
    if (Array.isArray(obj)) {
      return obj.join("");
    }
    return obj.toString();
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
    },
    navigate: function(instruction) {
      console.log('NAVIGATE', instruction);
      let a = document.createElement("a");
      a.target = instruction.target || "_self";
      a.href = instruction.href;
      a.click()
    }
  }

  function execute(instruction) {
    if (instruction) {
      if (Array.isArray(instruction)) {
        forEach(instruction, execute)
      }
      else if (enabledHere(instruction)) {
        INSTRUCTION_DISPATCH[instruction.code](instruction)
      }
    }
  }

  function enabledHere(instruction) {
    const disabled = (function(d) {
      return (d === "mobile" && isMobile()) || d === true;
    })(instruction.disabled);

    const enabled = (function(e) {
      return (e === "mobile" && isMobile()) || e === true || e === undefined;
    })(instruction.enabled);

    return enabled && !disabled;
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
            "<button class='optin-hover-button optin-hover-button-" + name + "'>",
            "</button>"
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
