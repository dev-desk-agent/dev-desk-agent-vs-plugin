(function () {
  const vscode = acquireVsCodeApi();
  const chatMessages = document.getElementById("chat-messages");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const previewContent = document.getElementById("preview-content");

  function addMessage(message, isUser = true) {
    const messageElement = document.createElement("div");
    messageElement.className = isUser ? "user-message" : "system-message";
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function updatePreview() {
    previewContent.textContent = messageInput.value;
  }

  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
      vscode.postMessage({ type: "sendMessage", value: message });
      addMessage(message);
      messageInput.value = "";
      updatePreview();
    }
  });

  messageInput.addEventListener("input", updatePreview);

  // Initial preview update
  updatePreview();
})();
