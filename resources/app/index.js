const { app, BrowserWindow, session, ipcMain, nativeTheme } = require("electron");
const { Configuration, OpenAIApi } = require("openai");
const { setdbPath, executeQuery, executeScript } = require("sqlite-electron");
const path = require("path");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

function hexEncode(str){
  var hex, i;

  var result = "";
  for (i=0; i<str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += ("000"+hex).slice(-4);
  }

  return result
}

function hexDecode (str){
  var j;
  var hexes = str.match(/.{1,4}/g) || [];
  var back = "";
  for(j = 0; j<hexes.length; j++) {
      back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
}

async function translate(event, language, sentence, type) {
  try {
    let encodedString = hexEncode(sentence);    
    const result = await executeQuery(
      "SELECT translated FROM trans WHERE original = ? AND language = ?",
      "all",
      ["'" + encodedString + "'", language]
    );    
    if (result.length != 0) {
      return hexDecode(result[0][0]);
    } else if (type == 1) {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt:
          "Translate this into" + language + ":\n" + sentence + "\n",
        temperature: 0.3,
        max_tokens: 128,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
      console.log("======================");
      console.log(response.data.choices[0].text);
      await executeQuery(
        "INSERT INTO trans (original, translated, language) VALUES (?, ?, ?)",
        "all",
        ["'" + encodedString + "'", hexEncode(response.data.choices[0].text), language]
      );
      return response.data.choices[0].text;
    } else {
      return "";
    }
  } catch (error) {
    return error.message;
  }
}

async function handleExecuteQuery(event, query, fetch, value) {
  console.log("================");
  console.log(query);
  console.log(fetch);
  console.log(value);
  let result = await executeQuery(query, fetch, value);
  console.log(result);
  return result;
}

async function test() {
  try {
    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: "what is the language of this sentense?: \n\n " + "test",
    //   temperature: 0.3,
    //   max_tokens: 128,
    //   top_p: 1.0,
    //   frequency_penalty: 0.0,
    //   presence_penalty: 0.0,
    // });
    // console.log(response.data.choices[0].text);
    // let query = "SELECT * FROM trans WHERE language =";
    // let result = await executeQuery(
    //   "SELECT translated FROM trans WHERE original = ? AND language = ?",
    //   "all",
    //   ["dGVzdA==", "Chinese"]
    // );
    let encString = hexEncode("有人");
    let decString = hexDecode(encString);

    console.log(encString);
    console.log(decString);
  } catch (error) {}
}

async function sqlQuery() {

}

let mainWindow;
async function pasteClipboard(event, target) {
  mainWindow.webContents.send("paste_clipboard", target);
}

const createWindow = async () => {
  // Create the browser window.
  try {
    await setdbPath("trans.db");
  } catch (error) {
    console.log(error);
  }

  nativeTheme.themeSource = 'dark';

  ipcMain.handle("translate", translate);
  ipcMain.handle("pasteClipboard", pasteClipboard);
  ipcMain.handle("executeQuery", handleExecuteQuery);

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.165 Safari/537.36";
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      webviewTag: true,
      preload: path.join(__dirname, "src/galaxy/assets/js/home_preload.js"),
      nodeintegration: true,
    },
  });
  mainWindow.loadFile("src/galaxy/home.html");

  mainWindow.on("ready-to-show", function () {
    mainWindow.show();
    mainWindow.focus();
  });
  // test();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
