const { contextBridge, ipcRenderer } = require("electron");

let sendFlag = false;
function sendMessage() {
  if (sendFlag == true) {
    return;
  }
  sendFlag = true;
  let inputDiv = document.querySelector(
    "[data-testid='conversation-compose-box-input']"
  );
  inputDiv.parentElement.parentElement.click();
  inputDiv.parentElement.parentElement.focus();
  let inputSpan = inputDiv.querySelector("span");
  let lang = document.getElementById("lang_select_receiver").value;
  ipcRenderer
    .invoke("translate", lang, inputSpan.innerText, 1)
    .then((result) => {
      navigator.clipboard.writeText(result);
      ipcRenderer.invoke("pasteClipboard", "whatsapp_webview");
      setTimeout(() => {
        document.querySelector("[data-testid='compose-btn-send']").click();
      }, 1000);
    });
  sendFlag = false;
}

document.onreadystatechange = (event) => {
  if (document.readyState == "complete") {
    // Do something useful here...
    var observer = new MutationObserver(function (mutations) {
      try {
        let header = document.querySelector(
          "[data-testid='conversation-header']"
        );
        if (header.children.length == 3) {
          var sender = document.createElement("select");
          sender.id = "lang_select_sender";
          sender.style.width = "25px";
          sender.style.marginLeft = "5px";
          sender.style.textAlign = "center";
          sender.style.border = "none";

          var qOption = document.createElement("option");
          qOption.value = "?";
          qOption.text = "?";
          sender.appendChild(qOption);
          var engOption = document.createElement("option");
          engOption.value = "English";
          engOption.text = "EN";
          sender.appendChild(engOption);
          var cnOption = document.createElement("option");
          cnOption.value = "Chinese";
          cnOption.text = "CN";
          sender.appendChild(cnOption);
          var jpOption = document.createElement("option");
          jpOption.value = "Japanes";
          jpOption.text = "JP";
          sender.appendChild(jpOption);
          var frOption = document.createElement("option");
          frOption.value = "French";
          frOption.text = "FR";
          sender.appendChild(frOption);
          var spOption = document.createElement("option");
          spOption.value = "Spanish";
          spOption.text = "SP";
          sender.appendChild(spOption);
          var koOption = document.createElement("option");
          koOption.value = "Korean";
          koOption.text = "KO";
          sender.appendChild(koOption);
          header.appendChild(sender);

          var mid = document.createElement("div");
          mid.innerText = "-";
          mid.style.marginLeft = "10px";
          mid.style.marginRight = "5px";
          header.appendChild(mid);

          var receiver = document.createElement("select");
          receiver.id = "lang_select_receiver";
          receiver.style.width = "25px";
          receiver.style.marginLeft = "5px";
          receiver.style.textAlign = "center";
          receiver.style.border = "none";

          var engOption = document.createElement("option");
          engOption.value = "English";
          engOption.text = "EN";
          receiver.appendChild(engOption);
          var cnOption = document.createElement("option");
          cnOption.value = "Chinese";
          cnOption.text = "CN";
          receiver.appendChild(cnOption);
          var koOption = document.createElement("option");
          koOption.value = "Korean";
          koOption.text = "KO";
          receiver.appendChild(koOption);
          var jpOption = document.createElement("option");
          jpOption.value = "Japanes";
          jpOption.text = "JP";
          receiver.appendChild(jpOption);
          var frOption = document.createElement("option");
          frOption.value = "French";
          frOption.text = "FR";
          receiver.appendChild(frOption);
          var spOption = document.createElement("option");
          spOption.value = "Spanish";
          spOption.text = "SP";
          receiver.appendChild(spOption);
          header.appendChild(receiver);

          var composeBox = document.querySelector(
            "[data-testid='conversation-compose-box-input']"
          );
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
          // var clone = composeBox.cloneNode(true);
          // composeBox.parentNode.replaceChild(clone, composeBox);
        }
      } catch (error) {}

      try {
        let sendButton = document.querySelector(
          "[data-testid='compose-btn-send']"
        );
        sendButton.style.display = "none";
        let parentElement = sendButton.parentElement;
        if (parentElement.children.length == 1) {
          let btn = document.createElement("button");
          btn.id = "new_send";
          btn.style.color = "#FFF";
          btn.style.fontSize = "100%";
          const textnodebtn = document.createTextNode("Send");
          btn.appendChild(textnodebtn);
          parentElement.appendChild(btn);
          btn.addEventListener("click", sendMessage);
        }
      } catch (error) {
        try {
          let btn = document.getElementById("new_send");
          btn.parentElement.removeChild(btn);
          let langSelect = document.getElementById("lang_select");
          langSelect.parentElement.removeChild(langSelect);
        } catch (error1) {}
      }

      try {
        let msgInElements = document.querySelectorAll(".message-in");
        for (let i = msgInElements.length - 1; i >= 0; i--) {
          let lastMsgElement = msgInElements[i];
          let textElement = lastMsgElement.querySelector(".selectable-text");
          if (textElement.children.length == 1) {
            let msg = textElement.firstChild.innerText;
            let lang = document.getElementById("lang_select_sender").value;
            if (lang != "?") {
              ipcRenderer
                .invoke(
                  "translate",
                  lang,
                  msg,
                  i == msgInElements.length - 1 ? 1 : 0
                )
                .then((result) => {
                  if (textElement.children.length == 1) {
                    let span = document.createElement("span");
                    if (result != "") {
                      span.innerText = "\t" + result;
                    }
                    textElement.appendChild(span);
                  }
                });
              break;
            }
          }
        }
      } catch (error) {}
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
};
