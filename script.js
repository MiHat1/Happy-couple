const questionView = document.querySelector("#question-view");
const storyView = document.querySelector("#story-view");
const rejectView = document.querySelector("#reject-view");
const successView = document.querySelector("#success-view");
const actions = document.querySelector("#actions");
const yesButton = document.querySelector("#yes-button");
const noButton = document.querySelector("#no-button");
const againButton = document.querySelector("#again-button");
const storyMessage = document.querySelector("#story-message");
const successPhoto = document.querySelector("#success-photo");
const hint = document.querySelector("#hint");

const maxDodges = 3;
const storyScenes = [
  { image: "img/anh_trai.jpg", focus: "45%", message: "Anh như này" },
  { image: "img/anh_trai_01.jpg", focus: "24%", message: "Như này" },
  { image: "img/anh_trai_02.jpg", focus: "40%", message: "Như này" },
  { image: "img/anh_gai.jpg", focus: "47%", message: "Còn em như này" },
  { image: "img/anh_gai_1.jpg", focus: "41%", message: "Như này" },
  { image: "img/anh_gai_02.jpg", focus: "44%", message: "Như này" },
  {
    image: "img/anh_chung.jpg",
    focus: "50%",
    message: "Chúng ta phải như này chứ, huhu",
  },
];

let dodgeCount = 0;
let storyIndex = 0;
let revealTimer;

function setBackground(image, focus = "50%") {
  document.body.style.setProperty("--scene-image", `url("${image}")`);
  document.body.style.setProperty("--scene-focus", focus);
}

function showStoryScene() {
  const scene = storyScenes[storyIndex];

  document.body.className = "story-state";
  setBackground(scene.image, scene.focus);
  questionView.hidden = true;
  rejectView.hidden = true;
  successView.hidden = true;
  storyView.hidden = false;
  storyMessage.textContent = scene.message;
}

function showReject() {
  document.body.className = "reject-state";
  setBackground("img/reject.jpg");
  storyView.hidden = true;
  rejectView.hidden = false;
}

function startStory() {
  actions.append(noButton);
  storyIndex = 0;
  showStoryScene();
}

function continueStory() {
  storyIndex += 1;

  if (storyIndex >= storyScenes.length) {
    showReject();
    return;
  }

  showStoryScene();
}

function showSuccess() {
  actions.append(noButton);
  document.body.className = "success-state";
  setBackground("img/success.jpg");
  questionView.hidden = true;
  storyView.hidden = true;
  rejectView.hidden = true;
  successView.hidden = false;

  revealTimer = window.setTimeout(() => {
    successPhoto.hidden = false;
    requestAnimationFrame(() => successPhoto.classList.add("is-visible"));
  }, 3000);
}

function dodgeButton() {
  if (dodgeCount >= maxDodges) {
    return;
  }

  dodgeCount += 1;
  const padding = 16;
  const maxX = Math.max(
    padding,
    window.innerWidth - noButton.offsetWidth - padding,
  );
  const maxY = Math.max(
    padding,
    window.innerHeight - noButton.offsetHeight - padding,
  );

  if (noButton.parentElement !== document.body) {
    document.body.append(noButton);
  }
  noButton.style.position = "fixed";
  noButton.style.left = `${padding + Math.random() * (maxX - padding)}px`;
  noButton.style.top = `${padding + Math.random() * (maxY - padding)}px`;
  noButton.style.transform = "none";
  hint.textContent =
    dodgeCount === maxDodges
      ? "Thôi không né nữa, em bấm được rồi đó!"
      : `Né lần ${dodgeCount}/${maxDodges}…`;
}

noButton.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse" || event.pointerType === "pen") {
    dodgeButton();
  }
});

noButton.addEventListener("click", () => {
  if (dodgeCount < maxDodges) {
    dodgeButton();
    return;
  }

  startStory();
});

yesButton.addEventListener("click", showSuccess);
storyView.addEventListener("click", continueStory);
storyView.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    continueStory();
  }
});

againButton.addEventListener("click", () => {
  window.clearTimeout(revealTimer);
  actions.append(noButton);
  document.body.className = "question-state";
  document.body.style.removeProperty("--scene-image");
  document.body.style.removeProperty("--scene-focus");
  questionView.hidden = false;
  storyView.hidden = true;
  rejectView.hidden = true;
  successView.hidden = true;
  successPhoto.hidden = true;
  successPhoto.classList.remove("is-visible");
  dodgeCount = 0;
  noButton.style.position = "";
  noButton.style.left = "";
  noButton.style.top = "";
  noButton.style.transform = "";
  hint.textContent = "Nút giận đang hơi ngại đó…";
});
