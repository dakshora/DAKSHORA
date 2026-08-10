document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu-btn"), nav = document.querySelector(".nav");
  if(menu) menu.addEventListener("click", () => nav.classList.toggle("open"));

  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if(id.length > 1 && document.querySelector(id)){ e.preventDefault(); document.querySelector(id).scrollIntoView({behavior:"smooth"}); if(nav) nav.classList.remove("open");}
  }));

  document.querySelectorAll("[data-goal]").forEach(btn => btn.addEventListener("click", () => {
    const goal = btn.dataset.goal;
    const input = document.getElementById("heroQuestion");
    if(input){ input.value = goal; input.focus(); }
    document.getElementById("ai")?.scrollIntoView({behavior:"smooth"});
    setTimeout(() => runAI(goal), 450);
  }));

  document.getElementById("heroAsk")?.addEventListener("click", () => runAI(document.getElementById("heroQuestion").value || "I want a clear career and earning path."));
  document.getElementById("aiSend")?.addEventListener("click", () => runAI(document.getElementById("aiInput").value || "I want a clear career and earning path."));
  document.getElementById("aiInput")?.addEventListener("keydown", e => { if(e.key==="Enter") runAI(e.target.value); });

  document.querySelectorAll("[data-solution]").forEach(btn => btn.addEventListener("click", () => {
    showToast(btn.dataset.solution + " request selected. Contact flow is ready for backend integration.");
    location.href = "contact.html";
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("visible"); }), {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});

function runAI(text){
  const clean = text.trim() || "I want a clear path";
  const bubble = document.getElementById("userBubble");
  const result = document.getElementById("aiResult");
  if(bubble) bubble.textContent = clean;
  if(result){
    let title = "Your starter path";
    let path = "Discover → Learn → Build → Prove → Opportunity";
    const t = clean.toLowerCase();
    if(t.includes("earn") || t.includes("money") || t.includes("income")) { title="Your earning-first path"; path="Skill Gap → High-value Skill → Portfolio → First Client → Earn → Grow"; }
    else if(t.includes("business") || t.includes("shop")) { title="Your business path"; path="Problem Diagnosis → AI Solution → Automation → Customer Value → Growth"; }
    else if(t.includes("ai")) { title="Your AI path"; path="AI Foundations → Practice → Build AI Workflow → Prove → Real Problem"; }
    else if(t.includes("job") || t.includes("career")) { title="Your career path"; path="Assessment → Skill Gap → Learn → Projects → Skill Passport → Opportunities"; }
    result.innerHTML = `<b>${title}</b><span>${path}</span>`;
  }
  showToast("DakshOra AI created a starter path. 🚀");
}

function showToast(message){
  const toast = document.getElementById("toast");
  if(!toast){ alert(message); return; }
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(window.__toast); window.__toast = setTimeout(()=>toast.classList.remove("show"), 3200);
}