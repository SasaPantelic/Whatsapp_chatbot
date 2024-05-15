const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("homeAPI", {
  pasteClipboard: (target) => ipcRenderer.on("paste_clipboard", target),
});
