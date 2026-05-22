"use strict";

/* =============================================
   SCREW EMPIRE - Idle Factory Game
   JavaScript complet - logique, UI, sauvegarde
   ============================================= */

// ---- DONNÉES DES PRODUCTEURS ----
const PRODUCERS = [
  { id: 0,  name: "Ouvrier Manuel",       base: 0.5,   cost: 15,    phase: 1, icon: "👷" },
  { id: 1,  name: "Machine Industrielle",  base: 3,     cost: 100,   phase: 1, icon: "⚙️"  },
  { id: 2,  name: "Atelier Automatisé",    base: 15,    cost: 500,   phase: 2, icon: "🏭"  },
  { id: 3,  name: "Chaîne d'Assemblage",   base: 75,    cost: 2500,  phase: 2, icon: "🔧"  },
  { id: 4,  name: "Complexe Robotisé",     base: 375,   cost: 12500, phase: 3, icon: "🤖"  },
  { id: 5,  name: "Nano-Usine",            base: 1875,  cost: 62500, phase: 4, icon: "💠"  },
  { id: 6,  name: "Forge Quantique",       base: 9375,  cost: 312500,phase: 5, icon: "⚡"  },
];

// ---- DONNÉES DES AMÉLIORATIONS ----
const UPGRADES = [
  { id: 0,  name: "Meilleurs Marteaux",    effect: "click",    mult: 2,   cost: 50,      phase: 1, icon: "🔨" },
  { id: 1,  name: "Lubrification",          effect: "prod",     mult: 1.5, cost: 200,     phase: 1, icon: "🛢️" },
  { id: 2,  name: "Contrôle Qualité",       effect: "value",    mult: 2,   cost: 500,     phase: 1, icon: "✅" },
  { id: 3,  name: "Outils de Précision",    effect: "click",    mult: 3,   cost: 5000,    phase: 2, icon: "📐" },
  { id: 4,  name: "Optimisation",           effect: "prod",     mult: 2,   cost: 10000,   phase: 2, icon: "📈" },
  { id: 5,  name: "Marque Premium",         effect: "value",    mult: 3,   cost: 25000,   phase: 2, icon: "💎" },
  { id: 6,  name: "Nano-Palpeur",          effect: "click",    mult: 5,   cost: 100000,  phase: 3, icon: "🔬" },
  { id: 7,  name: "Suite d'Automatisation", effect: "prod",     mult: 3,   cost: 250000,  phase: 3, icon: "🔄" },
  { id: 8,  name: "Distribution Globale",   effect: "value",    mult: 5,   cost: 500000,  phase: 3, icon: "🌐" },
  { id: 9,  name: "Clic Quantique",         effect: "click",    mult: 10,  cost: 2e6,     phase: 4, icon: "⚛️" },
  { id: 10, name: "IA d'Optimisation",      effect: "prod",     mult: 5,   cost: 5e6,     phase: 4, icon: "🧠" },
  { id: 11, name: "Domination du Marché",   effect: "value",    mult: 10,  cost: 1e7,     phase: 4, icon: "👑" },
  { id: 12, name: "Forge Singularité",      effect: "click",    mult: 25,  cost: 1e8,     phase: 5, icon: "🌀" },
  { id: 13, name: "Nano-Assemblage",        effect: "prod",     mult: 10,  cost: 2.5e8,   phase: 5, icon: "🧬" },
  { id: 14, name: "Monopole Mondial",       effect: "value",    mult: 25,  cost: 5e8,     phase: 5, icon: "🌍" },
];

// ---- PHASES ----
const PHASES = [
  { level: 1, name: "Production Simple",     threshold: 0,          desc: "Clics et production de base" },
  { level: 2, name: "Industrialisation",     threshold: 1000,       desc: "Machines et automatisation" },
  { level: 3, name: "Optimisation Avancée",  threshold: 50000,      desc: "Profit et efficacité" },
  { level: 4, name: "Économie de Pointe",    threshold: 1e6,        desc: "Systèmes financiers optimisés" },
  { level: 5, name: "Production Absolue",    threshold: 1e8,        desc: "Croissance exponentielle" },
];

