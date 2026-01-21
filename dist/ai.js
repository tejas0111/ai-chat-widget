(function () {
  const style = document.createElement("style");
  style.innerHTML = `
.ai-popup,
.ai-popup *,
.ai-assistant-btn,
.ai-assistant-btn * {
  box-sizing: border-box;
}

.ai-popup,
.ai-popup input,
.ai-popup button,
.ai-popup textarea,
.ai-popup .chat-message,
.ai-popup .initial-message,
.ai-assistant-btn {
  font-family: 'Poppins', sans-serif;
  color: #fff;
}

.ai-assistant-btn,
.send-btn,
.ai-icon {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  touch-action: manipulation;
}

.ai-assistant-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border-radius: 50%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.25s ease;
  z-index: 99999;
}

.ai-assistant-btn:hover {
  transform: scale(1.08);
}

.ai-icon {
  width: 28px;
  height: 28px;
  filter: invert(1);
  transition: transform 0.5s ease;
  transform: rotate(0deg);
}

.ai-icon.open {
  transform: rotate(90deg);
}

.ai-popup {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: min(380px, 90vw);
  height: min(560px, 75vh);
  background: #121212;
  border-radius: 22px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  pointer-events: none;
  transition: all 0.35s ease;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  z-index: 100000;
}

.ai-popup.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.ai-chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scrollbar-width: thin;
  scrollbar-color: #555 #1c1c1e;
}

.ai-chat-box::-webkit-scrollbar {
  width: 6px;
}

.ai-chat-box::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 10px;
}

.ai-input-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.75rem;
}

.ai-input-section input {
  flex: 1;
  min-width: 0; /* CRITICAL FIX */
  background: #1c1c1e;
  border: 1px solid #444;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  outline: none;
  font-size: 14px;
}

.ai-input-section input:focus {
  border-color: #777;
}

.send-btn {
  flex-shrink: 0;
  min-width: 64px;
  height: 40px;
  padding: 0 14px;
  border-radius: 14px;
  background: #2f2f2f;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s ease;
}

.send-btn:hover {
  background: #444;
}

.chat-message {
  max-width: 80%;
  line-height: 1.5;
  font-size: 14px;
}

.chat-message.user {
  align-self: flex-end;
  background: #2f2f2f;
  padding: 0.6rem 1rem;
  border-radius: 18px 18px 4px 18px;
}

.chat-message.ai {
  align-self: flex-start;
  background: transparent;
  padding: 0.6rem 1rem;
  position: relative;
}

.initial-message {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 15px;
  color: #888;
  text-align: center;
  transition: opacity 0.3s ease;
}

.initial-message.hidden {
  opacity: 0;
  pointer-events: none;
}

@media (max-width: 480px) {
  .ai-popup {
    right: 10px;
    bottom: 90px;
    height: 70vh;
  }

  .ai-assistant-btn {
    width: 54px;
    height: 54px;
  }

  .ai-icon {
    width: 24px;
  }
}

  `;
  document.head.appendChild(style);
  const html = `
    <div class="ai-popup" id="ai-popup">
      <div class="ai-chat-box" id="ai-chat-box"></div>
      <div class="initial-message" id="initial-message">
        Hey, how can I help you today?
      </div>
      <div class="ai-input-section">
        <input type="text" id="user-input" placeholder="Type a message..." />
        <button class="send-btn" id="send-btn">Send</button>
      </div>
    </div>

    <div class="ai-assistant-btn" id="ai-assistant-btn">
      <img src="icons/popup.svg" class="ai-icon" />
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

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
    aiIcon.src = "icons/close.svg";

    setTimeout(() => (isAnimating = false), 500);
  }

  function closeWidget() {
    if (isAnimating) return;
    isAnimating = true;
    isOpen = false;

    aiPopup.classList.remove("active");
    aiIcon.classList.remove("open");
    aiIcon.src = "icons/popup.svg";

    setTimeout(() => (isAnimating = false), 500);
  }

  aiButton.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen ? closeWidget() : openWidget();
  });

  aiPopup.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", () => {
    if (isOpen) closeWidget();
  });

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const msg = userInput.value.trim();
    if (!msg) return;

    initialMessage.classList.add("hidden");

    const userDiv = document.createElement("div");
    userDiv.className = "chat-message user";
    userDiv.textContent = msg;
    chatBox.appendChild(userDiv);
    userInput.value = "";
    scrollToBottom();

    setTimeout(fakeAIResponse, 600);
  }

  function fakeAIResponse() {
    if (isTyping) return;
    isTyping = true;

    const replies = [
      "Sure! I can help you with that.",
      "That’s a great question.",
      "Absolutely — happy to help.",
      "Let me look into that for you.",
      "Sounds good 👍"
    ];

    const reply = replies[Math.floor(Math.random() * replies.length)];
    const aiDiv = document.createElement("div");
    aiDiv.className = "chat-message ai";
    chatBox.appendChild(aiDiv);

    let i = 0;
    const interval = setInterval(() => {
      if (i < reply.length) {
        aiDiv.textContent += reply[i++];
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
})();

