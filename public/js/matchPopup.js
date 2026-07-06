const banner = document.getElementById("match-banner");
const overlay = document.getElementById("match-overlay");
const closeBtn = document.getElementById("close-match");
const form = document.getElementById("match-form");
const result = document.getElementById("match-results");

const answers = {};

// Open popup
banner.addEventListener("click", () => {
    overlay.style.display = "flex";
});

// Close popup
closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
});

// Questionnaire buttons
document.querySelectorAll(".option-group button").forEach(btn => {

    btn.addEventListener("click", () => {

        const name = btn.dataset.name;

        document
            .querySelectorAll(`[data-name="${name}"]`)
            .forEach(b => b.classList.remove("selected"));

        btn.classList.add("selected");

        answers[name] = btn.dataset.value;

    });

});

// Submit questionnaire
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    result.innerHTML = `
        <div class="loadingContainer">

            <img
                src="/images/pawbot.gif"
                class="thinkingCat"
                onerror="this.src='https://cdn-icons-png.flaticon.com/512/616/616430.png'">

            <h2>🐾 PawBot is finding your soulmate...</h2>

            <div class="loader"></div>

            <p id="loadingText">
                Reading kitty personalities...
            </p>

        </div>
    `;

    const loadingText = document.getElementById("loadingText");

    const loadingMessages = [

        "Reading kitty personalities...",

        "Comparing lifestyles...",

        "Checking compatibility...",

        "Looking for the purrfect companion..."

    ];

    let index = 0;

    const interval = setInterval(() => {

        loadingText.textContent = loadingMessages[index];

        index = (index + 1) % loadingMessages.length;

    }, 1200);

    try {

        const response = await fetch("/match/find-match", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(answers)

        });

        clearInterval(interval);

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const data = await response.json();

        console.log("Server Response:", data);

        if (!data.matches || data.matches.length === 0) {

            result.innerHTML = `
                <h2>No matches found 😿</h2>
            `;

            return;

        }

        const medals = [

            "🥇 Perfect Match",

            "🥈 Great Match",

            "🥉 Wonderful Match"

        ];

        let html = `

            <h2 class="matchTitle">

                🏆 PawBot's Top Picks

            </h2>

            <p class="matchSubtitle">

                These cats fit your lifestyle best.

            </p>

        `;

        data.matches.forEach((cat, i) => {

            const image = cat.image && cat.image.trim() !== ""

                ? cat.image

                : "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600";

            html += `

            <div class="match-card fadeUp">

                <div class="ribbon">

                    ${medals[i] || "🐾 Match"}

                </div>

                <img

                    src="${image}"

                    class="match-image"

                    alt="${cat.name}"

                >

                <h2>${cat.name}</h2>

                <h4>${cat.breed || ""}</h4>

                <div class="scoreBar">

                    <div

                        class="scoreFill"

                        style="width:${cat.score}%">

                    </div>

                </div>

                <h3>${cat.score}% Compatible ❤️</h3>

                <p class="reason">

                    ${cat.reason}

                </p>

                <div class="badges">

                    <span>🐱 ${cat.age || "?"} yrs</span>

                    <span>🏡 ${answers.home || ""}</span>

                    <span>❤️ AI Match</span>

                </div>

                <a

                    href="/kitty/${cat.id}"

                    class="meetBtn">

                    🐾 Meet ${cat.name}

                </a>

            </div>

            `;

        });

        result.innerHTML = html;

    }

    catch (err) {

        clearInterval(interval);

        console.error(err);

        result.innerHTML = `

            <div style="text-align:center;padding:40px;">

                <h2>😿 Unable to find matches</h2>

                <p>Please try again later.</p>

            </div>

        `;

    }

});