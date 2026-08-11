document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");

  if (menu) {
    menu.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");

      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();

        document.querySelector(id).scrollIntoView({
          behavior: "smooth"
        });

        if (nav) nav.classList.remove("open");
      }
    });
  });

  document.querySelectorAll("[data-goal]").forEach(btn => {
    btn.addEventListener("click", () => {
      const goal = btn.dataset.goal;
      const input = document.getElementById("heroQuestion");

      if (input) {
        input.value = goal;
        input.focus();
      }

      document.getElementById("ai")?.scrollIntoView({
        behavior: "smooth"
      });

      setTimeout(() => runAI(goal), 450);
    });
  });

  document.getElementById("heroAsk")?.addEventListener("click", () => {
    const input = document.getElementById("heroQuestion");

    runAI(
      input?.value ||
      "I want a clear career and earning path."
    );
  });

  document.getElementById("aiSend")?.addEventListener("click", () => {
    const input = document.getElementById("aiInput");

    runAI(
      input?.value ||
      "I want a clear career and earning path."
    );
  });

  document.getElementById("aiInput")?.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      runAI(e.target.value);
    }
  });

  document.querySelectorAll("[data-solution]").forEach(btn => {
    btn.addEventListener("click", () => {
      showToast(
        btn.dataset.solution +
        " request selected."
      );

      location.href = "contact.html";
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
  });
});


/* =========================================
   DAKSHORA REAL AI
========================================= */

async function runAI(text) {
  const clean = (text || "").trim();

  if (!clean) {
    showToast("कृपया अपनी समस्या बताइए।");
    return;
  }

  const bubble = document.getElementById("userBubble");
  const result = document.getElementById("aiResult");

  if (bubble) {
    bubble.textContent = clean;
  }

  if (result) {
    result.innerHTML = `
      <b>🤖 DAKSHORA AI सोच रहा है...</b>
      <span>आपकी समस्या समझी जा रही है...</span>
    `;

    result.classList.add("loading");
  }

  try {
    const response = await fetch("/api/dakshora-ai", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: clean
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "DAKSHORA AI request failed."
      );
    }

    displayAIResponse(data);

  } catch (error) {
    console.error("DAKSHORA AI ERROR:", error);

    if (result) {
      result.innerHTML = `
        <b>⚠️ DAKSHORA AI</b>
        <span>
          अभी AI से connection नहीं हो पाया।
          कृपया थोड़ी देर बाद फिर कोशिश करें।
        </span>
      `;
    }

    showToast("DAKSHORA AI connection problem.");
  }
}


/* =========================================
   DISPLAY AI RESPONSE
========================================= */

function displayAIResponse(data) {
  const result = document.getElementById("aiResult");

  if (!result) return;

  const title = escapeHTML(
    data.title || "DAKSHORA AI"
  );

  const answer = escapeHTML(
    data.answer || ""
  );

  const steps = Array.isArray(data.nextSteps)
    ? data.nextSteps
    : [];

  const stepsHTML = steps.length
    ? `
      <div class="ai-next-steps">
        <strong>अगले कदम</strong>

        <ol>
          ${steps
            .map(step => `<li>${escapeHTML(step)}</li>`)
            .join("")}
        </ol>
      </div>
    `
    : "";

  result.innerHTML = `
    <b>${title}</b>

    <p>
      ${answer.replace(/\n/g, "<br>")}
    </p>

    ${stepsHTML}

    <div class="ai-response-actions">

      <button
        type="button"
        onclick="speakDAKSHORA()">
        🔊 सुनें
      </button>

      <button
        type="button"
        onclick="stopDAKSHORA()">
        ⏹️ रोकें
      </button>

    </div>
  `;

  result.classList.remove("loading");

  window.__dakshoraLastAnswer =
    `${data.title || ""}. ` +
    `${data.answer || ""}. ` +
    `${steps.join(". ")}`;

  window.__dakshoraLanguage =
    data.language || "en";
}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================
   TEXT TO SPEECH
========================================= */

function speakDAKSHORA() {
  const text = window.__dakshoraLastAnswer;

  if (!text) {
    showToast("DAKSHORA का जवाब अभी उपलब्ध नहीं है।");
    return;
  }

  if (!("speechSynthesis" in window)) {
    showToast("इस device में voice playback उपलब्ध नहीं है।");
    return;
  }

  speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang =
    getSpeechLanguage(
      window.__dakshoraLanguage
    );

  utterance.rate = 0.9;
  utterance.pitch = 1;

  speechSynthesis.speak(utterance);
}


function stopDAKSHORA() {
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
}


function getSpeechLanguage(language) {
  const lang =
    String(language || "").toLowerCase();

  if (lang.includes("hindi") || lang === "hi") {
    return "hi-IN";
  }

  if (lang.includes("punjabi") || lang === "pa") {
    return "pa-IN";
  }

  if (lang.includes("bengali") || lang === "bn") {
    return "bn-IN";
  }

  if (lang.includes("marathi") || lang === "mr") {
    return "mr-IN";
  }

  if (lang.includes("gujarati") || lang === "gu") {
    return "gu-IN";
  }

  if (lang.includes("tamil") || lang === "ta") {
    return "ta-IN";
  }

  if (lang.includes("telugu") || lang === "te") {
    return "te-IN";
  }

  if (lang.includes("kannada") || lang === "kn") {
    return "kn-IN";
  }

  if (lang.includes("malayalam") || lang === "ml") {
    return "ml-IN";
  }

  return "en-IN";
}


/* =========================================
   TOAST
========================================= */

function showToast(message) {
  const toast =
    document.getElementById("toast");

  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(window.__toast);

  window.__toast = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}
