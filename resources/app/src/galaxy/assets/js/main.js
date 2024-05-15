let langBtns = document.getElementsByClassName("language");
Array.from(langBtns).forEach(function (langBtn) {
  langBtn.addEventListener("click", function (e) {
    document.getElementById("selectedLanguageBtn").innerText =
      langBtn.innerText;
  });
});

async function onClickTranslate() {
  document
    .getElementById("statusForTranslating")
    .classList.remove("visually-hidden");
  const result = await window.openaiAPI.translate(
    document.getElementById("selectedLanguageBtn").innerText,
    document.getElementById("leftTextView").value
  );
  document.getElementById("rightTextView").value = result;
  document
    .getElementById("statusForTranslating")
    .classList.add("visually-hidden");
}

let templateField = document.getElementById("template");
const templateVal = new Choices(templateField);
templateVal.setChoices([{ value: 0, label: "Normal" }]);

let genderField = document.getElementById("gender");
const genderVal = new Choices(genderField);
genderVal.setChoices([
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
]);

function onClickSetting() {
  document.getElementById("chatPage").style.display = "none";
  document.getElementById("settingPage").style.display = "flex";
}

function onClickClose() {
  document.getElementById("chatPage").style.display = "flex";
  document.getElementById("settingPage").style.display = "none";
}

async function getSettings() {
  const result = await window.openaiAPI.executeQuery(
    "SELECT * FROM settings LIMIT 1;",
    "all"
  );
  if (result.length != 0) {
    document.getElementById("clientNotes").value = result[0][1];
    document.getElementById("name").value = result[0][2];
    document.getElementById("age").value = result[0][3];
    genderVal.setChoiceByValue(result[0][4]);
    document.getElementById("occupation").value = result[0][5];
    document.getElementById("residence").value = result[0][6];
    document.getElementById("personality").value = result[0][7];
    document.getElementById("income").value = result[0][8];
    document.getElementById("familyStatus").value = result[0][9];
    document.getElementById("educationDegree").value = result[0][10];
    document.getElementById("personal").value = result[0][11];
    document.getElementById("relationships").value = result[0][12];
    document.getElementById("interests").value = result[0][13];
    document.getElementById("specialSkills").value = result[0][14];
    document.getElementById("psyCharacterstics").value = result[0][15];
    document.getElementById("values").value = result[0][16];
    document.getElementById("dream").value = result[0][17];
  }
}
getSettings();

async function onClickSaveSetting() {
  let clientNotes = document.getElementById("clientNotes").value;
  let name = document.getElementById("name").value;
  let age = document.getElementById("age").value;
  let gender = document.getElementById("gender").value;
  let occupation = document.getElementById("occupation").value;
  let residence = document.getElementById("residence").value;
  let personality = document.getElementById("personality").value;
  let income = document.getElementById("income").value;
  let familyStatus = document.getElementById("familyStatus").value;
  let educationDegree = document.getElementById("educationDegree").value;
  let personal = document.getElementById("personal").value;
  let relationships = document.getElementById("relationships").value;
  let interests = document.getElementById("interests").value;
  let specialSkills = document.getElementById("specialSkills").value;
  let psyCharacterstics = document.getElementById("psyCharacterstics").value;
  let charactervalues = document.getElementById("values").value;
  let dream = document.getElementById("dream").value;
  await window.openaiAPI.executeQuery("DELETE FROM settings");
  await window.openaiAPI.executeQuery(
    "INSERT INTO settings (clientNotes, name, age, gender, occupation, residence, personality, income, familyStatus, educationDegree, personal, relationships, interests, specialSkills, psyCharacterstics, charactervalues, dream) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    "all",
    [
      clientNotes,
      name,
      age,
      gender,
      occupation,
      residence,
      personality,
      income,
      familyStatus,
      educationDegree,
      personal,
      relationships,
      interests,
      specialSkills,
      psyCharacterstics,
      charactervalues,
      dream
    ]
  );
  Swal.fire({
    toast: true,
    icon: "success",
    title: "Saved successfully!",
    animation: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
  });
}
