/**
 * A2P Wizard SDK v1.0.0
 * Embeds the A2P 10DLC registration wizard into any page via iframe.
 *
 * Usage:
 *   A2PWizard.init({ container: '#wizard', accountId: 'abc123', ... })
 */
(function (global) {
  "use strict";

  var A2PWizard = {
    _iframe: null,
    _config: null,
    _origin: null,

    /**
     * Initialize the wizard.
     * @param {Object} config
     */
    init: function (config) {
      if (!config) throw new Error("A2PWizard.init: config is required");
      if (!config.accountId) throw new Error("A2PWizard.init: accountId is required");
      if (!config.container) throw new Error("A2PWizard.init: container is required");

      this._config = config;

      // Resolve container
      var container =
        typeof config.container === "string"
          ? document.querySelector(config.container)
          : config.container;
      if (!container) throw new Error("A2PWizard.init: container not found: " + config.container);

      // Build embed URL — only safe params in URL, keys via postMessage
      var baseUrl = config.baseUrl || this._detectBaseUrl();
      var params = new URLSearchParams();
      params.set("accountId", config.accountId);
      if (config.webhookUrl) params.set("webhook", config.webhookUrl);
      if (config.allowedOrigins) params.set("allowedOrigins", config.allowedOrigins.join(","));

      // Branding
      if (config.branding) {
        if (config.branding.logoUrl) params.set("logoUrl", config.branding.logoUrl);
        if (config.branding.companyName) params.set("companyName", config.branding.companyName);
      }

      // Theme
      if (config.theme) {
        Object.keys(config.theme).forEach(function (key) {
          if (config.theme[key]) params.set(key, config.theme[key]);
        });
      }

      // Prefill (safe to put in URL — no secrets)
      if (config.prefill) {
        Object.keys(config.prefill).forEach(function (key) {
          if (config.prefill[key]) params.set("prefill_" + key, config.prefill[key]);
        });
      }

      var url = baseUrl + "/embed?" + params.toString();
      this._origin = new URL(baseUrl).origin;

      // Create iframe
      var iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style.cssText =
        "width:100%;border:none;overflow:hidden;min-height:600px;display:block;";
      iframe.setAttribute("allowtransparency", "true");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("title", "A2P 10DLC Registration Wizard");

      // Clear container and append
      container.innerHTML = "";
      container.appendChild(iframe);
      this._iframe = iframe;

      // Listen for messages from iframe
      var self = this;
      window.addEventListener("message", function (event) {
        // Origin check
        if (event.origin !== self._origin) return;
        var msg = event.data;
        if (!msg || msg.source !== "a2p-wizard") return;

        switch (msg.type) {
          case "ready":
            // Send secure config (API keys) via postMessage after load
            self._sendSecureConfig();
            if (config.onReady) config.onReady();
            break;
          case "resize":
            if (msg.height && self._iframe) {
              self._iframe.style.height = msg.height + "px";
            }
            break;
          case "stepChange":
            if (config.onStepChange) config.onStepChange(msg.step, msg.data);
            break;
          case "complete":
            if (config.onComplete) config.onComplete(msg.data);
            break;
          case "error":
            if (config.onError) config.onError(msg.error);
            break;
        }
      });

      return this;
    },

    /**
     * Send API keys and sensitive config via postMessage (not in URL).
     */
    _sendSecureConfig: function () {
      if (!this._iframe || !this._iframe.contentWindow) return;
      var secureData = { source: "a2p-wizard-sdk", type: "config" };
      if (this._config.telnyxApiKey) secureData.telnyxApiKey = this._config.telnyxApiKey;
      if (this._config.googlePlacesKey) secureData.googlePlacesKey = this._config.googlePlacesKey;
      this._iframe.contentWindow.postMessage(secureData, this._origin);
    },

    /**
     * Detect base URL from the script tag src.
     */
    _detectBaseUrl: function () {
      var scripts = document.querySelectorAll('script[src*="sdk.js"]');
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        if (src.indexOf("sdk.js") !== -1) {
          var url = new URL(src);
          return url.origin;
        }
      }
      return "https://a2p-wizard.vercel.app";
    },

    /**
     * Destroy the wizard instance.
     */
    destroy: function () {
      if (this._iframe && this._iframe.parentNode) {
        this._iframe.parentNode.removeChild(this._iframe);
      }
      this._iframe = null;
      this._config = null;
    },
  };

  // Export
  if (typeof module !== "undefined" && module.exports) {
    module.exports = A2PWizard;
  } else {
    global.A2PWizard = A2PWizard;
  }
})(typeof window !== "undefined" ? window : this);