// ---- SUCCÈS ----
const ACHIEVEMENTS = [
  { id: 0,  name: "Premier Profit",     check: s => s.totalMoney >= 100,         icon: "🪙" },
  { id: 1,  name: "Business en Croissance", check: s => s.totalMoney >= 1000,    icon: "💰" },
  { id: 2,  name: "Industriel",         check: s => s.totalMoney >= 1e5,         icon: "🏭" },
  { id: 3,  name: "Millionnaire",       check: s => s.totalMoney >= 1e6,         icon: "💵" },
  { id: 4,  name: "Milliardaire",       check: s => s.totalMoney >= 1e9,         icon: "💎" },
  { id: 5,  name: "Premier Ouvrier",    check: s => s.producers[0] >= 1,         icon: "👷" },
  { id: 6,  name: "Équipe Complète",    check: s => s.producers[0] >= 10,        icon: "👥" },
  { id: 7,  name: "Mécanisé",           check: s => s.producers[1] >= 1,         icon: "⚙️" },
  { id: 8,  name: "Automatisé",         check: s => s.producers[2] >= 1,         icon: "🏭" },
  { id: 9,  name: "Propriétaire d'Usine", check: s => s.producers[3] >= 1,       icon: "🔧" },
  { id: 10, name: "Robotique",          check: s => s.producers[4] >= 1,         icon: "🤖" },
  { id: 11, name: "Nano-Tech",          check: s => s.producers[5] >= 1,         icon: "💠" },
  { id: 12, name: "Ère Quantique",      check: s => s.producers[6] >= 1,         icon: "⚡" },
  { id: 13, name: "Clicker",            check: s => s.totalClicks >= 100,        icon: "🖱️" },
  { id: 14, name: "Clicker Fou",        check: s => s.totalClicks >= 1000,       icon: "⌨️" },
  { id: 15, name: "Clicker Légende",    check: s => s.totalClicks >= 10000,      icon: "🏆" },
  { id: 16, name: "Novice de la Vis",   check: s => s.totalScrews >= 1000,       icon: "🔩" },
  { id: 17, name: "Expert en Vis",      check: s => s.totalScrews >= 1e5,        icon: "⭐" },
  { id: 18, name: "Maître de la Vis",   check: s => s.totalScrews >= 1e7,        icon: "🌟" },
  { id: 19, name: "Dieu de la Vis",     check: s => s.totalScrews >= 1e9,        icon: "👑" },
];

/* =============================================
   ÉTAT DU JEU
   ============================================= */
let game = null;

function createInitialState() {
  return {
    screws: 0,
    money: 0,
    totalScrews: 0,
    totalScrewsAllTime: 0,
    totalMoney: 0,
    totalClicks: 0,
    producers: PRODUCERS.map(() => 0),
    upgrades: UPGRADES.map(() => false),
    achievements: ACHIEVEMENTS.map(() => false),
    currentPhase: 1,
    prestigeMultiplier: 1,
    prestigeCount: 0,
    settings: {
      theme: 'dark',
      animations: true,
    },
    buyMultiplier: 1,
  };
}

/* =============================================
   UTILITAIRES
   ============================================= */
function formatNumber(n) {
  if (Math.abs(n) < 0.001 && n !== 0) return n.toExponential(2);
  if (Math.abs(n) < 1000) return n.toFixed(n % 1 === 0 ? 0 : 1);
  const suffixes = ['', 'k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
  const tier = Math.min(Math.floor(Math.log10(Math.abs(n)) / 3), suffixes.length - 1);
  if (tier === 0) return Math.floor(n).toLocaleString();
  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = n / scale;
  return scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0) + suffix;
}

function formatMoney(n) {
  if (Math.abs(n) < 0.01 && n > 0) return "$" + n.toExponential(2);
  if (Math.abs(n) < 1000) return "$" + n.toFixed(2);
  return "$" + formatNumber(n);
}

