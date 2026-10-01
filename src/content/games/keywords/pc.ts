import type { KeywordInput, Section } from '../types';

const AC8_DATES: Section = {
  heading: 'Ace Combat 8 release dates and times',
  blocks: [
    {
      type: 'list',
      items: [
        'Early Access: September 29, 2026 at 00:00 CEST (6:00 PM EDT on September 28)',
        'Worldwide launch: October 2, 2026 at 00:00 CEST (6:00 PM EDT on October 1)',
        'Platforms: PlayStation 5, Xbox Series X|S and PC via Steam',
      ],
    },
  ],
};

const AC8_EARLY: Section = {
  heading: 'How to get Ace Combat 8 Early Access',
  blocks: [
    {
      type: 'p',
      text: 'Early Access is included with a digital pre-order of the Deluxe Edition, the Joker Flight Pack or the Premium Joker Flight Pack. The Standard Edition unlocks at the worldwide launch.',
    },
  ],
};

const GK2_FACTS: Section = {
  heading: 'Graveyard Keeper 2 essentials',
  blocks: [
    {
      type: 'list',
      items: [
        'Announced: April 10, 2026 at the Triple-i Initiative livestream',
        'Released: September 22, 2026',
        'Platforms: PC (Steam), PlayStation 5, Xbox Series X|S, Nintendo Switch, Nintendo Switch 2',
        'Premise: the Keeper is now Grand Inquisitor — lead an undead army, manage a medieval graveyard, automate item production and rebuild a town',
      ],
    },
  ],
};

const DRESSMAKER_FACTS: Section = {
  heading: 'Dressmaker at a glance',
  blocks: [
    {
      type: 'list',
      items: [
        'Developer: Cozy Lives · Publisher: Free Lives',
        'Released: September 21, 2026 on Windows and macOS (Steam)',
        'Price: $14.99 US base (the 10% launch discount ended after September 28)',
        'Reception: overwhelmingly positive; reached #9 on Steam’s top sellers and recouped development costs within 24 hours',
      ],
    },
  ],
};

const DRESSMAKER_GAMEPLAY: Section = {
  heading: 'How you play',
  blocks: [
    {
      type: 'steps',
      items: [
        'Take a commission from a townsperson.',
        'Measure the client.',
        'Design the dress.',
        'Buy and cut fabric — paying attention to grain, bias and pattern placement.',
        'Sew the pieces together and add decorations.',
      ],
    },
  ],
};

const W3_FACTS: Section = {
  heading: 'The Witcher 3 Remastered — key facts',
  blocks: [
    {
      type: 'list',
      items: [
        'Announced: August 25, 2026',
        'Released: September 29, 2026 at 10:00 UTC, simultaneously on all platforms',
        'PC stores: Steam, GOG, Epic Games Store and — for the first time — Battle.net',
        'Upgrade: free for anyone who already owns the game on the same platform ecosystem',
      ],
    },
  ],
};

const LAUNDRY: Section = {
  heading: 'Central laundromat puzzle solution',
  blocks: [
    {
      type: 'steps',
      items: [
        'Go north of the Field Office in the Central region. West of Last Park Station is the "WEAR ’EM & WASH ’EM" laundromat, blocked by the Hiss.',
        'Follow the three red tendrils moving debris near the door to three bulbous Hiss blobs and destroy them to lower the barrier.',
        'Inside, read the poster with a grid of ones and zeros — each line is a row of washing machines, and "1" means switch it on.',
        'Set the machines to: 0001000 / 001100 / 100001 / 000000 / 000000 / 000000 / 100000.',
        'The secret door at the back opens — grab the Health Upgrade and the lore on a secret organization.',
      ],
    },
  ],
};

const NEEDLE_LIST: Section = {
  heading: 'Every "needle in a haystack" game on Steam',
  blocks: [
    {
      type: 'list',
      items: [
        'A Needle In A Haystack: Sorting Game — released September 25, 2026. A satisfying sorting sim that turns the saying into your job.',
        'Needle In A Haystack (NoGlyph) — released September 29, 2026. Co-op for up to 6 players.',
        'Needle In A Haystack - A Time For Goats — released September 18, 2026. Dig with tools and machines to unlock the ultimate reward.',
        'Needle In A Haystack Simulator (Studio Bitdot) — planned Q4 2026. One needle among 5,000,000 pieces of hay; its reveal video passed 48 million views.',
        'Find The Needle — planned Q4 2026, with around six million strands.',
        'A Needle In a Haystack (Persidera Industries) — a cozy first-person search game for 1–4 players, planned for 2026.',
      ],
    },
  ],
};

