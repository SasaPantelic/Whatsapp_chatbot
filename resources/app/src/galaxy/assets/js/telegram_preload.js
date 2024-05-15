const { contextBridge, ipcRenderer } = require("electron");

async function sendMessage(event) {
  let inputDiv = document.getElementById("editable-message-text");
  let lang = document.getElementById("lang_select_receiver").value;
  inputDiv.focus();
  inputDiv.click();
  ipcRenderer
    .invoke("translate", lang, inputDiv.innerText, 1)
    .then((result) => {
      navigator.clipboard.writeText(result);
      ipcRenderer.invoke("pasteClipboard", "telegram_webview");
      setTimeout(() => {
        document.querySelector("[aria-label='Send Message'").click();
      }, 1000);
    });
}

async function translate() {
  try {
    let header = document.querySelector(".HeaderActions");
    let empty = document.createElement("span");
    header.appendChild(empty);
    header.removeChild(empty);
  } catch (error) {}
}

document.onreadystatechange = (event) => {
  if (document.readyState == "complete") {
    var observer = new MutationObserver(function (mutations) {
      try {
        let header = document.querySelector(".HeaderActions");
        if (header.children.length == 3) {
          var sender = document.createElement("select");
          sender.id = "lang_select_sender";
          sender.style.color = "#FFF";
          sender.style.width = "fit-content";
          sender.style.height = "3.5rem";
          sender.style.marginLeft = "5px";
          sender.style.textAlign = "center";
          sender.style.border = "none";
          sender.style.background = "transparent";
          sender.addEventListener("change", translate);

          var qOption = document.createElement("option");
          qOption.value = "?";
          qOption.text = "?";
          qOption.style.background = "#000";
          sender.appendChild(qOption);
          var engOption = document.createElement("option");
          engOption.value = "English";
          engOption.text = "EN";
          engOption.style.background = "#000";
          sender.appendChild(engOption);
          var cnOption = document.createElement("option");
          cnOption.value = "Chinese";
          cnOption.text = "CN";
          cnOption.style.background = "#000";
          sender.appendChild(cnOption);
          var jpOption = document.createElement("option");
          jpOption.value = "Japanes";
          jpOption.text = "JP";
          jpOption.style.background = "#000";
          sender.appendChild(jpOption);
          var frOption = document.createElement("option");
          frOption.value = "French";
          frOption.text = "FR";
          frOption.style.background = "#000";
          sender.appendChild(frOption);
          var spOption = document.createElement("option");
          spOption.value = "Spanish";
          spOption.text = "SP";
          spOption.style.background = "#000";
          sender.appendChild(spOption);
          var koOption = document.createElement("option");
          koOption.value = "Korean";
          koOption.text = "KO";
          koOption.style.background = "#000";
          sender.appendChild(koOption);
          header.appendChild(sender);

          var mid = document.createElement("div");
          mid.innerText = "-";
          mid.style.marginLeft = "10px";
          mid.style.marginRight = "5px";
          header.appendChild(mid);

          var receiver = document.createElement("select");
          receiver.id = "lang_select_receiver";
          receiver.style.color = "#FFF";
          receiver.style.width = "fit-content";
          receiver.style.height = "3.5rem";
          receiver.style.marginLeft = "5px";
          receiver.style.textAlign = "center";
          receiver.style.border = "none";
          receiver.style.background = "transparent";

          var engOption = document.createElement("option");
          engOption.value = "English";
          engOption.text = "EN";
          engOption.style.background = "#000";
          receiver.appendChild(engOption);
          var cnOption = document.createElement("option");
          cnOption.value = "Chinese";
          cnOption.text = "CN";
          cnOption.style.background = "#000";
          receiver.appendChild(cnOption);
          var koOption = document.createElement("option");
          koOption.value = "Korean";
          koOption.text = "KO";
          koOption.style.background = "#000";
          receiver.appendChild(koOption);
          var jpOption = document.createElement("option");
          jpOption.value = "Japanes";
          jpOption.text = "JP";
          jpOption.style.background = "#000";
          receiver.appendChild(jpOption);
          var frOption = document.createElement("option");
          frOption.value = "French";
          frOption.text = "FR";
          frOption.style.background = "#000";
          receiver.appendChild(frOption);
          var spOption = document.createElement("option");
          spOption.value = "Spanish";
          spOption.text = "SP";
          spOption.style.background = "#000";
          receiver.appendChild(spOption);
          header.appendChild(receiver);

          var composeBox = document.getElementById("editable-message-text");
          composeBox.addEventListener(
            "keydown",
            (event) => {
              if (event.key == "Enter") {
                event.preventDefault();
                event.stopPropagation();
                sendMessage();
              }
            },
            true
          );
        }
      } catch (error) {}

      try {
        let sendButton = document.querySelector("[aria-label='Send Message'");
        if (sendButton.style.display != "none") {
          sendButton.style.display = "none";
          let btn = document.createElement("button");
          btn.id = "new_send";
          btn.style.color = "#FFF";
          btn.style.border = "none";
          btn.style.width = "3.5rem";
          btn.style.height = "3.5rem";
          btn.style.background = "transparent";
          const textnodebtn = document.createTextNode("Send");
          btn.appendChild(textnodebtn);
          sendButton.parentElement.appendChild(btn);
          btn.addEventListener("click", sendMessage);
        }
      } catch (e) {
        let sendButton =
          document.getElementById("message-compose").parentElement.children[1];
        sendButton.style.display = "";
        try {
          let btn = document.getElementById("new_send");
          btn.parentElement.removeChild(btn);
          let langSelect = document.getElementById("lang_select");
          langSelect.parentElement.removeChild(langSelect);
        } catch (error) {}
      }

      try {
        let msgInElements = document.querySelectorAll(".message-list-item");
        let type = 1;
        for (let i = msgInElements.length - 1; i >= 0; i--) {
          let msgElement = msgInElements[i];
          if (!msgElement.classList.contains("own")) {
            let textElement = msgElement.querySelector(".text-content");
            if (textElement.parentElement.children.length == 1) {
              let msg = textElement.innerText;
              let time = msgElement.querySelector(".message-time").innerText;
              msg = msg.replace(time, "");
              let lang = document.getElementById("lang_select_sender").value;
              if (lang != "?") {
                ipcRenderer
                  .invoke("translate", lang, msg, type)
                  .then((result) => {
                    if (textElement.parentElement.children.length == 1) {
                      let span = document.createElement("span");
                      if (result != "") {
                        span.innerText = "\t" + result;
                      }
                      textElement.parentElement.appendChild(span);
                    }
                  });
                break;
              }
            }
            type = 0;
          }
        }
      } catch (e) {}
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
};