function formatScrews(n) {
  if (Math.abs(n) < 1000) return Math.floor(n).toLocaleString();
  return formatNumber(n);
}

function getProducerCost(producerIndex) {
  const p = PRODUCERS[producerIndex];
  const owned = game.producers[producerIndex];
  return Math.floor(p.cost * Math.pow(1.15, owned));
}

function getProducerCostN(index, fromOwned, n) {
  const p = PRODUCERS[index];
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += Math.floor(p.cost * Math.pow(1.15, fromOwned + i));
  }
  return total;
}

function getMaxAffordable(index, maxWanted) {
  const p = PRODUCERS[index];
  const owned = game.producers[index];
  let totalCost = 0;
  let count = 0;
  for (let i = 0; i < maxWanted; i++) {
    const c = Math.floor(p.cost * Math.pow(1.15, owned + i));
    if (totalCost + c > game.money) break;
    totalCost += c;
    count++;
  }
  return { count, totalCost };
}

function getProductionPerSecond() {
  let total = 0;
  const eff = game._upgradeProd || 1;
  const pm = game.prestigeMultiplier;
  game.producers.forEach((count, i) => {
    if (count > 0) {
      total += PRODUCERS[i].base * count * eff * pm;
    }
  });
  return total;
}

function getClickPower() {
  const mult = game._upgradeClick || 1;
  return 1 * mult;
}

function getScrewValue() {
  const mult = game._upgradeValue || 1;
  return 1 * mult;
}

function getPhaseThreshold(level) {
  const p = PHASES.find(ph => ph.level === level);
  return p ? p.threshold : Infinity;
}

/* =============================================
   LOGIQUE DU JEU
   ============================================= */
let _buyingLock = 0;

function clickProduce() {
  const power = getClickPower();
  game.screws += power;
  game.totalScrews += power;
  game.totalClicks++;
  updateUI();
  if (game.settings.animations) {
    showFloatingText("+" + formatScrews(power), "vis");
  }
}

function sellScrews() {
  if (game.screws <= 0) return;
  const value = getScrewValue();
  const earned = game.screws * value;
  game.money += earned;
  game.totalMoney += earned;
  if (game.settings.animations && earned > 0) {
    showFloatingText("+" + formatMoney(earned), "money");
  }
  game.screws = 0;
  updateUI();
}

function buyProducer(index) {
  if (_buyingLock) return;
  _buyingLock = 1;

  try {
    const producer = PRODUCERS[index];
    if (producer.phase > game.currentPhase) return;

    const mult = game.buyMultiplier || 1;
    const { count, totalCost } = getMaxAffordable(index, mult);

    if (count === 0) return;

    game.money -= totalCost;
    game.producers[index] += count;

    if (count >= 10 && game.settings.animations) {
      showNotification("+" + count + " " + producer.name + " recruté(s) !", "success");
    }

    updateUI();
    checkAchievements();
    checkPhase();
  } finally {
    _buyingLock = 0;
  }
}

function buyUpgrade(index) {
  if (_buyingLock) return;
  _buyingLock = 1;

  try {
    const upgrade = UPGRADES[index];
    if (game.upgrades[index]) return;
    if (upgrade.phase > game.currentPhase) return;
    if (game.money < upgrade.cost) return;

    game.money -= upgrade.cost;
    game.upgrades[index] = true;

    recalcUpgrades();

    const msg = upgrade.name + " acheté !";
    showNotification(msg, "info");
    if (game.settings.animations) {
      showFloatingText(msg, "upgrade");
    }

    updateUI();
    checkAchievements();
  } finally {
    _buyingLock = 0;
  }
}

function recalcUpgrades() {
  let clickMult = 1;
  let prodMult = 1;
  let valueMult = 1;

  UPGRADES.forEach((u, i) => {
    if (game.upgrades[i]) {
      if (u.effect === "click") clickMult *= u.mult;
      if (u.effect === "prod") prodMult *= u.mult;
      if (u.effect === "value") valueMult *= u.mult;
    }
  });

  game._upgradeClick = clickMult;
  game._upgradeProd = prodMult;
  game._upgradeValue = valueMult;
}

