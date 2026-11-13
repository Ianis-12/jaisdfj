// ==========================================
// PHASMO COACH - PART 1: DATA & MATRIX
// ==========================================

const GHOSTS = window.GHOST_DATA.ghosts;
const MAPS = window.MAP_DATA;
const MODES = window.GAME_MODES;
const EQUIP = window.EQUIPMENT_DATA;
const OBJECTIVES = window.OBJECTIVES_DATA;

const STORAGE_KEY = "phasmoCoachProfile";
const HISTORY_KEY = "phasmoCoachHistory";

const EV = { EMF5: 1 << 0, SPIRIT_BOX: 1 << 1, GHOST_WR: 1 << 2, UV: 1 << 3, FREEZING: 1 << 4, ORBS: 1 << 5, DOTS: 1 << 6 };
const EV_TO_BIT = { "EMF 5": EV.EMF5, "Spirit Box": EV.SPIRIT_BOX, "Ghost Writing": EV.GHOST_WR, "Ultraviolet": EV.UV, "Freezing": EV.FREEZING, "Orbs": EV.ORBS, "DOTS": EV.DOTS };

const TESTS = [
  { id: 0, name: "EMF 5", cat: "evidence", bit: EV.EMF5, item: "EMF Reader", tip: "Check immediately when an object moves." },
  { id: 1, name: "Ultraviolet", cat: "evidence", bit: EV.UV, item: "UV Light", tip: "Check doors/switches RIGHT after interaction." },
  { id: 2, name: "Spirit Box", cat: "evidence", bit: EV.SPIRIT_BOX, item: "Spirit Box", tip: "Lights OFF, close door, ask questions." },
  { id: 3, name: "Ghost Writing", cat: "evidence", bit: EV.GHOST_WR, item: "Ghost Writing Book", tip: "Place book, walk away." },
  { id: 4, name: "Freezing", cat: "evidence", bit: EV.FREEZING, item: "Thermometer", tip: "Look for visible breath." },
  { id: 5, name: "DOTS", cat: "evidence", bit: EV.DOTS, item: "D.O.T.S. Projector", tip: "Place at eye level." },
  { id: 6, name: "Orbs", cat: "evidence", bit: EV.ORBS, item: "Video Camera", tip: "Night Vision ON." },
  { id: 7, name: "Stepped in salt?", cat: "passive", item: "Salt", tip: "Wraith never steps in salt.", conclusiveAbsence: false },
  { id: 8, name: "Turned a light ON?", cat: "passive", item: null, tip: "Mare cannot turn lights on.", conclusiveAbsence: false },
  { id: 9, name: "Turned breaker OFF?", cat: "passive", item: null, tip: "Jinn cannot turn off the breaker.", conclusiveAbsence: false },
  { id: 10, name: "Violent object throw?", cat: "passive", item: null, tip: "Only Poltergeist throws violently.", conclusiveAbsence: false },
  { id: 11, name: "Door left half-open?", cat: "passive", item: null, tip: "Yurei only fully closes doors.", conclusiveAbsence: false },
  { id: 12, name: "Mist/Airball event?", cat: "passive", item: null, tip: "Oni and Kormos cannot do mist events.", conclusiveAbsence: false },
  { id: 13, name: "Long singing event?", cat: "passive", item: null, tip: "Shade cannot do this.", conclusiveAbsence: false },
  { id: 14, name: "Ghost lit a candle?", cat: "passive", item: null, tip: "Onryo and Poltergeist cannot light candles.", conclusiveAbsence: false },
  { id: 15, name: "Very soft footsteps?", cat: "passive", item: null, tip: "Only Myling.", conclusiveAbsence: false },
  { id: 16, name: "Smudge lasted > 90s?", cat: "passive", item: "Smudge Sticks", tip: "Spirit has a 180s block.", conclusiveAbsence: true },
  { id: 17, name: "Banshee scream?", cat: "passive", item: "Parabolic Microphone", tip: "Unique Banshee scream.", conclusiveAbsence: false },
  { id: 18, name: "Hunted when you talked?", cat: "passive", item: null, tip: "Yokai hunts at 80% if you talk.", conclusiveAbsence: false },
  { id: 19, name: "Double interaction?", cat: "passive", item: null, tip: "The Twins interact twice.", conclusiveAbsence: false },
  { id: 20, name: "Teleported / EMF 2?", cat: "passive", item: null, tip: "Wraith can teleport to you.", conclusiveAbsence: false },
  { id: 21, name: "Hunted very early?", cat: "passive", item: null, tip: "Demon can hunt at any sanity.", conclusiveAbsence: false },
  { id: 22, name: "6-finger print?", cat: "passive", item: "UV Light", tip: "Obake leaves unique prints.", conclusiveAbsence: true },
  { id: 23, name: "Missing salt footprint?", cat: "passive", item: "Salt", tip: "Obake/Gallu can miss a print.", conclusiveAbsence: true },
  { id: 24, name: "Hunt after 3 flames?", cat: "passive", item: null, tip: "Onryo hunts after blowing 3 flames.", conclusiveAbsence: false },
  { id: 25, name: "Shapeshifted?", cat: "easy", item: null, tip: "Only Obake shapeshifts during hunts.", conclusiveAbsence: true },
  { id: 26, name: "DOTS only on camera?", cat: "easy", item: "Video Camera", tip: "Only Goryo shows DOTS only on camera.", conclusiveAbsence: true },
  { id: 27, name: "Fast near electronics?", cat: "easy", item: null, tip: "Only Raiju speeds up near electronics.", conclusiveAbsence: false },
  { id: 28, name: "Invisible blinks?", cat: "easy", item: null, tip: "Only Phantom blinks invisible.", conclusiveAbsence: false },
  { id: 29, name: "Freezing breath in hunt?", cat: "easy", item: null, tip: "Only Hantu has visible breath.", conclusiveAbsence: false },
  { id: 30, name: "Blind > 6 seconds?", cat: "easy", item: "Smudge Sticks", tip: "Moroi is blinded for 7.5s.", conclusiveAbsence: true },
  { id: 31, name: "Electronics flicker 15m?", cat: "easy", item: null, tip: "Raiju has extended range.", conclusiveAbsence: true },
  { id: 32, name: "Fast far, slow close?", cat: "hunt", item: null, tip: "Only Deogen has this speed pattern.", conclusiveAbsence: true },
  { id: 33, name: "Visible blinks?", cat: "hunt", item: null, tip: "Only Oni blinks visibly.", conclusiveAbsence: true },
  { id: 34, name: "Aged (slowed down)?", cat: "hunt", item: null, tip: "Only Thaye ages and slows down.", conclusiveAbsence: true },
  { id: 35, name: "Fast move, slow still?", cat: "hunt", item: null, tip: "Only Dayan speeds up when you move, slows down when you stop.", conclusiveAbsence: true },
    { id: 36, name: "Stepped in salt TWICE? (Gallu)", cat: "passive", item: "Salt", tip: "Place a second pile. If it steps again, it's likely a Gallu." }
];

const TEST_STATUS = { UNCHECKED: 0, HAPPENED: 1, NOT_YET: -1 };
const MATRIX = {};

const state = {
  level: 1, mode: "Intermediate", map: "", mapInfo: null, gender: "Unknown",
  phase: 1, sanity: 100, foundMask: 0, excludedMask: 0,
  testStatuses: {}, inventory: {}, startingItems: [],
  selectedObjectives: [], completedObjectives: [], cursedItem: "None",
  setupSecondsLeft: null, setupTimerId: null, sessionSeconds: 0, sessionTimerId: null,
  huntActive: false, huntSeconds: 0, huntTimerId: null,
  selectedGhost: null, manualEliminated: [], lastRecommendedTest: -1,
  skippedTests: [], loadoutPhase: false, pages: [], currentPageIndex: 0
};

