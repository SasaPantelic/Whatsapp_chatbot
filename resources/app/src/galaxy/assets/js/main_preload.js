const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("openaiAPI", {
  translate: (language, sentence) =>
    ipcRenderer.invoke("translate", language, sentence),
  executeQuery: (query, fetch, value) =>
    ipcRenderer.invoke("executeQuery", query, fetch, value),
});
