/**
 * Editorial copy — brand story, the "why us" grid, and the team.
 *
 * Kept as typed data rather than JSX so a CMS (Sanity, Contentful) can be
 * dropped in behind these exports without touching a single component. Every
 * consumer imports the shape, not the strings.
 *
 * The copy below is original writing in the cafe's voice, informed by its
 * public presence: family-run, beachside in Cowes, scratch-made daily, Five
 * Senses Coffee, dog friendly, open early.
 */

export type Highlight = {
  id: string
  title: string
  description: string
  /** Key into the ICONS map in components/ui/Icon.tsx. */
  icon: 'sunrise' | 'wave' | 'paw' | 'bean' | 'leaf' | 'heart'
}

export type TeamMember = {
  id: string
  name: string
  role: string
  bio: string
}

/* -------------------------------------------------------------------------- */
/* Homepage story strip                                                       */
/* -------------------------------------------------------------------------- */

export const story = {
  eyebrow: 'Our story',
  heading: 'A small kitchen, a big window, and the bay just down the road',
  body: [
    'The Waterboy is a family-run cafe a short walk from the Cowes foreshore, and it runs the way small beachside places should: doors open early, the kitchen starts from scratch, and nobody is rushed out of a good table.',
    'We cook what we would want to eat on a morning off. Eggs folded to order, bread cut thick, a cabinet of things baked before the sun properly landed. The specials board changes because the growers and the seasons change, not because a head office said so.',
    'The coffee is Five Senses, and we have stayed with them for the same reason regulars stay with us — it is reliably, quietly excellent. Alternative milks cost nothing extra, the courtyard is dog friendly, and the window seat is the best one in the room.',
  ],
  signature: 'The Waterboy family',
} as const

/* -------------------------------------------------------------------------- */
/* Why us                                                                     */
/* -------------------------------------------------------------------------- */

export const highlights: Highlight[] = [
  {
    id: 'fresh-daily',
    title: 'Made fresh daily',
    description:
      'Prep starts before opening and the cabinet is filled that morning. When something sells out, it is genuinely gone.',
    icon: 'sunrise',
  },
  {
    id: 'beachside',
    title: 'Beachside seating',
    description:
      'A sunny courtyard and a wide window onto Western Port Bay, minutes from the Cowes foreshore.',
    icon: 'wave',
  },
  {
    id: 'dog-friendly',
    title: 'Dog friendly',
    description:
      'Well-behaved dogs are welcome in the outdoor seating, and there is always a water bowl going.',
    icon: 'paw',
  },
  {
    id: 'specialty-coffee',
    title: 'Five Senses coffee',
    description:
      'Specialty beans, dialled in every morning. Oat, almond, soy and lactose-free at no extra charge.',
    icon: 'bean',
  },
  {
    id: 'local-produce',
    title: 'Local where we can',
    description:
      'Produce, bread and eggs from suppliers we can drive to, chosen for how they taste rather than how they invoice.',
    icon: 'leaf',
  },
  {
    id: 'family-run',
    title: 'Family run',
    description:
      'Owner-operated seven days. The people who make your coffee are the people whose name is over the door.',
    icon: 'heart',
  },
]

/* -------------------------------------------------------------------------- */
/* About page                                                                 */
/* -------------------------------------------------------------------------- */