function buildMatrix() {
  GHOSTS.forEach(g => {
    g.evidenceMask = 0;
    g.required_evidence.forEach(e => { if (EV_TO_BIT[e] !== undefined) g.evidenceMask |= EV_TO_BIT[e]; });
    if (g.name === "Mimic") g.evidenceMask |= EV.ORBS;
    
    for (let t = 0; t < TESTS.length; t++) {
      if (!MATRIX[t]) MATRIX[t] = {};
      MATRIX[t][g.name] = -1;
    }
    
    for (let t = 0; t < 7; t++) {
      MATRIX[t][g.name] = (g.evidenceMask & TESTS[t].bit) ? 1 : 0;
    }
    
    // Core behaviors
    MATRIX[7][g.name]  = (g.name === "Wraith") ? 0 : 1;
    MATRIX[8][g.name]  = (g.name === "Mare") ? 0 : 1;
    MATRIX[9][g.name]  = (g.name === "Jinn") ? 0 : 1;
    MATRIX[10][g.name] = (g.name === "Poltergeist") ? 1 : 0;
    MATRIX[11][g.name] = (g.name === "Yurei") ? 0 : 1;
    MATRIX[12][g.name] = (g.name === "Oni" || g.name === "Kormos") ? 0 : 1;
    MATRIX[13][g.name] = (g.name === "Shade") ? 0 : 1;
    MATRIX[14][g.name] = (g.name === "Onryo" || g.name === "Poltergeist") ? 0 : 1;
    MATRIX[15][g.name] = (g.name === "Myling") ? 1 : 0;
    MATRIX[16][g.name] = (g.name === "Spirit") ? 1 : 0;
    
    // Conditional / Probabilistic behaviors
    MATRIX[17][g.name] = (g.name === "Banshee") ? -1 : 0; // 33% chance, not conclusive
    MATRIX[18][g.name] = (g.name === "Yokai") ? 1 : -1; // Others can hunt coincidentally
    MATRIX[19][g.name] = (g.name === "The Twins" || g.name === "Gallu" || g.name === "Deildegast") ? 1 : 0;
    MATRIX[20][g.name] = (g.name === "Wraith") ? 1 : 0;
    MATRIX[21][g.name] = (["Demon", "Yokai", "Thaye", "Onryo"].includes(g.name)) ? 1 : 0;
    MATRIX[22][g.name] = (g.name === "Obake") ? 1 : 0;
    MATRIX[23][g.name] = (g.name === "Obake" || g.name === "Gallu") ? 1 : 0;
    MATRIX[24][g.name] = (g.name === "Onryo") ? 1 : 0;
    MATRIX[25][g.name] = (g.name === "Obake") ? 1 : 0;
    MATRIX[26][g.name] = (g.name === "Goryo") ? 1 : 0;
    MATRIX[27][g.name] = (g.name === "Raiju") ? 1 : 0;
    MATRIX[28][g.name] = (g.name === "Phantom") ? 1 : 0;
    MATRIX[29][g.name] = (g.name === "Hantu") ? 1 : 0;
    MATRIX[30][g.name] = (g.name === "Moroi") ? 1 : 0;
    MATRIX[31][g.name] = (g.name === "Raiju") ? 1 : 0;
    MATRIX[32][g.name] = (g.name === "Deogen") ? 1 : 0;
    MATRIX[33][g.name] = (g.name === "Oni") ? 1 : 0;
    MATRIX[34][g.name] = (g.name === "Thaye") ? 1 : 0;
    MATRIX[35][g.name] = (g.name === "Dayan") ? 1 : 0;
    // Adaugă linia de mai jos:
    MATRIX[36][g.name] = (g.name === "Gallu") ? 1 : -1; 
  });
}

function parseHuntSanity(str) {
  if (!str) return 50;
  if (String(str).includes("Varies")) return -1;
  const nums = String(str).match(/\d+/g);
  if (!nums) return 50;
  return Math.max(...nums.map(Number));
}

function formatCursedSpawns(str) {
  if (!str) return "<p>-</p>";
  let items = [];
  if (str.includes("(") && str.includes(")")) {
    let parts = str.split(/\),\s*/);
    items = parts.map((p, i) => i < parts.length - 1 ? p + ")" : p);
  } else {
    items = str.split(/,\s*/);
  }
  return `<ul style="margin: 0; padding-left: 15px; font-size: 0.85rem; color: #94a3b8; line-height: 1.5;">` + 
         items.map(p => `<li>${p}</li>`).join("") + `</ul>`;
}

function getSuspects() {
  return GHOSTS.filter(g => {
    if (state.manualEliminated.includes(g.name)) return false;
    if (state.gender === "Male" && (g.name === "Banshee" || g.name === "Dayan")) return false;
    if ((g.evidenceMask & state.foundMask) !== state.foundMask) return false;
    if ((g.evidenceMask & state.excludedMask) !== 0) return false;
    
    for (let t = 0; t < TESTS.length; t++) {
      const status = state.testStatuses[t] || TEST_STATUS.UNCHECKED;
      if (status === TEST_STATUS.UNCHECKED) continue;
      const expected = MATRIX[t][g.name];
      if (expected === -1) continue;
      
      // Only eliminate if the test is HAPPENED but ghost can't do it
      if (status === TEST_STATUS.HAPPENED && expected === 0) return false;
      
      // Only eliminate if NOT_YET and test is conclusively required
      if (status === TEST_STATUS.NOT_YET && expected === 1 && TESTS[t].conclusiveAbsence) return false;
    }
    return true;
  });
}
// ==========================================
// PHASMO COACH - PART 2: PAGINATION & LOGIC
// ==========================================

function addCoachPage(type, title, content) {
  state.pages.push({ type, title, content });
  if (state.pages.length > 30) state.pages.shift();
  state.currentPageIndex = state.pages.length - 1;
  renderChat();
}

function renderChat() {
  const stream = document.getElementById("chat-stream");
  const pag = document.getElementById("chat-pagination");
  if (!stream || !pag) return;
  
  if (state.pages.length === 0) {
    stream.innerHTML = `<div class="empty-chat">Waiting for game to start...</div>`;
    pag.innerHTML = "";
    return;
  }

  const page = state.pages[state.currentPageIndex];
  stream.innerHTML = `
    <div class="coach-card card-${page.type}">
      <div class="card-header">${page.title}</div>
      <div class="card-body">${page.content}</div>
    </div>
  `;

  const dotsHtml = state.pages.map((_, i) => 
    `<div class="dot ${i === state.currentPageIndex ? 'active' : ''}" onclick="gotoPage(${i})"></div>`
  ).join("");

  pag.innerHTML = `
    <button class="nav-btn" onclick="prevPage()" ${state.currentPageIndex === 0 ? 'disabled' : ''}>❮</button>
    <div class="dots-container">${dotsHtml}</div>
    <button class="nav-btn" onclick="nextPage()" ${state.currentPageIndex === state.pages.length - 1 ? 'disabled' : ''}>❯</button>
  `;
}

function nextPage() { if (state.currentPageIndex < state.pages.length - 1) { state.currentPageIndex++; renderChat(); } }
function prevPage() { if (state.currentPageIndex > 0) { state.currentPageIndex--; renderChat(); } }
function gotoPage(index) { if (index >= 0 && index < state.pages.length) { state.currentPageIndex = index; renderChat(); } }

