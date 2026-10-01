import type { KeywordInput } from '../types';

const LT2_STEPS = [
  'Earn some Lumber Bucks first (selling Oak works) so you own land and a vehicle — you will need to drive across the map.',
  'Head to the trusses in the corner of the map, climb them, find the hole in the rocks and drop down. Follow the cavern behind the ladder to reach the skeleton in the Lost Cave.',
  'Talk to the skeleton. This unlocks the ability to open the Purple (Glorb) bag on your current save slot.',
  'Open Glorb bags until you have the correct Lavender Glorb. Press it and confirm it turns black, then keep pressing it — the guides count 16 more presses — following the color cycle until it lands on the correct Orange Glorb.',
  'Drive to the mountain path with headlights on, place the Orange Glorb in the hole to open the Shrine of Sight door, and take the three items from the pedestals inside.',
  'Return to the truss area, go under the tiger scaffold, follow the right wall to the red eagle and open the hatch beneath it to enter the Den.',
  'Place the three items on the plates in the correct order and activate them. The Glorbaxe spawns, the items are consumed and everyone in the Den receives the "You got glorbed!" badge.',
];

export const ROBLOX_KEYWORDS: KeywordInput[] = [
  {
    keyword: 'lumber tycoon secret badge',
    product: 'lumber-tycoon-2',
    summary:
      'The Lumber Tycoon secret badge is "You got glorbed!" — earned by finishing the hidden Glorbaxe quest added for The Hunt: Roblox 20. Full route explained.',
    intro:
      'If you searched for the "Lumber Tycoon secret badge", you are almost certainly looking for the hidden challenge in Lumber Tycoon 2 that was added for The Hunt: Roblox 20 event. Finishing it awards the Glorbaxe and the "You got glorbed!" badge. Here is what it is, how the route works and whether you can still get it.',
    sections: [
      {
        heading: 'What is the Lumber Tycoon secret badge?',
        blocks: [
          {
            type: 'p',
            text: 'The Glorbaxe quest was added to Lumber Tycoon 2 on September 25, 2026 as the game’s secret challenge for The Hunt: Roblox 20, which ran from September 17 to September 28, 2026. Completing it gives the player who finishes it a Glorbaxe, and anyone standing in the Den at that moment receives the "You got glorbed!" badge.',
          },
          {
            type: 'p',
            text: 'The route sends you from a skeleton in the Lost Cave, to a color-changing Glorb, across the map to the Shrine of Sight, and finally to a hidden bunker (the Den) where three items must be placed in the right order.',
          },
        ],
      },
      {
        heading: 'How to get the secret badge, step by step',
        blocks: [{ type: 'steps', items: LT2_STEPS }],
      },
      {
        heading: 'Can you still get it after the event?',
        blocks: [
          {
            type: 'p',
            text: 'The Hunt: Roblox 20 ended on September 28, 2026, so event-specific progression and rewards may no longer be available through the original method. The quest was also nerfed during the event: a newer, simpler path was added and fiddly requirements (work lights, planks, sawmill steps and dynamite) were removed because parts of the event were buggy.',
          },
          {
            type: 'note',
            text: 'Check the in-game badge list and the Lumber Tycoon 2 community before grinding — what is obtainable can change after an event ends.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'What is the name of the Lumber Tycoon secret badge?',
        a: 'It is called "You got glorbed!" and comes with the Glorbaxe when you complete the hidden Den puzzle.',
      },
      {
        q: 'Is "Lumber Tycoon" the same as "Lumber Tycoon 2"?',
        a: 'Yes — when players say "Lumber Tycoon" they almost always mean Lumber Tycoon 2 by Defaultio, the version that is still played and updated on Roblox.',
      },
    ],
  },
  {
    keyword: 'lumber tycoon 2 secret badge',
    product: 'lumber-tycoon-2',
    summary:
      'Lumber Tycoon 2 secret badge guide: how to earn "You got glorbed!" and the Glorbaxe from The Hunt: Roblox 20 — every step, plus what the nerf changed.',
    intro:
      'The Lumber Tycoon 2 secret badge is "You got glorbed!", the reward for completing the Glorbaxe quest that Defaultio hid in the game for The Hunt: Roblox 20. This page walks through every step and explains what changed after the quest was nerfed.',
    sections: [
      {
        heading: 'Lumber Tycoon 2 secret badge at a glance',
        blocks: [
          {
            type: 'list',
            items: [
              'Badge: "You got glorbed!"',
              'Item reward: Glorbaxe (to the player who completes the puzzle)',
              'Added: September 25, 2026, for The Hunt: Roblox 20 (Sep 17–28, 2026)',
              'Key locations: Lost Cave skeleton → Shrine of Sight → the Den',
            ],
          },
        ],
      },
      {
        heading: 'Full walkthrough',
        blocks: [{ type: 'steps', items: LT2_STEPS }],
      },
      {
        heading: 'Tips that save time',
        blocks: [
          {
            type: 'list',
            items: [
              'Do the whole quest on one save slot — talking to the skeleton only unlocks Glorb bags on the slot you are on.',
              'Count your Glorb presses carefully; if you overshoot the color, keep cycling until it returns to orange.',
              'Bring friends into the Den — everyone inside when the puzzle completes gets the badge.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'How many Glorb presses do you need?',
        a: 'Guides describe pressing the Lavender Glorb once to confirm it turns black, then 16 more times following the color pattern until it becomes the correct Orange Glorb.',
      },
      {
        q: 'Was the Lumber Tycoon 2 secret badge nerfed?',
        a: 'Yes. A simpler path was added and requirements such as work lights, planks, sawmills and dynamite were removed because parts of the event were buggy.',
      },
    ],
  },
  {
    keyword: 'how to turn on work light in lumber tycoon 2',
    product: 'lumber-tycoon-2',
    summary:
      'How to turn on the work light in Lumber Tycoon 2, why it mattered for the Glorbaxe secret quest, and why you may no longer need it after the nerf.',
    intro:
      'Players started asking how to turn on the work light in Lumber Tycoon 2 because the original version of the Glorbaxe secret quest required light in dark areas. Here is how lights work in the game and why the step changed.',
    sections: [
      {
        heading: 'Turning on a work light',
        blocks: [
          {
            type: 'p',
            text: 'Placeable lights in Lumber Tycoon 2 are toggled by interacting with them: walk up to the light and click it (or use your interact key on console/mobile) to switch it on or off. Make sure it is placed and not still being carried — carried items cannot be toggled.',
          },
          {
            type: 'p',
            text: 'Your vehicle’s headlights are also useful: the secret quest guides tell you to drive the mountain path with headlights on before placing the Orange Glorb.',
          },
        ],
      },
      {
        heading: 'Why the work light mattered for the secret badge',
        blocks: [
          {
            type: 'p',
            text: 'In the first version of the Glorbaxe quest (The Hunt: Roblox 20), work lights were one of several fiddly requirements, alongside planks, sawmill steps and dynamite. These caused problems because parts of the event were buggy, so the quest was nerfed with a newer path that removed them.',
          },
          {
            type: 'note',
            text: 'If you are following an older video that shows work lights, compare it with a post-nerf guide — you may be able to skip that step entirely.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Do I still need a work light for the Glorbaxe?',
        a: 'Post-nerf guides say no — the work-light requirement was removed when the simpler route was added.',
      },
      {
        q: 'My light will not turn on. What should I check?',
        a: 'Make sure it is placed on the ground or a surface rather than held, that you own it, and try interacting again from closer range.',
      },
    ],
  },
  {
    keyword: 'lumber tycoon 2 secret quest',
    product: 'lumber-tycoon-2',
    summary:
      'The Lumber Tycoon 2 secret quest explained: skeleton, Glorb colors, the Shrine of Sight and the Den — and the Glorbaxe reward it gives.',
    intro:
      'The Lumber Tycoon 2 secret quest is the hidden Glorbaxe challenge added for The Hunt: Roblox 20. It chains together several of the map’s hidden spots into a single puzzle trail.',
    sections: [
      {
        heading: 'Quest overview',
        blocks: [
          {
            type: 'p',
            text: 'You must first speak to the skeleton in the Lost Cave to be able to open the Purple Bag, then use the correct Glorb to open the Shrine of Sight. The three items inside must be taken to the Den, where placing them correctly spawns the Glorbaxe and consumes the items.',
          },
        ],
      },
      {
        heading: 'Step-by-step route',
        blocks: [{ type: 'steps', items: LT2_STEPS }],
      },
      {
        heading: 'Rewards',
        blocks: [
          {
            type: 'list',
            items: [
              'Glorbaxe — the secret axe, given to the player who completes the Den puzzle',
              '"You got glorbed!" — badge for everyone inside the Den at completion',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Where does the secret quest start?',
        a: 'At the skeleton in the Lost Cave, reached by climbing the corner trusses, dropping through a hole in the rocks and following the cavern behind the ladder.',
      },
      {
        q: 'What is the Den?',
        a: 'A hidden bunker reached through a hatch under the red eagle near the tiger scaffold. It is where the three items are placed to finish the quest.',
      },
    ],
  },
  {
    keyword: 'glorb axe lumber tycoon 2',
    product: 'lumber-tycoon-2',
    summary:
      'Glorb Axe (Glorbaxe) in Lumber Tycoon 2: what it is, how to obtain it through the hidden Den puzzle, and whether it is still available.',
    intro:
      'The Glorb Axe — written "Glorbaxe" on the Lumber Tycoon 2 wiki — is the secret axe added on September 25, 2026 for The Hunt: Roblox 20. It is the item reward for completing the game’s hidden quest.',
    sections: [
      {
        heading: 'How to get the Glorb Axe',
        blocks: [{ type: 'steps', items: LT2_STEPS }],
      },
      {
        heading: 'Good to know',
        blocks: [
          {
            type: 'list',
            items: [
              'Only the player who completes the Den puzzle receives the Glorbaxe; others in the Den get the badge.',
              'The three Shrine of Sight items are consumed when the axe spawns.',
              'The event ended on September 28, 2026 — check the current game state before starting the quest.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is it called Glorb Axe or Glorbaxe?',
        a: 'Both are used by players; the wiki page title is "Glorbaxe".',
      },
      {
        q: 'Which Glorb color opens the shrine?',
        a: 'Guides describe cycling the Lavender Glorb until it becomes the correct Orange Glorb, which is placed in the hole on the mountain path.',
      },
    ],
  },
  {
    keyword: 'oil tycoon roblox secrets',
    product: 'oil-tycoon',
    summary:
      'All six Oil Tycoon Roblox secrets and their badges — igloo, flower cave, wall hole, catapult, bottomless hole and pirate grave — with hints and rarity.',
    intro:
      'Oil Tycoon on Roblox hides six secrets, confirmed by the shopkeeper Miguel, and each one awards a badge. Below are all of the Oil Tycoon Roblox secrets with their badge names, in-game hints and how rare they are.',
    sections: [
      {
        heading: 'All six secrets',
        blocks: [
          {
            type: 'list',
            items: [
              'Bottomless hole — "noclipped" badge (about 98% of players have it). Hint: fall into a bottomless hole.',
              'Pirate grave — "grave robber" (about 85%). Hint: where would a pirate be?',
              'Catapult launch — "weeee!" (about 30%). Hint: catapult + ? = weee!!!',
              'Wall hole in the grassy area — "out of bounds" (about 17%). Hint: a hole in the wall covered by something.',
              'Hidden flower cave near the beanstalk — "stop to smell the flowers" (about 9%). Hint: near the other big plants.',
              'Igloo — "chilly outside" (about 7%). Hint: where would an igloo be?',
            ],
          },
        ],
      },
      {
        heading: 'Which secrets are hardest?',
        blocks: [
          {
            type: 'p',
            text: 'Three secrets are held by fewer than a quarter of players: the igloo (7.0%), the flower (9.1%) and the wall hole (16.6%). Read each badge description carefully — they are the game’s built-in hints.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'How many secrets are in Oil Tycoon?',
        a: 'Six, each with its own badge.',
      },
      {
        q: 'What is the rarest Oil Tycoon badge?',
        a: '"chilly outside" from the igloo secret, held by roughly 7% of players.',
      },
    ],
  },
  {
    keyword: 'oil tycoon secrets',
    product: 'oil-tycoon',
    summary:
      'Oil Tycoon secrets list: six hidden badges, what each hint means and where to look — the igloo and flower cave are the rarest.',
    intro:
      'Looking for Oil Tycoon secrets? The Roblox tycoon has six of them, and every badge description doubles as a riddle. Here is a quick hint-by-hint breakdown.',
    sections: [
      {
        heading: 'Decoding the badge hints',
        blocks: [
          {
            type: 'list',
            items: [
              '"Where would an igloo be" → look for the coldest, snowiest corner of the map (badge: chilly outside).',
              '"Near the other big plants in this game" → search around the beanstalk for a hidden cave with a flower (stop to smell the flowers).',
              '"A hole in the wall covered by something" → in the grassy area, look for a covered gap in the boundary wall (out of bounds).',
              '"Catapult + ? = weee!!!" → combine the catapult with yourself and launch (weeee!).',
              '"Fall into a bottomless hole" → find the pit and jump in (noclipped).',
              '"Where would a pirate be" → find the grave/treasure spot (grave robber).',
            ],
          },
        ],
      },
      {
        heading: 'Order to hunt them',
        blocks: [
          {
            type: 'p',
            text: 'Start with the easy ones (noclipped and grave robber are owned by most players), then try the catapult, and finish with the three rare ones: wall hole, flower cave and igloo.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Who confirmed there are six secrets?',
        a: 'The shopkeeper Miguel in-game confirms the count.',
      },
      {
        q: 'Do secrets give money?',
        a: 'Secrets award badges; they are collectibles rather than an income source.',
      },
    ],
  },
  {
    keyword: 'tier list slayer 2',
    product: 'slayers-2',
    summary:
      'Slayers 2 tier list (Roblox): best clans, Breathing Styles, Demon Arts and weapons as of September 2026 — Kamado, Water and Ice lead the meta.',
    intro:
      'This tier list for Slayer 2 — the Roblox game is officially called Slayers 2 — summarizes what the community ranks highest right now across clans, Breathing Styles, Demon Arts and weapons.',
    sections: [
      {
        heading: 'Clans',
        blocks: [
          {
            type: 'p',
            text: 'Kamado is widely called the best clan. September 2026 lists put Rengoku, Soyama, Uzui, Kamado, Agatsuma (with Thunder) and Kocho (with Insect) in S tier.',
          },
        ],
      },
      {
        heading: 'Breathing Styles and Demon Arts',
        blocks: [
          {
            type: 'list',
            items: [
              'Best Breathing Style: Water, for its consistency in both PvE and PvP.',
              'Best Demon Art: Ice Manipulation.',
              'A tier Demon Arts: Shockwave, Dream Manipulation and Reaper — Shockwave’s ranged opener, follow-up and counter make it great for reactive play.',
            ],
          },
        ],
      },
      {
        heading: 'Weapons',
        blocks: [
          {
            type: 'p',
            text: 'For Demon Slayers, the Firstlight Tanto is rated the best weapon across PvE and PvP.',
          },
          {
            type: 'note',
            text: 'Rankings shift with every balance update — treat any tier list as a snapshot and re-check after patches.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is it "Slayer 2" or "Slayers 2"?',
        a: 'The Roblox game is called Slayers 2; "Slayer 2" is a common search spelling.',
      },
      {
        q: 'What is the best clan in Slayers 2?',
        a: 'Kamado is the most common #1 pick, with Rengoku, Soyama, Uzui, Agatsuma and Kocho also in S tier.',
      },
    ],
  },
  {
    keyword: 'yba codes',
    product: 'your-bizarre-adventure',
    summary:
      'YBA codes: how to redeem Your Bizarre Adventure codes on Roblox, what they usually give, and where to find new ones safely.',
    intro:
      'YBA codes are promo codes for Your Bizarre Adventure, the JoJo-inspired Roblox fighting game. Codes are released by the developers around updates and milestones and usually expire quickly.',
    sections: [
      {
        heading: 'How to redeem YBA codes',
        blocks: [
          {
            type: 'steps',
            items: [
              'Launch Your Bizarre Adventure on Roblox and load into the game.',
              'Open the in-game menu and look for the codes/redeem box.',
              'Type the code exactly — codes are case-sensitive — and confirm.',
            ],
          },
        ],
      },
      {
        heading: 'Where new codes come from',
        blocks: [
          {
            type: 'p',
            text: 'New YBA codes are announced through the game’s official community channels (its Roblox group, Discord and social accounts), typically alongside updates and like/visit milestones. If a code does not work, it has most likely expired.',
          },
          {
            type: 'note',
            text: 'Never enter your Roblox password on a third-party "code generator" site. Real codes are only redeemed inside the game.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'What does YBA stand for?',
        a: 'Your Bizarre Adventure, a Roblox game inspired by JoJo’s Bizarre Adventure.',
      },
      {
        q: 'Why does my YBA code say invalid?',
        a: 'It is probably expired or mistyped. Check capitalization and make sure there are no extra spaces.',
      },
    ],
  },
  {
    keyword: 'ball vs ball codes',
    product: 'ball-vs-ball',
    summary:
      'Ball vs Ball codes (Roblox): UPD1–UPD5 for 100 Coins each as of late September 2026, plus how to redeem and what Coins are for.',
    intro:
      'Ball vs Ball codes give free Coins, the currency you spend on ball and explosion gachas. Here are the codes reported active as of September 28, 2026 and how to redeem them.',
    sections: [
      {
        heading: 'Active Ball vs Ball codes',
        blocks: [
          {
            type: 'list',
            items: [
              'UPD1 — 100 Coins',
              'UPD2 — 100 Coins',
              'UPD3 — 100 Coins',
              'UPD4 — 100 Coins',
              'UPD5 — 100 Coins',
            ],
          },
          {
            type: 'note',
            text: 'Redeeming the full set gives 500 Coins. Codes can be withdrawn without a fixed expiry date, so claim them early.',
          },
        ],
      },
      {
        heading: 'How to redeem',
        blocks: [
          {
            type: 'steps',
            items: [
              'Launch Ball vs Ball on Roblox.',
              'Tap the present button, then tap "Codes".',
              'Enter the code and hit Redeem.',
            ],
          },
        ],
      },
      {
        heading: 'What to spend Coins on',
        blocks: [
          {
            type: 'p',
            text: 'Spend Coins in the ball gachas to unlock new balls, or in the explosion gachas to unlock different effects.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'How many Coins can I get from Ball vs Ball codes?',
        a: '500 Coins from the five UPD codes listed above, while they remain active.',
      },
      {
        q: 'When are new codes released?',
        a: 'The naming pattern (UPD1, UPD2…) suggests one code per update, so check after each new update.',
      },
    ],
  },
  {
    keyword: 'obby khan winnipeg',
    product: 'roblox-obby',
    summary:
      'Obby Khan of Winnipeg is a Manitoba politician and former Blue Bombers player — not a Roblox obby. Here is the quick context and where to find real obbies.',
    intro:
      '"Obby Khan Winnipeg" looks like a game search because of the word "obby", but it refers to a real person: Obby Khan, the MLA for the Winnipeg constituency of Fort Whyte.',
    sections: [
      {
        heading: 'Who is Obby Khan?',
        blocks: [
          {
            type: 'p',
            text: 'Obby Khan is a former Winnipeg Blue Bombers player and local businessman who won the Fort Whyte seat in a 2022 byelection. He became leader of the Manitoba Progressive Conservatives in April 2025 — the first person of colour, first South Asian and first Muslim to lead the party.',
          },
          {
            type: 'p',
            text: 'On September 28, 2026 he announced he was stepping down as PC leader after internal divisions, days after surviving a caucus confidence vote. He continues to represent Fort Whyte as an independent MLA.',
          },
        ],
      },
      {
        heading: 'Looking for a Roblox obby instead?',
        blocks: [
          {
            type: 'p',
            text: 'An "obby" on Roblox is an obstacle course. Use the link on this page to browse thousands of free obbies, from easy towers to hardcore parkour.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is Obby Khan a Roblox game?',
        a: 'No. Obby Khan is a Manitoba politician; "obby" in Roblox means an obstacle course.',
      },
      {
        q: 'Which Winnipeg riding does Obby Khan represent?',
        a: 'Fort Whyte.',
      },
    ],
  },
  {
    keyword: 'obby khan',
    product: 'roblox-obby',
    summary:
      'Obby Khan is a Winnipeg MLA and ex-CFL player who resigned as Manitoba PC leader in September 2026. Not a game — but here is where to find Roblox obbies.',
    intro:
      'Obby Khan trends in game searches because "obby" is also Roblox slang for an obstacle course. The name actually belongs to a Manitoba politician.',
    sections: [
      {
        heading: 'Quick facts',
        blocks: [
          {
            type: 'list',
            items: [
              'Former Winnipeg Blue Bombers (CFL) player and businessman.',
              'MLA for Fort Whyte since a 2022 byelection.',
              'Elected Manitoba PC leader in April 2025 with 50.4% of points.',
              'Announced his resignation as leader on September 28, 2026; staying on as an independent MLA.',
            ],
          },
        ],
      },
      {
        heading: 'What is an obby on Roblox?',
        blocks: [
          {
            type: 'p',
            text: 'Obbies are obstacle-course experiences: jump between platforms, avoid kill bricks and reach checkpoints. They are among the most popular free genres on Roblox and a great place for new players to start.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Why did Obby Khan resign?',
        a: 'He said division within the PC caucus left him no choice, shortly after a 13–6 confidence vote in his favour.',
      },
      {
        q: 'Where can I play obbies?',
        a: 'Search "obby" on Roblox — the button on this page opens that search.',
      },
    ],
  },
  {
    keyword: 'obby khan wife',
    product: 'roblox-obby',
    summary:
      'Searching "Obby Khan wife"? Obby Khan is a Manitoba politician, not a game. We only cover his public role here — plus where to find Roblox obbies.',
    intro:
      'People searching "Obby Khan wife" are usually curious about the Manitoba politician who made headlines in September 2026. As a game directory, we stick to his public record and do not publish details about family members.',
    sections: [
      {
        heading: 'Obby Khan’s public role',
        blocks: [
          {
            type: 'p',
            text: 'Obby Khan is the MLA for Fort Whyte in Winnipeg, a former Winnipeg Blue Bombers player and a local businessman. He led the Manitoba Progressive Conservatives from April 2025 until announcing his resignation on September 28, 2026, and now sits as an independent.',
          },
          {
            type: 'note',
            text: 'For personal or family information, rely on the official biographies and reputable news coverage rather than gossip sites.',
          },
        ],
      },
      {
        heading: 'If you meant Roblox obbies',
        blocks: [
          {
            type: 'p',
            text: 'Obbies are Roblox obstacle courses. Use the button on this page to browse them.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is Obby Khan related to Roblox?',
        a: 'No. The overlap is just the word "obby", which Roblox players use for obstacle courses.',
      },
    ],
  },
  {
    keyword: 'ride a pet',
    product: 'ride-a-pet',
    summary:
      'Ride A Pet on Roblox: hatch eggs, ride faster pets to reach rarer eggs, and mutate pets for more speed. Beginner tips and how the loop works.',
    intro:
      'Ride A Pet is a Roblox pet simulator with a simple, addictive loop: find eggs around the map, hatch faster and rarer pets, ride them to reach even rarer eggs, and mutate them to go faster still.',
    sections: [
      {
        heading: 'How Ride A Pet works',
        blocks: [
          {
            type: 'steps',
            items: [
              'Explore the map to find eggs.',
              'Hatch eggs to get pets — rarer pets are faster.',
              'Ride your fastest pet to reach areas with rarer eggs.',
              'Mutate pets to boost their speed even further.',
            ],
          },
        ],
      },
      {
        heading: 'Beginner tips',
        blocks: [
          {
            type: 'list',
            items: [
              'Always ride your fastest pet — speed is what unlocks new egg zones.',
              'Prioritize mutations on your top pet rather than spreading them thin.',
              'Revisit early zones after upgrades; faster pets make farming them much quicker.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is Ride A Pet free?',
        a: 'Yes, it is free to play on Roblox with optional purchases.',
      },
      {
        q: 'What makes a pet faster?',
        a: 'Rarity and mutations — rarer pets are faster, and mutating them increases speed further.',
      },
    ],
  },
  {
    keyword: 'blue lock farm',
    product: 'blue-lock-farm',
    summary:
      'Blue Lock Farm (Roblox): anime soccer idle tycoon guide — how Blue Lockers work, offline income, and codes like TRAITS, COMMUNITY and WEATHER.',
    intro:
      'Blue Lock Farm is an anime soccer idle tycoon on Roblox by Finding Illusions. You open Blue Lockers to collect characters, place them on your field for passive cash, and keep upgrading your roster.',
    sections: [
      {
        heading: 'Core gameplay',
        blocks: [
          {
            type: 'p',
            text: 'Characters on your field generate money over time, and both money generation and locker opening continue while you are offline — so logging in regularly to reinvest is the key to fast growth.',
          },
        ],
      },
      {
        heading: 'Codes reported active (September 2026)',
        blocks: [
          {
            type: 'list',
            items: [
              'TRAITS — 25 Trait Tokens',
              'ADMINABUSE — 20 Trait Tokens, 20 Grade Tokens and a Variant Token',
              'COMMUNITY — 3x Cash, 3x Grade Speed and 3x Luck Potions',
              'WEATHER — 5x Grade Tokens and 1x Luck Potion',
            ],
          },
          {
            type: 'steps',
            items: [
              'Launch Blue Lock Farm and press the Shop button on the left.',
              'Scroll to the bottom and type a code into "Enter code here".',
              'Press Redeem.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Does Blue Lock Farm earn while offline?',
        a: 'Yes — money generation and locker opening continue while you are away.',
      },
      {
        q: 'Who made Blue Lock Farm?',
        a: 'Finding Illusions.',
      },
    ],
  },
  {
    keyword: 'steal an egg',
    product: 'steal-an-egg',
    summary:
      'Steal An Egg (Roblox): hatch rare pets, train Speed on the treadmill, upgrade your base and steal eggs from other players. How the game works.',
    intro:
      'Steal An Egg is a Roblox game created on July 25, 2026. It combines pet hatching with player-vs-player theft: hatch eggs to collect rare pets that earn money, then raid other bases for their eggs.',
    sections: [
      {
        heading: 'The gameplay loop',
        blocks: [
          {
            type: 'steps',
            items: [
              'Hatch eggs to collect pets — rarer pets earn more money.',
              'Upgrade your treadmill and base.',
              'Train on the treadmill to gain Speed.',
              'Use your Speed to steal eggs from other players (and protect your own).',
              'Chase rarer eggs, pet sizes and mutations.',
            ],
          },
        ],
      },
      {
        heading: 'Tips',
        blocks: [
          {
            type: 'list',
            items: [
              'Speed is everything — invest in treadmill training early.',
              'Upgrade your base before carrying valuable eggs around.',
              'Avoid third-party "scripts": they break Roblox rules and can get your account banned.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'When was Steal An Egg created?',
        a: 'July 25, 2026.',
      },
      {
        q: 'Is there a similar game?',
        a: 'It follows the "steal a…" trend popularized by Steal a Brainrot.',
      },
    ],
  },
  {
    keyword: 'anime dice',
    product: 'anime-dice',
    summary:
      'Anime Dice (Roblox): RNG anime-character collector with 35M+ visits. How rolling works, how to redeem codes for spins, gems and trait rerolls.',
    intro:
      'Anime Dice is a Roblox RNG collecting game where you roll for increasingly rare anime characters and build the strongest collection you can. Created on August 15, 2026, it passed 35 million visits by update 6.',
    sections: [
      {
        heading: 'How Anime Dice works',
        blocks: [
          {
            type: 'p',
            text: 'Every roll can give you a character, with rarer characters appearing less often. Building a strong collection lets you progress faster, and traits add another layer of power you can reroll.',
          },
        ],
      },
      {
        heading: 'Codes',
        blocks: [
          {
            type: 'p',
            text: 'Anime Dice codes give free spins, gems and trait rerolls. They are usually released with updates (the game was on "UPD 6" in September 2026), so check after each patch.',
          },
          {
            type: 'note',
            text: 'Avoid auto-roll scripts — they violate Roblox’s terms and risk a ban.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is Anime Dice popular?',
        a: 'Yes — it reached tens of thousands of concurrent players and a 99% rating in September 2026.',
      },
      {
        q: 'What do Anime Dice codes give?',
        a: 'Typically free spins, gems and trait rerolls.',
      },
    ],
  },
  {
    keyword: 'is it verity',
    product: 'is-it-verity',
    summary:
      '"Is It Verity?" is a Roblox 1v1 pattern-guessing game by Prince Creations — not the Verity horror game. How to play and win.',
    intro:
      '"Is It Verity?" is a competitive Roblox puzzle game by Prince Creations. Two players race to crack a hidden pattern of Veritys before the other does.',
    sections: [
      {
        heading: 'How to play',
        blocks: [
          {
            type: 'steps',
            items: [
              'Place your Veritys into the sequence.',
              'Check the result to see which placements are right.',
              'Use the feedback to deduce the full hidden order.',
              'Guess the entire pattern before your opponent to win the 1v1.',
            ],
          },
        ],
      },
      {
        heading: 'Collecting Veritys',
        blocks: [
          {
            type: 'p',
            text: 'Open packs to discover new Veritys and build your ideal loadout. Think of it like a competitive Mastermind with collectible pieces.',
          },
        ],
      },
      {
        heading: 'Not the horror game',
        blocks: [
          {
            type: 'p',
            text: 'Several Roblox experiences use the name Verity, including horror games. "Is It Verity?" is the puzzle/strategy one.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Who made Is It Verity?',
        a: 'Prince Creations.',
      },
      {
        q: 'Is it a horror game?',
        a: 'No — it is a pattern-guessing duel. The Verity horror games are separate experiences.',
      },
    ],
  },
  {
    keyword: 'dream car collection',
    product: 'dream-car-collection',
    summary:
      'Dream Car Collection (Roblox): open lucky crates, collect 50+ realistic cars, earn money and try ASMR car cleaning. How it works.',
    intro:
      'Dream Car Collection is a Roblox collecting game. You spawn lucky crates, place and open them to get cars, then add each car to your collection so it earns money for you.',
    sections: [
      {
        heading: 'Features',
        blocks: [
          {
            type: 'list',
            items: [
              '50+ shiny, realistic cars to collect',
              'Lucky crates you spawn, place and open',
              'Collected cars generate money',
              'ASMR car cleaning',
              'Car shows (announced as coming soon)',
            ],
          },
        ],
      },
      {
        heading: 'How to grow faster',
        blocks: [
          {
            type: 'p',
            text: 'Reinvest early earnings into more crates — every new car adds to your income, so the collection snowballs.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'How many cars are in Dream Car Collection?',
        a: 'The game advertises 50+ cars.',
      },
    ],
  },
  {
    keyword: 'roll a fisherman',
    product: 'roll-a-fisherman',
    summary:
      'Roll a Fisherman: the trending Roblox RNG fishing game with a seals update. What it is and how to get started.',
    intro:
      'Roll a Fisherman is a Roblox RNG game that blends rolling for characters with fishing. It trended on the Roblox charts in September 2026 with a seals-themed update and a 98% rating.',
    sections: [
      {
        heading: 'Getting started',
        blocks: [
          {
            type: 'list',
            items: [
              'Roll to unlock fishermen — rarer rolls are stronger.',
              'Fish to earn currency, then reinvest it into more rolls.',
              'Check update notes (like the seals update) for new content and limited rewards.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is Roll a Fisherman free?',
        a: 'Yes, it is free on Roblox.',
      },
    ],
  },
  {
    keyword: 'build and kill zombies',
    product: 'build-and-kill-zombies',
    summary:
      'Build and Kill Zombies (Roblox): roll car parts, bolt on weapons and drive through zombie waves for Cash and permanent Skills. Beginner guide.',
    intro:
      'Build and Kill Zombies is a Roblox game by Zombie Car Crusher, created on August 19, 2026 and already played more than 32 million times. You build a car from rolled parts, then drive it through hordes of zombies.',
    sections: [
      {
        heading: 'How a run works',
        blocks: [
          {
            type: 'steps',
            items: [
              'Start in the shared lobby and roll CAR PARTS and SUPPORTS.',
              'Bolt an engine, fuel tank and wheels onto your car on your own plot.',
              'Add weapons and defenses.',
              'Drive down the track as far as you can while it fills with zombie waves.',
              'Earn Cash and unlock permanent Skills, then rebuild stronger.',
            ],
          },
        ],
      },
      {
        heading: 'Good to know',
        blocks: [
          {
            type: 'list',
            items: [
              'Servers hold five players.',
              'Rated Mild for repeated cartoon violence.',
              'Free on PC and mobile; spending is optional.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Who made Build and Kill Zombies?',
        a: 'Zombie Car Crusher.',
      },
      {
        q: 'What carries over between runs?',
        a: 'Permanent Skills unlocked with Cash.',
      },
    ],
  },
  {
    keyword: 'build an ant empire codes',
    product: 'build-an-ant-empire',
    summary:
      'Build an Ant Empire codes: codes reported in September 2026 for 15-minute Cash boosts, plus how to redeem them in Settings.',
    intro:
      'Build an Ant Empire codes give temporary Cash boosts that multiply your income for 15 minutes. These are the codes reported across code trackers in September 2026.',
    sections: [
      {
        heading: 'Codes reported active',
        blocks: [
          {
            type: 'list',
            items: [
              'Wnus13 — 15 minutes of Cash boost',
              '9hcb2s — 15 minutes of Cash boost',
              'RAIDS, MASTERY, GHOULUPDATE, SORRYFORRESTARTGUYSTPBUG3 — listed as active by some trackers',
            ],
          },
          {
            type: 'p',
            text: 'Expired: xn287hx and nuwnxx2.',
          },
        ],
      },
      {
        heading: 'How to redeem',
        blocks: [
          {
            type: 'steps',
            items: [
              'Open Build an Ant Empire on Roblox.',
              'Tap the Settings button.',
              'Paste a code into the code box and claim the reward.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'What do the codes do?',
        a: 'They apply a 15-minute multiplier to your Cash gain rate.',
      },
      {
        q: 'Do boosts stack?',
        a: 'Redeem them one after another to chain boost time; avoid redeeming all at once if you will be offline.',
      },
    ],
  },
  {
    keyword: 'loot to forge codes',
    product: 'loot-to-forge',
    summary:
      '+1 Loot To Forge codes: 50000CCU, 30000CCU and 20000CCU for Ember Stones, Coins, Race Rerolls and a Power Potion. How to redeem.',
    intro:
      'Loot to Forge codes — for the Roblox game "+1 Loot To Forge" — hand out Coins, Race Rerolls, potions and Ember Stones. These were the codes reported active in late September 2026.',
    sections: [
      {
        heading: 'Active codes',
        blocks: [
          {
            type: 'list',
            items: [
              '50000CCU — 50x Ember Stones',
              '30000CCU — 2,000 Coins and 2x Race Rerolls',
              '20000CCU — 2,000 Coins and 1x Power Potion',
            ],
          },
        ],
      },
      {
        heading: 'How to redeem',
        blocks: [
          {
            type: 'steps',
            items: [
              'Launch +1 Loot To Forge and finish the short tutorial.',
              'Open the Shop menu and scroll all the way down.',
              'Enter one code at a time and click Submit.',
            ],
          },
        ],
      },
      {
        heading: 'What rewards do',
        blocks: [
          {
            type: 'p',
            text: 'Coins pay for backpack upgrades, training and luck. Race Rerolls swap your character into a different race with its own bonuses. A Power Potion adds a short burst of extra damage and stats.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Why are the codes named CCU?',
        a: 'CCU means concurrent users — the codes celebrate player-count milestones, so new ones often appear when the game hits a new peak.',
      },
    ],
  },
];
