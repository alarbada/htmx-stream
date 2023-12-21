/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

window.htmx.defineExtension("stream", {
  onEvent: function (name, evt) {
    if (name === "htmx:beforeRequest") {
      var element = evt.detail.elt;
      var xhr = evt.detail.xhr;

      var lastLength = 0;
      xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === 2 || xhr.readyState === 3) {
          var newText = xhr.responseText.substring(lastLength);
          element['__streamedChars'] = lastLength;
          lastLength = xhr.responseText.length;
          element.innerHTML = newText;
        }
      });
    }
    return true;
  },
  transformResponse: function (text, _xhr, elt) {
    var lastLength = elt['__streamedChars'];
    if (lastLength) {
      var newText = text.substring(lastLength);
      return newText;
    }

    return text;
  }
});