// ANALIZA PRINCIPALĂ (Cu suport pentru Skip)
function analyzeState(actionText = "", skipId = -1) {
  try {
    const suspects = getSuspects();
    const ramase = suspects.length;
    const isLoadout = state.loadoutPhase;
    const modeData = MODES[state.mode] || {};
    const allowedEv = modeData.evidence ?? 3;
    const isHardMode = allowedEv <= 2;

    let foundCount = 0;
    for (let b = 0; b < 7; b++) if (state.foundMask & (1 << b)) foundCount++;

    if (ramase === 0) {
      addCoachPage("warning", "🚨 CONTRADICTION!", `<div class="start-box danger-box"><h4>Error</h4><p>No ghost matches your data. Reset a wrong evidence or behavior.</p></div>`);
      if (!isLoadout) document.getElementById("chat-input-area").innerHTML = `<button class="btn-chat" onclick="resetTests()">♻️ Reset Tests</button><button class="btn-chat" onclick="resetEvidence()">♻️ Reset Evidence</button>`;
      return;
    }

    if (ramase === 1) {
      const g = suspects[0];
      const content = `
        <div class="start-box success-box full-width">
          <h4>Confirmed Ghost: ${g.name}</h4>
          <p><b>Evidence:</b> ${g.required_evidence.join(", ")}<br><b>Speed:</b> ${g.speed} | <b>Sanity:</b> ${g.hunt_sanity}</p>
        </div>
        <div class="start-box info-box full-width"><h4>💡 Tell</h4><p>${g.test}</p></div>
      `;
      addCoachPage("result", "🎯 GHOST CONFIRMED", content);
      if (!isLoadout) document.getElementById("chat-input-area").innerHTML = `<button class="btn-chat primary" onclick="endRun()">🏁 End Run</button>`;
      return;
    }

    if (state.phase === 1 && state.mapInfo) {
      let content = `<div class="start-box danger-box full-width"><h4>📍 Phase 1: Find the Room</h4><p>Explore and find the ghost room.</p></div>`;
      content += `<div class="start-box info-box"><h4>🔌 Breaker</h4><p>${(state.mapInfo.breakers || []).join(", ")}</p></div>`;
      content += `<div class="start-box warning-box"><h4>💀 Cursed</h4>${formatCursedSpawns(state.mapInfo.cursedSpawn)}</div>`;
      content += `<div class="start-box neutral-box full-width"><h4>💡 Pro Tip</h4><p>${(state.mapInfo.proTips && state.mapInfo.proTips[0]) || "Explore carefully."}</p></div>`;
      
      addCoachPage("phase", "📍 Phase 1: Find the Ghost Room", content);
      if (!isLoadout) document.getElementById("chat-input-area").innerHTML = `<button class="btn-chat primary" onclick="foundRoom()">📍 Found Ghost Room</button>`;
      return;
    }

    let content = "";
    if (actionText) {
      content += `<div class="start-box info-box full-width"><h4>⚡ Recent Action</h4><p>${actionText}</p></div>`;
    }

    // --- NOUA SECȚIUNE: FINAL SHOWDOWN (Când au rămas <= 3 fantome) ---
    if (ramase <= 3) {
      content += `<div class="start-box warning-box full-width"><h4>⚔️ Final Showdown: ${ramase} Suspects Left</h4><p>Let's break them down. We need to find the differences to eliminate them.</p></div>`;
      
      suspects.forEach(g => {
        const traits = GHOST_TRAITS[g.name] || { pro: "Standard.", con: "Standard." };
        content += `
          <div class="start-box neutral-box full-width" style="border-left-color: #fbbf24; background: rgba(251, 191, 36, 0.05);">
            <h4>👻 ${g.name}</h4>
            <p style="font-size: 0.85rem; margin-bottom: 5px;">
              <b>Evidence:</b> ${g.required_evidence.join(", ")}<br>
              <b>Speed:</b> ${g.speed} | <b>Hunts at:</b> ${g.hunt_sanity}
            </p>
            <p style="font-size: 0.85rem; margin-bottom: 5px; color: #cbd5e1;"><b>Behavior:</b> <i>${g.test}</i></p>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px;">
              <b>Pro:</b> ${traits.pro}<br>
              <b>Con:</b> ${traits.con}
            </p>
          </div>
        `;
      });

      // Găsim cele mai bune teste "Easy/Passive" care fac diferența între ei
      let diffTests = [];
      for (let t = 0; t < TESTS.length; t++) {
        if (TESTS[t].cat !== "passive" && TESTS[t].cat !== "easy") continue;
        if ((state.testStatuses[t] || 0) !== TEST_STATUS.UNCHECKED) continue;
        
        // Verificăm dacă testul are informație de câștig > 0 pentru că diferențiază fantomele rămase
        if (calculateInformationGain(t) > 0) {
           diffTests.push({ id: t, name: TESTS[t].name, tip: TESTS[t].tip, score: calculateInformationGain(t) });
        }
      }
      
      diffTests.sort((a, b) => b.score - a.score);
      
      if (diffTests.length > 0) {
        content += `<div class="start-box success-box full-width"><h4>🎯 Key Tests to Separate Them:</h4><p>Since we need to rely on behavior, try to notice these:</p><ul style="margin-top:10px;">`;
        diffTests.slice(0, 3).forEach(dt => {
           content += `<li style="margin-bottom:8px;"><b>${dt.name}</b><br><span style="font-size:0.8rem; color:#94a3b8;">${dt.tip}</span></li>`;
        });
        content += `</ul></div>`;
      }
    }

    // --- BEST NEXT STEP (Logica normală) ---
    content += `<div class="start-box neutral-box full-width"><h4>📊 Live Status</h4><p>Found <b>${foundCount}/${allowedEv}</b> Evidence. <b>${ramase}</b> Suspects remaining.</p></div>`;

    let bestTest = -1, bestScore = -999;
    for (let t = 0; t < TESTS.length; t++) {
      if (t === skipId) continue; 
      if ((state.testStatuses[t] || 0) !== TEST_STATUS.UNCHECKED) continue;
      
      // Dacă am atins numărul maxim de dovezi, ignorăm testele de dovezi
      if (TESTS[t].cat === "evidence" && foundCount >= allowedEv) continue;
      if (isHardMode && TESTS[t].cat === "hunt") continue;
      
      const score = (calculateInformationGain(t) * calculateSafetyWeight(t)) - calculateCost(t);
      if (score > bestScore) { bestScore = score; bestTest = t; }
    }

    let nextStep = "";
    if (bestTest !== -1 && bestScore > 0.5) {
      const test = TESTS[bestTest];
      const itemReq = test.item;
      const inv = itemReq ? state.inventory[itemReq] : null;
      const hasItem = itemReq ? (inv && inv.taken === 1) : true;
      
      nextStep += `<b>Test for:</b> ${test.name}<br>`;
      nextStep += `<i>💡 ${test.tip}</i><br><br>`;

      if (itemReq && !hasItem) {
        nextStep += `<span style="color:#fbbf24;">🎒 You need to take ${itemReq} (T${inv ? inv.tier : 0}) from the van!</span><br><br>`;
      }

      nextStep += `<div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:10px;">`;
      if (test.cat === "evidence") {
          nextStep += `<button class="btn-chat primary" style="padding:6px 12px; font-size:0.8rem;" onclick="quickTest('${test.name}', 1)">✅ Found</button>`;
          nextStep += `<button class="btn-chat" style="background:var(--danger-red); border-color:var(--danger-red); padding:6px 12px; font-size:0.8rem;" onclick="quickTest('${test.name}', -1)">❌ Excluded</button>`;
      } else {
          nextStep += `<button class="btn-chat primary" style="padding:6px 12px; font-size:0.8rem;" onclick="quickTest('${test.name}', 1)">✅ Happened</button>`;
          nextStep += `<button class="btn-chat" style="background:var(--danger-red); border-color:var(--danger-red); padding:6px 12px; font-size:0.8rem;" onclick="quickTest('${test.name}', -1)">❌ Did NOT Happen</button>`;
      }
      nextStep += `<button class="btn-chat" style="padding:6px 12px; font-size:0.8rem;" onclick="skipTest(${bestTest})">⏭️ Skip Step</button>`;
      nextStep += `</div>`;
      
      state.lastRecommendedTest = bestTest;
    } else {
      nextStep += `📖 <b>No more useful evidence tests.</b> Move to behavior tests or provoke a hunt to check speed/blinking.`;
      state.lastRecommendedTest = -1;
    }
    
    content += `<div class="start-box success-box full-width"><h4>🎯 Best Next Step</h4><p>${nextStep}</p></div>`;

    if (state.sanity < 50) {
      const dangerGhosts = suspects.filter(g => parseHuntSanity(g.hunt_sanity) >= state.sanity);
      if (dangerGhosts.length > 0) {
        content += `<div class="start-box danger-box full-width"><h4>🚨 Sanity Warning (${state.sanity}%)</h4><p>These suspects can hunt: <b>${dangerGhosts.map(g => g.name).join(", ")}</b>. Place Crucifix / Smudge!</p></div>`;
      }
    }

    addCoachPage("advice", "🔍 Analysis & Next Step", content);
    if (!isLoadout) document.getElementById("chat-input-area").innerHTML = `<button class="btn-chat primary" onclick="analyzeState('Manually Re-analyzed')">🔍 Re-Analyze</button>`;
  } catch (e) { console.error(e); }
}

