const message = document.querySelector("#message");
const cheerButton = document.querySelector("#cheer-button");

cheerButton.addEventListener("click", function () {
  message.textContent = "좋아요! 작은 코드부터 직접 바꾸어 봅시다. 🚀";
});