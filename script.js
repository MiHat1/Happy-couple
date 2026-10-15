const questionView = document.querySelector("#question-view");
const resultView = document.querySelector("#result-view");
const yesButton = document.querySelector("#yes-button");
const noButton = document.querySelector("#no-button");
const againButton = document.querySelector("#again-button");
const resultMessage = document.querySelector("#result-message");
const resultEyebrow = document.querySelector("#result-eyebrow");
const hint = document.querySelector("#hint");

const maxDodges = 15;
let dodgeCount = 0;

function showResult(result) {
  const isReject = result === "reject";

  document.body.classList.toggle("reject-state", isReject);
  document.body.classList.toggle("success-state", !isReject);
  questionView.hidden = true;
  resultView.hidden = false;
  resultEyebrow.textContent = isReject ? "Ui, vl thật luôn á:((( !" : "Anh biết mà , hê hê♡";
  resultMessage.textContent = isReject
    ? "em chả thương anh"
    : "làm liền luôn đi , lẹ lên";
}

function dodgeButton() {
  if (dodgeCount >= maxDodges) {
    return;
  }

  dodgeCount += 1;
  const buttonRect = noButton.getBoundingClientRect();
  const padding = 12;
  const minX = padding - buttonRect.left;
  const maxX = window.innerWidth - padding - buttonRect.right;
  const minY = padding - buttonRect.top;
  const maxY = window.innerHeight - padding - buttonRect.bottom;
  const currentTransform = noButton.dataset.offset
    ? JSON.parse(noButton.dataset.offset)
    : { x: 0, y: 0 };
  const deltaX = Math.max(minX, Math.min(maxX, Math.random() * 180 - 90));
  const deltaY = Math.max(minY, Math.min(maxY, Math.random() * 120 - 60));
  const x = currentTransform.x + deltaX;
  const y = currentTransform.y + deltaY;

  noButton.style.transform = `translate(${x}px, ${y}px)`;
  noButton.dataset.offset = JSON.stringify({ x, y });
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

  showResult("reject");
});

yesButton.addEventListener("click", () => showResult("success"));

againButton.addEventListener("click", () => {
  document.body.classList.remove("reject-state", "success-state");
  questionView.hidden = false;
  resultView.hidden = true;
  dodgeCount = 0;
  noButton.style.transform = "";
  delete noButton.dataset.offset;
  hint.textContent = "Nút từ chối đang hơi ngại đó…";
});