function quickTest(testName, status) {
  const test = TESTS.find(t => t.name === testName);
  if (!test) return;

  if (test.cat === "evidence") {
    const bit = test.bit;
    if (status === 1) {
      state.foundMask |= bit;
      state.excludedMask &= ~bit;
      state.testStatuses[test.id] = 1;
    } else {
      state.excludedMask |= bit;
      state.foundMask &= ~bit;
      state.testStatuses[test.id] = -1;
    }
  } else {
    state.testStatuses[test.id] = status;
  }

  updateUI();
  
  if (status === -1) {
    if (test.cat === "evidence") {
      analyzeState(`You excluded <b>${test.name}</b>.<br><br>Ghosts requiring this evidence are now eliminated.`);
    } else {
      analyzeState(`You marked <b>${test.name}</b> as NO / NOT HAPPENED.`);
    }
  } else {
    analyzeState(`You logged <b>${test.name}</b> as FOUND.`);
  }
}

function skipTest(testId) {
  if (!state.skippedTests.includes(testId)) state.skippedTests.push(testId);
  analyzeState(`You skipped <b>${TESTS[testId].name}</b>. Don't worry, let's look at the next best option or grab a different item.`, testId);
}

function calculateInformationGain(t) {
  let da = 0, nu = 0;
  const suspects = getSuspects();
  suspects.forEach(g => {
    const exp = MATRIX[t][g.name];
    if (exp === 0) da++;
    else if (exp === 1) nu++;
  });
  if (da === 0 || nu === 0) return 0;
  return (2.0 * da * nu) / (da + nu);
}

function calculateSafetyWeight(t) {
  if (state.sanity > 50) return 1.0;
  const suspects = getSuspects();
  if (!suspects.some(g => g.name === "Demon" || g.name === "Moroi")) return 1.0;
  if (TESTS[t].cat === "hunt") return 0.3;
  if (TESTS[t].name === "Spirit Box") return 0.7;
  return 1.0;
}

function calculateCost(t) {
  let cost = 0;
  const test = TESTS[t];
  
  if (test.item) {
    const inv = state.inventory[test.item];
    if (!inv || inv.tier === 0) return 999; 
    
    if (inv.taken === 0) cost += 3.0; 
    else if (inv.taken === 2) cost += 0.5; 
  }
  
  if (test.cat === "hunt") cost += 4.0; 
  
  if (state.sanity < 60 && (test.name === "Spirit Box" || test.name === "Ghost Writing")) {
    cost += 2.0; 
  }
  
  return cost;
}


// ==========================================
// PHASMO COACH - PART 3: ACTIONS & SETUP
// ==========================================

function cycleEvidence(evName) {
  try {
    if (state.phase === 1) {
      state.phase = 2;
      const hud = document.getElementById("hud-status");
      if (hud) hud.innerText = "Phase 2: Evidence";
    }
    const bit = EV_TO_BIT[evName];
    if (bit === undefined) return;

    const allowedEv = MODES[state.mode]?.evidence ?? 3;
    let foundCount = 0;
    for (let b = 0; b < 7; b++) if (state.foundMask & (1 << b)) foundCount++;

    const isNew = !(state.foundMask & bit) && !(state.excludedMask & bit);
    if (isNew && foundCount >= allowedEv) {
      showToast(`Max ${allowedEv} evidence`, "error");
      return;
    }

    const testObj = TESTS.find(t => t.bit === bit);
    const testId = testObj ? testObj.id : -1;
    let actionMsg = "";

    if (state.foundMask & bit) {
      state.foundMask &= ~bit; state.excludedMask |= bit;
      if (testId !== -1) state.testStatuses[testId] = TEST_STATUS.NOT_YET;
      actionMsg = `You excluded <b>${evName}</b>.`;
    } else if (state.excludedMask & bit) {
      state.excludedMask &= ~bit;
      if (testId !== -1) delete state.testStatuses[testId];
      actionMsg = `You reset <b>${evName}</b>.`;
    } else {
      state.foundMask |= bit;
      if (testId !== -1) state.testStatuses[testId] = TEST_STATUS.HAPPENED;
      actionMsg = `You found <b>${evName}</b>.`;
    }
    
    updateUI(); 
    analyzeState(actionMsg);
  } catch (e) { console.error(e); }
}

function logBehaviorTest(testId) {
  try {
    const test = TESTS[testId];
    if (!test) return;
    
    const current = state.testStatuses[testId] || TEST_STATUS.UNCHECKED;
    let next = (current === TEST_STATUS.UNCHECKED) ? TEST_STATUS.HAPPENED : (current === TEST_STATUS.HAPPENED) ? TEST_STATUS.NOT_YET : TEST_STATUS.UNCHECKED;
    state.testStatuses[testId] = next;

    let actionMsg = "";

    // --- LOGICA SPECIALA PENTRU SAREA 1 (ID 7) ---
    if (testId === 7) {
      if (next === TEST_STATUS.HAPPENED) {
        actionMsg = `I see it **stepped in salt**!<br><br>🚫 <b>Wraith is ELIMINATED.</b><br>👉 <b>Let's test for Gallu:</b> Place a second pile of salt. (I just unlocked a new test for you). Also, put a <b>UV Light</b> next to it to see the footprint for an easy UV evidence!`;
      } else if (next === TEST_STATUS.NOT_YET) {
        actionMsg = `⏳ <b>Salt Test on Standby.</b><br><br>It hasn't stepped in the second pile yet. Place a <b>Motion Sensor</b> over it, or watch if it does an event and physically passes through the salt without stepping in it. Keep an eye on it!`;
      } else {
        actionMsg = `You reset the Salt test.`;
      }
      updateUI(); analyzeState(actionMsg); return;
    }

    // --- LOGICA PENTRU SAREA 2 (ID 36) ---
    if (testId === 36) {
      if (next === TEST_STATUS.HAPPENED) {
        actionMsg = `🎯 <b>It stepped in salt TWICE!</b><br><br>This is a massive indicator for <b>Gallu</b> (especially if it leaves no UV prints). Check UV immediately!`;
      } else if (next === TEST_STATUS.NOT_YET) {
        actionMsg = `It did NOT step in the second pile yet. Keep the test on standby and watch the salt.`;
      } else {
        actionMsg = `You reset the Second Salt test.`;
      }
      updateUI(); analyzeState(actionMsg); return;
    }

    // --- LOGICA NORMALA PENTRU RESTUL TESTELOR ---
    if (next === TEST_STATUS.HAPPENED) {
      if (test.name === "Turned a light ON?") {
        actionMsg = `It **turned a light ON**.<br><br>🚫 <b>Mare is ELIMINATED.</b> Mare can never turn lights on.`;
      } else {
        actionMsg = `You confirmed <b>${test.name}</b> happened.<br><br>Check the suspect list — the ghosts that <i>cannot</i> do this are now crossed out.`;
      }
    } else if (next === TEST_STATUS.NOT_YET) {
      actionMsg = `You marked <b>${test.name}</b> as NOT HAPPENED.<br><br>Ghosts that <i>require</i> this behavior are now crossed out.`;
    } else {
      actionMsg = `You reset the test: <b>${test.name}</b>.`;
    }

    updateUI(); analyzeState(actionMsg);
  } catch (e) { console.error(e); }
}

function quickHuntLog(testId, checkbox) {
  const current = state.testStatuses[testId] || TEST_STATUS.UNCHECKED;
  let next = (current === TEST_STATUS.UNCHECKED) ? TEST_STATUS.HAPPENED : (current === TEST_STATUS.HAPPENED) ? TEST_STATUS.NOT_YET : TEST_STATUS.UNCHECKED;
  state.testStatuses[testId] = next;

  if (checkbox) {
    if (next === TEST_STATUS.HAPPENED) { checkbox.checked = true; checkbox.indeterminate = false; }
    else if (next === TEST_STATUS.NOT_YET) { checkbox.checked = false; checkbox.indeterminate = true; }
    else { checkbox.checked = false; checkbox.indeterminate = false; }
  }
  updateUI(); 
  showToast(`Logged: ${TESTS[testId].name}`, "info");
}

function resetTests() {
  state.testStatuses = {};
  state.skippedTests = [];
  updateUI(); analyzeState("All behavior tests have been reset.");
}

