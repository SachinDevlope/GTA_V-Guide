window.GTA_DATA = window.GTA_DATA || {};

// Story-mode character skills (each of Michael, Franklin and Trevor has these).
window.GTA_DATA.skills = [
  {
    "id": "s-stamina",
    "name": "Stamina",
    "summary": "How long you can sprint, swim and cycle before tiring.",
    "howToImprove": [
      "Sprint on foot for long stretches",
      "Ride a bicycle (BMX, Scorcher, Tri-Cycles)",
      "Swim",
      "Complete triathlons"
    ],
    "description": "Higher Stamina lets your character run, cycle and swim for longer without slowing down. It also adds a little to how much damage you can take.",
    "tags": ["running", "sprint", "cycling", "swimming", "triathlon"]
  },
  {
    "id": "s-shooting",
    "name": "Shooting",
    "summary": "Accuracy, recoil control, reload speed and ammo capacity.",
    "howToImprove": [
      "Get kills with firearms",
      "Land headshots",
      "Complete challenges at the Ammu-Nation shooting ranges"
    ],
    "description": "Shooting affects accuracy, recoil control, how fast you reload and how much ammo you can carry. The shooting range is the quickest way to raise it.",
    "tags": ["aim", "accuracy", "gun range", "ammu-nation"]
  },
  {
    "id": "s-strength",
    "name": "Strength",
    "summary": "Melee damage and how much damage you can absorb.",
    "howToImprove": [
      "Punch and melee enemies",
      "Play tennis or golf",
      "Do pull-ups / workouts at Muscle Sands (Vespucci Beach)"
    ],
    "description": "Strength raises melee damage and makes your character a little tougher. Tennis and golf rallies raise it steadily.",
    "tags": ["melee", "fist fight", "tennis", "golf", "gym"]
  },
  {
    "id": "s-stealth",
    "name": "Stealth",
    "summary": "How quietly you move while crouched/sneaking.",
    "howToImprove": [
      "Move around in stealth mode (crouch)",
      "Get stealth kills (melee takedowns from behind)"
    ],
    "description": "Stealth lowers the noise you make while sneaking and makes you harder to spot on the minimap. Stealth takedowns raise it fastest.",
    "tags": ["sneak", "crouch", "takedown"]
  },
  {
    "id": "s-flying",
    "name": "Flying",
    "summary": "Plane and helicopter handling, and resistance to turbulence.",
    "howToImprove": [
      "Fly planes and helicopters",
      "Complete lessons at the San Andreas Flight School",
      "Fly under bridges and do knife flights",
      "Land safely after flying"
    ],
    "description": "Flying makes aircraft steadier, more responsive and less affected by turbulence. Flight School lessons give big boosts.",
    "tags": ["pilot", "plane", "helicopter", "flight school"]
  },
  {
    "id": "s-driving",
    "name": "Driving",
    "summary": "Vehicle control, cornering and air control on jumps.",
    "howToImprove": [
      "Drive fast without crashing",
      "Do wheelies on motorcycles",
      "Get near misses with traffic",
      "Complete stunt jumps and street races"
    ],
    "description": "Driving improves car control, traction while cornering and how well you control a car in the air. Franklin's special ability also benefits from practice behind the wheel.",
    "tags": ["car", "wheelie", "racing", "stunt jumps"]
  },
  {
    "id": "s-lung-capacity",
    "name": "Lung Capacity",
    "summary": "How long you can stay underwater.",
    "howToImprove": [
      "Swim underwater",
      "Collect submarine pieces / explore the seabed"
    ],
    "description": "Lung Capacity sets how long you can hold your breath underwater before you start losing health.",
    "tags": ["underwater", "breath", "diving", "swim"]
  },
  {
    "id": "s-special",
    "name": "Special",
    "summary": "Length of each character's special ability.",
    "howToImprove": [
      "Use your special ability often",
      "Michael: Bullet Time while shooting",
      "Franklin: slow-motion driving",
      "Trevor: Red Mist rage mode in combat"
    ],
    "description": "Special controls how long the special ability bar lasts. Michael slows time while aiming, Franklin slows time while driving, and Trevor deals more damage and takes less while enraged.",
    "tags": ["special ability", "bullet time", "red mist", "slow motion"]
  }
];

