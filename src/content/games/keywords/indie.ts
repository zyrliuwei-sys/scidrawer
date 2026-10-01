import type { KeywordInput } from '../types';

/**
 * Compact builder for new/indie game pages. Each page gets a unique summary,
 * intro, "how to play" steps and tips so no two pages share body copy.
 */
function game(
  keyword: string,
  product: string,
  o: {
    genre: string;
    summary: string;
    intro: string;
    howTo: string[];
    tips: string[];
    faq: Array<[string, string]>;
  }
): KeywordInput {
  return {
    keyword,
    product,
    summary: o.summary,
    intro: o.intro,
    sections: [
      {
        heading: `How to play ${keyword}`,
        blocks: [{ type: 'steps', items: o.howTo }],
      },
      {
        heading: 'Tips & tricks',
        blocks: [{ type: 'list', items: o.tips }],
      },
      {
        heading: 'Where to play',
        blocks: [
          {
            type: 'p',
            text: `${keyword} is a ${o.genre}. Use the button at the top of this page to find a place to play it. Prefer well-known portals and official app stores, and skip any site that asks you to download an installer for a browser game.`,
          },
        ],
      },
    ],
    faq: o.faq.map(([q, a]) => ({ q, a })),
  };
}

export const INDIE_KEYWORDS: KeywordInput[] = [
  game('The Toxic Mist', 'the-toxic-mist', {
    genre: 'survival game built around a creeping, poisonous fog',
    summary:
      'The Toxic Mist: survive a creeping poisonous fog — how to play, survival tips and where to play online.',
    intro:
      'The Toxic Mist puts you in a world swallowed by poisonous fog. Your job is simple to say and hard to do: stay out of the mist long enough to survive.',
    howTo: [
      'Explore while the mist is thin and gather whatever supplies you can.',
      'Watch the fog line — it advances over time.',
      'Retreat to safe ground before the mist reaches you.',
    ],
    tips: [
      'Learn the map early so you always know your escape route.',
      'Do not over-loot: being slow near the mist is how most runs end.',
    ],
    faq: [
      [
        'Is The Toxic Mist scary?',
        'It leans atmospheric and tense rather than jump-scare horror.',
      ],
    ],
  }),
  game('Krabby Chase', 'krabby-chase', {
    genre: 'casual crab-themed arcade chase game',
    summary:
      'Krabby Chase: a quick crab-themed arcade chase — controls, high-score tips and where to play free in your browser.',
    intro:
      'Krabby Chase is a bite-sized arcade game starring a crab on the run. Rounds are short, so it is perfect for a quick break.',
    howTo: [
      'Move your crab to dodge whatever is chasing you.',
      'Grab pickups along the way to boost your score.',
      'Survive as long as possible for a new high score.',
    ],
    tips: [
      'Crabs move sideways — use wide, sweeping dodges rather than sharp turns.',
      'Prioritize survival over pickups when the screen gets busy.',
    ],
    faq: [
      [
        'Is Krabby Chase related to SpongeBob?',
        'No official connection is known; the crab theme is just a shared idea.',
      ],
    ],
  }),
  game('Luigi’s Pizza House', 'luigis-pizza-house', {
    genre: 'pizza-cooking and restaurant time-management game',
    summary:
      'Luigi’s Pizza House: bake pizzas, serve customers and grow your pizzeria — gameplay guide and time-management tips.',
    intro:
      'Luigi’s Pizza House is a cooking game where you run a pizzeria: take orders, top and bake pizzas, and keep customers happy.',
    howTo: [
      'Read each customer’s order.',
      'Add the right sauce, cheese and toppings.',
      'Bake without burning it, then serve.',
      'Spend earnings on upgrades for your pizza house.',
    ],
    tips: [
      'Start the next pizza while one is baking.',
      'Upgrade the oven first — speed is the main bottleneck.',
    ],
    faq: [
      [
        'Is it related to Nintendo’s Luigi?',
        'No official connection; it is a casual cooking game.',
      ],
    ],
  }),
  game('Jewel Blocks Quest', 'jewel-blocks-quest', {
    genre: 'relaxing jewel block puzzle',
    summary:
      'Jewel Blocks Quest: place jewel blocks to clear rows and columns — how to play and strategies for higher scores.',
    intro:
      'Jewel Blocks Quest is a block-fitting puzzle with a jewel theme: drop shapes on the grid and clear full lines.',
    howTo: [
      'Drag a jewel block onto the board.',
      'Complete a full row or column to clear it.',
      'The game ends when no block fits.',
    ],
    tips: [
      'Keep a 3×3 space free for big pieces.',
      'Clear several lines at once for combo points.',
    ],
    faq: [
      [
        'Is there a time limit?',
        'Classic block puzzles like this usually let you play at your own pace.',
      ],
    ],
  }),
  game('Backrooms: Five Nights to Escape', 'backrooms-five-nights', {
    genre: 'Backrooms-inspired survival horror game',
    summary:
      'Backrooms: Five Nights to Escape — survive five nights in the endless yellow rooms. How to play and survival tips.',
    intro:
      'Backrooms: Five Nights to Escape mixes the creepypasta Backrooms with a five-night survival structure: last each night and find the way out.',
    howTo: [
      'Explore the yellow halls and learn their layout.',
      'Avoid the entities that roam each night.',
      'Survive all five nights to escape.',
    ],
    tips: [
      'Sound matters — play with headphones.',
      'Mark landmarks; the Backrooms are designed to disorient you.',
    ],
    faq: [
      [
        'Is it the same as Escape the Backrooms?',
        'No — Escape the Backrooms is a different game.',
      ],
    ],
  }),
  game('Sortello', 'sortello', {
    genre: 'color-sorting puzzle',
    summary:
      'Sortello: a tidy color-sorting puzzle — rules, solving strategies and where to play online.',
    intro:
      'Sortello is a sorting puzzle: move items between containers until every container holds a single color.',
    howTo: [
      'Tap a container to pick up its top item.',
      'Tap another container to place it — only on a matching color or an empty slot.',
      'Finish when every container is one color.',
    ],
    tips: [
      'Keep one container empty as a buffer as long as possible.',
      'Plan two moves ahead before committing.',
    ],
    faq: [
      [
        'Can I undo moves?',
        'Most sorting puzzles include an undo or restart button.',
      ],
    ],
  }),
  game('Wolfoo Word Wonders', 'wolfoo-word-wonders', {
    genre: 'crossword-style word puzzle for kids and families',
    summary:
      'Wolfoo Word Wonders: swipe letters to fill a crossword across 30 levels from Easy to Expert, with hints and word audio.',
    intro:
      'Wolfoo Word Wonders, released in July 2026, is a friendly word game: swipe letters on a wheel to spell words and fill the crossword grid.',
    howTo: [
      'Swipe across the letters on the wheel to spell a word.',
      'Correct words fill into the crossword.',
      'Complete the grid to finish the level — 30 levels from Easy to Expert.',
    ],
    tips: [
      'Try short words first; they often reveal letters for longer ones.',
      'Use hints and word audio when stuck — great for younger players.',
    ],
    faq: [
      [
        'Does it work on phones?',
        'Yes, it plays on desktop and mobile browsers.',
      ],
    ],
  }),
  game('Viviennes Lifestyle Yacht Club', 'viviennes-yacht-club', {
    genre: 'fashion dress-up game set on a luxury superyacht',
    summary:
      'Viviennes Lifestyle Yacht Club: style a socialite for yacht parties — designer dresses, shoes and jewelry. How to play.',
    intro:
      'In Viviennes Lifestyle Yacht Club you are the personal stylist of a socialite aboard a superyacht, creating outfits for sea parties and deck lounging.',
    howTo: [
      'Shop for designer dresses and footwear.',
      'Accessorize with jewelry and sunglasses.',
      'Create looks for each occasion and earn points.',
    ],
    tips: [
      'Match the outfit to the event — party looks and deck looks score differently.',
      'Keep accessories minimal with bold dresses.',
    ],
    faq: [['Is it free?', 'Yes, it is a free browser game.']],
  }),
  game('Slime Gluttion', 'slime-gluttion', {
    genre: 'arcade growth game starring a hungry slime',
    summary:
      'Slime Gluttion: eat, grow and evolve as a hungry slime — how to play and growth tips.',
    intro:
      'Slime Gluttion (often searched as Slime Gluttony) is an arcade game about a slime that eats everything smaller than itself to grow bigger.',
    howTo: [
      'Move your slime around the level.',
      'Eat anything smaller than you to grow.',
      'Avoid bigger threats until you outgrow them.',
    ],
    tips: [
      'Grow safely on small food before hunting larger prey.',
      'Watch the edges — threats often enter from off-screen.',
    ],
    faq: [
      [
        'Is it "Gluttion" or "Gluttony"?',
        'Players search both spellings for the same idea of a hungry, growing slime.',
      ],
    ],
  }),
  game('Mage’s Mate: Chess', 'mages-mate-chess', {
    genre: 'chess game against an AI opponent',
    summary:
      'Mage’s Mate: Chess: duel an AI at a vintage board, adjust difficulty and unlock carved piece sets. Tips to win.',
    intro:
      'Mage’s Mate: Chess is a browser chess game where you sit at a vintage board and duel an AI. Coins you earn unlock unique carved piece sets.',
    howTo: [
      'Pick a difficulty for your AI opponent.',
      'Play a standard game of chess.',
      'Win to earn coins and unlock new carved sets.',
    ],
    tips: [
      'Control the center early and develop knights and bishops.',
      'Raise the difficulty gradually as you improve.',
    ],
    faq: [['Is it standard chess rules?', 'Yes, it is a classic chess duel.']],
  }),
  game('Solitaire Classic Klondike 2027', 'solitaire-klondike-2027', {
    genre: 'classic Klondike solitaire card game',
    summary:
      'Solitaire Classic Klondike 2027: rules, winning strategy and where to play this refreshed Klondike solitaire.',
    intro:
      'Solitaire Classic Klondike 2027 is the timeless Klondike solitaire with a fresh look. The goal: move all cards to the four foundations, Ace to King.',
    howTo: [
      'Build tableau columns down in alternating colors.',
      'Move Aces to the foundations as soon as they appear.',
      'Draw from the stock when you run out of moves.',
    ],
    tips: [
      'Reveal face-down cards whenever possible.',
      'Only put a King in an empty column if it unlocks progress.',
    ],
    faq: [
      [
        'Draw 1 or draw 3?',
        'Draw 1 is easier; Draw 3 is the traditional challenge.',
      ],
    ],
  }),
  game('Obby: Magic Wall Breaker', 'obby-magic-wall-breaker', {
    genre: 'obby-style arcade runner where you smash through walls with magic',
    summary:
      'Obby: Magic Wall Breaker — break walls with magic in a fast obby run. Controls, tips and where to play.',
    intro:
      'Obby: Magic Wall Breaker takes the obstacle-course "obby" format and adds magic: smash through walls instead of just jumping over gaps.',
    howTo: [
      'Run through the course.',
      'Use magic to break the walls in your way.',
      'Reach the end without falling.',
    ],
    tips: [
      'Time your magic just before impact.',
      'Upgrade power first so you can break tougher walls.',
    ],
    faq: [
      [
        'Is it a Roblox game?',
        'It borrows the obby style; check where you play it — it is listed as a browser game.',
      ],
    ],
  }),
  game('Arrows Flow: Escape Puzzle', 'arrows-flow', {
    genre: 'logic puzzle about clearing arrows off a grid',
    summary:
      'Arrows Flow: Escape Puzzle — tap arrows in the right order so every arrow escapes the grid. Rules and strategy.',
    intro:
      'Arrows Flow: Escape Puzzle is a tidy logic game. Every arrow can only exit in the direction it points, so the challenge is finding the right order.',
    howTo: [
      'Tap an arrow whose lane to the edge is clear.',
      'If another arrow blocks the exit, clear that one first.',
      'Clear every arrow to finish the level.',
    ],
    tips: [
      'Start from arrows on the edge pointing outward.',
      'Work backward from the most blocked arrow.',
    ],
    faq: [['Is it on mobile?', 'Yes, on iOS and Android.']],
  }),
  game('Ancient Library: Hidden Secrets', 'ancient-library', {
    genre: 'hidden-object mystery game',
    summary:
      'Ancient Library: Hidden Secrets — find hidden objects in a dusty library and uncover its mystery. Tips for every scene.',
    intro:
      'Ancient Library: Hidden Secrets is a hidden-object game set among towering shelves, old scrolls and secret compartments.',
    howTo: [
      'Check the list of items to find.',
      'Scan the scene and tap each item.',
      'Solve mini-puzzles to unlock new rooms.',
    ],
    tips: [
      'Zoom in on cluttered shelves — small items hide in shadows.',
      'Save hints for the last stubborn item.',
    ],
    faq: [
      [
        'Is there a story?',
        'Hidden-object games like this usually tie scenes together with a light mystery.',
      ],
    ],
  }),
  game('Electoral Reform Please', 'electoral-reform-please', {
    genre: 'satirical desk-job simulation about voting systems',
    summary:
      'Electoral Reform Please: a satirical sim about fixing an election system — what it is and how to play.',
    intro:
      'Electoral Reform Please is a satirical desk sim — its title nods to the "Papers, Please" style — about the messy business of reforming how votes are counted.',
    howTo: [
      'Review the cases or ballots placed in front of you.',
      'Apply the current rules — which change as reforms roll in.',
      'Balance fairness against the pressures of the job.',
    ],
    tips: [
      'Read rule changes carefully each round.',
      'Speed matters, but mistakes cost more.',
    ],
    faq: [
      ['Is it political?', 'It is satire about electoral systems in general.'],
    ],
  }),
  game('Legend of Zelda - Level 1', 'zelda-level-1', {
    genre: 'retro adventure tribute to the first Zelda dungeon',
    summary:
      'Legend of Zelda - Level 1: a tribute to the original dungeon — layout, enemies and where to play the official game.',
    intro:
      '"Legend of Zelda - Level 1" refers to the first dungeon (the Eagle) in the original 1986 The Legend of Zelda, and to fan tributes that recreate it.',
    howTo: [
      'Explore the dungeon room by room.',
      'Collect keys, the map and the compass.',
      'Pick up the bow and boomerang, then defeat the dragon boss Aquamentus to claim the Triforce piece.',
    ],
    tips: [
      'Bomb walls that look suspicious.',
      'The official game is on Nintendo Switch Online — fan versions are unofficial.',
    ],
    faq: [
      [
        'Is the fan version official?',
        'No. The official The Legend of Zelda is available through Nintendo Switch Online.',
      ],
    ],
  }),
  game('Until the First Snow Falls', 'until-the-first-snow-falls', {
    genre: 'quiet, story-driven narrative game',
    summary:
      'Until the First Snow Falls: a calm narrative game set in the days before winter. What to expect and how long it takes.',
    intro:
      'Until the First Snow Falls is a story-first game: slow, reflective and built around the days before winter arrives.',
    howTo: [
      'Explore and talk to the characters around you.',
      'Make choices in conversations.',
      'Follow the story to its end as the first snow approaches.',
    ],
    tips: [
      'Take your time — the game rewards looking around.',
      'Play with sound on for the atmosphere.',
    ],
    faq: [
      [
        'Is it a long game?',
        'Narrative games like this are usually short enough to finish in a sitting or two.',
      ],
    ],
  }),
  game('Fish Sort Puzzle', 'fish-sort-puzzle', {
    genre: 'color-sorting puzzle with fish and tanks',
    summary:
      'Fish Sort Puzzle: sort fish by color into tanks — rules, strategy and how to beat hard levels.',
    intro:
      'Fish Sort Puzzle is a calm sorting game: move fish between tanks until every tank holds just one color.',
    howTo: [
      'Tap a tank to pick up the top fish.',
      'Drop it onto a matching color or into an empty tank.',
      'Clear the level when all tanks are sorted.',
    ],
    tips: [
      'Never fill your last empty tank unless it finishes a color.',
      'Focus on colors that are almost complete.',
    ],
    faq: [['Is it relaxing?', 'Yes — no timers in most levels.']],
  }),
  game('Slime Chef Magnet Merge Kitchen', 'slime-chef', {
    genre: 'merge-and-cook puzzle starring a slime chef',
    summary:
      'Slime Chef Magnet Merge Kitchen: use magnets to merge ingredients and cook dishes. How to play and merge tips.',
    intro:
      'Slime Chef Magnet Merge Kitchen combines merge puzzles with cooking: a slime chef uses magnets to pull matching ingredients together.',
    howTo: [
      'Use the magnet to pull ingredients together.',
      'Merge matching ingredients into higher-tier ones.',
      'Combine them into dishes to fill orders.',
    ],
    tips: [
      'Clear space before merging chains.',
      'Work toward the current order instead of merging randomly.',
    ],
    faq: [['Is it a merge game?', 'Yes, with a cooking twist.']],
  }),
  game('Texter Tycoon', 'texter-tycoon', {
    genre: 'idle tycoon about building a messaging empire',
    summary:
      'Texter Tycoon: grow a texting empire in this idle tycoon — how upgrades work and how to earn faster.',
    intro:
      'Texter Tycoon is an idle tycoon where your business is messages: send texts, earn money and automate your way to an empire.',
    howTo: [
      'Send messages to earn your first income.',
      'Buy upgrades that send messages automatically.',
      'Reinvest to grow exponentially.',
    ],
    tips: [
      'Automation upgrades beat manual tapping in the long run.',
      'Check back after a break — idle income adds up.',
    ],
    faq: [
      ['Is it an idle game?', 'Yes — progress continues through automation.'],
    ],
  }),
  game('Desert Wheels: 2 Player Racing', 'desert-wheels', {
    genre: 'split-screen two-player desert racing game',
    summary:
      'Desert Wheels: 2 Player Racing — race a friend across the desert on one keyboard. Controls and racing tips.',
    intro:
      'Desert Wheels: 2 Player Racing is a local multiplayer racer: two players, one screen, dusty desert tracks.',
    howTo: [
      'Player 1 and Player 2 each take a side of the keyboard.',
      'Race across desert tracks.',
      'First to the finish wins.',
    ],
    tips: [
      'Brake before dunes to avoid flipping.',
      'Upgrade grip for sandy corners.',
    ],
    faq: [
      [
        'Can I play solo?',
        'It is built for two players; many such racers also offer a single-player mode.',
      ],
    ],
  }),
  game('Highway Domination Desert', 'highway-domination-desert', {
    genre: 'endless highway driving game in the desert',
    summary:
      'Highway Domination Desert: weave through desert highway traffic at top speed — tips for longer runs.',
    intro:
      'Highway Domination Desert is a high-speed traffic dodger set on a long desert highway.',
    howTo: [
      'Steer between lanes to avoid traffic.',
      'Stay fast for bonus points.',
      'Survive as long as possible.',
    ],
    tips: [
      'Near-misses often score extra.',
      'Look further ahead than you think.',
    ],
    faq: [['Is it endless?', 'Yes, runs continue until you crash.']],
  }),
  game('Cooking Tasty: Restaurant Game', 'cooking-tasty', {
    genre: 'restaurant cooking and time-management game',
    summary:
      'Cooking Tasty: Restaurant Game — cook and serve fast, upgrade your kitchen and unlock new restaurants.',
    intro:
      'Cooking Tasty: Restaurant Game is a classic cooking rush: prepare dishes, serve customers before they lose patience and upgrade as you go.',
    howTo: [
      'Prepare each dish as orders come in.',
      'Serve before customer patience runs out.',
      'Upgrade equipment and unlock new restaurants.',
    ],
    tips: [
      'Prep popular items ahead of time.',
      'Upgrade the slowest station first.',
    ],
    faq: [['Is it free?', 'Yes, it is a free-to-play cooking game.']],
  }),
  game('PieceAlive', 'piecealive', {
    genre: 'quirky puzzle game',
    summary:
      'PieceAlive: a quirky puzzle where pieces come alive — what it is and how to approach each level.',
    intro:
      'PieceAlive is a newer puzzle game built around pieces that behave like living things. Each level asks you to figure out how they move and interact.',
    howTo: [
      'Observe how each piece behaves.',
      'Move pieces to reach the level goal.',
      'Restart and experiment if you get stuck.',
    ],
    tips: [
      'Spend the first few seconds just watching.',
      'Solutions are often simpler than they look.',
    ],
    faq: [
      [
        'Is PieceAlive hard?',
        'It starts easy and ramps up as new piece types appear.',
      ],
    ],
  }),
  game('Diamond Art Sort', 'diamond-art-sort', {
    genre: 'diamond-painting sorting puzzle',
    summary:
      'Diamond Art Sort: sort gems by color to reveal a sparkling diamond-art picture. How to play and tips.',
    intro:
      'Diamond Art Sort mixes diamond painting with sorting: move colorful gems into the right spots and reveal a picture piece by piece.',
    howTo: [
      'Pick up gems and sort them by color.',
      'Place each gem in its matching spot.',
      'Finish the picture to complete the level.',
    ],
    tips: [
      'Complete one color at a time.',
      'Use empty slots as temporary storage.',
    ],
    faq: [['Is it on mobile?', 'Yes, plus browser versions.']],
  }),
  game('Road Racer Fighter', 'road-racer-fighter', {
    genre: 'combat racing game',
    summary:
      'Road Racer Fighter: race and fight on the highway at the same time — controls and combat-racing tips.',
    intro:
      'Road Racer Fighter is a combat racer: you are not just trying to finish first, you are fighting rivals on the road.',
    howTo: [
      'Race down the highway.',
      'Attack nearby riders to knock them out.',
      'Finish first without wrecking.',
    ],
    tips: [
      'Attack when you have a clear lane to escape.',
      'Upgrade durability before speed.',
    ],
    faq: [
      [
        'Is it like Road Rash?',
        'It shares the race-and-fight idea popularized by Road Rash.',
      ],
    ],
  }),
  game('Animal Snap Showdown', 'animal-snap-showdown', {
    genre: 'fast matching card game with animals',
    summary:
      'Animal Snap Showdown: snap matching animal cards faster than your rival. Rules and reaction tips.',
    intro:
      'Animal Snap Showdown is a speedy take on Snap with animal cards — spot a match and slap first.',
    howTo: [
      'Cards are flipped one at a time.',
      'When two matching animals appear, hit Snap.',
      'First to snap wins the pile.',
    ],
    tips: [
      'Watch the pile, not your opponent.',
      'False snaps can cost you — be sure.',
    ],
    faq: [['Is it good for kids?', 'Yes, it is simple and quick.']],
  }),
  game('Ember Boy and Ripple Girl', 'ember-boy-ripple-girl', {
    genre: 'fire-and-water platform puzzle adventure',
    summary:
      'Ember Boy and Ripple Girl: switch between fire and water heroes to pull levers, move slabs and avoid traps.',
    intro:
      'Ember Boy and Ripple Girl is a colorful platform adventure in the fire-and-water tradition. You control both characters and switch between them to solve each level.',
    howTo: [
      'Switch between Ember Boy (fire) and Ripple Girl (water).',
      'Use each one’s ability to activate wall levers and move heavy slabs.',
      'Avoid deadly traps and get both characters to the exit.',
    ],
    tips: [
      'Keep each hero away from the opposite element.',
      'Move one character into a safe spot before switching.',
    ],
    faq: [
      [
        'Is it like Fireboy and Watergirl?',
        'It uses the same fire-and-water co-op idea.',
      ],
    ],
  }),
  game('Stumble Boys: Party Royale', 'stumble-boys', {
    genre: 'party royale obstacle game',
    summary:
      'Stumble Boys: Party Royale — survive chaotic obstacle rounds to be the last one standing. Tips to qualify.',
    intro:
      'Stumble Boys: Party Royale is a party game in the "stumble" style: wobbly characters race through obstacle rounds until one winner remains.',
    howTo: [
      'Race through each obstacle round.',
      'Qualify before the slots fill up.',
      'Win the final round.',
    ],
    tips: [
      'Avoid the crowded middle path.',
      'Jump timing beats raw speed on spinning bars.',
    ],
    faq: [
      ['Is it like Stumble Guys?', 'It follows the same party-royale formula.'],
    ],
  }),
  game('Terminator Robot Uprising', 'terminator-robot-uprising', {
    genre: 'action shooter about fighting off a robot uprising',
    summary:
      'Terminator Robot Uprising: fight back against a machine uprising — weapons, waves and survival tips.',
    intro:
      'Terminator Robot Uprising is an action game where machines have turned on humanity and you lead the fight back.',
    howTo: [
      'Fight off waves of robots.',
      'Collect better weapons as you go.',
      'Survive and push the uprising back.',
    ],
    tips: [
      'Keep moving — robots focus on stationary targets.',
      'Save heavy weapons for elite enemies.',
    ],
    faq: [
      [
        'Is it an official Terminator game?',
        'No official franchise connection is listed for it — treat it as an independent browser game.',
      ],
    ],
  }),
  game('Ultimate Car Parking Sim', 'ultimate-car-parking-sim', {
    genre: 'realistic car-parking simulator',
    summary:
      'Ultimate Car Parking Sim: master tight spots and tricky angles — controls, camera tips and how to stop clipping cones.',
    intro:
      'Ultimate Car Parking Sim is all about precision: maneuver your car into tight spaces without hitting anything.',
    howTo: [
      'Drive to the highlighted parking spot.',
      'Use reverse and steering carefully.',
      'Park without touching cones or other cars.',
    ],
    tips: [
      'Switch camera views for tight spaces.',
      'Go slow — speed is never rewarded here.',
    ],
    faq: [
      ['Is it realistic?', 'It aims for realistic handling and camera views.'],
    ],
  }),
  game('What Lies In The Depths', 'what-lies-in-the-depths', {
    genre: 'free incremental game with a dreamlike story',
    summary:
      'What Lies In The Depths: a free 6–7 hour incremental game about sinking into your own dream — Mind Palace, Oneiri and 25 places.',
    intro:
      'What Lies In The Depths is a free incremental game by Drew the Bear about a dreamer who sank into his own sleep and never came back up.',
    howTo: [
      'Gather what the dream gives up.',
      'Build a Mind Palace to hold it.',
      'Bind the Oneiri to work for you and uncover Revelations.',
      'March down a road of twenty-five places to face what waits at the bottom.',
    ],
    tips: [
      'A full playthrough takes roughly 6–7 hours.',
      'Play in the browser or download it for Windows on itch.io.',
    ],
    faq: [['Is What Lies In The Depths free?', 'Yes.']],
  }),
];