function resetEvidence() {
  state.foundMask = 0;
  state.excludedMask = 0;
  for (let t = 0; t < 7; t++) delete state.testStatuses[t];
  updateUI(); analyzeState("All evidence has been reset.");
}

function cycleItem(itemName) {
  if (!state.inventory[itemName]) return;
  const inv = state.inventory[itemName];

  if (inv.taken === 0) {
    if (Object.values(state.inventory).filter(i => i.taken === 1).length >= 3) {
      showToast("Max 3 items in hand!", "error"); return;
    }
    inv.taken = 1; // Van -> Hand
  } else if (inv.taken === 1) {
    inv.taken = 2; // Hand -> Room
  } else {
    inv.taken = 0; // Room -> Van
  }
  
  updateEquipmentUI();

  // Debounce the coach update so it doesn't spam when grabbing multiple items
  clearTimeout(inventoryTimeout);
  inventoryTimeout = setTimeout(() => {
    // Don't interrupt the initial loadout screen
    if (state.loadoutPhase) return;

    // Gather items currently in hand
    const inHand = Object.keys(state.inventory).filter(item => state.inventory[item].taken === 1);
    
    let actionMsg = "🎒 <b>Inventory Updated.</b><br><br>";
    
    if (inHand.length === 0) {
      actionMsg += "You currently have no items in hand. Grab some gear from the van!";
    } else {
      actionMsg += "<b>Tips for items currently in your hands:</b><br>";
      inHand.forEach(item => {
        const eqData = EQUIP[item];
        const tip = eqData && eqData.tip ? eqData.tip : "Use this to test evidence.";
        actionMsg += `• <b>${item}</b>: <i>${tip}</i><br>`;
      });
    }
    
    // Trigger the coach analysis
    analyzeState(actionMsg);
  }, 3000); // 3000ms = 3 seconds
}

function foundRoom() {
  state.phase = 2;
  const hud = document.getElementById("hud-status");
  if (hud) hud.innerText = "Phase 2: Evidence";
  updateEquipmentUI();
  
  const modeData = MODES[state.mode] || {};
  const isHighDifficulty = (modeData.multiplier >= 3);

  let msg = "You found the <b>Ghost Room</b>! Time to test evidence.";
  
  if (isHighDifficulty || state.sanity <= 65) {
     msg += `<br><br>🚨 <b>Hunt Warning:</b> Because you are on ${state.mode} (or low sanity), immediately drop a <b>Crucifix</b> in the room and keep <b>Smudge Sticks</b> nearby before testing evidence!`;
  }

  analyzeState(msg);
}

function toggleGhostState(ghostName) {
  if (state.manualEliminated.includes(ghostName)) {
    // Reset
    state.manualEliminated = state.manualEliminated.filter(n => n !== ghostName);
    showToast(`Reset: ${ghostName}`);
    updateUI();
  } else if (state.selectedGhost === ghostName) {
    // Eliminare manuală
    state.selectedGhost = null;
    state.manualEliminated.push(ghostName);
    showToast(`Manually eliminated: ${ghostName}`, "warning");
    analyzeState(`You manually eliminated <b>${ghostName}</b>. Let's find the real ghost.`);
  } else {
    // Selectare Suspect
    state.selectedGhost = ghostName;
    const g = GHOSTS.find(x => x.name === ghostName);
    showToast(`Selected Suspect: ${ghostName}`);
    updateUI();

    // Verificăm dacă testul necesită Hunt
    const huntKeywords = ["hunt", "speed", "blink", "sprint", "step", "footstep", "hiding", "loop", "age"];
    const isHuntTest = huntKeywords.some(kw => g.test.toLowerCase().includes(kw)) || 
                       ["Yokai", "Deogen", "Revenant", "Thaye", "Obake", "Oni", "Phantom", "Hantu", "Moroi", "Jinn", "Raiju"].includes(g.name);

    let content = `
      <div class="start-box info-box full-width">
        <h4>You suspect a ${g.name}!</h4>
        <p>Let's test it. Here is the specific behavior for <b>${g.name}</b>:</p>
        <p style="margin-top:8px; color:#fff; font-size:1.05em;"><b>${g.test}</b></p>
      </div>
    `;

    if (isHuntTest) {
        content += `
          <div class="start-box danger-box full-width">
            <h4>⚠️ Be careful: Hunt Test</h4>
            <p>If it does this, you can exclude it. If not, we keep looking. <b>Note:</b> This test can primarily be done during a <b>hunt</b>.</p>
            <p style="margin-top:8px; color:#fbbf24;"><b>Strategy:</b> Let's test for the other ghosts that we can do <i>outside</i> the hunt first. Keep an eye out for this specific behavior during the next hunt for the remaining ghosts.</p>
          </div>
        `;
    } else {
         content += `
          <div class="start-box success-box full-width">
            <h4>✅ Outside Hunt Test</h4>
            <p>You can test this right now! Look for this behavior in the ghost room.</p>
            <p style="margin-top:8px;">If it happens, you can exclude it. If it doesn't, let's test for the other ghosts.</p>
          </div>
        `;
    }

    content += `<div class="start-box neutral-box full-width"><h4>🎯 What's next?</h4><p>Go back to the main analysis to see your best next step, or click another ghost to compare tests.</p></div>`;

    addCoachPage("info", `🔍 Suspect Profile: ${g.name}`, content);
  }
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p.level && document.getElementById("setup-level")) document.getElementById("setup-level").value = p.level;
      if (p.mode && document.getElementById("setup-mode")) document.getElementById("setup-mode").value = p.mode;
      if (p.map && document.getElementById("setup-map")) document.getElementById("setup-map").value = p.map;
      if (p.gender && document.getElementById("setup-gender")) document.getElementById("setup-gender").value = p.gender;
    }
  } catch (e) { console.warn(e); }
  renderSetupObjectives(); handleModeChange(); updateMapPreview();
}

function saveProfile() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    level: state.level, mode: state.mode, map: state.map, gender: state.gender
  }));
}

function renderSetupObjectives() {
  const el = document.getElementById("setup-objectives");
  if (!el) return;
  el.innerHTML = OBJECTIVES.map(obj => {
    const reqText = obj.requires.length > 0 ? `(Req: ${obj.requires.join(", ")})` : "";
    return `<label class="obj-checkbox-label">
      <input type="checkbox" value="${obj.id}" onchange="toggleSetupObjective(this)">
      <div>
        <span style="font-weight:bold; color:#fff;">${obj.name}</span><br>
        <span style="font-size:0.75rem; color:#94a3b8;">${reqText}</span>
      </div>
    </label>`;
  }).join("");
}

function toggleSetupObjective(checkbox) {
  const id = checkbox.value;
  if (checkbox.checked) {
    if (state.selectedObjectives.length >= 3) { checkbox.checked = false; return; }
    state.selectedObjectives.push(id);
  } else {
    state.selectedObjectives = state.selectedObjectives.filter(o => o !== id);
  }
  
  const count = state.selectedObjectives.length;
  document.getElementById("objective-count").innerText = count;
  
  // Activează butonul normal
  document.getElementById("init-coach-btn").disabled = count !== 3;
  
  // Activează butonul PRO MODE
  document.getElementById("pro-mode-btn").disabled = count !== 3; 
}
function openLoadoutSelection(proMode = false) {
  if (state.selectedObjectives.length !== 3) return;

  // ... (codul existent pentru salvarea nivelului, hărții, etc.) ...
  
  state.inventory = {};
  for (const [name, data] of Object.entries(EQUIP)) {
    let tier = 0;
    for (let t = data.tiers.length - 1; t >= 0; t--) {
      if (state.level >= data.tiers[t].lvl) { tier = t + 1; break; }
    }
    // ACEASTA ESTE LINIA MAGICĂ: Dacă e Pro Mode, itemul e luat (1) automat
    state.inventory[name] = { tier: tier, taken: proMode ? 1 : 0 };
  }

  // ... (codul existent pentru afișarea interfeței) ...

  setTimeout(() => {
    // ... (codul existent) ...
    
    if (proMode) {
      state.phase = 2; 
      state.loadoutPhase = false; 
      
      const hud = document.getElementById("hud-status");
      if (hud) hud.innerText = "Phase 2: Evidence (Pro)";

      updateUI();
      analyzeState("⚡ <b>Pro Mode Activated.</b><br>All equipment is assumed to be available inside the house.<br><br>👉 <b>What do you know so far?</b> Click the evidence and behavior tests you've already confirmed. I'll tell you the fastest way to separate the remaining ghosts.");
    } else {
      state.phase = 1;
      state.loadoutPhase = true;
      updateUI();
      askForLoadout();
    }
  }, 500);
}
function handleModeChange() {
  const modeKey = document.getElementById("setup-mode").value;
  const modeData = MODES[modeKey];
  if (!modeData) return;
  const setup = modeData.setupTime ?? 0;
  const ev = modeData.evidence ?? 3;
  const br = modeData.breaker ?? "Unknown";
  document.getElementById("mode-preview").innerText = `Setup: ${setup}s | Evidence: ${ev} | Breaker: ${br}`;
}

