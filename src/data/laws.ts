import type { LawCard } from '../types'

export const laws: LawCard[] = [
  // ── LEGAL ──────────────────────────────────────────────────────────────────
  {
    id: 'game-licence-req',
    category: 'Permit — s.19 & 20',
    title: 'Game Licence Required',
    description:
      'No person may hunt any game species unless they hold a current game licence. Applications are made to the Commissioner of Police using the form in Part I of the Fifth Schedule.',
    isLegal: true,
    source: 'Wildlife & National Parks Act 1993, s.19(a)(i) & s.20',
  },
  {
    id: 'landowner-consent',
    category: 'Conduct — s.18',
    title: 'Landowner / Occupier Consent',
    description:
      'A hunter must obtain the consent of the occupier before hunting on privately occupied land, or the owner\'s consent where the land is unoccupied. Entering without consent is an offence.',
    isLegal: true,
    source: 'Wildlife & National Parks Act 1993, s.18(1)(a)',
  },
  {
    id: 'season-compliance',
    category: 'Season — First Schedule',
    title: 'Hunt Within Open Season',
    description:
      'Each game species has a defined hunting window set in the First Schedule. Deer: 1st Saturday of June to last Sunday of September. Partridge & Quail: 2 April – 14 August. Guinea Fowl: 16 April – 14 September. Hare and Wild Boar are open year-round.',
    isLegal: true,
    source: 'Wildlife & National Parks Act 1993, First Schedule & s.19(b)',
  },
  {
    id: 'firearm-registration',
    category: 'Equipment — s.19 & 21',
    title: 'Registered Firearm Above .22 for Deer',
    description:
      'Deer must be hunted with a firearm above .22 calibre. The weapon must be registered under the Firearms Act and declared on the hunting licence. A shotgun loaded with lead shot is also prohibited for deer.',
    isLegal: true,
    source: 'Wildlife & National Parks Act 1993, s.19(1)(c)',
  },
  {
    id: 'scientific-authorisation',
    category: 'Permit — s.19',
    title: 'Scientific / Game-Management Hunt',
    description:
      'The authorised officer may grant permission to hunt game outside the open season and by any approved method for scientific purposes or game management, subject to conditions.',
    isLegal: true,
    source: 'Wildlife & National Parks Act 1993, s.19(2)',
  },
  {
    id: 'crop-protection-hunt',
    category: 'Conduct — s.19',
    title: 'Crop-Protection Hunting',
    description:
      'A landowner or authorised person may hunt game found straying on a cultivated portion of their land or damaging their crops. The carcass must immediately be sent to the nearest police station.',
    isLegal: true,
    source: 'Wildlife & National Parks Act 1993, s.19(3)',
  },
  {
    id: 'camaron-own-waterway',
    category: 'Aquatic — s.24',
    title: 'Camarons on Own Land',
    description:
      'A landowner whose land is bordered or crossed by a natural watercourse may catch camarons in the portion of that watercourse on their land, provided the camaron is not berried (egg-bearing) and measures at least 8.5 cm.',
    isLegal: true,
    source: 'Wildlife & National Parks Act 1993, s.24(2)',
  },
  {
    id: 'protected-wildlife-permit',
    category: 'Permit — s.15',
    title: 'Protected Wildlife Permit',
    description:
      'Hunting, rearing, possessing, buying, selling or exporting any protected wildlife or its products requires a written permit from the authorised officer. Without this permit, the act is an offence.',
    isLegal: true,
    source: 'Wildlife & National Parks Act 1993, s.15(1)',
  },

  // ── ILLEGAL ────────────────────────────────────────────────────────────────
  {
    id: 'night-hunting',
    category: 'Conduct — s.18',
    title: 'Night Hunting',
    description:
      'Hunting any wildlife between sunset and sunrise is strictly prohibited. Using artificial light to locate, dazzle or shoot game is equally illegal under Section 19.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, s.18(1)(b) & s.19(1)(a)(iii)',
  },
  {
    id: 'caliber-deer',
    category: 'Equipment — s.19',
    title: '.22 or Smaller Calibre for Deer',
    description:
      'Using a firearm of .22 calibre or smaller to hunt deer is expressly prohibited. A shotgun loaded with lead shot is also banned for deer hunting.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, s.19(1)(c)',
  },
  {
    id: 'poison-drug-explosive',
    category: 'Conduct — s.18',
    title: 'Poison, Drugs, Explosives or Fire',
    description:
      'Hunting with any drug, poison, poisoned weapon or bait, explosive, fire, pit, or missile containing a detonator is a serious criminal offence under Section 18.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, s.18(1)(c)',
  },
  {
    id: 'snare-gin-trap',
    category: 'Equipment — s.18',
    title: 'Snares and Gin Traps',
    description:
      'It is an offence to hunt with, purchase, sell or possess a snare or gin trap. This prohibition applies to all wildlife, not only game species.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, s.18(2)',
  },
  {
    id: 'vehicle-hunting',
    category: 'Conduct — s.19',
    title: 'Hunting from a Vehicle',
    description:
      'Pursuing, driving or shooting game from any vehicle — including cars, motorcycles, boats or aircraft — is prohibited. "Vehicle" covers all means of transport in the Act.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, s.19(1)(a)(ii)',
  },
  {
    id: 'automatic-firearm',
    category: 'Equipment — s.18',
    title: 'Semi/Full-Auto Firearm',
    description:
      'Using a firearm capable of firing more than one round at a time (semi-automatic or automatic) for hunting is expressly forbidden under the Act.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, s.18(1)(c)(iv)',
  },
  {
    id: 'fawn-hunting',
    category: 'Season — First Schedule',
    title: 'Hunting Fawns (Deer Calves)',
    description:
      'The First Schedule explicitly protects fawns — only adult deer may be taken during the open season. Killing a fawn is treated as taking protected wildlife.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, First Schedule',
  },
  {
    id: 'fourth-schedule-species',
    category: 'Wildlife — s.26 & Fourth Schedule',
    title: 'Fourth Schedule Species',
    description:
      'Species in the Fourth Schedule (e.g. Mauritius pink pigeon, Mauritius kestrel, Round Island boas, fruit bats) attract the most severe penalties. Hunting, possessing or trading them is a major offence.',
    isLegal: false,
    penalty: 'Fine up to Rs 100,000 and/or imprisonment up to 5 years (s.26(2)(a))',
    source: 'Wildlife & National Parks Act 1993, s.26(2)(a) & Fourth Schedule',
  },
  {
    id: 'minor-game-licence',
    category: 'Permit — s.21',
    title: 'Game Licence for a Minor',
    description:
      'No game licence shall be issued to a minor. Any adult who hunts with an unlicensed minor, or who allows a minor to use their licence, commits an offence.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, s.21(1)(a)',
  },
  {
    id: 'convicted-hunter',
    category: 'Permit — s.21',
    title: 'Hunting After Prior Conviction',
    description:
      'A person convicted of any offence under this Act within the preceding five years is ineligible to hold a game licence. Hunting while ineligible compounds the original offence.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, s.21(1)(b)',
  },
  {
    id: 'illegal-wildlife-trade',
    category: 'Conduct — s.17',
    title: 'Trading Protected / Prescribed Wildlife',
    description:
      'Buying, selling, exporting or importing any prescribed species of wildlife or its products without a permit from the authorised officer is an offence. This includes assisting or facilitating such trade.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years — up to Rs 100,000 / 5 years for Fourth Schedule species',
    source: 'Wildlife & National Parks Act 1993, s.17 & s.26',
  },
  {
    id: 'unlawful-animal-intro',
    category: 'Conduct — s.23',
    title: 'Introducing Animals Without Permit',
    description:
      'No living animal (other than livestock or fish) may be introduced into Mauritius, or onto any island within Mauritius, without a permit from the authorised officer.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, s.23',
  },
  {
    id: 'berried-camaron',
    category: 'Aquatic — s.24',
    title: 'Catching Berried or Undersized Camarons',
    description:
      'It is illegal to catch or sell a berried (egg-bearing) female camaron at any time, or any camaron measuring less than 8.5 cm from the back of the eye to the tip of the tail.',
    isLegal: false,
    penalty: 'Fine up to Rs 50,000 and/or imprisonment up to 3 years (s.26(2)(b))',
    source: 'Wildlife & National Parks Act 1993, s.24(1)(a) & (b)',
  },
]