/* =============================================
   PHASES
   ============================================= */
function checkPhase() {
  let newPhase = game.currentPhase;
  for (const p of PHASES) {
    if (game.totalScrews >= p.threshold && p.level > newPhase) {
      newPhase = p.level;
    }
  }

  if (newPhase > game.currentPhase) {
    game.currentPhase = newPhase;
    const phaseData = PHASES.find(p => p.level === newPhase);
    showNotification("Phase " + newPhase + " : " + phaseData.name + " débloquée !", "achievement");

    const newProducers = PRODUCERS.filter(p => p.phase === newPhase);
    if (newProducers.length > 0) {
      showNotification("Nouveaux systèmes de production disponibles !", "info");
    }
  }

  updateUI();
}

/* =============================================
   SUCCÈS
   ============================================= */
function checkAchievements() {
  ACHIEVEMENTS.forEach((a, i) => {
    if (!game.achievements[i] && a.check(game)) {
      game.achievements[i] = true;
      showNotification("🏆 Succès : " + a.name, "achievement");
    }
  });
}

/* =============================================
   PRESTIGE
   ============================================= */
function canPrestige() {
  return game.totalScrewsAllTime >= 1000000;
}

function getPrestigeMultiplier() {
  return 1 + Math.sqrt(game.totalScrewsAllTime) / 10000;
}

function doPrestige() {
  if (!canPrestige()) return;

  const newMult = getPrestigeMultiplier();

  game.prestigeMultiplier = newMult;
  game.prestigeCount++;
  game.screws = 0;
  game.money = 0;
  game.totalScrews = game.totalScrewsAllTime;
  game.producers = PRODUCERS.map(() => 0);
  game.upgrades = UPGRADES.map(() => false);
  game.currentPhase = 1;
  game._upgradeClick = 1;
  game._upgradeProd = 1;
  game._upgradeValue = 1;

  showNotification("★ Prestige réussi ! Multiplicateur x" + newMult.toFixed(2), "achievement");
  updateUI();
}

/* =============================================
   SAUVEGARDE
   ============================================= */
const SAVE_KEY = "screwEmpireSave";

function saveGame() {
  try {
    const data = {
      screws: game.screws,
      money: game.money,
      totalScrews: game.totalScrews,
      totalScrewsAllTime: game.totalScrewsAllTime,
      totalMoney: game.totalMoney,
      totalClicks: game.totalClicks,
      producers: game.producers,
      upgrades: game.upgrades,
      achievements: game.achievements,
      currentPhase: game.currentPhase,
      prestigeMultiplier: game.prestigeMultiplier,
      prestigeCount: game.prestigeCount,
      settings: game.settings,
      _upgradeClick: game._upgradeClick,
      _upgradeProd: game._upgradeProd,
      _upgradeValue: game._upgradeValue,
      buyMultiplier: game.buyMultiplier,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Save failed:", e);
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);

    game = createInitialState();

    const fields = [
      "screws","money","totalScrews","totalScrewsAllTime","totalMoney","totalClicks",
      "producers","upgrades","achievements","currentPhase",
      "prestigeMultiplier","prestigeCount","settings",
      "_upgradeClick","_upgradeProd","_upgradeValue",
      "buyMultiplier"
    ];
    for (const f of fields) {
      if (data[f] !== undefined) game[f] = data[f];
    }

    while (game.producers.length < PRODUCERS.length) game.producers.push(0);
    while (game.upgrades.length < UPGRADES.length) game.upgrades.push(false);
    while (game.achievements.length < ACHIEVEMENTS.length) game.achievements.push(false);

    const savedTheme = game.settings.theme || 'dark';
    document.documentElement.setAttribute("data-theme", savedTheme);
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) themeToggle.checked = (savedTheme === 'dark');

    const animToggle = document.getElementById("anim-toggle");
    if (animToggle) animToggle.checked = game.settings.animations !== false;
    document.documentElement.setAttribute("data-animations", game.settings.animations !== false ? "on" : "off");

    recalcUpgrades();

    return true;
  } catch (e) {
    console.warn("Load failed:", e);
    return false;
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  game = createInitialState();
  recalcUpgrades();
  document.documentElement.setAttribute("data-theme", game.settings.theme);
  updateUI();
  checkPhase();
  showScreen('menu');
  showNotification("Partie réinitialisée", "danger");
}

