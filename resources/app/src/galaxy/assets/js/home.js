window.homeAPI.pasteClipboard((event, target) => {
  let whatsappView = document.getElementById(target);
  whatsappView.sendInputEvent({
    type: "keyDown",
    keyCode: "a",
    modifiers: ["control"],
  });

  setTimeout(() => {
    whatsappView.sendInputEvent({
      type: "keyDown",
      keyCode: "v",
      modifiers: ["control"],
    });
  }, 50);
});
