import type { Product } from './types';

export { CATEGORIES, CATEGORY_MAP } from './categories';

const robloxSearch = (q: string) =>
  `https://www.roblox.com/discover?Keyword=${encodeURIComponent(q)}`;
const steamSearch = (q: string) =>
  `https://store.steampowered.com/search/?term=${encodeURIComponent(q)}`;
const webSearch = (q: string) =>
  `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;

const G = {
  red: 'from-rose-500 to-orange-400',
  blue: 'from-sky-500 to-indigo-500',
  green: 'from-emerald-500 to-lime-400',
  purple: 'from-violet-500 to-fuchsia-500',
  amber: 'from-amber-500 to-yellow-400',
  slate: 'from-slate-700 to-slate-500',
  teal: 'from-teal-500 to-cyan-400',
  pink: 'from-pink-500 to-rose-400',
};

export const PRODUCTS: Product[] = [
  // ── Roblox ────────────────────────────────────────────────────────────
  {
    id: 'lumber-tycoon-2',
    name: 'Lumber Tycoon 2',
    tagline: 'Chop, mill and sell wood to build your dream base.',
    description:
      'Lumber Tycoon 2 is a long-running Roblox sandbox by Defaultio where you cut trees, process them at your sawmill, sell lumber and build a base on your own plot. It is famous for its hidden areas, rare axes and secret quests — including the Glorbaxe quest added for The Hunt: Roblox 20 event in September 2026.',
    url: 'https://www.roblox.com/games/13822889/Lumber-Tycoon-2',
    cta: 'Play on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Sandbox', 'Tycoon', 'Secrets'],
    color: G.amber,
    featured: true,
    facts: [
      ['Developer', 'Defaultio'],
      ['Genre', 'Sandbox / tycoon'],
      ['Event', 'The Hunt: Roblox 20 (Sep 17–28, 2026)'],
      ['Secret reward', 'Glorbaxe + "You got glorbed!" badge'],
    ],
  },
  {
    id: 'oil-tycoon',
    name: 'Oil Tycoon!',
    tagline: 'Drill, refine and expand — then hunt down six hidden badges.',
    description:
      'Oil Tycoon! is a Roblox tycoon about building an oil production empire. Beyond the factory loop, the map hides six secret badges — an igloo, a hidden flower cave, a wall hole, a catapult launch, a bottomless hole and a pirate grave.',
    url: robloxSearch('Oil Tycoon'),
    cta: 'Find on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Tycoon', 'Secrets', 'Badges'],
    color: G.slate,
    facts: [
      ['Genre', 'Tycoon'],
      ['Secret badges', '6'],
      ['Rarest badge', '"chilly outside" (igloo)'],
    ],
  },
  {
    id: 'slayers-2',
    name: 'Slayers 2',
    tagline: 'Demon-slaying RPG with clans, breathing styles and demon arts.',
    description:
      'Slayers 2 is an anime action RPG on Roblox inspired by demon-hunter stories. Your clan, Breathing Style (as a slayer) or Demon Art (as a demon) defines your build, which is why tier lists are one of the most searched topics for the game.',
    url: robloxSearch('Slayers 2'),
    cta: 'Find on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Anime', 'RPG', 'PvP'],
    color: G.red,
  },
  {
    id: 'your-bizarre-adventure',
    name: 'Your Bizarre Adventure (YBA)',
    tagline: 'JoJo-inspired Roblox fighter with Stands, Specs and skins.',
    description:
      "Your Bizarre Adventure, better known as YBA, is a Roblox fighting game inspired by JoJo's Bizarre Adventure. Players roll Stands with Arrows, unlock fighting Specs, grind bosses and trade skins. Codes occasionally hand out free skips and item boosts.",
    url: 'https://www.roblox.com/games/2809202155/Your-Bizarre-Adventure',
    cta: 'Play on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Anime', 'Fighting', 'Codes'],
    color: G.purple,
  },
  {
    id: 'ball-vs-ball',
    name: 'Ball vs Ball',
    tagline: 'Collect balls from gachas and battle them in PvP.',
    description:
      'Ball vs Ball is a Roblox PvP game where you spend Coins in ball gachas and explosion gachas, then pit your collection against other players. Codes are the easiest way to get free Coins for extra draws.',
    url: robloxSearch('Ball vs Ball'),
    cta: 'Find on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['PvP', 'Gacha', 'Codes'],
    color: G.blue,
  },
  {
    id: 'ride-a-pet',
    name: 'Ride A Pet',
    tagline: 'Hatch faster pets, ride them and find rarer eggs.',
    description:
      'Ride A Pet is a Roblox pet game where you find eggs around the map, hatch faster and rarer pets, ride them to reach new eggs and mutate them to go even faster.',
    url: 'https://www.roblox.com/games/124216119978534/Ride-A-Pet',
    cta: 'Play on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Pets', 'Simulator'],
    color: G.green,
  },
  {
    id: 'blue-lock-farm',
    name: 'Blue Lock Farm',
    tagline: 'Anime soccer idle tycoon — open Blue Lockers and farm cash.',
    description:
      'Blue Lock Farm is an anime soccer idle tycoon on Roblox by Finding Illusions. You open Blue Lockers to collect characters, place them on your field to earn passive cash and keep upgrading your roster — progress continues while you are offline.',
    url: robloxSearch('Blue Lock Farm'),
    cta: 'Find on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Anime', 'Idle', 'Tycoon'],
    color: G.blue,
  },
  {
    id: 'steal-an-egg',
    name: 'Steal An Egg',
    tagline: 'Hatch rare pets, train speed and steal eggs from rivals.',
    description:
      'Steal An Egg is a Roblox game created in July 2026. You hatch eggs to collect rare pets that earn money, upgrade your treadmill and base, train Speed and raid other players to steal their eggs — chasing rarer eggs, sizes and mutations.',
    url: 'https://www.roblox.com/games/107778070777162/Steal-An-Egg',
    cta: 'Play on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Pets', 'PvP', 'Simulator'],
    color: G.amber,
  },
  {
    id: 'anime-dice',
    name: 'Anime Dice',
    tagline: 'Roll for ever-rarer anime characters in this RNG collector.',
    description:
      'Anime Dice is a Roblox RNG collecting game, created in August 2026, where you roll for increasingly rare anime characters and build the strongest collection. It quickly passed tens of millions of visits, and codes hand out free spins, gems and trait rerolls.',
    url: 'https://www.roblox.com/games/113290951185459/Anime-Dice',
    cta: 'Play on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Anime', 'RNG', 'Codes'],
    color: G.pink,
    featured: true,
  },
  {
    id: 'is-it-verity',
    name: 'Is It Verity?',
    tagline: '1v1 pattern-guessing duel — crack the hidden Verity order.',
    description:
      '"Is It Verity?" is a competitive Roblox puzzle game by Prince Creations. Two players race to crack a hidden pattern by placing their Veritys, checking the result and guessing the full sequence first. Packs unlock new Veritys for your loadout. It is not the Verity horror game.',
    url: 'https://www.roblox.com/games/135439033252889/Is-It-Verity',
    cta: 'Play on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Puzzle', '1v1', 'Strategy'],
    color: G.teal,
  },
  {
    id: 'dream-car-collection',
    name: 'Dream Car Collection',
    tagline: 'Open lucky crates, collect 50+ cars and earn money.',
    description:
      'Dream Car Collection is a Roblox collecting game: spawn lucky crates, place and open them for cars, then add each car to your collection to earn money. It features 50+ realistic cars and ASMR car cleaning, with car shows planned.',
    url: 'https://www.roblox.com/games/76841016201110/Dream-Car-Collection',
    cta: 'Play on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Cars', 'Collecting', 'Idle'],
    color: G.red,
  },
  {
    id: 'roll-a-fisherman',
    name: 'Roll a Fisherman',
    tagline: 'Roll for fishermen and reel in rare catches.',
    description:
      'Roll a Fisherman is a trending Roblox RNG game that mixes rolling for characters with fishing. It climbed the Roblox charts in September 2026 with a seals-themed update.',
    url: robloxSearch('Roll a Fisherman'),
    cta: 'Find on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['RNG', 'Fishing'],
    color: G.teal,
  },
  {
    id: 'build-and-kill-zombies',
    name: 'Build and Kill Zombies',
    tagline: 'Roll car parts, bolt on weapons and plow through zombie waves.',
    description:
      'Build and Kill Zombies is a Roblox game by Zombie Car Crusher, created in August 2026. You roll car parts and supports, bolt an engine, fuel tank and wheels onto your car, then drive as far as you can while crushing zombies for Cash and permanent Skills.',
    url: 'https://www.roblox.com/games/105011592530400/Build-and-Kill-Zombies',
    cta: 'Play on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Zombies', 'Vehicles', 'Survival'],
    color: G.green,
    featured: true,
  },
  {
    id: 'build-an-ant-empire',
    name: 'Build an Ant Empire',
    tagline: 'Grow a colony, raid rivals and boost your cash with codes.',
    description:
      'Build an Ant Empire is a Roblox colony-builder where you expand your ant empire, earn cash and take on raids. Codes give temporary cash boosts that multiply your income rate.',
    url: robloxSearch('Build an Ant Empire'),
    cta: 'Find on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Tycoon', 'Strategy', 'Codes'],
    color: G.amber,
  },
  {
    id: 'loot-to-forge',
    name: '+1 Loot To Forge',
    tagline: 'Loot, forge and reroll your race to grow stronger.',
    description:
      '+1 Loot To Forge is a Roblox loot-and-forge simulator. Coins pay for backpack upgrades, training and luck, Race Rerolls swap your race and its bonuses, and potions give short power boosts — all available through codes.',
    url: robloxSearch('+1 Loot To Forge'),
    cta: 'Find on Roblox',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Simulator', 'Loot', 'Codes'],
    color: G.purple,
  },
  {
    id: 'roblox-obby',
    name: 'Roblox Obbies',
    tagline: 'Thousands of obstacle courses — from easy to rage-quit hard.',
    description:
      'An "obby" is a Roblox obstacle course: jump, climb and dodge your way through stages. Searching Roblox for "obby" brings up thousands of free courses, from tower climbs to parkour challenges.',
    url: robloxSearch('obby'),
    cta: 'Browse obbies',
    platform: 'Roblox',
    category: 'roblox',
    tags: ['Obby', 'Parkour'],
    color: G.blue,
  },

  // ── Fortnite ──────────────────────────────────────────────────────────
  {
    id: 'fortnite',
    name: 'Fortnite',
    tagline: 'Epic’s battle royale — now with Fortnitemares 2026.',
    description:
      'Fortnite is Epic Games’ free-to-play battle royale and creative platform. Its yearly Halloween event, Fortnitemares, returned on October 1, 2026 with collaborations including Five Nights at Freddy’s, Freddy Krueger, Slender Man, The Purge and Black Clover.',
    url: 'https://www.fortnite.com',
    cta: 'Visit Fortnite',
    platform: 'PC · Console · Mobile',
    category: 'fortnite',
    tags: ['Battle Royale', 'Events', 'Free-to-play'],
    color: G.purple,
    featured: true,
    facts: [
      ['Publisher', 'Epic Games'],
      ['Fortnitemares 2026', 'From October 1, 2026'],
      ['Price', 'Free-to-play'],
    ],
  },
  {
    id: 'fortnite-competitive',
    name: 'Fortnite Competitive',
    tagline: 'FNCS, cash cups and the Global Championship.',
    description:
      'Fortnite Competitive is Epic’s official esports hub: FNCS seasons, cash cups, rules and the Global Championship that crowns the year’s best players.',
    url: 'https://www.fortnite.com/competitive',
    cta: 'Competitive hub',
    platform: 'PC · Console',
    category: 'fortnite',
    tags: ['Esports', 'FNCS'],
    color: G.blue,
  },

  // ── Minecraft ─────────────────────────────────────────────────────────
  {
    id: 'minecraft',
    name: 'Minecraft',
    tagline: 'The sandbox that is getting its first new dimension since 2011.',
    description:
      'Minecraft is Mojang’s block-building sandbox. At Minecraft Live in September 2026 Mojang revealed The Sift — a new dimension coming to Java and Bedrock in 2027, the first new dimension since The End arrived with 1.0 in 2011.',
    url: 'https://www.minecraft.net',
    cta: 'Visit Minecraft.net',
    platform: 'PC · Console · Mobile',
    category: 'minecraft',
    tags: ['Sandbox', 'Survival', 'Updates'],
    color: G.green,
    featured: true,
    facts: [
      ['Developer', 'Mojang Studios'],
      ['Next dimension', 'The Sift (2027)'],
      ['Editions', 'Java & Bedrock'],
    ],
  },
  {
    id: 'minecraft-redeem',
    name: 'Minecraft Redeem',
    tagline: 'Official page to redeem codes, gift cards and cape codes.',
    description:
      'minecraft.net/redeem is the official Mojang page for redeeming Minecraft codes — game keys, gift cards, Minecoins and promotional cape codes. Sign in with the Microsoft account that owns Minecraft and enter the 25-character code.',
    url: 'https://www.minecraft.net/en-us/redeem',
    cta: 'Redeem a code',
    platform: 'Web',
    category: 'minecraft',
    tags: ['Codes', 'Capes', 'Official'],
    color: G.green,
  },
  {
    id: 'minecraft-dungeons-2',
    name: 'Minecraft Dungeons II',
    tagline: 'The dungeon-crawler sequel — out now with Game Pass.',
    description:
      'Minecraft Dungeons II is the sequel to Mojang’s action dungeon-crawler. It launched on September 29, 2026 on Windows, Xbox Series X|S, Nintendo Switch, Switch 2 and PlayStation 5, and was available day one on Game Pass. It also offers an early look at The Sift.',
    url: 'https://www.xbox.com/en-US/games/minecraft-dungeons-ii',
    cta: 'View on Xbox',
    platform: 'PC · Xbox · PS5 · Switch',
    category: 'minecraft',
    tags: ['Action RPG', 'Co-op', 'New release'],
    color: G.teal,
    featured: true,
    facts: [
      ['Release date', 'September 29, 2026'],
      ['Platforms', 'Windows, Xbox Series X|S, PS5, Switch, Switch 2'],
      ['Game Pass', 'Day one'],
    ],
  },

  // ── Genshin ───────────────────────────────────────────────────────────
  {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    tagline: 'HoYoverse’s open-world RPG — Version 7.1 is live.',
    description:
      'Genshin Impact is HoYoverse’s free-to-play open-world action RPG. Version 7.1 launched on September 23, 2026, bringing the Ronova boss encounter, deeper Khaenri’ah and Snezhnaya lore, and the "Silverwing in Pursuit of the Moon" event with the free 4-star sword Silver Light.',
    url: 'https://genshin.hoyoverse.com',
    cta: 'Visit Genshin Impact',
    platform: 'PC · PS5 · Mobile',
    category: 'genshin',
    tags: ['Open world', 'RPG', 'Gacha'],
    color: G.amber,
    featured: true,
    facts: [
      ['Developer', 'HoYoverse'],
      ['Current version', '7.1 (Sep 23, 2026)'],
      ['Flagship event', 'Silverwing in Pursuit of the Moon'],
    ],
  },

  // ── PC & Console ──────────────────────────────────────────────────────
  {
    id: 'gta-vi',
    name: 'Grand Theft Auto VI',
    tagline: 'Rockstar’s return to Vice City — November 19, 2026.',
    description:
      'Grand Theft Auto VI is Rockstar Games’ next open-world crime epic set in the state of Leonida and Vice City. After two delays, Rockstar set the launch for Thursday, November 19, 2026 on PlayStation 5 and Xbox Series X|S. A PC version has not been announced.',
    url: 'https://www.rockstargames.com/VI',
    cta: 'Official site',
    platform: 'PS5 · Xbox Series X|S',
    category: 'pc-console',
    tags: ['Open world', 'Action', 'Upcoming'],
    color: G.pink,
    featured: true,
    facts: [
      ['Developer', 'Rockstar Games'],
      ['Release date', 'November 19, 2026'],
      ['Platforms', 'PS5, Xbox Series X|S'],
      ['PC', 'Not announced'],
    ],
  },
  {
    id: 'transport-fever-3',
    name: 'Transport Fever 3',
    tagline: 'Build the transport empire of the century — out now.',
    description:
      'Transport Fever 3 is the transport-tycoon sequel from Urban Games, published by Paradox Interactive. It launched on September 29, 2026 for PC (Steam, Epic, GOG — Windows, Mac and Linux), PlayStation 5 and Xbox Series X|S.',
    url: 'https://store.steampowered.com/app/3493540/Transport_Fever_3/',
    cta: 'View on Steam',
    platform: 'PC · PS5 · Xbox',
    category: 'pc-console',
    tags: ['Tycoon', 'Simulation', 'New release'],
    color: G.blue,
    facts: [
      ['Developer', 'Urban Games'],
      ['Publisher', 'Paradox Interactive'],
      ['Release date', 'September 29, 2026'],
    ],
  },
  {
    id: 'ace-combat-8',
    name: 'Ace Combat 8: Wings of Theve',
    tagline: 'Bandai Namco’s flight-combat return — launches Oct 2, 2026.',
    description:
      'ACE COMBAT 8: WINGS OF THEVE is the next mainline entry in Bandai Namco’s arcade flight-combat series. Deluxe Edition pre-orders unlock Early Access from September 29, 2026 (00:00 CEST), ahead of the worldwide launch on October 2, 2026 for PS5, Xbox Series X|S and PC via Steam.',
    url: 'https://store.steampowered.com/app/2288340/ACE_COMBAT_8_WINGS_OF_THEVE/',
    cta: 'View on Steam',
    platform: 'PC · PS5 · Xbox',
    category: 'pc-console',
    tags: ['Flight', 'Action', 'Early access'],
    color: G.slate,
    featured: true,
    facts: [
      ['Publisher', 'Bandai Namco'],
      ['Early access', 'Sep 29, 2026 · 00:00 CEST'],
      ['Launch', 'Oct 2, 2026 · 00:00 CEST'],
    ],
  },
  {
    id: 'graveyard-keeper-2',
    name: 'Graveyard Keeper 2',
    tagline: 'Become Grand Inquisitor and lead an undead army.',
    description:
      'Graveyard Keeper 2 continues the darkly comic management sim. As Grand Inquisitor you manage a medieval graveyard, automate item production, rebuild a town and lead an undead army. It released on September 22, 2026 for PC, PS5, Xbox Series X|S, Switch and Switch 2.',
    url: 'https://store.steampowered.com/app/4358690/Graveyard_Keeper_2/',
    cta: 'View on Steam',
    platform: 'PC · Console',
    category: 'pc-console',
    tags: ['Management', 'Crafting', 'New release'],
    color: G.slate,
    facts: [
      ['Announced', 'April 10, 2026 (Triple-i Initiative)'],
      ['Release date', 'September 22, 2026'],
    ],
  },
  {
    id: 'dressmaker',
    name: 'Dressmaker',
    tagline: 'Cozy tailoring sim — measure, cut, sew and decorate.',
    description:
      'Dressmaker is a cozy job simulation developed by Cozy Lives and published by Free Lives. You run a dressmaking shop: measure clients, design dresses, cut fabric with attention to grain and bias, sew and decorate. It launched on Steam on September 21, 2026 for $14.99 and became a viral top seller.',
    url: steamSearch('Dressmaker'),
    cta: 'Find on Steam',
    platform: 'Windows · macOS',
    category: 'pc-console',
    tags: ['Cozy', 'Simulation', 'Indie hit'],
    color: G.pink,
    featured: true,
    facts: [
      ['Developer', 'Cozy Lives'],
      ['Publisher', 'Free Lives'],
      ['Release date', 'September 21, 2026'],
      ['Price', '$14.99 (US)'],
    ],
  },
  {
    id: 'witcher-3',
    name: 'The Witcher 3: Wild Hunt',
    tagline: 'The Remastered edition launched September 29, 2026.',
    description:
      'The Witcher 3: Wild Hunt is CD PROJEKT RED’s open-world RPG. The Witcher 3 Remastered was announced on August 25, 2026 and released on September 29, 2026 at 10:00 UTC on all platforms, as a free upgrade for existing owners on the same platform.',
    url: 'https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/',
    cta: 'View on Steam',
    platform: 'PC · Console',
    category: 'pc-console',
    tags: ['RPG', 'Open world', 'Remaster'],
    color: G.red,
    facts: [
      ['Remaster announced', 'August 25, 2026'],
      ['Remaster release', 'September 29, 2026 · 10:00 UTC'],
      ['Upgrade', 'Free for existing owners'],
    ],
  },
  {
    id: 'control-resonant',
    name: 'CONTROL Resonant',
    tagline: 'Remedy\u2019s new Control — Hiss, puzzles and secrets.',
    description:
      'CONTROL Resonant is the new game in the Control universe, developed and published by Remedy Entertainment. It launched on Steam on September 24, 2026 ($59.99 Standard, $69.99 Digital Deluxe) and passed 40,000 concurrent players with a very positive rating. Its districts are packed with environmental puzzles — like the Central laundromat washing-machine puzzle.',
    url: 'https://store.steampowered.com/app/3669870/CONTROL_Resonant/',
    cta: 'View on Steam',
    platform: 'PC · Console',
    category: 'pc-console',
    tags: ['Action', 'Puzzles', 'New release'],
    color: G.red,
    featured: true,
    facts: [
      ['Developer', 'Remedy Entertainment'],
      ['Release date', 'September 24, 2026'],
      ['Price', '$59.99 / $69.99 Deluxe'],
    ],
  },
  {
    id: 'silent-hill-townfall',
    name: 'Silent Hill: Townfall',
    tagline: 'A new psychological-horror chapter in the Silent Hill series.',
    description:
      'Silent Hill: Townfall is a new entry in Konami’s Silent Hill series. It released on September 24, 2026 for PlayStation 5, Steam and the Epic Games Store, with Deluxe Edition early access from September 22.',
    url: 'https://store.steampowered.com/app/1636440/SILENT_HILL_Townfall/',
    cta: 'View on Steam',
    platform: 'PC · PS5',
    category: 'pc-console',
    tags: ['Horror', 'New release'],
    color: G.slate,
    facts: [
      ['Release date', 'September 24, 2026'],
      ['Early access', 'September 22, 2026 (Deluxe)'],
      ['Platforms', 'PS5, Steam, Epic'],
    ],
  },
  {
    id: 'needle-in-a-haystack',
    name: 'Needle in a Haystack games',
    tagline: 'The viral 2026 trend: one needle, millions of straws.',
    description:
      'In 2026 a wave of "needle in a haystack" games hit Steam after a simulator video passed 48 million views. Titles include A Needle In A Haystack: Sorting Game, Needle In A Haystack by NoGlyph (6-player co-op), Needle In A Haystack - A Time For Goats, Needle In A Haystack Simulator and Find The Needle.',
    url: steamSearch('needle in a haystack'),
    cta: 'Browse on Steam',
    platform: 'PC',
    category: 'pc-console',
    tags: ['Viral', 'Puzzle', 'Co-op'],
    color: G.amber,
  },
  {
    id: 'deadlock',
    name: 'Deadlock',
    tagline: 'Valve’s hero shooter MOBA — "The City Never Sleeps" update.',
    description:
      'Deadlock is Valve’s third-person hero shooter with MOBA lanes. After a minor patch on September 16, 2026, the major "City Never Sleeps" update arrived in late September and pushed the game to an all-time peak above 228,000 concurrent players.',
    url: 'https://store.steampowered.com/app/1422450/Deadlock/',
    cta: 'View on Steam',
    platform: 'PC',
    category: 'pc-console',
    tags: ['Hero shooter', 'MOBA', 'Valve'],
    color: G.amber,
    featured: true,
  },
  {
    id: 'fable',
    name: 'Fable',
    tagline: 'Playground Games’ return to Albion — Feb 23, 2027.',
    description:
      'Fable is Playground Games’ reboot of the beloved RPG series. At Xbox FanFest in London (September 2026) attendees got a surprise hands-on with a combat-focused demo running at 60fps on Xbox Series X. The game is set to launch on February 23, 2027.',
    url: 'https://www.xbox.com/en-US/search?q=Fable',
    cta: 'Find on Xbox',
    platform: 'Xbox · PC',
    category: 'pc-console',
    tags: ['RPG', 'Upcoming', 'Xbox'],
    color: G.green,
    facts: [
      ['Developer', 'Playground Games'],
      ['Release date', 'February 23, 2027'],
      ['FanFest demo', 'Combat-focused, 60fps (Series X)'],
    ],
  },
  {
    id: 'scam-with-your-friends',
    name: 'Scam With Your Friends',
    tagline: 'Co-op comedy sim about running a fictional scam call center.',
    description:
      'Scam With Your Friends is a co-op comedy game by JakeHub where you run a fictional scam call center, talk with AI callers in real time and hit daily quotas across increasingly chaotic workdays. It supports solo and online co-op, with release planned for October 28, 2026.',
    url: 'https://store.steampowered.com/app/4954910/Scam_With_Your_Friends/',
    cta: 'View on Steam',
    platform: 'PC',
    category: 'pc-console',
    tags: ['Co-op', 'Comedy', 'Upcoming'],
    color: G.purple,
  },

  {
    id: 'wuthering-waves',
    name: 'Wuthering Waves',
    tagline: 'Kuro Games\u2019 open-world action RPG — Version 3.7 is live.',
    description:
      'Wuthering Waves (WuWa) is Kuro Games\u2019 free-to-play open-world action RPG. Version 3.7, "Prism\u2019s Illusion, Heart\u2019s Illumination", launched on September 30, 2026 and runs for 42 days until November 11, 2026, concluding the Xuanfang saga in Mengzhou.',
    url: 'https://wutheringwaves.kurogames.com',
    cta: 'Official site',
    platform: 'PC · PS5 · Mobile',
    category: 'pc-console',
    tags: ['Open world', 'Action RPG', 'Gacha'],
    color: G.teal,
    featured: true,
    facts: [
      ['Developer', 'Kuro Games'],
      ['Version 3.7', 'Sep 30 – Nov 11, 2026'],
      ['New characters', 'Hsin, Suoming'],
    ],
  },
  {
    id: 'aion-2',
    name: 'AION 2',
    tagline: 'NCSoft\u2019s MMORPG sequel — eight classes, flight and PvPvE.',
    description:
      'AION 2 is NCSoft\u2019s sequel to the classic MMORPG Aion. Its global version launches with eight classes covering tank, melee, ranged and support roles, so picking a class is the first big decision for new players.',
    url: steamSearch('AION 2'),
    cta: 'Find on Steam',
    platform: 'PC · Mobile',
    category: 'pc-console',
    tags: ['MMORPG', 'Classes', 'PvP'],
    color: G.purple,
    facts: [
      ['Developer', 'NCSoft'],
      ['Classes', '8'],
    ],
  },
  {
    id: 'ea-fc-27',
    name: 'EA SPORTS FC 27',
    tagline: 'EA\u2019s football sim — plus a free FC 27 Lite edition.',
    description:
      'EA SPORTS FC 27 is the latest entry in EA\u2019s football series. Alongside the full game, EA released FC 27 Lite on September 25, 2026 — a free edition that replaces the old time-limited demo with permanent access to selected modes.',
    url: 'https://store.steampowered.com/app/4407750/EA_SPORTS_FC_27_Lite/',
    cta: 'Get FC 27 Lite',
    platform: 'PC · PlayStation · Xbox',
    category: 'pc-console',
    tags: ['Football', 'Sports', 'Free edition'],
    color: G.green,
    facts: [
      ['Publisher', 'EA SPORTS'],
      ['FC 27 Lite release', 'September 25, 2026'],
      ['Lite price', 'Free'],
    ],
  },

  // ── Indie / browser / mobile ──────────────────────────────────────────
  {
    id: 'survivor-island',
    name: 'Survivor Island-Idle Game',
    tagline: 'Keep the bonfire lit, rescue survivors and fix the ship.',
    description:
      'Survivor Island-Idle Game is a free mobile survival idle game by MOBIBRAIN. Stranded on a misty island, you craft tools, keep the bonfire burning to hold back the fog, assign survivors to jobs, build towers and work toward repairing the ship — with offline progress.',
    url: 'https://apps.apple.com/us/app/survivor-island-idle-game/id6451130382',
    cta: 'App Store',
    platform: 'iOS · Android',
    category: 'indie',
    tags: ['Idle', 'Survival', 'Mobile'],
    color: G.teal,
  },
  {
    id: 'idle-games',
    name: 'Cookie Clicker',
    tagline:
      'The classic idle game — a great first answer to "what is an idle game".',
    description:
      'Cookie Clicker by Orteil is the archetypal idle (incremental) game: click a cookie, buy buildings that bake for you, and watch the numbers grow even while you are away. It is free to play in the browser.',
    url: 'https://orteil.dashnet.org/cookieclicker/',
    cta: 'Play in browser',
    platform: 'Browser',
    category: 'indie',
    tags: ['Idle', 'Incremental', 'Classic'],
    color: G.amber,
  },
  {
    id: 'rummy',
    name: 'Rummy (online)',
    tagline: 'Play the classic card-melding game free in your browser.',
    description:
      'Rummy is a classic card game where you draw and discard to form sets and runs. Free browser versions let you play instantly against the computer — no download needed.',
    url: 'https://poki.com/en/g/rummy',
    cta: 'Play on Poki',
    platform: 'Browser',
    category: 'indie',
    tags: ['Cards', 'Casual'],
    color: G.red,
  },
  {
    id: 'agar-io',
    name: 'Agar.io',
    tagline: 'Eat cells, grow huge and avoid bigger blobs.',
    description:
      'Agar.io is the original massively multiplayer cell-eating .io game. You control a cell, eat pellets and smaller players, split to attack and avoid anything bigger than you.',
    url: 'https://agar.io',
    cta: 'Play Agar.io',
    platform: 'Browser · Mobile',
    category: 'indie',
    tags: ['.io', 'Multiplayer', 'Classic'],
    color: G.green,
  },
  ...indie(
    'the-toxic-mist',
    'The Toxic Mist',
    'Survive a creeping toxic fog in this atmospheric browser game.',
    ['Survival', 'Horror'],
    G.green
  ),
  ...indie(
    'krabby-chase',
    'Krabby Chase',
    'Scuttle, dodge and chase in a quick crab-themed arcade run.',
    ['Arcade', 'Casual'],
    G.red
  ),
  ...indie(
    'luigis-pizza-house',
    'Luigi’s Pizza House',
    'Bake pizzas, serve customers and grow your pizzeria.',
    ['Cooking', 'Time management'],
    G.red
  ),
  ...indie(
    'jewel-blocks-quest',
    'Jewel Blocks Quest',
    'Fit and clear jewel blocks in a relaxing block puzzle.',
    ['Puzzle', 'Blocks'],
    G.purple
  ),
  ...indie(
    'backrooms-five-nights',
    'Backrooms: Five Nights to Escape',
    'Survive five nights in the endless yellow halls.',
    ['Horror', 'Survival'],
    G.amber
  ),
  ...indie(
    'sortello',
    'Sortello',
    'A tidy sorting puzzle — group by color and clear the board.',
    ['Puzzle', 'Sorting'],
    G.teal
  ),
  {
    id: 'wolfoo-word-wonders',
    name: 'Wolfoo Word Wonders',
    tagline: 'Swipe letters to fill a crossword — 30 levels, easy to expert.',
    description:
      'Wolfoo Word Wonders is a word puzzle released in July 2026. Swipe letters on the wheel to spell words and fill the crossword across 30 levels from Easy to Expert, with hints and word audio. It plays on desktop and mobile browsers.',
    url: 'https://game-game.com/280323/',
    cta: 'Play online',
    platform: 'Browser',
    category: 'indie',
    tags: ['Word', 'Puzzle', 'Kids'],
    color: G.blue,
  },
  {
    id: 'viviennes-yacht-club',
    name: 'Viviennes Lifestyle Yacht Club',
    tagline: 'Style a socialite for parties aboard a luxury superyacht.',
    description:
      'Viviennes Lifestyle Yacht Club is a fashion dress-up game. As a socialite’s personal stylist on a superyacht, you shop for designer dresses, shoes, jewelry and sunglasses to create looks for sea parties and deck lounging.',
    url: 'https://game-game.com/283302/',
    cta: 'Play online',
    platform: 'Browser',
    category: 'indie',
    tags: ['Dress-up', 'Fashion'],
    color: G.pink,
  },
  ...indie(
    'slime-gluttion',
    'Slime Gluttion',
    'Eat, grow and evolve as a hungry slime.',
    ['Arcade', 'Growth'],
    G.green
  ),
  {
    id: 'mages-mate-chess',
    name: 'Mage’s Mate: Chess',
    tagline: 'Duel an AI at a vintage board and unlock carved piece sets.',
    description:
      'Mage’s Mate: Chess is a browser chess game where you face an AI opponent at a vintage board, adjust its difficulty and unlock unique carved piece sets with earned coins.',
    url: 'https://game-game.com/282882/',
    cta: 'Play online',
    platform: 'Browser',
    category: 'indie',
    tags: ['Chess', 'Strategy'],
    color: G.slate,
  },
  ...indie(
    'solitaire-klondike-2027',
    'Solitaire Classic Klondike 2027',
    'Classic Klondike solitaire with a fresh coat of paint.',
    ['Cards', 'Solitaire'],
    G.green
  ),
  ...indie(
    'obby-magic-wall-breaker',
    'Obby: Magic Wall Breaker',
    'Smash through walls with magic in a fast obby run.',
    ['Obby', 'Arcade'],
    G.purple
  ),
  {
    id: 'arrows-flow',
    name: 'Arrows Flow: Escape Puzzle',
    tagline: 'Tap arrows in the right order so every one escapes the grid.',
    description:
      'Arrows Flow: Escape Puzzle is a logic puzzle: arrows can only leave in the direction they point, so you must find the move order that clears every lane. Tap an arrow when its path is free; if another arrow blocks the exit, clear that one first.',
    url: 'https://apps.apple.com/us/app/arrows-flow-escape-puzzle/id6761592557',
    cta: 'App Store',
    platform: 'iOS · Android',
    category: 'indie',
    tags: ['Logic', 'Puzzle', 'Mobile'],
    color: G.blue,
  },
  ...indie(
    'ancient-library',
    'Ancient Library: Hidden Secrets',
    'Search a dusty library for hidden objects and secrets.',
    ['Hidden object', 'Mystery'],
    G.amber
  ),
  ...indie(
    'electoral-reform-please',
    'Electoral Reform Please',
    'A satirical desk sim about fixing the voting system.',
    ['Satire', 'Simulation'],
    G.blue
  ),
  ...indie(
    'zelda-level-1',
    'Legend of Zelda - Level 1',
    'A tribute take on the very first Zelda dungeon.',
    ['Adventure', 'Retro'],
    G.green
  ),
  ...indie(
    'until-the-first-snow-falls',
    'Until the First Snow Falls',
    'A quiet, story-driven game set before winter arrives.',
    ['Narrative', 'Cozy'],
    G.teal
  ),
  ...indie(
    'fish-sort-puzzle',
    'Fish Sort Puzzle',
    'Sort fish by color into tanks in this calm puzzle.',
    ['Sorting', 'Puzzle'],
    G.blue
  ),
  ...indie(
    'slime-chef',
    'Slime Chef Magnet Merge Kitchen',
    'Merge ingredients with magnets and cook as a slime chef.',
    ['Merge', 'Cooking'],
    G.green
  ),
  ...indie(
    'texter-tycoon',
    'Texter Tycoon',
    'Grow a messaging empire one text at a time.',
    ['Tycoon', 'Idle'],
    G.purple
  ),
  ...indie(
    'desert-wheels',
    'Desert Wheels: 2 Player Racing',
    'Split-screen desert racing for two players.',
    ['Racing', '2 player'],
    G.amber
  ),
  ...indie(
    'highway-domination-desert',
    'Highway Domination Desert',
    'Weave through desert highway traffic at full speed.',
    ['Racing', 'Driving'],
    G.amber
  ),
  ...indie(
    'cooking-tasty',
    'Cooking Tasty: Restaurant Game',
    'Cook and serve fast in a busy restaurant.',
    ['Cooking', 'Time management'],
    G.red
  ),
  ...indie(
    'piecealive',
    'PieceAlive',
    'Bring pieces to life in a quirky puzzle game.',
    ['Puzzle'],
    G.teal
  ),
  {
    id: 'diamond-art-sort',
    name: 'Diamond Art Sort',
    tagline: 'Sort gems by color to reveal a diamond-painting picture.',
    description:
      'Diamond Art Sort blends diamond painting with sorting puzzles: move colorful gems into the right spots by color and reveal a sparkling picture piece by piece.',
    url: 'https://game-game.com/283262/',
    cta: 'Play online',
    platform: 'Browser · Mobile',
    category: 'indie',
    tags: ['Sorting', 'Relaxing'],
    color: G.pink,
  },
  ...indie(
    'road-racer-fighter',
    'Road Racer Fighter',
    'Race and brawl on the highway at the same time.',
    ['Racing', 'Action'],
    G.red
  ),
  ...indie(
    'animal-snap-showdown',
    'Animal Snap Showdown',
    'Snap matching animals faster than your rival.',
    ['Cards', 'Kids'],
    G.amber
  ),
  {
    id: 'ember-boy-ripple-girl',
    name: 'Ember Boy and Ripple Girl',
    tagline: 'Switch between fire and water heroes to solve each level.',
    description:
      'Ember Boy and Ripple Girl is a co-op style platform adventure: control a fire character and a water character, use their natural abilities, pull levers, move slabs and avoid deadly traps to reach the exit.',
    url: 'https://game-game.com/282568/',
    cta: 'Play online',
    platform: 'Browser',
    category: 'indie',
    tags: ['Platformer', 'Co-op', 'Puzzle'],
    color: G.red,
  },
  ...indie(
    'stumble-boys',
    'Stumble Boys: Party Royale',
    'Stumble through obstacle rounds in a party royale.',
    ['Party', 'Multiplayer'],
    G.pink
  ),
  ...indie(
    'terminator-robot-uprising',
    'Terminator Robot Uprising',
    'Fight back against a machine uprising.',
    ['Action', 'Shooter'],
    G.slate
  ),
  ...indie(
    'ultimate-car-parking-sim',
    'Ultimate Car Parking Sim',
    'Master tight spots in a realistic parking simulator.',
    ['Driving', 'Simulation'],
    G.blue
  ),
  {
    id: 'what-lies-in-the-depths',
    name: 'What Lies In The Depths',
    tagline: 'A free incremental game about sinking into your own dream.',
    description:
      'What Lies In The Depths is a free incremental game by Drew the Bear. A dreamer sinks into his own sleep; you gather what the dream gives up, build a Mind Palace, bind the Oneiri to work for you and march down a road of 25 places. A full run takes about 6–7 hours, in the browser or on Windows.',
    url: 'https://drewthebear.itch.io/wlitd',
    cta: 'Play on itch.io',
    platform: 'Browser · Windows',
    category: 'indie',
    tags: ['Incremental', 'Narrative', 'Free'],
    color: G.purple,
  },

  // ── Tools & trackers ─────────────────────────────────────────────────
  {
    id: 'fut-gg',
    name: 'FUT.GG',
    tagline: 'The fast EA FC 27 Ultimate Team database and squad builder.',
    description:
      'FUT.GG is a popular EA SPORTS FC Ultimate Team database. For FC 27 it covers player ratings, card prices, Evolutions, Hall of FUT, Holographic cards and a squad builder — plus a mobile app.',
    url: 'https://www.fut.gg',
    cta: 'Open FUT.GG',
    platform: 'Web · Mobile',
    category: 'tools',
    tags: ['EA FC 27', 'Database', 'Ultimate Team'],
    color: G.green,
  },
  {
    id: 'wow-fate-randomizer',
    name: 'WoW Forever Fate Randomizer',
    tagline: 'Roll a random race/class combo for WoW: Forever.',
    description:
      'The WoW Forever Fate Randomizer is a free, offline character randomizer for WoW: Forever. Roll a verified race/class combination, use "equal per race" weighting, avoid repeats or run a 5 → 3 → 1 championship bracket.',
    url: 'https://kozmek.github.io/fate-randomizer/',
    cta: 'Open randomizer',
    platform: 'Web',
    category: 'tools',
    tags: ['WoW', 'Randomizer', 'Free'],
    color: G.blue,
  },
  {
    id: 'ilovepdf',
    name: 'iLovePDF Merge PDF',
    tagline: 'Combine PDFs in the order you want — free in the browser.',
    description:
      'iLovePDF’s Merge PDF tool combines multiple PDF files into one document in the browser. Drag files in, reorder them and download the merged file.',
    url: 'https://www.ilovepdf.com/merge_pdf',
    cta: 'Merge PDFs',
    platform: 'Web',
    category: 'tools',
    tags: ['PDF', 'Utility'],
    color: G.red,
  },
  {
    id: 'minnesota-lynx',
    name: 'Minnesota Lynx',
    tagline: 'WNBA team page — schedule, scores and game recaps.',
    description:
      'The Minnesota Lynx are a WNBA team. Their 2026 season ended in the playoffs when the No. 8 New York Liberty swept the top-seeded Lynx — the first time a No. 8 seed eliminated a No. 1 seed in league history.',
    url: 'https://www.espn.com/wnba/team/_/name/min/minnesota-lynx',
    cta: 'Scores on ESPN',
    platform: 'Web',
    category: 'tools',
    tags: ['WNBA', 'Scores'],
    color: G.blue,
  },
  {
    id: 'web-search',
    name: 'Game search',
    tagline: 'Search the web for the exact game you have in mind.',
    description:
      'Some trending terms point to several different things. Use a web search with extra context (platform, developer or genre) to find the exact game or page you are looking for.',
    url: webSearch('game'),
    cta: 'Search',
    platform: 'Web',
    category: 'tools',
    tags: ['Search'],
    color: G.slate,
  },
];

/** Builds a browser-game listing whose play link is a targeted web search. */
function indie(
  id: string,
  name: string,
  tagline: string,
  tags: string[],
  color: string
): Product[] {
  return [
    {
      id,
      name,
      tagline,
      description: `${name} is a new browser and mobile game that started trending in 2026. ${tagline} It is free to try on web game portals, with no download needed on most sites.`,
      url: webSearch(`${name} game play online`),
      cta: 'Find & play',
      platform: 'Browser',
      category: 'indie',
      tags,
      color,
    },
  ];
}

export const PRODUCT_MAP = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p])
) as Record<string, Product>;