// Story-mode collectibles and side activities. Counts are for the story mode.
window.GTA_DATA.collectibles = [
  {
    "id": "col-spaceship-parts",
    "name": "Spaceship Parts",
    "count": 50,
    "character": "Franklin",
    "giver": "Omega",
    "reward": "Space Docker (alien buggy)",
    "description": "Glowing spaceship pieces hidden around the map for Franklin, unlocked by the Strangers and Freaks mission \"Far Out\" with Omega. Return all 50 to get the Space Docker.",
    "tags": ["omega", "ufo", "alien", "space docker", "far out"]
  },
  {
    "id": "col-letter-scraps",
    "name": "Letter Scraps",
    "count": 50,
    "character": "Any",
    "giver": null,
    "reward": "Reveals the killer of Leonora Johnson",
    "description": "Torn pieces of a letter scattered around Los Santos and Blaine County. Collecting all of them reveals who murdered Leonora Johnson and starts a short follow-up.",
    "tags": ["murder mystery", "leonora johnson", "letter"]
  },
  {
    "id": "col-submarine-pieces",
    "name": "Submarine Pieces",
    "count": 30,
    "character": "Michael",
    "giver": "Abigail Mathers",
    "reward": null,
    "description": "Wreckage of a mini-submarine lying on the seabed, found by Michael after meeting Abigail Mathers. A submarine or diving gear makes this much easier.",
    "tags": ["abigail", "underwater", "submarine", "diving"]
  },
  {
    "id": "col-nuclear-waste",
    "name": "Nuclear Waste",
    "count": 30,
    "character": null,
    "giver": null,
    "reward": null,
    "description": "Barrels of nuclear waste on the seabed off Palmer-Taylor Power Station, picked up with a Submersible fitted with a claw.",
    "tags": ["barrels", "submersible", "underwater"]
  },
  {
    "id": "col-stunt-jumps",
    "name": "Stunt Jumps",
    "count": 50,
    "character": "Any",
    "giver": null,
    "reward": "Counts toward 100% completion",
    "description": "Ramps and gaps across the map. Hit them fast and land cleanly in the marked zone to complete each one.",
    "tags": ["jumps", "ramp", "100%"]
  },
  {
    "id": "col-under-the-bridge",
    "name": "Under the Bridge",
    "count": 50,
    "character": "Any",
    "giver": null,
    "reward": "Counts toward 100% completion",
    "description": "Fly any aircraft under the bridges around San Andreas. Raises Flying skill as you go.",
    "tags": ["bridges", "flying", "100%"]
  },
  {
    "id": "col-knife-flights",
    "name": "Knife Flights",
    "count": 15,
    "character": "Any",
    "giver": null,
    "reward": "Counts toward 100% completion",
    "description": "Fly a plane through tight gaps between buildings, tilted on its side, mostly in downtown Los Santos.",
    "tags": ["flying", "downtown", "100%"]
  },
  {
    "id": "col-epsilon-tracts",
    "name": "Epsilon Tracts",
    "count": 10,
    "character": "Michael",
    "giver": "Epsilon Program",
    "reward": "Progress in the Epsilon Program",
    "description": "Hidden pamphlets for the Epsilon Program, found by Michael during the Epsilon strangers and freaks chain. Only visible once that chain is underway.",
    "tags": ["epsilon", "cult", "marnie", "cris formage"]
  },
  {
    "id": "col-monkey-mosaics",
    "name": "Monkey Mosaics",
    "count": 50,
    "character": "Any",
    "giver": null,
    "reward": null,
    "description": "Small monkey mosaics on walls around the map, added in the enhanced (PS4/Xbox One/PC and later) editions of the game.",
    "tags": ["monkey", "mosaic", "enhanced edition"]
  },
  {
    "id": "col-peyote-plants",
    "name": "Peyote Plants",
    "count": 27,
    "character": "Any",
    "giver": null,
    "reward": "Play as animals",
    "description": "Eating a peyote plant turns you into an animal for a short trip. Added in the enhanced editions.",
    "tags": ["animal", "peyote", "enhanced edition"]
  }
];