export const OTHER_KEYWORDS: KeywordInput[] = [
  {
    keyword: 'my 9 games',
    product: 'web-search',
    summary:
      '"My 9 games" — what people mean by it, from game-tracker lists to "my top 9" grids — and how to make your own.',
    intro:
      '"My 9 games" is not a single game. It usually refers to a personal list or grid — like sharing your nine favorite games — or to tracking the games you are playing.',
    sections: [
      {
        heading: 'How to make a "my 9 games" grid',
        blocks: [
          {
            type: 'steps',
            items: [
              'Pick nine games that define your taste.',
              'Grab each game’s cover art.',
              'Arrange them in a 3×3 grid and share it.',
            ],
          },
        ],
      },
      {
        heading: 'Track your games',
        blocks: [
          {
            type: 'p',
            text: 'Game-tracking sites let you log what you are playing, finished and want to play — handy if you are building a top-9 list.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is "My 9 Games" an app?',
        a: 'We could not find an official app by that exact name; it is most often a personal list format.',
      },
    ],
  },
  {
    keyword: 'scam with your friends',
    product: 'scam-with-your-friends',
    summary:
      'Scam With Your Friends: a co-op comedy sim about running a fictional scam call center with AI callers. Release date Oct 28, 2026.',
    intro:
      'Scam With Your Friends is a comedy co-op game by JakeHub where you run a fictional scam call center — talking to AI callers in real time — to hit daily quotas.',
    sections: [
      {
        heading: 'Gameplay',
        blocks: [
          {
            type: 'list',
            items: [
              'Talk with AI callers in real time.',
              'Use remote computer access as part of the (fictional) scheme.',
              'Hit daily quotas across increasingly chaotic workdays.',
              'Play solo or in online co-op.',
            ],
          },
        ],
      },
      {
        heading: 'Release date',
        blocks: [
          {
            type: 'p',
            text: 'The Steam page lists October 28, 2026.',
          },
          {
            type: 'note',
            text: 'It is a parody. In real life, if someone calls asking for remote access to your computer, hang up.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Who makes Scam With Your Friends?',
        a: 'JakeHub.',
      },
      {
        q: 'Is it multiplayer?',
        a: 'Yes, with online co-op as well as single-player.',
      },
    ],
  },
  {
    keyword: 'yoshi tracker',
    product: 'deadlock',
    summary:
      'Yoshi tracker: the fan-made tool that watches a Valve Deadlock developer’s public activity to guess when updates drop.',
    intro:
      'The "Yoshi tracker" is a tongue-in-cheek fan site built around tracking Yoshi, a Valve developer on Deadlock, to predict when the next update will land.',
    sections: [
      {
        heading: 'Why it exists',
        blocks: [
          {
            type: 'p',
            text: 'Deadlock updates do not follow a fixed schedule. Yoshi often communicates with the community — for example explaining that the September 2026 major patch would slip to "late September" — so fans started watching his public status for hints.',
          },
          {
            type: 'note',
            text: 'Fans point out the tracker only uses public information like Discord and forum status. Respect developers’ privacy — watch official Deadlock channels for announcements.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is the Yoshi tracker official?',
        a: 'No, it is a fan-made joke tool.',
      },
      {
        q: 'Not about Deadlock?',
        a: 'If you meant Nintendo’s Yoshi, try adding the game name (e.g. "Yoshi’s Island") to your search.',
      },
    ],
  },
  {
    keyword: 'i love pdf merge',
    product: 'ilovepdf',
    summary:
      'iLovePDF merge: how to combine PDFs in the right order for free, plus privacy tips and offline alternatives.',
    intro:
      'iLovePDF’s Merge PDF tool combines several PDFs into one file in your browser. It is not a game, but it is a hugely popular utility — here is how to use it.',
    sections: [
      {
        heading: 'How to merge PDFs with iLovePDF',
        blocks: [
          {
            type: 'steps',
            items: [
              'Open the Merge PDF tool.',
              'Select or drag in your PDF files.',
              'Drag thumbnails to reorder them.',
              'Click Merge PDF and download the result.',
            ],
          },
        ],
      },
      {
        heading: 'Privacy and alternatives',
        blocks: [
          {
            type: 'list',
            items: [
              'Avoid uploading sensitive documents to any online tool if you can.',
              'macOS Preview can merge PDFs offline: open one, show thumbnails, drag the others in.',
              'Most PDF editors include a combine/merge feature.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is iLovePDF merge free?',
        a: 'Basic merging is free; paid plans raise limits.',
      },
    ],
  },
];
