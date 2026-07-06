const pawButton = document.getElementById("pawbot-button");
const pawWindow = document.getElementById("pawbot-window");
const closeButton = document.getElementById("close-chat");

const chatArea = document.getElementById("chat-area");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

// Open chatbot
pawButton.addEventListener("click", () => {
    pawWindow.style.display = "flex";
});

// Close chatbot
closeButton.addEventListener("click", () => {
    pawWindow.style.display = "none";
});

// Send button
sendBtn.addEventListener("click", sendMessage);

// Enter key
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

    const text = input.value.trim();

    if (!text) return;

    addUserMessage(text);

    input.value = "";

    showTyping();

    try {

        const ai = await getAIResponse(text);

        removeTyping();

        addBotMessage(ai.reply);

    } catch (err) {

        console.error(err);

        removeTyping();

        addBotMessage("😿 Sorry, PawBot is unavailable right now.");

    }

}

function addUserMessage(text) {

    const div = document.createElement("div");

    div.className = "user-message";

    div.innerText = text;

    chatArea.appendChild(div);

    scrollBottom();

}

function addBotMessage(text) {

    const div = document.createElement("div");

    div.className = "bot-message";

    div.innerText = text;

    chatArea.appendChild(div);

    scrollBottom();

}

function showTyping() {

    const typing = document.createElement("div");

    typing.className = "bot-message";

    typing.id = "typing";

    typing.innerHTML = "🐱 PawBot is typing...";

    chatArea.appendChild(typing);

    scrollBottom();

}

function removeTyping() {

    const typing = document.getElementById("typing");

    if (typing) {

        typing.remove();

    }

}

function scrollBottom() {

    chatArea.scrollTop = chatArea.scrollHeight;

}

async function getAIResponse(message) {

    const response = await fetch("/chatbot", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            message: message

        })

    });

    if (!response.ok) {

        throw new Error("Server Error");

    }

    return await response.json();

}