function updateMapPreview() {
  const mapName = document.getElementById("setup-map").value;
  const map = MAPS[mapName];
  document.getElementById("map-preview").innerText = map ? `Size: ${map.size} | Breaker: ${map.breakers[0]}` : "Unknown";
}
// ==========================================
// PHASMO COACH - PART 4: FINAL UI & INIT
// ==========================================

function updateUI() {
  const evGrid = document.getElementById("evidence-grid");
  if (evGrid) {
    evGrid.innerHTML = Object.keys(EV_TO_BIT).map(ev => {
      const bit = EV_TO_BIT[ev];
      let cls = "evidence-btn", suffix = "";
      if (state.foundMask & bit) { cls += " found"; suffix = " ✓"; }
      else if (state.excludedMask & bit) { cls += " excluded"; suffix = " ✗"; }
      if (state.lastRecommendedTest !== -1 && TESTS[state.lastRecommendedTest]?.name === ev && !(state.foundMask & bit) && !(state.excludedMask & bit)) {
        cls += " suspected-ev";
      }
      return `<button class="${cls}" onclick="cycleEvidence('${ev}')">${ev}${suffix}</button>`;
    }).join("");
  }

  const renderTest = (id, label) => {
    const status = state.testStatuses[id] || TEST_STATUS.UNCHECKED;
    let cls = "behavior-btn", icon = "";
    if (status === TEST_STATUS.HAPPENED) { cls += " confirmed"; icon = "✓ "; }
    else if (status === TEST_STATUS.NOT_YET) { cls += " excluded"; icon = "✗ "; }
    return `<button class="${cls}" onclick="logBehaviorTest(${id})" title="${TESTS[id].tip}">${icon}${label}</button>`;
  };

   let bg = `<div class="behavior-section passive-test"><h4>🟢 Passive</h4>`;
  TESTS.filter(t => t.cat === "passive" && t.id !== 36).forEach(t => {
    bg += renderTest(t.id, t.name);
    // Daca testul de sare (7) e bifat ca "Happened", deblocam testul 36 langa el
    if (t.id === 7 && state.testStatuses[7] === TEST_STATUS.HAPPENED) {
      bg += renderTest(36, "Stepped in salt TWICE?");
    }
  });
  bg += `</div><div class="behavior-section easy-test"><h4>🟡 Easy / Camera</h4>`;
  TESTS.filter(t => t.cat === "easy").forEach(t => bg += renderTest(t.id, t.name));
  bg += `</div><div class="behavior-section hunt-test"><h4>🔴 Hunt</h4>`;
  TESTS.filter(t => t.cat === "hunt").forEach(t => bg += renderTest(t.id, t.name));
  bg += `</div>`;

  const bGrid = document.getElementById("behavior-grid");
  if (bGrid) bGrid.innerHTML = bg;

  const huntIds = [33, 28, 32, 25, 26, 34];
  huntIds.forEach(id => {
    const cb = document.getElementById(`hunt-chk-${id}`);
    if (cb) {
      const status = state.testStatuses[id] || TEST_STATUS.UNCHECKED;
      if (status === TEST_STATUS.HAPPENED) { cb.checked = true; cb.indeterminate = false; }
      else if (status === TEST_STATUS.NOT_YET) { cb.checked = false; cb.indeterminate = true; }
      else { cb.checked = false; cb.indeterminate = false; }
    }
  });

  updateGhostList();
  updateEquipmentUI();
}

function updateGhostList() {
  const suspects = getSuspects();
  const countEl = document.getElementById("ghost-count");
  if (countEl) countEl.innerText = suspects.length;

  const listEl = document.getElementById("ghost-list");
  if (!listEl) return;

  const html = GHOSTS.map(g => {
    const isActive = suspects.some(s => s.name === g.name);
    const isSelected = state.selectedGhost === g.name;
    const isManuallyDead = state.manualEliminated.includes(g.name);

    let cls = "ghost-card";
    if (!isActive || isManuallyDead) cls += " dead";
    if (isSelected) cls += " selected";

    return `<div class="${cls}" onclick="toggleGhostState('${g.name}')" title="Click 1: Suspect | Click 2: Eliminate | Click 3: Reset">
      <h4>${g.name}</h4>
      <p style="font-size:0.65rem; color:#60a5fa; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${g.required_evidence.join(', ')}">${g.required_evidence.join(" · ")}</p>
      <p style="font-size:0.6rem; color:#fbbf24; margin:0;">Spd: ${g.speed} | San: ${g.hunt_sanity}</p>
    </div>`;
  }).join("");

  listEl.innerHTML = html;
}

function updateEquipmentUI() {
  const tracker = document.getElementById("equipment-tracker");
  if (!tracker) return;
  let html = "";
  for (const [name, data] of Object.entries(EQUIP)) {
    const inv = state.inventory[name];
    if (!inv || inv.tier === 0) continue;
    let cls = "equip-item";
    let statusText = "VAN (0)";
    if (inv.taken === 1) { statusText = "HAND (1)"; cls += " in-hand"; }
    else if (inv.taken === 2) { statusText = "ROOM (2)"; cls += " in-room"; }

    html += `<div class="${cls}" onclick="cycleItem('${name}')">
      <span>${name} <b>T${inv.tier}</b></span>
      <span class="equip-status">${statusText}</span>
    </div>`;
  }
  tracker.innerHTML = html || `<p style="font-size:0.8rem; color:#94a3b8;">No items unlocked.</p>`;
}

function renderActiveObjectives() {
  const container = document.getElementById("active-objectives");
  if (!container) return;
  if (state.selectedObjectives.length === 0) {
    container.innerHTML = `<p style="font-size:0.8rem; color:#94a3b8;">No objectives.</p>`;
    return;
  }
  container.innerHTML = state.selectedObjectives.map(id => {
    const obj = OBJECTIVES.find(o => o.id === id);
    if (!obj) return "";
    const isDone = state.completedObjectives.includes(id);
    return `<label class="active-obj-label ${isDone ? 'completed' : ''}">
      <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleActiveObjective('${id}')">
      <span>${obj.name}</span>
      <span class="reward">+$${obj.reward}</span>
    </label>`;
  }).join("");
}

function toggleActiveObjective(id) {
  if (state.completedObjectives.includes(id)) state.completedObjectives = state.completedObjectives.filter(o => o !== id);
  else state.completedObjectives.push(id);
  renderActiveObjectives();
}

function startProMode() {
  // Verificăm dacă avem 3 obiective selectate înainte să pornim
  if (state.selectedObjectives.length !== 3) {
    alert("Please select exactly 3 objectives first!");
    return;
  }
  // Apelăm funcția principală cu parametrul 'true' pentru Pro Mode
  openLoadoutSelection(true);
}