/* =============================================
   INTERFACE
   ============================================= */
function updateUI() {
  const screws = document.getElementById("screw-display");
  const money = document.getElementById("money-display");
  const profit = document.getElementById("profit-display");

  if (screws) screws.textContent = formatScrews(game.screws);
  if (money) money.textContent = formatMoney(game.money);

  const prodPS = getProductionPerSecond();
  const value = getScrewValue();
  const profitPS = prodPS * value;
  if (profit) {
    profit.textContent = formatMoney(profitPS) + "/s";
  }

  const prodRate = document.getElementById("production-rate");
  if (prodRate) prodRate.textContent = "(" + formatScrews(prodPS) + " vis/s)";

  const sellBtn = document.getElementById("sell-btn");
  if (sellBtn) {
    sellBtn.textContent = "💰 VENDRE (" + formatScrews(game.screws) + " vis)";
    sellBtn.disabled = game.screws <= 0;
  }

  const phaseName = document.getElementById("phase-name");
  const phaseScrews = document.getElementById("phase-screws");
  const phaseProgress = document.getElementById("phase-progress");

  if (phaseName) phaseName.textContent = "Phase " + game.currentPhase + " : " + PHASES[game.currentPhase - 1].name;

  const nextPhase = PHASES.find(p => p.level === game.currentPhase + 1);
  if (phaseScrews && nextPhase) {
    const current = Math.min(game.totalScrews, nextPhase.threshold);
    phaseScrews.textContent = formatScrews(current) + " / " + formatScrews(nextPhase.threshold) + " vis";
    if (phaseProgress) {
      const pct = (current / nextPhase.threshold) * 100;
      phaseProgress.style.width = Math.min(pct, 100) + "%";
    }
  } else if (phaseScrews) {
    phaseScrews.textContent = "Phase max atteinte";
    if (phaseProgress) phaseProgress.style.width = "100%";
  }

  updateProducersUI();
  updateUpgradesUI();
  updateAchievementsUI();

  if (!updateUI._lastSave || Date.now() - updateUI._lastSave > 2000) {
    saveGame();
    updateUI._lastSave = Date.now();
  }
}

function updateProducersUI() {
  const container = document.getElementById("producers-container");
  if (!container) return;

  const mult = game.buyMultiplier || 1;

  let html = "";
  PRODUCERS.forEach((p, i) => {
    const owned = game.producers[i];
    const cost = getProducerCost(i);
    const locked = p.phase > game.currentPhase;
    const actualProd = owned > 0 ? (p.base * owned * (game._upgradeProd || 1) * game.prestigeMultiplier) : 0;

    let btnLabel = "";
    let btnDisabled = locked;
    let btnClass = "";

    if (locked) {
      btnLabel = "🔒";
      btnDisabled = true;
    } else if (mult > 1) {
      const { count, totalCost } = getMaxAffordable(i, mult);
      if (count > 0) {
        btnLabel = "ACHETER ×" + count + "<br><span class=\"cost-text\">" + formatMoney(totalCost) + "</span>";
        btnClass = "btn-primary";
      } else {
        btnLabel = "ACHETER ×" + mult + "<br><span class=\"cost-text\">" + formatMoney(cost) + "</span>";
        btnDisabled = true;
      }
    } else {
      if (game.money >= cost) {
        btnLabel = "ACHETER<br><span class=\"cost-text\">" + formatMoney(cost) + "</span>";
        btnClass = "btn-primary";
      } else {
        btnLabel = "ACHETER<br><span class=\"cost-text\">" + formatMoney(cost) + "</span>";
        btnDisabled = true;
      }
    }

    html += `
      <div class="producer-item ${locked ? 'locked' : ''}">
        <div class="producer-info">
          <div class="producer-name">${locked ? '🔒 ' : p.icon + ' '}${p.name}</div>
          <div class="producer-stats">${owned > 0 ? '+' + formatScrews(actualProd) + ' vis/s' : '—'}</div>
        </div>
        <div class="producer-count">${owned}</div>
        <button class="btn ${btnClass}" 
                onclick="buyProducer(${i})" 
                ${btnDisabled ? 'disabled' : ''}>
          ${btnLabel}
        </button>
      </div>`;
  });

  container.innerHTML = html;
}

