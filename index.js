window.htmx.defineExtension("stream", {
  onEvent: function (name, evt) {
    if (name === "htmx:beforeRequest") {
      let element = evt.detail.elt;
      if (evt.detail.requestConfig.target) {
        element['__target'] = evt.detail.requestConfig.target;
        element = evt.detail.requestConfig.target;
      }

      const xhr = evt.detail.xhr;

      let lastLength = 0;
      let isBlazorStream = false;
      xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === 2) {
          isBlazorStream = xhr.getResponseHeader("blazor-enhanced-nav") === "allow";
        }

        if (xhr.readyState === 2 || xhr.readyState === 3) {

          element.innerHTML = isBlazorStream ? xhr.responseText : xhr.responseText.substring(lastLength);
          element['__streamedChars'] = lastLength;
          lastLength = xhr.responseText.length;
        }
      });
    }
    return true;
  },
  transformResponse: function (text, _xhr, elt) {
    let lastLength = elt['__streamedChars'];
    let target = elt['__target'];

    if (target) {
      const isBlazorStream = _xhr.getResponseHeader("blazor-enhanced-nav") === "allow";
      if (isBlazorStream) {
        return target.innerHTML;
      }

      lastLength = target['__streamedChars'];
    }

    if (lastLength) {
      return text.substring(lastLength);
    }

    return text;
  }
});