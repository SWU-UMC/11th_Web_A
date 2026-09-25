const message = document.querySelector("#message");
const cheerButton = document.querySelector("#cheer-button");
const firstMessage = "UMC 11기 Web 챌린저 애플/이석현입니다!";

cheerButton.addEventListener("click", function () {
  if (message.textContent === firstMessage) {
    message.textContent = "오늘도 개발 공부 파이팅!! 💫";
  } else {
    message.textContent = firstMessage;
  }
});