function openLoadoutSelection(proMode = false) {
  if (state.selectedObjectives.length !== 3) return;

  state.level = parseInt(document.getElementById("setup-level").value) || 1;
  state.mode = document.getElementById("setup-mode").value;
  state.map = document.getElementById("setup-map").value;
  state.gender = document.getElementById("setup-gender").value;

  const modeData = MODES[state.mode] || {};
  if (modeData.map && MAPS[modeData.map]) {
    state.map = modeData.map;
    document.getElementById("setup-map").value = state.map;
  }
  state.mapInfo = MAPS[state.map] || { size: "Unknown", breakers: ["Unknown"], cursedSpawn: "Unknown", proTips: ["No tips available."], hidingSpots: ["Unknown"] };
  state.sanity = modeData.startSanity ?? 100;

  if (modeData.cursedItem && modeData.cursedItem !== "None" && modeData.cursedItem !== "Random") {
    state.cursedItem = modeData.cursedItem;
    document.getElementById("cursed-select").value = state.cursedItem;
  } else state.cursedItem = "None";

  state.inventory = {};
  for (const [name, data] of Object.entries(EQUIP)) {
    let tier = 0;
    for (let t = data.tiers.length - 1; t >= 0; t--) {
      if (state.level >= data.tiers[t].lvl) { tier = t + 1; break; }
    }
    // AICI ESTE MODIFICAREA: Dacă e Pro Mode, toate itemele sunt luate (1) by default
    state.inventory[name] = { tier: tier, taken: proMode ? 1 : 0 };
  }

  saveProfile();

  document.getElementById("setup-modal").classList.add("slide-up");
  setTimeout(() => {
    document.getElementById("setup-modal").style.display = "none";
    document.getElementById("top-bar").classList.remove("hidden");
    document.getElementById("hud-level").innerText = state.level;
    document.getElementById("hud-mode").innerText = state.mode + (proMode ? " (PRO)" : "");
    document.getElementById("hud-map").innerText = state.map;
    document.getElementById("sanity-val").innerText = state.sanity + "%";
    document.getElementById("sanity-slider").value = state.sanity;
    
    if (state.cursedItem !== "None") setTimeout(() => handleCursedItem(state.cursedItem), 50);

    renderActiveObjectives();
    startSetupTimer();
    startSessionTimer();

    state.foundMask = 0;
    state.excludedMask = 0;
    state.testStatuses = {};
    state.pages = [];
    state.currentPageIndex = 0;

    if (proMode) {
      // PRO MODE: Sare peste loadout, merge direct la analiza
      state.phase = 2; 
      state.loadoutPhase = false; 
      
      const hud = document.getElementById("hud-status");
      if (hud) hud.innerText = "Phase 2: Evidence (Pro)";

      updateUI();
      // Mesajul de întâmpinare pentru Pro Mode
      analyzeState("⚡ <b>Pro Mode Activated.</b><br>All equipment is assumed to be available inside the house.<br><br>👉 <b>What do you know so far?</b> Click the evidence and behavior tests you've already confirmed. I'll tell you the fastest way to separate the remaining ghosts.");
    } else {
      // MOD NORMAL
      state.phase = 1;
      state.loadoutPhase = true;
      updateUI();
      askForLoadout();
    }
  }, 500);
}

function askForLoadout() {
  try {
    let c = "";
    if (state.gender === "Male") {
      c += `<div class="start-box danger-box"><h4>🚫 Gender Eliminations</h4><p>Board is <b>Male</b>. <b>Banshee</b> and <b>Dayan</b> are automatically eliminated.</p></div>`;
    } else if (state.gender === "Female") {
      c += `<div class="start-box warning-box"><h4>⚠️ Gender Notes</h4><p>Board is <b>Female</b>. Banshee and Dayan are still possible.</p></div>`;
    }

    const modeTip = MODES[state.mode]?.coachTip || "Standard rules apply.";
    c += `<div class="start-box info-box"><h4>📋 Match Details (Lvl ${state.level})</h4><p><b>Mode:</b> ${state.mode} — ${modeTip}</p><p><b>Map:</b> ${state.map} (${state.mapInfo?.size || "Unknown"})</p></div>`;
    c += `<div class="start-box neutral-box"><h4>🔌 Key Locations</h4>
            <ul>
              <li><b>Breaker:</b> ${(state.mapInfo?.breakers || ["Unknown"]).join(", ")}</li>
              <li><b>Cursed:</b>${formatCursedSpawns(state.mapInfo?.cursedSpawn)}</li>
              <li><b>Hiding Spots:</b> ${(state.mapInfo?.hidingSpots || []).slice(0, 3).join(", ") || "Unknown"}</li>
            </ul>
          </div>`;

    let recommended = state.mapInfo && state.mapInfo.size === "Large" ? ["Parabolic Microphone", "Thermometer", "Video Camera"] : ["Thermometer", "EMF Reader", "Spirit Box"];
    const available = Object.keys(EQUIP).filter(item => state.inventory[item] && state.inventory[item].tier > 0);
    recommended = recommended.filter(r => available.includes(r));
    
    // Fix infinite loop for item selection
    while (recommended.length < 3 && available.some(i => !recommended.includes(i))) {
      for (const item of available) {
        if (recommended.length >= 3) break;
        if (!recommended.includes(item)) recommended.push(item);
      }
    }
    state.startingItems = [...recommended.slice(0, 3)];
    
    if (state.startingItems.length > 0) {
      let why = state.mapInfo.size === "Large" 
        ? "Large maps require the <b>Parabolic Mic</b> to hear the ghost through walls and <b>Thermometer</b> for quick room sweeping." 
        : "Small/Medium maps are easily swept with the <b>Thermometer</b> and verified with the <b>EMF Reader</b> or <b>Spirit Box</b>.";
        
      c += `<div class="start-box success-box"><h4>🎒 Recommended Loadout</h4><p>${state.startingItems.map(r => `${r} (T${state.inventory[r].tier})`).join("<br>")}</p><p style="margin-top:8px; font-size:0.8rem; color:#94a3b8; border-top:1px solid #334155; padding-top:8px;"><i>💡 <b>Why?</b> ${why}</i></p></div>`;
    }
    
    c += `<div class="start-box warning-box full-width"><h4>🧠 First Minute Checklist</h4><ul><li>1. Turn <b>Breaker ON</b> immediately.</li><li>2. Find the <b>Bone</b> ($$) and a <b>Cursed Item</b>.</li><li>3. Listen for doors/phones to locate the <b>Ghost Room</b>.</li><li>4. Note down 2 safe <b>hiding spots</b> near the room.</li></ul></div>`;

    addCoachPage("phase", "📋 Hunt Setup & Strategy", c);

    const inputArea = document.getElementById("chat-input-area");
    inputArea.innerHTML = available.map(item => {
      const isSel = state.startingItems.includes(item);
      return `<button class="btn-chat ${isSel ? 'selected' : ''}" onclick="toggleStartingItem('${item}')" id="btn-${item.replace(/\s/g, '')}">${item} T${state.inventory[item].tier}</button>`;
    }).join("") + `<button class="btn-chat primary" onclick="enterHouse()" id="enter-btn">Enter House</button>`;
  } catch (e) { console.error(e); }
}

function toggleStartingItem(item) {
  const idx = state.startingItems.indexOf(item);
  const btn = document.getElementById(`btn-${item.replace(/\s/g, '')}`);
  if (idx > -1) {
    state.startingItems.splice(idx, 1);
    if (btn) btn.classList.remove("selected");
  } else {
    if (state.startingItems.length >= 3) { showToast("Max 3 items!", "warning"); return; }
    state.startingItems.push(item);
    if (btn) btn.classList.add("selected");
  }
}

function enterHouse() {
  Object.values(state.inventory).forEach(i => i.taken = 0);
  state.startingItems.slice(0, 3).forEach(item => {
    if (state.inventory[item]) state.inventory[item].taken = 1;
  });
  state.loadoutPhase = false;
  updateEquipmentUI();
  analyzeState("Entered the house. Setup complete!");
}

function updateSanityVisual(val) {
  state.sanity = parseInt(val);
  const el = document.getElementById("sanity-val");
  if (!el) return;
  el.innerText = state.sanity + "%";
  el.style.color = state.sanity <= 50 ? "#ef4444" : (state.sanity <= 70 ? "#fbbf24" : "#4ade80");
  if (window.sanityTimeout) clearTimeout(window.sanityTimeout);
  window.sanityTimeout = setTimeout(() => { analyzeState("Sanity changed."); }, 1000);
}