function updateUpgradesUI() {
  const container = document.getElementById("upgrades-container");
  if (!container) return;

  let html = "";
  UPGRADES.forEach((u, i) => {
    const owned = game.upgrades[i];
    const locked = u.phase > game.currentPhase;
    const canAfford = game.money >= u.cost;

    let effectText = "";
    if (u.effect === "click") effectText = "clic ×" + u.mult;
    else if (u.effect === "prod") effectText = "production ×" + u.mult;
    else if (u.effect === "value") effectText = "valeur ×" + u.mult;

    html += `
      <div class="upgrade-item ${locked ? 'locked' : ''} ${owned ? 'owned' : ''}">
        <div class="producer-info">
          <div class="upgrade-name">${locked ? '🔒 ' : u.icon + ' '}${u.name}</div>
          <div class="upgrade-effect">${owned ? '✓ Acheté' : effectText}</div>
        </div>
        <button class="btn ${canAfford && !locked && !owned ? 'btn-accent' : ''}" 
                onclick="buyUpgrade(${i})" 
                ${locked || owned || !canAfford ? 'disabled' : ''}>
          ${owned ? '✓' : formatMoney(u.cost)}
        </button>
      </div>`;
  });

  container.innerHTML = html;
}

function updateAchievementsUI() {
  const container = document.getElementById("achievements-container");
  const counter = document.getElementById("achievement-counter");
  if (!container) return;

  const unlocked = game.achievements.filter(a => a).length;
  if (counter) counter.textContent = "(" + unlocked + "/" + ACHIEVEMENTS.length + ")";

  let html = "";
  ACHIEVEMENTS.forEach((a, i) => {
    const owned = game.achievements[i];
    html += `
      <div class="achievement-badge ${owned ? 'unlocked' : ''}" 
           data-name="${a.name}"
           title="${a.name}">
        ${a.icon}
      </div>`;
  });

  container.innerHTML = html;
}

/* ---- NOTIFICATIONS ---- */
function showNotification(message, type) {
  const container = document.getElementById("notification-container");
  if (!container) return;

  const el = document.createElement("div");
  el.className = "notification " + (type || "info");
  el.textContent = message;
  container.appendChild(el);

  setTimeout(() => {
    el.classList.add("fade-out");
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

/* ---- TEXTE FLOTTANT ---- */
let floatingId = 0;

function showFloatingText(text, type) {
  const produceBtn = document.getElementById("produce-btn");
  if (!produceBtn) return;

  const el = document.createElement("div");
  el.id = "float-" + (floatingId++);
  el.textContent = text;
  el.style.cssText = `
    position: fixed;
    pointer-events: none;
    font-family: 'Fira Code', monospace;
    font-weight: 700;
    font-size: ${type === 'vis' ? '1rem' : '0.9rem'};
    color: ${type === 'vis' ? 'var(--accent)' : type === 'money' ? 'var(--success)' : 'var(--warning)'};
    z-index: 50;
    transition: all 0.8s ease-out;
    opacity: 1;
    text-shadow: 0 0 10px rgba(0,0,0,0.5);
  `;

  const rect = produceBtn.getBoundingClientRect();
  el.style.left = (rect.left + rect.width / 2 - 50) + "px";
  el.style.top = (rect.top - 10) + "px";

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = "translateY(-60px)";
    el.style.opacity = "0";
  });

  setTimeout(() => el.remove(), 900);
}

/* ---- ÉCRANS ---- */
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  if (screen === 'game') {
    document.getElementById("game-screen").classList.add("active");
    updateUI();
  } else {
    document.getElementById("menu-screen").classList.add("active");
  }
}

