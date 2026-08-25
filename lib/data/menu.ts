/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  MENU DATA — transcribed from the cafe's printed menu board.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Every item, price, section and footnote below comes from the printed menu,
 * not from invention. The structure mirrors the board exactly: all-day
 * breakfast, lunch from 12pm, kids under 12, hot drinks, something cold, and
 * the extras list.
 *
 * ⚠️  PROOFREAD BEFORE LAUNCH. The transcription was taken from a photograph
 * of the board, and the small descriptive lines under each dish are set at a
 * size that does not survive being photographed. Names and prices are the
 * confident part; check the descriptions, and check every price against the
 * current board — prices move and a wrong one on a live site is worse than no
 * description at all.
 *
 * The shape is deliberately CMS-shaped (flat, typed, id-keyed) so a Sanity or
 * Contentful query can be swapped in behind the same exports later. The /menu
 * page, the homepage signature strip and the Menu JSON-LD all derive from this
 * module, so nothing else needs touching when the content changes.
 */

export type DietaryTag = 'v' | 'vg' | 'gf' | 'gfo' | 'df' | 'dfo'

export type MenuItem = {
  id: string
  name: string
  /** Optional — several board items are just a name and a price. */
  description?: string
  /** In dollars. `null` renders as "MP" — market price / ask staff. */
  price: number | null
  /** Two-size pricing, as the drinks list is set on the board. */
  sizes?: { label: string; price: number }[]
  /** Optional add-on line, e.g. "add ice cream +3". */
  addOns?: { label: string; price: number }[]
  dietary?: DietaryTag[]
  /** Promotes the item into the homepage "Signature" preview. */
  featured?: boolean
  /** Renders a small clay "Kitchen favourite" flag. */
  popular?: boolean
  /** Static path into /public/images. */
  image?: string
}

export type MenuCategory = {
  id: string
  name: string
  /** Small uppercase line above the category heading. */
  eyebrow: string
  description: string
  /** Shown under the category heading. */
  note?: string
  items: MenuItem[]
}

export const dietaryLabels: Record<DietaryTag, string> = {
  v: 'Vegetarian',
  vg: 'Vegan',
  gf: 'Gluten free',
  gfo: 'Gluten free option',
  df: 'Dairy free',
  dfo: 'Dairy free option',
}

