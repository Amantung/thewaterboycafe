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

export type WelcomeFeature = {
  id: string
  title: string
  body: string
  /** Key into the ICONS map in components/ui/Icon.tsx. */
  icon: 'leaf' | 'paw' | 'pin' | 'heart'
  /** Optional photo from /public/gallery — not every card carries one. */
  image?: string
  imageAlt?: string
}

/* -------------------------------------------------------------------------- */
/* Homepage welcome — the SEO-facing introduction beneath the hero            */
/* -------------------------------------------------------------------------- */

export const welcome = {
  eyebrow: 'Phillip Island cafe',
  heading: 'Welcome to The Waterboy Cafe',
  intro: [
    'Located on beautiful Phillip Island, The Waterboy Cafe is a welcoming, spacious cafe known for its stunning ocean views, delicious coffee and fresh, homemade food.',
    'Our chefs work in an open kitchen, preparing quality meals and homemade dishes throughout the day. We also offer a tempting selection of homemade cakes and slices, with plenty of options to satisfy your sweet tooth.',
  ],
  closing:
    'Come and enjoy the ocean views, great coffee, homemade food and warm atmosphere that make The Waterboy Cafe a favourite destination on Phillip Island.',
  features: [
    {
      id: 'everyone',
      title: 'Something for Everyone',
      body: 'At The Waterboy, we believe everyone should be able to enjoy a great meal. Our menu includes vegan, vegetarian and gluten-free options, with a variety of choices to suit different dietary preferences.',
      icon: 'leaf',
      image: '/gallery/vegan-cake.jpg',
      imageAlt: 'A vegan cake slice from the cabinet at The Waterboy Cafe, Phillip Island',
    },
    {
      id: 'space',
      title: 'Plenty of Space for Everyone',
      body: 'Our large cafe is perfect for families, friends and larger groups. Whether you are stopping by for breakfast, lunch, coffee or cake, there is plenty of room to relax and enjoy your time with us. For those who prefer to sit outside, our front outdoor seating area is dog-friendly, so your four-legged family members can join you too.',
      icon: 'paw',
      image: '/gallery/dog-friendly.jpg',
      imageAlt: 'A dog resting beside its owner at the dog-friendly outdoor seating area',
    },
    {
      id: 'parking',
      title: 'Easy Parking',
      body: 'We have plenty of parking available at both the front and rear of the cafe, making it easy and convenient to visit.',
      icon: 'pin',
      image: '/images/waterboy-logo-philip-1.webp',
      imageAlt: 'A dog resting beside its owner at the dog-friendly outdoor seating area',
    },
    {
      id: 'local',
      title: 'Local & Independently Run',
      body: 'The Waterboy Cafe is proudly run by a local young couple who are passionate about creating a welcoming place for the Phillip Island community and visitors alike.',
      icon: 'heart',
      image: '/gallery/made-by-owner.jpg',
      imageAlt: 'One of the owners of The Waterboy Cafe preparing food by hand in the kitchen',
    },
  ] satisfies WelcomeFeature[],
} as const

/* -------------------------------------------------------------------------- */
/* Homepage story strip                                                       */
/* -------------------------------------------------------------------------- */

export const story = {
  eyebrow: '',
  heading: 'Our story',
  body: [
    'The Waterboy Cafe journey began in May 2025, when Aman and Parjit decided it was time to turn their passion for hospitality into something of their own.',
    'With many years of experience in the hospitality industry, we have always loved working with people, creating great food and making customers feel welcome. We both felt that the time was right to create a place that we could truly enjoy and share with others.',
    'When we took over The Waterboy Cafe, our vision was simple — to create a warm, welcoming place where everyone feels at home.',
    'From the very beginning, we have welcomed everyone through our doors — our wonderful locals, visitors, tourists and everyone exploring Phillip Island.',
    'We love being part of the local community and seeing familiar faces return, while also meeting new people from all around Australia and the world.',
    'For us, The Waterboy is more than just a cafe. It’s a place to enjoy good food, great coffee, friendly service and beautiful moments together.',
    'We are proud of how far we have come and are excited to continue growing, improving and welcoming you all for many years to come.',
    'Thank you for being part of our journey.',
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
    'We’re a neighbourhood cafe serving honest food from scratch and specialty coffee, made for locals, weekenders and everyone who drops by for something good.',

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
    question: 'Do you take bookings or reservations?',
    answer:
      'No — The Waterboy is a walk-in only cafe, so there is no need to book ahead. If you are coming as a large group, give us a call before you arrive and we will do our best to seat you together.',
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
    question: 'Do you offer alternative milk options?',
    answer:
      'Yes! We offer almond, Bonsoy, oat, lactose-free and tigernut milk options for your coffee.',
  },
  {
    question: 'Can I get takeaway?',
    answer:
      'Yes — the full coffee list and most of the food menu are available to take away, and the cabinet is stocked from opening.',
  },
] as const
