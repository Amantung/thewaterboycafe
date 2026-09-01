export type GalleryPhoto = {
  src: string
  alt: string
  width: number
  height: number
  /** Short caption shown on hover and in the lightbox. */
  label: string
  /**
   * Art-directed cell size for the editorial bento grid in `GalleryGrid`.
   * Curated by hand rather than derived from the aspect ratio — the point of
   * a bento composition is a deliberate rhythm of large-anchor, wide and tall
   * moments, not a mechanical rule. Defaults to `'normal'` (a single cell).
   */
  size?: 'feature' | 'wide' | 'tall' | 'normal'
}

/** Real photographs, referenced directly from /public/images. */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: '/gallery/courtyard-seating.jpeg',
    alt: 'Guests at outdoor cafe tables under a canvas umbrella, shaded by gum trees',
    width: 1400,
    height: 1750,
    label: 'Courtyard seating',
    size: 'feature',
  },
  {
    src: '/images/the-cabinet.webp',
    alt: 'A glass cabinet of fruit tarts and chocolate cakes on the cafe counter',
    width: 1400,
    height: 1050,
    label: 'The cabinet',
    size: 'wide',
  },
  {
    src: '/images/gallery-dog-friendly-patio.jpg',
    alt: 'A small dog waiting beside a cafe table while its owner has coffee and cake',
    width: 1400,
    height: 1400,
    label: 'Dogs welcome',
    size: 'normal',
  },
  {
    src: '/images/foreshore.jpeg',
    alt: 'The coastline from above, a long jetty reaching out into calm water past the foreshore',
    width: 1400,
    height: 1050,
    label: 'The foreshore, minutes away',
    size: 'wide',
  },
  {
    src: '/images/gallery-five-senses-coffee-beans.jpg',
    alt: 'Freshly roasted coffee beans filling the frame',
    width: 1400,
    height: 1750,
    label: 'Five Senses beans',
    size: 'tall',
  },
  {
    src: '/images/morning-view.jpeg',
    alt: 'A chef working the pans in a warmly lit kitchen during morning service',
    width: 1400,
    height: 1050,
    label: 'Morning view',
    size: 'normal',
  },
  {
    src: '/images/waterboy-logo-philip.webp',
    alt: 'Afternoon sun falling across timber stools at a cafe window counter',
    width: 1400,
    height: 1750,
    label: 'Window seat',
    size: 'tall',
  },
  {
    src: '/images/waffle.png',
    alt: 'A slice of butter cake on a small plate set on marble',
    width: 1400,
    height: 1050,
    label: 'Cake of the day',
    size: 'normal',
  },
  {
    src: '/images/resort.webp',
    alt: 'A cafe frontage with tall glazing, a lantern and its menu in the window',
    width: 1400,
    height: 1050,
    label: 'Out the front',
    size: 'wide',
  },
  {
    src: '/images/gallery-team.jpg',
    alt: 'Four members of the team standing together behind the counter, aprons on, ready for service',
    width: 1086,
    height: 1448,
    label: 'The team',
    size: 'tall',
  },

  /* ─── From the gallery folder ──────────────────────────────────────── */
  {
    src: '/gallery/cafe-inner-view.jpg',
    alt: 'Inside the spacious dining room at The Waterboy Cafe on Phillip Island, with plenty of room for families and larger groups',
    width: 1536,
    height: 2048,
    label: 'Inside the cafe',
    size: 'tall',
  },
  {
    src: '/gallery/chef-making.jpg',
    alt: 'A chef preparing a fresh dish in the open kitchen at The Waterboy Cafe',
    width: 1536,
    height: 2048,
    label: 'In the open kitchen',
    size: 'wide',
  },
  {
    src: '/gallery/coffee-with-cake.jpg',
    alt: 'A flat white coffee served alongside a slice of homemade cake',
    width: 1536,
    height: 2048,
    label: 'Coffee and cake',
    size: 'normal',
  },
  {
    src: '/gallery/croissant.jpg',
    alt: 'A freshly baked croissant plated at The Waterboy Cafe',
    width: 1536,
    height: 2048,
    label: 'Fresh from the oven',
    size: 'normal',
  },
  {
    src: '/gallery/dog-friendly.jpg',
    alt: 'A dog resting beside its owner in the dog-friendly outdoor seating at The Waterboy Cafe',
    width: 1536,
    height: 2048,
    label: 'Dogs welcome',
    size: 'wide',
  },
  {
    src: '/gallery/gluten-free.jpg',
    alt: 'A gluten-free dish served at The Waterboy Cafe, Phillip Island',
    width: 1536,
    height: 2048,
    label: 'Gluten-free options',
    size: 'normal',
  },
  {
    src: '/gallery/homemade-cakes.jpg',
    alt: 'A display of homemade cakes and slices in the pastry cabinet',
    width: 900,
    height: 1599,
    label: 'Homemade cakes and slices',
    size: 'tall',
  },
  {
    src: '/gallery/made-by-owner.jpg',
    alt: 'One of the owners of The Waterboy Cafe preparing food by hand in the kitchen',
    width: 1536,
    height: 2048,
    label: 'Made by the owners',
    size: 'tall',
  },
  {
    src: '/gallery/restaurant-sitting.jpg',
    alt: 'Guests seated together in the large dining room at The Waterboy Cafe',
    width: 1536,
    height: 2048,
    label: 'Plenty of seating',
    size: 'wide',
  },
  {
    src: '/gallery/swiss-style-potato.jpg',
    alt: 'A Swiss-style potato dish served at The Waterboy Cafe',
    width: 1536,
    height: 2048,
    label: 'Off the kitchen pass',
    size: 'normal',
  },
  {
    src: '/gallery/vegan-cake.jpg',
    alt: 'A vegan cake slice from the cabinet at The Waterboy Cafe, Phillip Island',
    width: 1536,
    height: 2048,
    label: 'Vegan cake',
    size: 'normal',
  },
]
