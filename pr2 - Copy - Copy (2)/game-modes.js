window.GAME_MODES = {
  "Amateur": { type: "standard", multiplier: 1, setupTime: 300, evidence: 3, breaker: "On", startSanity: 100, coachTip: "5 minutes of setup. Find the camera and learn the map." },
  "Intermediate": { type: "standard", multiplier: 2, setupTime: 120, evidence: 3, breaker: "Off", startSanity: 100, coachTip: "2 minutes of setup. Turn the breaker on immediately." },
  "Professional": { type: "standard", multiplier: 3, setupTime: 0, evidence: 3, breaker: "Off", startSanity: 100, coachTip: "No setup. Enter with a Crucifix in hand. Sanity drain is 200%." },
  "Nightmare": { type: "standard", multiplier: 4, setupTime: 0, evidence: 2, breaker: "Off (Hidden)", startSanity: 100, coachTip: "Only 2 evidence. Monitors are broken. Use behavior." },
  "Insanity": { type: "standard", multiplier: 6, setupTime: 0, evidence: 1, breaker: "Off (Hidden)", startSanity: 75, coachTip: "Only 1 evidence. Start at 75% sanity. Zero cursed items." },

  "Weekly: Lights Out!": {
    type: "weekly", multiplier: 5, setupTime: 0, evidence: 3, breaker: "Broken", startSanity: 100,
    map: "6 Tanglewood Drive", mods: "No flashlights, breaker broken.",
    coachTip: "Use candles and environmental light. The breaker is broken.",
    cursedItem: "Music Box"
  },
  "Weekly: Speed Demons": {
    type: "weekly", multiplier: 5, setupTime: 0, evidence: 3, breaker: "Off", startSanity: 100,
    map: "Maple Lodge Campsite", mods: "150% player and ghost speed.",
    coachTip: "Looping is essential. You are fast, but so is the ghost.",
    cursedItem: "Monkey Paw"
  },
  "Weekly: Detectives Only": {
    type: "weekly", multiplier: 5, setupTime: 0, evidence: 0, breaker: "Off", startSanity: 100,
    map: "42 Edgefield Road", mods: "0 Evidence.",
    coachTip: "Rely entirely on behavior tests.",
    cursedItem: "None"
  },
  "Weekly: Missed Delivery": {
    type: "weekly", multiplier: 5, setupTime: 0, evidence: 3, breaker: "Off", startSanity: 100,
    map: "Brownstone High School", mods: "Tier 1 gear only.",
    coachTip: "Slow thermometer, weak flashlight. Listen for sounds.",
    cursedItem: "Random"
  },
  "Weekly: The Apocalypse": {
    type: "weekly", multiplier: 10, setupTime: 0, evidence: 0, breaker: "Broken", startSanity: 0,
    map: "Sunny Meadows Restricted", mods: "0 Sanity, no flashlights, 150% ghost speed, 0 hiding spots.",
    coachTip: "The hardest challenge. Stay moving, use ambient light.",
    cursedItem: "Random"
  }
};