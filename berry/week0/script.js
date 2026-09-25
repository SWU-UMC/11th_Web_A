const message = document.querySelector("#message");
const cheerButton = document.querySelector("#cheer-button");

cheerButton.addEventListener("click", function () {
  message.textContent = "화이팅! 열심히 해보자!";
});