/* ---- PARAMÈTRES ---- */
function toggleSettings() {
  const modal = document.getElementById("settings-modal");
  if (modal) modal.classList.toggle("active");
}

function closeSettingsOutside(event) {
  if (event.target === event.currentTarget) toggleSettings();
}

function toggleTheme() {
  const toggle = document.getElementById("theme-toggle");
  const theme = toggle.checked ? 'dark' : 'light';
  document.documentElement.setAttribute("data-theme", theme);
  game.settings.theme = theme;
  saveGame();
}

function toggleAnimations() {
  const toggle = document.getElementById("anim-toggle");
  const on = toggle.checked;
  document.documentElement.setAttribute("data-animations", on ? "on" : "off");
  game.settings.animations = on;
  saveGame();
}

function buyMultiplierSet(mult) {
  game.buyMultiplier = mult;
  document.querySelectorAll(".buy-multiplier .btn").forEach(b => b.classList.remove("active"));
  const btns = document.querySelectorAll(".buy-multiplier .btn");
  const map = {1:0, 10:1, 100:2};
  const idx = map[mult] || 0;
  if (btns[idx]) btns[idx].classList.add("active");
  saveGame();
  updateProducersUI();
}

/* ---- CONFIRMATIONS ---- */
function confirmReset() {
  if (confirm("Êtes-vous sûr de vouloir réinitialiser votre partie ?\nToute progression sera perdue !")) {
    resetGame();
    toggleSettings();
  }
}

function confirmPrestige() {
  if (!canPrestige()) {
    showNotification("Préstige disponible à partir de 1M de vis produites", "danger");
    return;
  }

  const mult = getPrestigeMultiplier();
  const msg = "⚠️ PRESTIGE\n\n" +
    "Vous allez réinitialiser votre progression actuelle, mais gagnerez un multiplicateur permanent.\n\n" +
    "Multiplicateur obtenu : ×" + mult.toFixed(4) + "\n" +
    "Nombre de prestiges : " + (game.prestigeCount + 1) + "\n\n" +
    "Vis produites (total) : " + formatScrews(game.totalScrewsAllTime) + "\n\n" +
    "Continuer ?";

  if (confirm(msg)) {
    doPrestige();
  }
}

/* =============================================
   BOUCLE DE JEU
   ============================================= */
let lastTick = Date.now();
let saveTimer = 0;

function gameLoop() {
  const now = Date.now();
  const dt = Math.min((now - lastTick) / 1000, 5);
  lastTick = now;

  if (!game) return;

  const prodPS = getProductionPerSecond();
  const produced = prodPS * dt;
  game.screws += produced;
  game.totalScrews += produced;
  game.totalScrewsAllTime += produced;

  checkPhase();
  checkAchievements();

  updateUI();
}

function init() {
  const loaded = loadGame();
  if (!loaded) {
    game = createInitialState();
    recalcUpgrades();
  }

  showScreen('menu');

  document.documentElement.setAttribute("data-theme", game.settings.theme || 'dark');
  document.documentElement.setAttribute("data-animations", game.settings.animations !== false ? "on" : "off");

  setInterval(gameLoop, 100);
  setInterval(saveGame, 30000);

  window.addEventListener("beforeunload", saveGame);

  document.addEventListener("keydown", (e) => {
    if (e.key === " " && !e.repeat) {
      e.preventDefault();
      if (document.getElementById("game-screen").classList.contains("active")) {
        clickProduce();
      }
    }
  });

  console.log("Screw Empire initialisé !");
  console.log("🔩 Produisez des vis, construisez votre empire !");
}

/* =============================================
   DÉMARRAGE
   ============================================= */
document.addEventListener("DOMContentLoaded", init);
