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
    src: '/images/gallery-outdoor-courtyard-seating.jpg',
    alt: 'Guests at outdoor cafe tables under a canvas umbrella, shaded by gum trees',
    width: 1400,
    height: 1750,
    label: 'Courtyard seating',
    size: 'feature',
  },
  {
    src: '/images/gallery-pastry-cabinet-counter.jpg',
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
    src: '/images/gallery-cowes-foreshore-western-port.jpg',
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
    src: '/images/gallery-kitchen-morning-prep.jpg',
    alt: 'A chef working the pans in a warmly lit kitchen during morning service',
    width: 1400,
    height: 1050,
    label: 'Morning prep',
    size: 'normal',
  },
  {
    src: '/images/gallery-window-seat-timber-stools.jpg',
    alt: 'Afternoon sun falling across timber stools at a cafe window counter',
    width: 1400,
    height: 1750,
    label: 'Window seat',
    size: 'tall',
  },
  {
    src: '/images/gallery-cake-of-the-day-slice.jpg',
    alt: 'A slice of butter cake on a small plate set on marble',
    width: 1400,
    height: 1050,
    label: 'Cake of the day',
    size: 'normal',
  },
  {
    src: '/images/gallery-cafe-frontage-signage.jpg',
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
]