export const menu: MenuCategory[] = [
  /* ─── All day breakfast ────────────────────────────────────────────── */
  {
    id: 'breakfast',
    name: 'All Day Breakfast',
    eyebrow: 'From 7.30am',
    description:
      'Everything starts in our kitchen each morning — sourdough sliced to order, house-made rösti and preserves, and a hollandaise we refuse to make in advance.',
    note: 'Served all day, because holidays do not run to a schedule.',
    items: [
      {
        id: 'toast-preserves',
        name: 'Toast & Preserves',
        description:
          'Your choice of sourdough or fruit toast with butter, jam, marmalade or peanut butter.',
        price: 5.5,
        dietary: ['v', 'gfo'],
      },
      {
        id: 'banana-bread',
        name: 'Banana Bread',
        description: 'House-made, served warm.',
        price: 5.5,
        dietary: ['v'],
      },
      {
        id: 'toasted-muesli',
        name: 'Toasted Muesli',
        description: 'House-made, with seasonal fruit compote and Greek yoghurt.',
        price: 16.5,
        dietary: ['v'],
      },
      {
        id: 'bircher-muesli',
        name: 'Bircher Muesli',
        description:
          'Oats and bran soaked with apple, toasted almonds, currants and vanilla mascarpone.',
        price: 15,
        dietary: ['v'],
      },
      {
        id: 'belgium-waterboy-waffles',
        name: 'Belgium Waterboy Waffles',
        description:
          'With berry compote, Canadian maple syrup, whipped vanilla mascarpone and toasted coconut.',
        price: 24,
        addOns: [{ label: 'ice cream', price: 3 }],
        dietary: ['v'],
        featured: true,
        image: '/images/dish-belgian-waffles-berry-compote.jpg',
      },
      {
        id: 'bacon-egg-turkish-roll',
        name: 'Bacon & Egg Turkish Roll',
        description: 'Fried egg and bacon with house tomato relish in pressed Turkish bread.',
        price: 14,
        popular: true,
      },
      {
        id: 'free-range-eggs-on-toast',
        name: 'Free Range Eggs on Toast',
        description: 'Poached, fried or scrambled, on thick-cut sourdough.',
        price: 13,
        dietary: ['v', 'gfo'],
      },
      {
        id: 'eggs-benedict',
        name: 'Eggs Benedict',
        description:
          'Poached eggs and hollandaise on toasted sourdough. Choose leg ham, smoked salmon or wilted spinach.',
        price: 24,
        dietary: ['gfo'],
        featured: true,
        image: '/images/dish-eggs-benedict-hollandaise.jpg',
      },
      {
        id: 'chilli-chive-scramble',
        name: 'Chilli & Chive Scramble',
        description:
          'Creamy scrambled eggs through fresh chilli and chives on toasted sourdough, with grated parmesan and pomegranate molasses.',
        price: 23,
        dietary: ['v', 'gfo'],
        featured: true,
        popular: true,
        image: '/images/dish-chilli-chive-scramble-sourdough.jpg',
      },
      {
        id: 'smashed-avocado',
        name: 'Smashed Avocado',
        description:
          'Smashed avocado with grilled zucchini, pesto and mozzarella on sourdough, finished with fetta.',
        price: 19.5,
        dietary: ['v', 'gfo'],
        featured: true,
        image: '/images/dish-smashed-avocado-sourdough-dukkah.jpg',
      },
      {
        id: 'smoked-salmon-potato-rosti',
        name: 'Smoked Salmon & Potato Rösti',
        description:
          'House-made potato rösti with smoked salmon, poached eggs and hollandaise.',
        price: 25,
        dietary: ['gf'],
        featured: true,
        image: '/images/dish-smoked-salmon-potato-rosti.jpg',
      },
      {
        id: 'housemade-harissa-beans',
        name: 'House-made Harissa Beans',
        description: 'Red beans and butter beans in a smoky harissa tomato sauce, with sourdough.',
        price: 22,
        dietary: ['v', 'vg', 'gfo'],
      },
      {
        id: 'mushroom-bruschetta',
        name: 'Mushroom Bruschetta',
        description:
          'Sautéed mushrooms with thyme on sourdough, with crumbled fetta and a poached egg.',
        price: 25,
        dietary: ['v', 'gfo'],
        image: '/images/dish-roasted-mushrooms-soft-polenta.jpg',
      },
      {
        id: 'egyptian-eggs',
        name: 'Egyptian Eggs',
        description:
          'Poached eggs with labneh, house-made dukkah and pomegranate molasses on toasted sourdough.',
        price: 25,
        dietary: ['v', 'gfo'],
        popular: true,
      },
    ],
  },

  /* ─── Lunch ────────────────────────────────────────────────────────── */
  {
    id: 'lunch',
    name: 'Lunch',
    eyebrow: 'From 12pm',
    description:
      'The lunch board comes on at midday — rolls and burgers pressed to order, a rice noodle salad that changes with the season, and squid we fry rather than hold.',
    items: [
      {
        id: 'rueben-sandwich',
        name: 'Rueben Sandwich',
        description: 'House pickled beef, Swiss cheese, sauerkraut and Russian dressing on toasted sourdough.',
        price: 26,
      },
      {
        id: 'asian-chicken-burger',
        name: 'Asian Chicken Burger',
        description:
          'Crumbed chicken with lemongrass and ginger slaw and kewpie mayonnaise in a brioche bun, with chips.',
        price: 26,
        featured: true,
        popular: true,
        image: '/images/dish-waterboy-beef-burger-brioche.jpg',
      },
      {
        id: 'bao-buns',
        name: 'Bao Buns',
        description: 'Steamed buns, house-made kimchi, slaw, pickled carrot and coriander.',
        price: 26,
      },
      {
        id: 'warm-vegetable-frittata',
        name: 'Warm Vegetable Frittata',
        description: 'Served warm with a side of salad greens and tomato relish.',
        price: 25,
        dietary: ['v', 'gf'],
      },
      {
        id: 'grilled-chicken-rice-noodle-salad',
        name: 'Grilled Chicken & Rice Noodle Salad',
        description: 'Chicken over noodles, cabbage, pickled carrot, fresh herbs and toasted peanuts.',
        price: 26,
        dietary: ['df'],
      },
      {
        id: 'veggie-toastie',
        name: 'Veggie Toastie',
        description: 'Roasted capsicum, grilled zucchini, pesto and mozzarella, pressed with chips.',
        price: 24,
        dietary: ['v'],
      },
      {
        id: 'salt-pepper-squid',
        name: 'Salt & Pepper Squid',
        description: 'Lightly fried squid, served with lemon pepper, aioli and garden salad.',
        price: 26,
        dietary: ['df'],
      },
      {
        id: 'sweet-potato-salad',
        name: 'Sweet Potato Salad',
        description: 'Roasted sweet potato with grains, greens, fetta and a citrus dressing.',
        price: 24,
        dietary: ['v', 'gf'],
        featured: true,
        image: '/images/dish-island-garden-bowl-quinoa.jpg',
      },
      {
        id: 'chips-tomato-sauce',
        name: 'Chips & Tomato Sauce',
        price: null,
        dietary: ['v'],
      },
    ],
  },

  /* ─── Kids ─────────────────────────────────────────────────────────── */
  {
    id: 'kids',
    name: 'Kids Menu',
    eyebrow: 'Under 12',
    description:
      'Smaller plates for smaller people, out of the kitchen fast — because nobody enjoys a long wait at that end of the table.',
    items: [
      {
        id: 'kids-egg-on-toast',
        name: 'Egg on Toast',
        price: 8,
        dietary: ['v', 'gfo'],
      },
      {
        id: 'kids-ham-cheese-toastie',
        name: 'Ham and Cheese Toastie',
        price: 7.5,
      },
      {
        id: 'kids-panko-chicken-chips',
        name: 'Panko House Crumbed Chicken & Chips',
        price: 12,
        popular: true,
      },
      {
        id: 'kids-waffle-maple',
        name: 'Waffle with Maple Syrup',
        price: 8.5,
        dietary: ['v'],
      },
    ],
  },

  /* ─── Hot drinks ───────────────────────────────────────────────────── */
  {
    id: 'hot-drinks',
    name: 'Coffee · Tea · Hot Drinks',
    eyebrow: 'Five Senses Coffee',
    description:
      'We pour Five Senses, roasted in Melbourne, and we will make it however you take it. Alternative milks and syrups are on the extras list.',
    items: [
      {
        id: 'five-senses-coffee',
        name: 'Five Senses Coffee',
        price: 5,
        sizes: [
          { label: 'Reg', price: 5 },
          { label: 'Lrg', price: 6 },
        ],
        featured: true,
        popular: true,
        image: '/images/drink-house-blend-flat-white-latte-art.jpg',
      },
      {
        id: 'hot-chocolate',
        name: 'Hot Chocolate',
        description: 'Made with rich chocolate powder.',
        price: 5.5,
        sizes: [
          { label: 'Reg', price: 5.5 },
          { label: 'Lrg', price: 6.5 },
        ],
      },
      {
        id: 'matcha-latte',
        name: 'Matcha Latte',
        price: 5.5,
        sizes: [
          { label: 'Reg', price: 5.5 },
          { label: 'Lrg', price: 6.5 },
        ],
      },
      {
        id: 'pot-of-tea',
        name: 'Pot of Tea',
        description:
          'English Breakfast, Earl Grey, Green Tea, Lemongrass & Ginger, or Peppermint.',
        price: 5.5,
      },
      {
        id: 'prana-chai',
        name: 'Hand Made Pot of Prana Chai',
        price: 6,
      },
    ],
  },

  /* ─── Something cold ───────────────────────────────────────────────── */
  {
    id: 'cold-drinks',
    name: 'Something Cold',
    eyebrow: 'Iced & blended',
    description: 'For the walk back down to the water.',
    items: [
      {
        id: 'smoothies',
        name: 'Smoothies',
        description: 'Berry or mango.',
        price: 9.5,
      },
      {
        id: 'milkshakes',
        name: 'Milkshakes',
        description: 'Chocolate, vanilla, strawberry or caramel.',
        price: 8.5,
        sizes: [
          { label: 'Reg', price: 8.5 },
          { label: 'Lrg', price: 9.5 },
        ],
      },
      {
        id: 'iced-drinks',
        name: 'Iced Drinks',
        description: 'Iced latte, iced long black, iced chocolate or iced matcha.',
        price: 7,
      },
    ],
  },

  /* ─── Extras ───────────────────────────────────────────────────────── */
  {
    id: 'extras',
    name: 'Extras',
    eyebrow: 'Add to any plate',
    description: 'Anything on this list can go on anything on the board.',
    items: [
      { id: 'extra-pork-leek-sausage', name: 'Pork & Leek Sausage', price: 3.5 },
      { id: 'extra-hash-brown', name: 'Hash Brown', price: 3.5, dietary: ['v'] },
      { id: 'extra-bacon', name: 'Bacon', price: 5 },
      { id: 'extra-hollandaise', name: 'Hollandaise', price: 3, dietary: ['v'] },
      { id: 'extra-roasted-tomato', name: 'Roasted Tomato', price: 3.5, dietary: ['v', 'vg'] },
      { id: 'extra-egg', name: 'Extra Egg', price: 3, dietary: ['v'] },
      { id: 'extra-mushrooms', name: 'Mushrooms', price: 5, dietary: ['v', 'vg'] },
      { id: 'extra-scramble', name: 'Scramble', price: 4, dietary: ['v'] },
      { id: 'extra-smoked-salmon', name: 'Smoked Salmon', price: 6 },
      { id: 'extra-halloumi', name: 'Halloumi', price: 5, dietary: ['v'] },
      { id: 'extra-avocado', name: 'Avocado', price: 4.5, dietary: ['v', 'vg'] },
      { id: 'extra-fetta', name: 'Fetta', price: 3, dietary: ['v'] },
      { id: 'extra-wilted-spinach', name: 'Wilted Spinach', price: 4, dietary: ['v', 'vg'] },
      { id: 'extra-aioli-relish', name: 'Aioli / Tomato Relish', price: 2, dietary: ['v'] },
      { id: 'extra-alt-milk', name: 'Alternative Milk', price: 1, dietary: ['v'] },
      { id: 'extra-decaf', name: 'Decaf', price: 0.5 },
      { id: 'extra-syrup', name: 'Syrup — vanilla, hazelnut or caramel', price: 1, dietary: ['v'] },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Board footnotes                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The three notices printed on the board. They belong with the menu rather
 * than hardcoded into the page, because they have to appear wherever the menu
 * appears — and because a surcharge that is on the board but not on the site
 * is the kind of thing people complain about at the counter.
 */
export const menuNotices = {
  ordering: 'Please order and pay at the counter.',
  surcharge: 'A 1.5% surcharge applies to all card transactions.',
  allergens:
    'Please make our staff aware of any allergy or dietary requirement. Our kitchen handles nuts, seafood, sesame, wheat flour, egg and dairy, so while we take every care we cannot guarantee an allergen-free plate.',
} as const

/* -------------------------------------------------------------------------- */
/* Derived views                                                              */
/* -------------------------------------------------------------------------- */

/** Flat list of every item across every category. */
export const allMenuItems: MenuItem[] = menu.flatMap((category) => category.items)

/** The homepage "Signature" strip — anything flagged `featured`. */
export const featuredItems: MenuItem[] = allMenuItems.filter((item) => item.featured)

/** "$24" / "$5.50" / "MP". */
export function formatPrice(price: number | null): string {
  if (price === null) return 'MP'
  return `$${Number.isInteger(price) ? price : price.toFixed(2)}`
}

/** "$5 / $6" for a two-size drink, or the plain price otherwise. */
export function priceLabel(item: MenuItem): string {
  if (!item.sizes?.length) return formatPrice(item.price)
  return item.sizes.map((size) => formatPrice(size.price)).join(' / ')
}