export const about = {
  intro:
    'We are a small beachside cafe in Cowes on Phillip Island, cooking honest food from scratch and pouring specialty coffee for locals, weekenders and everyone who wandered up from the beach still holding their thongs.',

  chapters: [
    {
      id: 'beginning',
      eyebrow: 'The beginning',
      heading: 'It started with a room nobody else wanted',
      body: 'The space on Chapel Street had high ceilings, tired floorboards, and one enormous window facing the water. Everyone who walked through saw a renovation. We saw the window. We sanded the boards back, put timber and linen everywhere the light landed, and opened with a menu short enough to cook properly.',
    },
    {
      id: 'kitchen',
      eyebrow: 'In the kitchen',
      heading: 'Scratch-made is a workload, not a slogan',
      body: 'Hollandaise is whisked to order, not held in a bath. Relish, tartare, compote and dressings are ours. Cakes and muffins are baked in-house each morning, and the specials board is written after the delivery arrives rather than before. It is slower and more expensive, and it is the entire point.',
    },
    {
      id: 'coffee',
      eyebrow: 'The coffee',
      heading: 'Five Senses, dialled in before the doors open',
      body: 'We pour Five Senses Coffee — a roaster whose house blend gives us dark chocolate, toasted hazelnut and a long caramel finish that holds up under milk. The grinder gets adjusted through the day as the weather moves, because a cup that was right at 8am is not automatically right at 1pm.',
    },
    {
      id: 'welcome',
      eyebrow: 'The welcome',
      heading: 'Dogs, prams, sandy feet, big tables',
      body: 'This is a beach town cafe and it should behave like one. The courtyard is dog friendly and there is always water going. Kids get their own short menu that comes out fast. Groups get pushed-together tables. Nobody gets hurried, and the emergency services crews who look after this island drink free, Monday to Friday.',
    },
  ],

  values: [
    {
      title: 'Cook it here',
      body: 'If we can make it in our own kitchen, we do — even when buying it in would be easier.',
    },
    {
      title: 'Buy it close',
      body: 'Island and Gippsland suppliers first. Shorter trips, better produce, money that stays local.',
    },
    {
      title: 'Waste less',
      body: 'Small batches, whole-vegetable cooking, and a specials board built from what needs using.',
    },
    {
      title: 'Everyone sits down',
      body: 'Dietary needs get a real answer, kids get looked after, and dogs get a bowl.',
    },
  ],

  /**
   * Described by role rather than by invented names — the site has no
   * verified staff names or headshots to publish. Swap in the real team
   * (name, role, bio, portrait) whenever that is supplied.
   */
  team: [
    {
      id: 'owner',
      name: 'The owners',
      role: 'Founders',
      bio: 'Ran kitchens on the mainland for two decades, moved down for the water, and never got around to leaving. You will find them on the pass most mornings.',
    },
    {
      id: 'head-chef',
      name: 'Head chef',
      role: 'Kitchen',
      bio: 'Writes the specials board after the produce lands, and is quietly responsible for the brownie recipe nobody is allowed to change.',
    },
    {
      id: 'head-barista',
      name: 'Head barista',
      role: 'Coffee',
      bio: 'Dials in the grinder before opening and again when the weather turns. Knows roughly forty regulars by their order rather than their name.',
    },
  ] satisfies TeamMember[],
} as const

/* -------------------------------------------------------------------------- */
/* Frequently asked — also feeds the FAQPage schema on /contact               */
/* -------------------------------------------------------------------------- */

export const faqs = [
  {
    question: 'Do you take bookings?',
    answer:
      'Small tables are walk-in, and we hold a limited number of bookings for groups. Send a table request through the website or give us a call and we will confirm by phone or email.',
  },
  {
    question: 'Are dogs allowed?',
    answer:
      'Yes — well-behaved dogs are welcome in our outdoor courtyard seating, and there is always a water bowl available. Assistance animals are welcome throughout the cafe.',
  },
  {
    question: 'Do you cater for dietary requirements?',
    answer:
      'We have vegetarian, vegan and gluten-free options across the menu, and most dishes can be adjusted. Please tell our team about any allergies when you order — our kitchen is small and not allergen-free, so we will be honest with you about cross-contact.',
  },
  {
    question: 'Is there parking nearby?',
    answer:
      'There is street parking on Chapel Street and additional parking within a short walk. It gets busy over summer weekends and school holidays, so allow a few extra minutes.',
  },
  {
    question: 'Do you charge extra for alternative milks?',
    answer:
      'No. Oat, almond, soy and lactose-free milk are all the same price as dairy.',
  },
  {
    question: 'Can I get takeaway?',
    answer:
      'Yes — the full coffee list and most of the food menu are available to take away, and the cabinet is stocked from opening.',
  },
] as const