function toggleHunt() {
  state.huntActive = !state.huntActive;
  const btn = document.getElementById("hunt-btn");
  const protocol = document.getElementById("hunt-protocol");

  if (state.huntActive) {
    btn.innerText = "🔴 HUNT ACTIVE"; btn.style.animation = "pulse 1s infinite";
    protocol.classList.remove("hidden");
    state.huntSeconds = 0; startHuntTimer();

    const suspects = getSuspects();
    let h = `<div class="start-box danger-box full-width"><h4>🚨 CHECKLIST</h4><p>Crucifix placed? Smudge in hand? Photo/Video ready?</p></div>`;
    if (suspects.some(g => g.name === "Dayan")) h += `<div class="start-box warning-box"><h4>⚠️ Dayan</h4><p>STAND COMPLETELY STILL.</p></div>`;
    if (suspects.some(g => g.name === "Obake")) h += `<div class="start-box warning-box"><h4>⚠️ Obake</h4><p>Watch for SHAPESHIFT.</p></div>`;
    if (suspects.some(g => g.name === "Raiju")) h += `<div class="start-box warning-box"><h4>⚠️ Raiju</h4><p>Drop electronics.</p></div>`;
    if (suspects.some(g => g.name === "Deogen")) h += `<div class="start-box warning-box"><h4>⚠️ Deogen</h4><p>Do NOT hide. Loop it.</p></div>`;
    if (suspects.some(g => g.name === "Revenant")) h += `<div class="start-box warning-box"><h4>⚠️ Revenant</h4><p>Hide immediately.</p></div>`;
    if (suspects.some(g => g.name === "Hantu")) h += `<div class="start-box warning-box"><h4>⚠️ Hantu</h4><p>Look for freezing breath.</p></div>`;

    addCoachPage("hunt", "🚨 HUNT ACTIVE", h);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  } else {
    btn.innerText = "🔴 START HUNT"; btn.style.animation = "none";
    protocol.classList.add("hidden"); stopHuntTimer();
    analyzeState("Hunt ended. Here is the updated analysis based on your observations.");
  }
}

function startHuntTimer() { clearInterval(state.huntTimerId); state.huntTimerId = setInterval(() => { state.huntSeconds++; const m = Math.floor(state.huntSeconds / 60), s = state.huntSeconds % 60, e = document.getElementById("hunt-timer"); if (e) e.innerText = `Hunt: ${m}:${s.toString().padStart(2, "0")}`; }, 1000); }
function stopHuntTimer() { clearInterval(state.huntTimerId); }
function startSessionTimer() { state.sessionSeconds = 0; clearInterval(state.sessionTimerId); state.sessionTimerId = setInterval(() => { state.sessionSeconds++; const m = Math.floor(state.sessionSeconds / 60), s = state.sessionSeconds % 60, e = document.getElementById("session-timer"); if (e) e.innerText = `Time: ${m}:${s.toString().padStart(2, "0")}`; }, 1000); }

function startSetupTimer() {
  const modeData = MODES[state.mode]; const setupTime = modeData?.setupTime ?? 0;
  if (setupTime <= 0) { state.setupSecondsLeft = null; const el = document.getElementById("setup-timer"); if (el) el.innerText = "No setup phase"; return; }
  state.setupSecondsLeft = setupTime; clearInterval(state.setupTimerId);
  state.setupTimerId = setInterval(() => {
    state.setupSecondsLeft--; const m = Math.floor(state.setupSecondsLeft / 60), s = state.setupSecondsLeft % 60, el = document.getElementById("setup-timer");
    if (el) el.innerText = `Setup: ${m}:${s.toString().padStart(2, "0")}`;
    if (state.setupSecondsLeft <= 0) { clearInterval(state.setupTimerId); if (el) el.innerText = "Setup Over"; }
  }, 1000);
}

function handleCursedItem(item) {
  state.cursedItem = item;
  const infoBox = document.getElementById("cursed-info");
  if (!infoBox) return;
  if (item === "None") { infoBox.style.display = "none"; return; }
  infoBox.style.display = "block";

  const isLarge = state.mapInfo && state.mapInfo.size === "Large";
  const lowSanity = state.sanity < 50;
  let desc = "", strategy = "";

  switch (item) {
    case "Ouija Board": desc = "Ask 'Where are you?' for room. Costs 20% sanity."; strategy = isLarge ? "Great for big maps." : "Save for later."; if (lowSanity) strategy = "⚠️ Sanity low. Do NOT use."; break;
    case "Voodoo Doll": desc = "Push pins to force EMF 5. Never push the heart pin."; strategy = "Force an interaction for EMF5."; if (lowSanity) strategy = "⚠️ Heart pin forces a hunt. Risky."; break;
    case "Haunted Mirror": desc = "See ghost room through the glass. Drains sanity."; strategy = "Safest way to find the room."; break;
    case "Monkey Paw": desc = "Grants wishes with side effects."; strategy = "Use 'I wish for activity'."; break;
    case "Summoning Circle": desc = "Light candles to force a cursed hunt."; strategy = "Use only for Hunt objective."; break;
    case "Music Box": desc = "Reveals location. Drop and run if it approaches."; strategy = "Good for medium maps."; break;
    case "Tarot Cards": desc = "Random effect (Sun/Tower)."; strategy = "Gamble. Have Sanity Pills ready."; break;
  }
  infoBox.innerHTML = `<strong style="color:#fff;">${item}</strong><br>${desc}<br><br>💡 <i>${strategy}</i>`;
  addCoachPage("info", `💀 Cursed Item: ${item}`, `<div class="start-box info-box full-width"><h4>Item Details</h4><p>${desc}</p></div><div class="start-box success-box full-width"><h4>💡 Strategy</h4><p>${strategy}</p></div>`);
}

function saveMatchHistory(ghostGuessed) {
  let history = []; try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch (e) {}
  history.unshift({ date: new Date().toLocaleDateString(), map: state.map, mode: state.mode, ghost: ghostGuessed || "Unknown", time: `${Math.floor(state.sessionSeconds / 60)}m ${state.sessionSeconds % 60}s` });
  if (history.length > 5) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const el = document.getElementById("history-list"); if (!el) return;
  let history = []; try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch (e) {}
  if (history.length === 0) { el.innerHTML = `<p style="font-size:0.8rem; color:#94a3b8;">No runs yet.</p>`; return; }
  el.innerHTML = history.map(r => `<div class="history-row"><strong>${r.ghost}</strong><small>${r.map} · ${r.mode} · ${r.time} · ${r.date}</small></div>`).join("");
}

function endRun() {
  saveMatchHistory(state.selectedGhost || "Unknown");
  clearInterval(state.setupTimerId); clearInterval(state.sessionTimerId); clearInterval(state.huntTimerId);
  setTimeout(() => location.reload(), 200);
}

function toggleDrawer(type) {
  const drawer = document.getElementById(`${type}-drawer`); const tab = document.getElementById(`tab-${type}`);
  if (!drawer || !tab) return;
  drawer.classList.toggle("open");
  tab.innerText = drawer.classList.contains("open") ? (type === 'suspect' ? "❮" : "❯") : (type === 'suspect' ? "❯" : "❮");
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container"); if (!container) return;
  const toast = document.createElement("div"); toast.className = `toast ${type}`; toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation = "fadeOut 0.3s forwards"; setTimeout(() => toast.remove(), 300); }, 3000);
}

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", e => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName) || state.loadoutPhase) return;
    const k = e.key.toLowerCase();
    if (k === "h") { e.preventDefault(); toggleHunt(); }
    else if (k === "r") { e.preventDefault(); analyzeState("Manually Re-analyzed"); }
    else if (k === "t") { e.preventDefault(); toggleDrawer('behavior'); }
    else if (k === "g") { e.preventDefault(); toggleDrawer('suspect'); }
    else if (k === "arrowleft") { e.preventDefault(); prevPage(); }
    else if (k === "arrowright") { e.preventDefault(); nextPage(); }
    else if (k >= "1" && k <= "7") {
      const names = Object.keys(EV_TO_BIT); const idx = parseInt(k) - 1;
      if (idx < names.length) { e.preventDefault(); cycleEvidence(names[idx]); }
    }
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(err => console.log('SW failed', err)); });
}

window.onload = () => {
  buildMatrix(); loadProfile(); updateUI(); renderHistory(); renderChat(); setupKeyboardShortcuts();
}