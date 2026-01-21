document.addEventListener("DOMContentLoaded", () => {
  const aiButton = document.getElementById("ai-assistant-btn");
  const aiPopup = document.getElementById("ai-popup");
  const aiIcon = aiButton.querySelector(".ai-icon");

  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("ai-chat-box");
  const sendBtn = document.getElementById("send-btn");
  const initialMessage = document.getElementById("initial-message");

  let isOpen = false;
  let isAnimating = false;
  let isTyping = false;

  function openWidget() {
    if (isAnimating) return;
    isAnimating = true;

    isOpen = true;
    aiPopup.classList.add("active");
    aiIcon.classList.add("open");
    aiIcon.src = "assets/icons/close.svg";

    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  function closeWidget() {
    if (isAnimating) return;
    isAnimating = true;

    isOpen = false;
    aiPopup.classList.remove("active");
    aiIcon.classList.remove("open");
    aiIcon.src = "assets/icons/popup.svg";

    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  aiButton.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent outside click
    isOpen ? closeWidget() : openWidget();
  });

  aiPopup.addEventListener("click", (e) => {
    e.stopPropagation(); // allow interaction inside popup
  });

  document.addEventListener("click", () => {
    if (isOpen) closeWidget();
  });

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    initialMessage?.classList.add("hidden");

    addUserMessage(message);
    userInput.value = "";

    setTimeout(fakeAIResponse, 600);
  }

  function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "chat-message user";
    div.textContent = text;
    chatBox.appendChild(div);
    scrollToBottom();
  }

  function fakeAIResponse() {
    if (isTyping) return;
    isTyping = true;

    const responses = [
      "Sure! I can help you with that.",
      "That’s a great question.",
      "Let me check that for you.",
      "Absolutely — here’s what you need to know.",
      "Happy to help!",
      "Great question."
    ];

    const reply =
      responses[Math.floor(Math.random() * responses.length)];

    const aiDiv = document.createElement("div");
    aiDiv.className = "chat-message ai";
    chatBox.appendChild(aiDiv);

    typeText(reply, aiDiv);
  }

  function typeText(text, el) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i++];
        scrollToBottom();
      } else {
        clearInterval(interval);
        isTyping = false;
      }
    }, 20);
  }

  function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

