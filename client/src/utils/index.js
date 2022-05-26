export const copyTextToClipboard = (text = "") => {
  return new Promise((resolve, reject) => {
    if (!navigator.clipboard) {
      const textArea = document.createElement("textarea");
      let message = "";
      textArea.value = text;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        message = "Fallback: Copying text command was " + msg;
      } catch (err) {
        message = "Fallback: Oops, unable to copy " + err;
      }
      textArea.remove();
      return resolve(message);
    } else {
      navigator.clipboard.writeText(text).then(
        function () {
          resolve("Async: Copying to clipboard was successful!");
        },
        function (err) {
          resolve("Async: Could not copy text: " + err);
        },
      );
    }
  });
};

export const downloadUrl = (url = "") => {
  const randomFilename = Math.random().toString(36).slice(2);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `v-${randomFilename}.mp4`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};