export const PC_KEYWORDS: KeywordInput[] = [
  {
    keyword: 'rockstar games gta vi',
    product: 'gta-vi',
    summary:
      'Rockstar Games GTA VI: release date November 19, 2026 on PS5 and Xbox Series X|S. Delay history, platforms and what is known about PC.',
    intro:
      'Rockstar Games’ GTA VI (Grand Theft Auto VI) is set to release on Thursday, November 19, 2026. Here is the confirmed information in one place.',
    sections: [
      {
        heading: 'GTA VI release date and platforms',
        blocks: [
          {
            type: 'list',
            items: [
              'Release date: Thursday, November 19, 2026',
              'Platforms: PlayStation 5 and Xbox Series X|S',
              'PC: not yet announced',
            ],
          },
        ],
      },
      {
        heading: 'Delay history',
        blocks: [
          {
            type: 'steps',
            items: [
              'Originally targeted for fall 2025.',
              'May 2025: Rockstar moved the date to May 26, 2026.',
              'November 2025: delayed again by six months to November 19, 2026, to finish the game "with the level of polish you have come to expect".',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'When does GTA VI come out?',
        a: 'November 19, 2026.',
      },
      {
        q: 'Is GTA VI coming to PC?',
        a: 'Rockstar has not announced a PC version yet.',
      },
    ],
  },
  {
    keyword: 'transport fever 3',
    product: 'transport-fever-3',
    summary:
      'Transport Fever 3 is out now (September 29, 2026) on PC, Mac, Linux, PS5 and Xbox Series X|S. Developer, platforms and editions.',
    intro:
      'Transport Fever 3, the transport tycoon sequel from Urban Games, released on September 29, 2026 — published for the first time by Paradox Interactive.',
    sections: [
      {
        heading: 'Release and platforms',
        blocks: [
          {
            type: 'list',
            items: [
              'Release date: September 29, 2026',
              'PC: Windows, Mac and Linux via Steam, Epic Games Store and GOG',
              'Consoles: PlayStation 5 and Xbox Series X|S (same day)',
              'Editions: Standard, Deluxe and Collector’s',
            ],
          },
        ],
      },
      {
        heading: 'Who is it for?',
        blocks: [
          {
            type: 'p',
            text: 'If you enjoyed Transport Fever 2, Train Fever or other logistics tycoons, this is the series’ biggest step up — and the first time it launched on consoles day one.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Who publishes Transport Fever 3?',
        a: 'Paradox Interactive; it is developed by Urban Games.',
      },
      {
        q: 'Is Transport Fever 3 on Mac?',
        a: 'Yes, alongside Windows and Linux.',
      },
    ],
  },
  {
    keyword: 'ace combat 8',
    product: 'ace-combat-8',
    summary:
      'Ace Combat 8: Wings of Theve — Bandai Namco’s new flight-combat game. Early Access Sep 29, launch Oct 2, 2026 on PS5, Xbox and Steam.',
    intro:
      'Ace Combat 8 is officially titled ACE COMBAT 8: WINGS OF THEVE. It is the next mainline entry in Bandai Namco’s arcade flight series, following Ace Combat 7: Skies Unknown.',
    sections: [AC8_DATES, AC8_EARLY],
    faq: [
      {
        q: 'What is the full title of Ace Combat 8?',
        a: 'ACE COMBAT 8: WINGS OF THEVE.',
      },
      {
        q: 'Is Ace Combat 8 on PC?',
        a: 'Yes, via Steam.',
      },
    ],
  },
  {
    keyword: 'ace combat 8 release date',
    product: 'ace-combat-8',
    summary:
      'Ace Combat 8 release date: October 2, 2026 (00:00 CEST) worldwide; Early Access from September 29 for Deluxe pre-orders.',
    intro:
      'The Ace Combat 8 release date is October 2, 2026 worldwide, with Early Access starting three days earlier for Deluxe pre-orders.',
    sections: [AC8_DATES, AC8_EARLY],
    faq: [
      {
        q: 'What time does Ace Combat 8 release?',
        a: 'October 2, 2026 at 00:00 CEST — that is 6:00 PM EDT on October 1.',
      },
    ],
  },
  {
    keyword: 'ace combat 8 early access countdown',
    product: 'ace-combat-8',
    summary:
      'Ace Combat 8 early access countdown: unlock time Sep 29, 2026 00:00 CEST (Sep 28, 6 PM EDT). Who gets early access and when full launch hits.',
    intro:
      'Counting down to Ace Combat 8 early access? It unlocked on September 29, 2026 at 00:00 CEST. Here are the exact times and how to qualify.',
    sections: [
      {
        heading: 'Early access unlock times',
        blocks: [
          {
            type: 'list',
            items: [
              'CEST: September 29, 2026 at 00:00',
              'EDT: September 28, 2026 at 6:00 PM',
              'Full launch (CEST): October 2, 2026 at 00:00',
            ],
          },
        ],
      },
      AC8_EARLY,
    ],
    faq: [
      {
        q: 'Is Ace Combat 8 early access live?',
        a: 'Yes, since September 29, 2026 (00:00 CEST) for eligible pre-orders.',
      },
    ],
  },
  {
    keyword: 'graveyard keeper 2',
    product: 'graveyard-keeper-2',
    summary:
      'Graveyard Keeper 2: out September 22, 2026 on PC, PS5, Xbox and Switch. Play as Grand Inquisitor with an undead army. What is new.',
    intro:
      'Graveyard Keeper 2 continues the darkly comic management sim, this time with the Keeper promoted to Grand Inquisitor.',
    sections: [
      GK2_FACTS,
      {
        heading: 'What is new in the sequel',
        blocks: [
          {
            type: 'list',
            items: [
              'An undead army you lead into battle',
              'Automatic item production chains',
              'A town to rebuild alongside your graveyard',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'When did Graveyard Keeper 2 come out?',
        a: 'September 22, 2026.',
      },
      {
        q: 'Is Graveyard Keeper 2 on Switch 2?',
        a: 'Yes, as well as Switch, PS5, Xbox Series X|S and PC.',
      },
    ],
  },
  {
    keyword: 'graveyard keeper 2 wiki',
    product: 'graveyard-keeper-2',
    summary:
      'Graveyard Keeper 2 wiki starter: release info, core systems (inquisition, undead army, automation, town), and beginner tips.',
    intro:
      'A quick Graveyard Keeper 2 wiki-style reference: the facts and systems you need before diving into community wikis.',
    sections: [
      GK2_FACTS,
      {
        heading: 'Core systems',
        blocks: [
          {
            type: 'list',
            items: [
              'Graveyard management — keep your medieval graveyard in good standing.',
              'Inquisition — your new role as Grand Inquisitor drives the story.',
              'Undead army — raise and lead the dead into battle.',
              'Automation — set up production so items craft themselves.',
              'Town rebuilding — restore buildings and services.',
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
              'Automate early — every chain you set up frees time for the story.',
              'Keep notes on recipes; like the first game, production trees go deep.',
              'Check the official Steam community hub for patch notes before following older guides.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is there an official Graveyard Keeper 2 wiki?',
        a: 'Community wikis are the main reference; the Steam page and patch notes are the official sources.',
      },
    ],
  },
  {
    keyword: 'graveyard keeper wiki',
    product: 'graveyard-keeper-2',
    summary:
      'Graveyard Keeper wiki hub: the original game and Graveyard Keeper 2 (Sep 22, 2026) — what changed and where to find reliable guides.',
    intro:
      'Searching the Graveyard Keeper wiki? There are now two games: the original Graveyard Keeper and the 2026 sequel, Graveyard Keeper 2. Make sure your guide matches the game you are playing.',
    sections: [
      {
        heading: 'Original vs sequel',
        blocks: [
          {
            type: 'list',
            items: [
              'Graveyard Keeper — the original medieval graveyard management sim.',
              'Graveyard Keeper 2 — released September 22, 2026; you play as Grand Inquisitor with an undead army, automation and a town to rebuild.',
            ],
          },
          {
            type: 'note',
            text: 'Recipes and quest steps from the first game often do not apply to the sequel — check the game name on any wiki page.',
          },
        ],
      },
      GK2_FACTS,
    ],
    faq: [
      {
        q: 'Do I need to play Graveyard Keeper 1 first?',
        a: 'It helps with the story, but the sequel is playable on its own.',
      },
    ],
  },
  {
    keyword: 'dressmaker',
    product: 'dressmaker',
    summary:
      'Dressmaker: the cozy tailoring sim that went viral on Steam in September 2026. Gameplay, price, developer and why players love it.',
    intro:
      'Dressmaker is a 2026 cozy job simulation about running a dressmaking shop. It launched on September 21, 2026 and became the latest viral hit on Steam.',
    sections: [DRESSMAKER_FACTS, DRESSMAKER_GAMEPLAY],
    faq: [
      {
        q: 'Who made Dressmaker?',
        a: 'Cozy Lives developed it; Free Lives published it.',
      },
      {
        q: 'How much is Dressmaker?',
        a: '$14.99 in the US; regional prices vary.',
      },
    ],
  },
  {
    keyword: 'dressmaker game',
    product: 'dressmaker',
    summary:
      'Dressmaker game explained: measure, design, cut and sew dresses for townsfolk in this detailed but accessible cozy sim.',
    intro:
      'The Dressmaker game turns real sewing details — fabric grain, bias, measurements and pattern placement — into an accessible cozy sim.',
    sections: [
      DRESSMAKER_GAMEPLAY,
      {
        heading: 'Why it stands out',
        blocks: [
          {
            type: 'p',
            text: 'Most cozy games abstract crafting into a single button. Dressmaker pays close attention to how garments are actually made while staying dynamic enough that it never becomes frustrating.',
          },
        ],
      },
      DRESSMAKER_FACTS,
    ],
    faq: [
      {
        q: 'Is the Dressmaker game hard?',
        a: 'It is detailed but designed to stay accessible and forgiving.',
      },
    ],
  },
  {
    keyword: 'dressmaker steam',
    product: 'dressmaker',
    summary:
      'Dressmaker on Steam: released September 21, 2026 for Windows and macOS at $14.99. Reviews, top-seller rank and system platforms.',
    intro:
      'Dressmaker is on Steam for Windows and macOS. It launched on September 21, 2026 with overwhelmingly positive reviews.',
    sections: [
      DRESSMAKER_FACTS,
      {
        heading: 'Steam performance',
        blocks: [
          {
            type: 'p',
            text: 'Within its first week Dressmaker climbed to #9 on Steam’s top sellers — ahead of titles like EA Sports FC 27 and Overwatch — and earned back its development costs within 24 hours of launch.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is Dressmaker on Mac?',
        a: 'Yes, Steam lists Windows and macOS.',
      },
      {
        q: 'Is Dressmaker on sale?',
        a: 'The 10% launch discount ended after September 28, 2026.',
      },
    ],
  },
  {
    keyword: 'the witcher 3 remastered steam',
    product: 'witcher-3',
    summary:
      'The Witcher 3 Remastered on Steam: free upgrade for existing owners, released September 29, 2026 at 10:00 UTC. How the upgrade works.',
    intro:
      'The Witcher 3 Remastered is available on Steam as a free upgrade if you already own The Witcher 3: Wild Hunt there.',
    sections: [
      W3_FACTS,
      {
        heading: 'How to get the Remastered version on Steam',
        blocks: [
          {
            type: 'steps',
            items: [
              'Open your Steam library — the upgrade applies to existing Witcher 3 owners on Steam.',
              'Update the game; the Remastered version is delivered as a free update.',
              'New buyers simply purchase The Witcher 3: Wild Hunt on Steam.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is The Witcher 3 Remastered free on Steam?',
        a: 'Yes for existing owners on Steam; it is a free upgrade within the same platform.',
      },
      {
        q: 'Does a GOG copy upgrade on Steam?',
        a: 'No — the free upgrade applies within the same platform ecosystem.',
      },
    ],
  },
  {
    keyword: 'the witcher 3 remastered release date',
    product: 'witcher-3',
    summary:
      'The Witcher 3 Remastered release date: September 29, 2026 at 10:00 UTC on all platforms, announced August 25, 2026.',
    intro:
      'The Witcher 3 Remastered released on September 29, 2026, at 10:00 UTC — the same moment on every platform.',
    sections: [W3_FACTS],
    faq: [
      {
        q: 'When was The Witcher 3 Remastered announced?',
        a: 'August 25, 2026.',
      },
    ],
  },
  {
    keyword: 'witcher 3 remastered release date',
    product: 'witcher-3',
    summary:
      'Witcher 3 Remastered release date and time: Sep 29, 2026, 10:00 UTC. Platforms, stores (incl. Battle.net) and free upgrade details.',
    intro:
      'Witcher 3 Remastered came out on September 29, 2026. Below are the launch time, stores and upgrade rules.',
    sections: [
      W3_FACTS,
      {
        heading: 'Launch time in other zones',
        blocks: [
          {
            type: 'list',
            items: ['10:00 UTC', '12:00 CEST', '6:00 AM EDT / 3:00 AM PDT'],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is the Witcher 3 Remastered on Battle.net?',
        a: 'Yes — it is the first time the game is sold there.',
      },
    ],
  },
  {
    keyword: 'control resonant',
    product: 'control-resonant',
    summary:
      'CONTROL Resonant: Remedy’s new Control game, out September 24, 2026 on Steam ($59.99). Reception, editions and puzzle guides.',
    intro:
      'CONTROL Resonant is Remedy Entertainment’s new game in the Control universe, released on September 24, 2026.',
    sections: [
      {
        heading: 'Key facts',
        blocks: [
          {
            type: 'list',
            items: [
              'Developer & publisher: Remedy Entertainment',
              'Release: September 24, 2026',
              'Steam price: $59.99 Standard, $69.99 Digital Deluxe',
              'Launch: 40,000+ concurrent players and roughly 88% positive reviews on Steam',
            ],
          },
        ],
      },
      {
        heading: 'Popular puzzles',
        blocks: [
          {
            type: 'p',
            text: 'The most searched puzzle is the Central laundromat washing-machine puzzle — see our laundry puzzle guide for the full solution.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Who made CONTROL Resonant?',
        a: 'Remedy Entertainment.',
      },
    ],
  },
  {
    keyword: 'control resonant steam',
    product: 'control-resonant',
    summary:
      'CONTROL Resonant on Steam: $59.99 Standard / $69.99 Digital Deluxe, released September 24, 2026, very positive reviews.',
    intro:
      'CONTROL Resonant is available on Steam now. Here are the prices, editions and how it is doing.',
    sections: [
      {
        heading: 'Steam editions and prices',
        blocks: [
          {
            type: 'list',
            items: [
              'Standard Edition — $59.99',
              'Digital Deluxe Edition — $69.99',
            ],
          },
        ],
      },
      {
        heading: 'Reviews',
        blocks: [
          {
            type: 'p',
            text: 'Shortly after launch the game passed 40,000 concurrent players and nearly 5,000 Steam reviews at about 88% positive.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'When did CONTROL Resonant launch on Steam?',
        a: 'September 24, 2026.',
      },
    ],
  },
  {
    keyword: 'laundry puzzle control resonant',
    product: 'control-resonant',
    summary:
      'Laundry puzzle Control Resonant solution: the binary washing-machine code, where the laundromat is and the Health Upgrade reward.',
    intro:
      'The laundry puzzle in Control Resonant is in a laundromat in the Central region. The note on the wall is a binary grid telling you which washing machines to turn on.',
    sections: [
      LAUNDRY,
      {
        heading: 'Why it works',
        blocks: [
          {
            type: 'p',
            text: 'Each line of the poster corresponds to one row of washing machines. A "1" means on and a "0" means off — so you are simply copying the grid onto the machines.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'What is the reward for the laundry puzzle?',
        a: 'A Health Upgrade and lore on a secret organization.',
      },
      {
        q: 'Where is the laundromat?',
        a: 'North of the Field Office in Central, west of Last Park Station — "WEAR ’EM & WASH ’EM".',
      },
    ],
  },
  {
    keyword: 'silent hill townfall',
    product: 'silent-hill-townfall',
    summary:
      'Silent Hill: Townfall released September 24, 2026 on PS5, Steam and Epic, with Deluxe early access from September 22.',
    intro:
      'Silent Hill: Townfall is the newest entry in Konami’s psychological-horror series, released on September 24, 2026.',
    sections: [
      {
        heading: 'Release details',
        blocks: [
          {
            type: 'list',
            items: [
              'Release date: September 24, 2026',
              'Deluxe Edition early access: September 22, 2026 (48 hours early)',
              'Platforms: PlayStation 5, Steam and Epic Games Store',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is Silent Hill: Townfall on Xbox?',
        a: 'The launch platforms were PS5, Steam and Epic Games Store.',
      },
    ],
  },
  {
    keyword: 'silent hill townfall steam',
    product: 'silent-hill-townfall',
    summary:
      'Silent Hill: Townfall on Steam: unlocked at midnight local time on September 24, 2026; Deluxe owners played from September 22.',
    intro:
      'Silent Hill: Townfall unlocked on Steam at midnight local time on September 24, 2026.',
    sections: [
      {
        heading: 'Steam launch',
        blocks: [
          {
            type: 'list',
            items: [
              'Standard unlock: September 24, 2026, midnight local time',
              'Deluxe early access: September 22, 2026',
              'Also on: PlayStation 5 and Epic Games Store',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Why did some players start early?',
        a: 'The Deluxe Edition included 48 hours of early access.',
      },
    ],
  },
  {
    keyword: 'needle in a haystack',
    product: 'needle-in-a-haystack',
    summary:
      'Needle in a Haystack games: the 2026 Steam trend explained — six games, from a 6-player co-op to a 5-million-straw simulator.',
    intro:
      '"Needle in a haystack" went from proverb to genre in 2026 after a simulator clip gathered 48 million views. Here are all the games carrying the name.',
    sections: [NEEDLE_LIST],
    faq: [
      {
        q: 'Which needle in a haystack game went viral?',
        a: 'Needle In A Haystack Simulator by Studio Bitdot — its reveal video passed 48 million views.',
      },
    ],
  },
  {
    keyword: 'needle in a haystack game',
    product: 'needle-in-a-haystack',
    summary:
      'Needle in a haystack game: which one to play — co-op, sorting, cozy or hardcore 5-million-straw search. Release dates included.',
    intro:
      'There is more than one needle in a haystack game. Use this comparison to pick the right one.',
    sections: [
      NEEDLE_LIST,
      {
        heading: 'Which should you pick?',
        blocks: [
          {
            type: 'list',
            items: [
              'With friends: Needle In A Haystack by NoGlyph (up to 6 players).',
              'Relaxing: A Needle In A Haystack: Sorting Game.',
              'Silly: Needle In A Haystack - A Time For Goats.',
              'Hardcore: Needle In A Haystack Simulator or Find The Needle.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is there a free needle in a haystack game?',
        a: 'A demo of Needle in a Haystack is listed on Steam; check each store page for current pricing.',
      },
    ],
  },
  {
    keyword: 'find the needle game',
    product: 'needle-in-a-haystack',
    summary:
      'Find The Needle game: a Steam haystack search with around six million strands, planned for Q4 2026 — plus similar games out now.',
    intro:
      'Find The Needle is one of the extreme entries in 2026’s needle-in-a-haystack trend, with a haystack of roughly six million strands.',
    sections: [
      {
        heading: 'Find The Needle',
        blocks: [
          {
            type: 'p',
            text: 'Listed on Steam with a planned Q4 2026 release, Find The Needle challenges you to locate a single needle in about six million strands of hay.',
          },
        ],
      },
      NEEDLE_LIST,
    ],
    faq: [
      {
        q: 'Is Find The Needle out?',
        a: 'It was listed for Q4 2026; check its Steam page for the latest date.',
      },
    ],
  },
  {
    keyword: 'rummy zip',
    product: 'rummy',
    summary:
      'Rummy Zip: no single official game uses that name — here is what people usually mean and where to play rummy free online.',
    intro:
      'We could not find an official game called "Rummy Zip". The search usually means a quick rummy game to play online, or a rummy set with a zippered travel case.',
    sections: [
      {
        heading: 'What "rummy zip" can mean',
        blocks: [
          {
            type: 'list',
            items: [
              'A fast online rummy game — free browser versions let you play instantly.',
              'A physical rummy tile set sold with a zippered travel bag.',
              'A downloadable .zip of a rummy game — avoid these from unknown sites; they are a common malware vector.',
            ],
          },
        ],
      },
      {
        heading: 'How rummy works',
        blocks: [
          {
            type: 'p',
            text: 'Draw a card, then discard one. Form sets (same rank) and runs (consecutive cards of the same suit). The first player to meld all their cards wins the round.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Where can I play rummy free?',
        a: 'Browser portals such as Poki host free rummy games — use the button on this page.',
      },
    ],
  },
  {
    keyword: 'deadlock update',
    product: 'deadlock',
    summary:
      'Deadlock update: Sept 16, 2026 patch notes summary and the "City Never Sleeps" major update that pushed Deadlock past 228,000 players.',
    intro:
      'Two Deadlock updates landed in September 2026: a balance patch on September 16 and the long-awaited "City Never Sleeps" major update in late September.',
    sections: [
      {
        heading: 'September 16, 2026 patch',
        blocks: [
          {
            type: 'list',
            items: [
              'Comeback mechanics nerfed slightly',
              'Objective reward changes',
              'Movement slows cut by 20%',
              'Item balance and parry changes',
              'Multiple hero adjustments',
            ],
          },
        ],
      },
      {
        heading: '"The City Never Sleeps" major update',
        blocks: [
          {
            type: 'p',
            text: 'Valve had warned the major update would slip to "late September". When it arrived it was Deadlock’s largest content drop yet — new heroes, map overhauls and new mechanics — and the game hit an all-time peak of over 228,000 concurrent players on September 29.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'When was the last big Deadlock update?',
        a: '"The City Never Sleeps", released in late September 2026.',
      },
      {
        q: 'What is Deadlock’s player peak?',
        a: 'Over 228,000 concurrent players on September 29, 2026.',
      },
    ],
  },
  {
    keyword: 'fut gg',
    product: 'fut-gg',
    summary:
      'FUT GG (fut.gg): the EA FC 27 Ultimate Team database — player ratings, prices, Evolutions, Hall of FUT and squad builder.',
    intro:
      'FUT GG — fut.gg — is one of the most-used EA SPORTS FC Ultimate Team databases. For FC 27 it is where many players check ratings and prices first.',
    sections: [
      {
        heading: 'What you can do on FUT.GG',
        blocks: [
          {
            type: 'list',
            items: [
              'Browse EA FC 27 player ratings, the Top 100 and biggest upgrades/downgrades from FC 26',
              'Check Transfer Market prices',
              'Track Evolutions, Hall of FUT, Past & Present and Holographic cards',
              'Plan squads with the squad builder before spending coins',
              'Use the FUT.GG mobile app on the go',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is FUT.GG official?',
        a: 'No, it is a fan-run database for EA SPORTS FC Ultimate Team.',
      },
      {
        q: 'Is FUT.GG free?',
        a: 'The core database and squad builder are free to use.',
      },
    ],
  },
  {
    keyword: 'is agar io down',
    product: 'agar-io',
    summary:
      'Is Agar.io down? How to check if Agar.io servers are offline or if it is just you — and quick fixes for connection problems.',
    intro:
      'Agar.io not loading? Before assuming the servers are down, run through these quick checks to see whether it is an outage or a local problem.',
    sections: [
      {
        heading: 'Check if Agar.io is down for everyone',
        blocks: [
          {
            type: 'list',
            items: [
              'Open agar.io in a private/incognito window.',
              'Try another network (e.g. mobile data instead of Wi-Fi).',
              'Search social media for "agar.io down" with a recent time filter.',
              'Use a third-party status checker to see if others report issues.',
            ],
          },
        ],
      },
      {
        heading: 'Fixes if it is just you',
        blocks: [
          {
            type: 'steps',
            items: [
              'Hard refresh (Ctrl/Cmd + Shift + R) and clear the site’s cache.',
              'Disable ad blockers or script blockers for agar.io.',
              'Switch the server region in the game menu.',
              'Update your browser or try a different one.',
              'Restart your router.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Why is Agar.io stuck on loading?',
        a: 'Usually a blocked script, cached files or a regional server issue — try the fixes above.',
      },
    ],
  },
  {
    keyword: 'xbox fanfest surprise fable demo',
    product: 'fable',
    summary:
      'Xbox FanFest surprise Fable demo: attendees in London played a combat-focused demo at 60fps on Series X. Reactions and release date (Feb 23, 2027).',
    intro:
      'At Xbox FanFest in London (September 2026), Playground Games surprised attendees with an unannounced hands-on demo of Fable.',
    sections: [
      {
        heading: 'What was in the demo',
        blocks: [
          {
            type: 'list',
            items: [
              'Combat-focused slice of Albion',
              'Running on Xbox Series X in Performance Mode at 60fps',
              'Not announced ahead of time',
            ],
          },
        ],
      },
      {
        heading: 'Player reactions',
        blocks: [
          {
            type: 'p',
            text: 'Hundreds of attendees played it. Reported impressions highlighted "flawless 60fps", fun combat, seamless switching between magic, ranged and melee, and top-notch voice acting.',
          },
        ],
      },
      {
        heading: 'About Xbox FanFest',
        blocks: [
          {
            type: 'p',
            text: 'Xbox FanFest is an in-person celebration of Xbox, held in 2026 to mark the brand’s 25th anniversary.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'When does Fable release?',
        a: 'February 23, 2027.',
      },
      {
        q: 'Can I play the Fable demo at home?',
        a: 'The FanFest demo was an in-person event build; watch official Xbox channels for any public demo.',
      },
    ],
  },
  {
    keyword: 'survivor island idle game mod apk',
    product: 'survivor-island',
    summary:
      'Survivor Island idle game mod APK: why modded APKs are risky, and safe ways to progress faster in the official game.',
    intro:
      'Many players search for a Survivor Island idle game mod APK hoping for unlimited money. We do not link to mods — here is why, and how to progress faster legitimately.',
    sections: [
      {
        heading: 'Risks of mod APKs',
        blocks: [
          {
            type: 'list',
            items: [
              'Malware and spyware bundled into repackaged APKs.',
              'Account bans and lost progress.',
              'No updates — mods break when the official game updates.',
              'Permission abuse (contacts, SMS, accessibility).',
            ],
          },
        ],
      },
      {
        heading: 'Progress faster the safe way',
        blocks: [
          {
            type: 'list',
            items: [
              'Keep the bonfire fed — it holds back the fog and prevents sickness.',
              'Assign every survivor a job; idle survivors waste offline time.',
              'Check in about every two hours — offline gains accumulate for roughly that long.',
              'Prioritize ship repairs; escaping the island is the main goal.',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is Survivor Island free?',
        a: 'Yes, it is free with in-app purchases on iOS and Android.',
      },
      {
        q: 'Who makes Survivor Island-Idle Game?',
        a: 'MOBIBRAIN TECHNOLOGY PTE. LTD.',
      },
    ],
  },
  {
    keyword: 'was ist ein idle game',
    product: 'idle-games',
    titleSuffix: 'Einfach erklärt',
    summary:
      'Was ist ein Idle Game? Ein Spiel, das auch ohne dich weiterläuft: Ressourcen wachsen automatisch, du investierst und optimierst.',
    intro:
      'Ein Idle Game (auch Incremental Game oder „Clicker") ist ein Spiel, das größtenteils von selbst weiterläuft. Du triffst Entscheidungen, investierst Ressourcen — und das Spiel produziert weiter, auch wenn du nicht aktiv spielst.',
    sections: [
      {
        heading: 'So funktioniert ein Idle Game',
        blocks: [
          {
            type: 'steps',
            items: [
              'Am Anfang sammelst du Ressourcen per Klick oder Tippen.',
              'Mit diesen Ressourcen kaufst du Gebäude oder Helfer, die automatisch produzieren.',
              'Die Produktion steigt exponentiell — die Zahlen werden riesig.',
              'Viele Spiele belohnen dich für Offline-Zeit.',
              'Mit „Prestige" startest du neu, behältst aber dauerhafte Boni.',
            ],
          },
        ],
      },
      {
        heading: 'Bekannte Beispiele',
        blocks: [
          {
            type: 'list',
            items: [
              'Cookie Clicker — der Klassiker im Browser',
              'Survivor Island-Idle Game — Survival-Idle für Mobilgeräte',
              'Blue Lock Farm — Anime-Fußball-Idle-Tycoon auf Roblox',
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Ist ein Idle Game dasselbe wie ein Clicker?',
        a: 'Fast: Clicker-Spiele beginnen mit aktivem Klicken, Idle Games betonen den automatischen Fortschritt. Beide gehören zu den Incremental Games.',
      },
      {
        q: 'Laufen Idle Games offline weiter?',
        a: 'Viele ja — du bekommst Ressourcen für die Zeit, in der das Spiel geschlossen war.',
      },
    ],
  },
  {
    keyword: 'wow forever fate randomizer',
    product: 'wow-fate-randomizer',
    summary:
      'WoW Forever Fate Randomizer: free offline tool to roll race/class combos for WoW: Forever — quick roll, equal-per-race, no-repeat and championship modes.',
    intro:
      'The WoW Forever Fate Randomizer is a free, offline character randomizer for WoW: Forever. It only rolls verified race and class combinations.',
    sections: [
      {
        heading: 'Modes',
        blocks: [
          {
            type: 'list',
            items: [
              'Quick roll — every eligible race/class pair has the same chance.',
              'Equal per race — first picks a race uniformly, then a class from that race’s eligible classes.',
              'No-repeat — retires a combination for the rest of the cycle.',
              'Championship — draw five, advance three, crown one; repeat three times, then run a Grand Final.',
            ],
          },
        ],
      },
      {
        heading: 'Who it is for',
        blocks: [
          {
            type: 'p',
            text: 'Great for challenge runs, streamers letting chat decide, or anyone stuck choosing an alt.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is the Fate Randomizer free?',
        a: 'Yes, and it works offline.',
      },
    ],
  },
  {
    keyword: 'lynx game',
    product: 'minnesota-lynx',
    summary:
      'Lynx game: the Minnesota Lynx’s 2026 WNBA playoff run ended with a historic sweep by the No. 8 Liberty. Scores and recap.',
    intro:
      'Most "Lynx game" searches in late September 2026 are about the Minnesota Lynx, whose WNBA playoff series against the New York Liberty made history.',
    sections: [
      {
        heading: 'Lynx vs Liberty, 2026 playoffs',
        blocks: [
          {
            type: 'list',
            items: [
              'Game 1 (Sep 27, 2026): Liberty 91–75 Lynx',
              'Game 2 (Sep 29, 2026): Liberty 87–71 Lynx',
            ],
          },
          {
            type: 'p',
            text: 'With the sweep, the No. 8 seed Liberty became the first No. 8 seed to eliminate a No. 1 seed in the WNBA’s 30-year history.',
          },
        ],
      },
      {
        heading: 'Looking for a video game called Lynx?',
        blocks: [
          {
            type: 'p',
            text: 'Several games and the classic Atari Lynx handheld share the name. Add the platform or developer to your search to find the exact one.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Who eliminated the Lynx in 2026?',
        a: 'The New York Liberty, in a 2–0 sweep.',
      },
    ],
  },
  {
    keyword: 'lula',
    product: 'web-search',
    summary:
      '"Lula" can mean several things — a person, a game character or a game title. How to narrow down the search to the game you want.',
    intro:
      '"Lula" is an ambiguous search. It is a common name and nickname, and it appears in several game titles and characters. Here is how to find the right one quickly.',
    sections: [
      {
        heading: 'How to narrow it down',
        blocks: [
          {
            type: 'list',
            items: [
              'Add the platform: "lula game steam", "lula roblox", "lula android".',
              'Add the genre or developer if you remember it.',
              'If you saw it in a video, search the creator’s name plus "lula".',
            ],
          },
        ],
      },
      {
        heading: 'Browse trending games instead',
        blocks: [
          {
            type: 'p',
            text: 'Not sure what you were looking for? Browse the latest trending games in our directory — you may spot it.',
          },
        ],
      },
    ],
    faq: [
      {
        q: 'Is Lula a game?',
        a: 'There are games and characters with that name, but the word on its own also refers to people — add more context to your search.',
      },
    ],
  },
];
