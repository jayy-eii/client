/**
 * Yash Cloth Stores - Central Data Repository
 * 
 * Scalable product showcase database.
 * To add new products in any category, simply add an object to the category's `products` array.
 * No UI or layout code changes required!
 */

export const storeInfo = {
  name: "Yash Cloth Stores",
  tagline: "Beautiful Essentials for Every Space",
  subtagline: "Explore quality home-furnishing products available at Yash Cloth Stores, Nagpur.",
  phone: "9370278715",
  phoneFormatted: "+91 93702 78715",
  whatsapp: "9356591979",
  whatsappFormatted: "+91 93565 91979",
  address: "Yash Cloth Stores, Bajaria, near Nagpur Inn Hotel, Nagpur, Maharashtra",
  landmark: "Near Nagpur Inn Hotel",
  area: "Bajaria, Nagpur",
  timings: "Monday to Sunday: 10:00 AM – 9:00 PM",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Yash+Cloth+Stores+Bajaria+Nagpur",
  about: "Yash Cloth Stores is your trusted neighbourhood destination for quality home-furnishing essentials in Bajaria, Nagpur. We curate a thoughtful selection of daily comfort and interior essentials — including durable doormats, premium bedsheets, cozy comforters, warm blankets, absorbent towels, decorative carpets, elegant curtains, fitted sofa covers, and multi-purpose floor mats. Every item in our store is chosen for genuine fabric feel, everyday durability, and honest local pricing.",
  badges: [
    { title: "Physical Store in Nagpur", desc: "Touch & feel fabrics in person at Bajaria" },
    { title: "Honest Store Guidance", desc: "Friendly local assistance for your home requirements" },
    { title: "Daily Home Essentials", desc: "Wide variety in sizes, colors and textures" },
    { title: "Instant WhatsApp Support", desc: "Check live stock and color availability quickly" }
  ]
};

export const doormatKeyFeatures = [
  {
    id: "feat-1",
    title: "Water Absorbent Surface",
    subtitle: "Quickly absorbs moisture",
    description: "Specialized porous fiber structure traps water, moisture, and fine dust to keep your interior tiles clean and dry.",
    image: "/assets/images/features/feat-absorbent-photo.jpg",
    fullCardImage: "/assets/images/features/feat-absorbent.jpg"
  },
  {
    id: "feat-2",
    title: "Antiskid Backing",
    subtitle: "Provides strong grip",
    description: "Heavy-duty textured rubber base stays firmly in place without sliding on smooth marble, granite, or vitrified tiles.",
    image: "/assets/images/features/feat-antiskid-photo.jpg",
    fullCardImage: "/assets/images/features/feat-antiskid.jpg"
  },
  {
    id: "feat-3",
    title: "Smooth Rounded Corners",
    subtitle: "Safe & stylish finish",
    description: "Carefully rounded border trim prevents tripping hazards, protects edges from curling up, and ensures smooth door swing.",
    image: "/assets/images/features/feat-corners-photo.jpg",
    fullCardImage: "/assets/images/features/feat-corners.jpg"
  },
  {
    id: "feat-4",
    title: "Flexible & Easy to Clean",
    subtitle: "Simply shake or wipe",
    description: "Durable flexible construction allows convenient daily maintenance — simply shake out dust, wipe with a damp cloth, or rinse.",
    image: "/assets/images/features/feat-easyclean-photo.jpg",
    fullCardImage: "/assets/images/features/feat-easyclean.jpg"
  }
];

export const doormatPlacements = [
  {
    id: "place-kitchen",
    room: "Kitchen",
    headline: "Kitchen Counter & Sink Area",
    description: "Catches oil splatters, sink splashes, and provides cushioning for standing comfort during cooking.",
    image: "/assets/images/doormat/placement-kitchen.jpg",
    cardImage: "/assets/images/doormat/card-kitchen.jpg"
  },
  {
    id: "place-washroom",
    room: "Washroom",
    headline: "Bathroom & Shower Boundary",
    description: "Rapidly traps moisture from wet feet after baths, protecting outside corridors from slippery water tracks.",
    image: "/assets/images/doormat/placement-washroom.jpg",
    cardImage: "/assets/images/doormat/card-washroom.jpg"
  },
  {
    id: "place-bedroom",
    room: "Bedroom",
    headline: "Bedside & Dressing Comfort",
    description: "Soft underfoot landing for bare feet when stepping off the bed, pairing gracefully with bedroom decor.",
    image: "/assets/images/doormat/placement-bedroom.jpg",
    cardImage: "/assets/images/doormat/card-bedroom.jpg"
  },
  {
    id: "place-living",
    room: "Living Room",
    headline: "Center Table & Lounge Accent",
    description: "Warm wooden-finish visual that complements hardwood furniture, center coffee tables, and sofa corners.",
    image: "/assets/images/doormat/placement-livingroom.jpg",
    cardImage: "/assets/images/doormat/card-livingroom.jpg"
  },
  {
    id: "place-entry",
    room: "Entryway / Balcony",
    headline: "Main Door & Balcony Foyer",
    description: "Engineered for high daily footfall to scrape outdoor dust, shoe grit, and moisture right at the doorstep.",
    image: "/assets/images/doormat/placement-entryway.jpg",
    cardImage: "/assets/images/doormat/card-entryway.jpg"
  }
];

export const categoriesData = [
  {
    id: "doormats",
    name: "Doormats",
    slug: "doormats",
    tagline: "Water-absorbent, anti-skid & durable floor mats",
    description: "Functional and stylish mats engineered with quick-absorbing surfaces and strong grip backing for every room in your home.",
    coverImage: "/assets/images/categories/doormats.jpg",
    badge: "In Stock & Featured",
    itemCountText: "Multiple room designs available",
    products: [
      {
        id: "dm-01",
        name: "Rustic Wooden Plank Anti-Skid Doormat",
        category: "Doormats",
        categoryId: "doormats",
        shortDescription: "Ultra-absorbent printed mat with non-slip base & rounded safety corners",
        description: "A signature multi-purpose floor mat featuring a realistic rustic timber texture that blends seamlessly into modern wooden and tiled floors. Built with a fast-acting water absorption surface and a firm rubberized antiskid backing to prevent slips.",
        images: [
          "/assets/images/doormat/doormat-hero.jpg",
          "/assets/images/doormat/doormat-main-product.jpg",
          "/assets/images/features/feat-absorbent-photo.jpg",
          "/assets/images/features/feat-antiskid-photo.jpg",
          "/assets/images/features/feat-corners-photo.jpg",
          "/assets/images/features/feat-easyclean-photo.jpg",
          "/assets/images/doormat/reference-original.jpg"
        ],
        details: {
          "Primary Use": "Main Door, Kitchen, Washroom & Bedroom",
          "Surface": "High-absorption moisture trap layer",
          "Backing": "Heavy textured anti-skid rubber base",
          "Edge Finish": "Smooth rounded corner trims",
          "Maintenance": "Shake, wipe or wash clean easily"
        },
        tags: ["Anti-Skid", "High Absorption", "Rounded Edges", "Multi-Room"]
      },
      {
        id: "dm-02",
        name: "Kitchen Counter Splash-Absorbing Mat",
        category: "Doormats",
        categoryId: "doormats",
        shortDescription: "Spill-absorbing standing mat for kitchen platforms & sinks",
        description: "Engineered specifically for kitchen food prep zones and sink areas. Quickly traps spilled water droplets, prevents greasy footprints from tracking into rooms, and stays firmly anchored to the floor.",
        images: [
          "/assets/images/doormat/placement-kitchen.jpg",
          "/assets/images/doormat/doormat-main-product.jpg",
          "/assets/images/features/feat-absorbent-photo.jpg",
          "/assets/images/features/feat-easyclean-photo.jpg"
        ],
        details: {
          "Ideal Area": "Under kitchen sink & stove counter",
          "Surface": "Splash and moisture absorbent",
          "Grip": "Secure anti-slip base on tile surfaces",
          "Care": "Wipe with damp sponge or quick water rinse"
        },
        tags: ["Kitchen", "Splash Resistant", "Non-Slip"]
      },
      {
        id: "dm-03",
        name: "Washroom Quick-Dry Entry Mat",
        category: "Doormats",
        categoryId: "doormats",
        shortDescription: "Rapid evaporative floor mat for wet bathroom doorways",
        description: "Positioned directly outside shower stalls or bathroom exits. The moisture-retaining micro-structure absorbs water from dripping feet, leaving wet feet dry in moments while keeping your passage slip-free.",
        images: [
          "/assets/images/doormat/placement-washroom.jpg",
          "/assets/images/features/feat-antiskid-photo.jpg",
          "/assets/images/features/feat-absorbent-photo.jpg"
        ],
        details: {
          "Ideal Area": "Bathroom threshold, shower outside area",
          "Drying": "Fast-absorbing, prevents puddle formation",
          "Safety Base": "Full grip base prevents sliding on wet tiles",
          "Profile": "Low clearance fits under doors easily"
        },
        tags: ["Bathroom", "Quick Dry", "Anti-Slip"]
      },
      {
        id: "dm-04",
        name: "Bedroom Bedside Comfort Mat",
        category: "Doormats",
        categoryId: "doormats",
        shortDescription: "Gentle step-out bedside mat for cozy bare-foot comfort",
        description: "Provides a soothing step when getting out of bed in the morning. Protects feet from cold floors and adds an earthy, warm rustic wood finish that coordinates with your bed linen.",
        images: [
          "/assets/images/doormat/placement-bedroom.jpg",
          "/assets/images/doormat/doormat-hero.jpg",
          "/assets/images/features/feat-corners-photo.jpg"
        ],
        details: {
          "Ideal Area": "Beside bed, wardrobe, dressing table",
          "Underfoot Feel": "Comfortable & smooth barefoot touch",
          "Corners": "Rounded corners prevent curling & tripping"
        },
        tags: ["Bedroom", "Comfort", "Aesthetic"]
      },
      {
        id: "dm-05",
        name: "Living Room Accent Floor Mat",
        category: "Doormats",
        categoryId: "doormats",
        shortDescription: "Elegant room accent mat for center & side lounge spaces",
        description: "A compact floor furnishing piece designed for center coffee tables, armchair zones, and transition walkways. Its neutral wooden pattern pairs seamlessly with leather, fabric sofas, and wooden furniture.",
        images: [
          "/assets/images/doormat/placement-livingroom.jpg",
          "/assets/images/doormat/doormat-main-product.jpg",
          "/assets/images/features/feat-easyclean-photo.jpg"
        ],
        details: {
          "Ideal Area": "Coffee table perimeter, sofa side",
          "Look": "Rustic warm wood grain print",
          "Durability": "Resilient surface against everyday wear"
        },
        tags: ["Living Room", "Decor", "Floor Accent"]
      },
      {
        id: "dm-06",
        name: "Main Entryway & Balcony High-Traffic Mat",
        category: "Doormats",
        categoryId: "doormats",
        shortDescription: "Durable dust & dirt trapper for front door & balcony entrance",
        description: "Tough enough for high-traffic front doors and balcony passages. Traps exterior dust and grit, safeguarding interior floors while presenting a welcoming aesthetic to visiting guests.",
        images: [
          "/assets/images/doormat/placement-entryway.jpg",
          "/assets/images/features/feat-antiskid-photo.jpg",
          "/assets/images/features/feat-easyclean-photo.jpg"
        ],
        details: {
          "Ideal Area": "Main entrance door, balcony slider, porch",
          "Function": "Dust and grit scraper base",
          "Base Stability": "Weight-balanced base resists shifting"
        },
        tags: ["Entrance", "Heavy Duty", "Balcony"]
      }
    ]
  },
  {
    id: "bedsheets",
    name: "Bedsheets",
    slug: "bedsheets",
    tagline: "Pure cotton, fitted & luxury bedsheet sets",
    description: "Breathable pure cotton, satin stripe, and floral printed bedsheets crafted for cool restful sleep and lasting wash durability.",
    coverImage: "/assets/images/categories/bedsheets.jpg",
    badge: "Available in Store",
    itemCountText: "Single, Queen & King sizes in store",
    // SCALABLE SLOT: Add new real products here when images are ready!
    products: []
  },
  {
    id: "comforters",
    name: "Comforters",
    slug: "comforters",
    tagline: "Plush all-season microfiber comforters & quilts",
    description: "Lightweight, ultra-soft quilted comforters with hypoallergenic microfiber filling for cozy year-round air-conditioned comfort.",
    coverImage: "/assets/images/categories/comforters.jpg",
    badge: "Available in Store",
    itemCountText: "Reversible & Solid colors in store",
    // SCALABLE SLOT: Add new real products here when images are ready!
    products: []
  },
  {
    id: "blankets",
    name: "Blankets",
    slug: "blankets",
    tagline: "Warm mink, fleece & winter plush blankets",
    description: "Premium single and double ply blankets featuring dense thermal weave, rich embossed patterns, and feather-soft touch for cold nights.",
    coverImage: "/assets/images/categories/blankets.jpg",
    badge: "Available in Store",
    itemCountText: "Single & Double ply varieties",
    // SCALABLE SLOT: Add new real products here when images are ready!
    products: []
  },
  {
    id: "towels",
    name: "Towels & Napkins",
    slug: "towels",
    tagline: "High-GSM combed cotton bath towels & hand napkins",
    description: "Deeply absorbent, fast-drying Turkish style and combed cotton bath towels, hand towels, and kitchen napkin sets.",
    coverImage: "/assets/images/categories/towels.jpg",
    badge: "Available in Store",
    itemCountText: "Bath, Hand & Napkin sets in store",
    // SCALABLE SLOT: Add new real products here when images are ready!
    products: []
  },
  {
    id: "carpets",
    name: "Carpets",
    slug: "carpets",
    tagline: "Woven living room area rugs & traditional runners",
    description: "Dense-pile center carpets, traditional floral motifs, and minimalist geometric rugs to elevate living room comfort and visual warmth.",
    coverImage: "/assets/images/categories/carpets.jpg",
    badge: "Available in Store",
    itemCountText: "Varied dimensions & weaves in store",
    // SCALABLE SLOT: Add new real products here when images are ready!
    products: []
  },
  {
    id: "curtains",
    name: "Curtains",
    slug: "curtains",
    tagline: "Blackout, linen-textured & sheer window drapes",
    description: "Room-darkening blackout curtains and airy sheer fabrics with rust-resistant brass eyelets for windows, doors, and long balconies.",
    coverImage: "/assets/images/categories/curtains.jpg",
    badge: "Available in Store",
    itemCountText: "Window (5ft), Door (7ft) & Long Door (9ft)",
    products: [
      {
        id: "curt-01",
        name: "Royal Blue Damask Jacquard Eyelet Curtains",
        category: "Curtains",
        categoryId: "curtains",
        shortDescription: "Rich slate-navy jacquard drape with intricate silver damask weave",
        description: "Add timeless elegance to your living room or master bedroom with these premium slate-blue curtains. Crafted from heavyweight jacquard fabric with woven silver damask motifs, they provide gentle room darkening and drape with natural volume. Fitted with smooth brass eyelets for easy sliding.",
        images: [
          "/assets/images/curtains/curtain-royal-blue-damask.jpg"
        ],
        details: {
          "Standard Sizes": "Window (5ft), Door (7ft), Long Door (9ft)",
          "Fabric": "Heavyweight Jacquard Poly-Blend",
          "Header": "Rust-resistant metal eyelet grommets",
          "Light Control": "Semi-blackout (blocks 70-80% light)",
          "Care": "Gentle machine wash or dry clean"
        },
        tags: ["Damask Weave", "Eyelet Header", "Living Room", "Semi-Blackout"]
      },
      {
        id: "curt-02",
        name: "Champagne Beige Luxury Damask Curtains",
        category: "Curtains",
        categoryId: "curtains",
        shortDescription: "Warm golden-beige textured drapes with regal lattice patterns",
        description: "A warm and inviting choice for bedrooms and formal living areas. These champagne-gold drapes feature an ornate repeating diamond damask weave that catches natural light subtly. The thick woven texture maintains crisp pleats from ceiling to floor while insulating against daytime glare.",
        images: [
          "/assets/images/curtains/curtain-champagne-damask-room.jpg",
          "/assets/images/curtains/curtain-champagne-damask-detail.jpg"
        ],
        details: {
          "Standard Sizes": "Window (5ft), Door (7ft), Long Door (9ft)",
          "Fabric": "Rich textured jacquard weave",
          "Header": "Smooth slide grommet rings",
          "Light Control": "Soft light filtering with daytime privacy",
          "Care": "Cold wash with mild detergent, low iron"
        },
        tags: ["Luxury Damask", "Bedroom Decor", "Champagne Gold", "Grommet Top"]
      },
      {
        id: "curt-03",
        name: "Navy Blue Botanical Wheat Border Curtains",
        category: "Curtains",
        categoryId: "curtains",
        shortDescription: "Modern dual-tone navy drapes with horizontal botanical leaf bands",
        description: "Designed with striking horizontal bands of botanical wheat and leaf motifs, this curtain brings a fresh, contemporary character to windows and balcony doors. Built with dense fabric that provides privacy and minimizes heat transmission into your living space.",
        images: [
          "/assets/images/curtains/curtain-navy-botanical.jpg"
        ],
        details: {
          "Standard Sizes": "Window (5ft), Door (7ft), Long Door (9ft)",
          "Fabric": "Textured room-darkening fabric",
          "Header": "Sturdy metal eyelets",
          "Pattern": "Botanical floral & geometric band print",
          "Care": "Machine wash separate, line dry in shade"
        },
        tags: ["Botanical Border", "Room Darkening", "Modern Living", "Door & Window"]
      },
      {
        id: "curt-04",
        name: "Mocha Taupe Floral Vine Eyelet Curtains",
        category: "Curtains",
        categoryId: "curtains",
        shortDescription: "Warm earthy taupe drapes adorned with delicate floral vine branches",
        description: "An understated, nature-inspired drapery that complements neutral interiors, warm wood furniture, and marble flooring. Features an all-over botanical vine pattern on a rich taupe base with a contrasting dark top header band for tailored contrast.",
        images: [
          "/assets/images/curtains/curtain-mocha-floral.jpg"
        ],
        details: {
          "Standard Sizes": "Window (5ft), Door (7ft), Long Door (9ft)",
          "Fabric": "Durable textured polyester blend",
          "Header": "Contemporary dark contrast eyelet header",
          "Light Control": "Privacy shielding & light softening",
          "Care": "Normal wash, shake out wrinkles, steam iron"
        },
        tags: ["Floral Vines", "Taupe Earthy", "Contrast Header", "Living Room"]
      }
    ]
  },
  {
    id: "sofa-covers",
    name: "Sofa Covers",
    slug: "sofa-covers",
    tagline: "Stretchable & quilted protective furniture covers",
    description: "Protective and decorative sofa slipcovers for 1-seater, 2-seater, 3-seater, and L-shape sectional sofas, protecting upholstery from stains and wear.",
    coverImage: "/assets/images/categories/sofa-covers.jpg",
    badge: "Available in Store",
    itemCountText: "1-Seater to 5-Seater & L-Shape fits",
    // SCALABLE SLOT: Add new real products here when images are ready!
    products: []
  },
  {
    id: "floor-mats",
    name: "Floor Mats",
    slug: "floor-mats",
    tagline: "Multi-purpose runners, yoga mats & utility floor protectors",
    description: "Versatile PVC, rubber, and woven floor runners designed for corridors, kitchens, pooja rooms, and active utility areas.",
    coverImage: "/assets/images/categories/floor-mats.jpg",
    badge: "Available in Store",
    itemCountText: "Corridor runners & utility mats in store",
    // SCALABLE SLOT: Add new real products here when images are ready!
    products: []
  }
];

/**
 * Helper to get all products across all categories
 */
export const getAllProducts = () => {
  return categoriesData.flatMap(cat => cat.products);
};

/**
 * Helper to get a category by ID
 */
export const getCategoryById = (categoryId) => {
  return categoriesData.find(cat => cat.id === categoryId);
};

/**
 * Helper to get a product by ID
 */
export const getProductById = (productId) => {
  return getAllProducts().find(prod => prod.id === productId);
};

/**
 * Check if product has a valid price
 */
export const hasValidPrice = (price) => {
  if (price === null || price === undefined || price === '') return false;
  const cleaned = typeof price === 'string' ? price.replace(/[^0-9.]/g, '') : price;
  const num = Number(cleaned);
  return !isNaN(num) && num > 0;
};

/**
 * Format product price for display.
 * Returns professional Indian Rupee formatting (e.g. "₹499", "₹1,499").
 * If owner has not entered a price or price is <= 0, returns "Price on request".
 */
export const getDisplayPrice = (price) => {
  if (!hasValidPrice(price)) {
    return 'Price on request';
  }
  const cleaned = typeof price === 'string' ? price.replace(/[^0-9.]/g, '') : price;
  const num = Number(cleaned);
  return `₹${num.toLocaleString('en-IN')}`;
};

/**
 * Format numeric price value without currency symbol
 */
export const formatProductPrice = (price) => {
  if (!hasValidPrice(price)) return null;
  const cleaned = typeof price === 'string' ? price.replace(/[^0-9.]/g, '') : price;
  const num = Number(cleaned);
  return num.toLocaleString('en-IN');
};

/**
 * Resolves a stable unique product slug for URLs
 */
export const getProductSlug = (product) => {
  if (!product) return '';
  if (product.slug && typeof product.slug === 'string') return product.slug;
  if (product.id && typeof product.id === 'string' && !product.id.includes(' ')) return product.id;
  if (product._id) return product._id.toString();
  return (product.name || 'product')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Generates the stable product detail page URL
 */
export const getProductPageUrl = (product, absolute = true) => {
  if (!product) return '/';
  const slug = getProductSlug(product);
  const relativePath = `/product/${slug}`;
  if (!absolute) return relativePath;

  const origin =
    typeof window !== 'undefined' && window.location && window.location.origin
      ? window.location.origin
      : 'https://yashcloths.vercel.app';
  return `${origin}${relativePath}`;
};

/**
 * Generates unique product reference code / ID
 */
export const getProductIdentifier = (product) => {
  if (!product) return 'YCS-PROD';
  if (product.details) {
    const detailsMap = product.details instanceof Map ? Object.fromEntries(product.details) : product.details;
    if (detailsMap.productId) return detailsMap.productId;
    if (detailsMap['Product ID']) return detailsMap['Product ID'];
    if (detailsMap.id) return detailsMap.id;
  }
  if (product.id && typeof product.id === 'string' && !product.id.includes(' ')) {
    return product.id.toUpperCase();
  }
  if (product._id) {
    return `YCS-${product._id.toString().slice(-6).toUpperCase()}`;
  }
  if (product.slug) {
    return product.slug.toUpperCase();
  }
  return 'YCS-PROD';
};

/**
 * Generates the pre-filled WhatsApp message for ordering a product.
 * Formatted dynamically per specification:
 * 
 * Hello Yash Cloth Stores! I would like to order this product.
 * 
 * Product: [Product Name]
 * Category: [Category]
 * Price: [₹Price or Price on request]
 * Product ID: [Unique ID]
 * [Details/Variation if available]
 * Product link: https://yashcloths.vercel.app/product/[SLUG]
 * 
 * Please confirm availability and ordering details.
 */
export const generateWhatsAppOrderMessage = (product, options = {}) => {
  if (!product) return '';

  const productName = product.name || 'Home Furnishing Item';
  const categoryName = product.category || 'Home Furnishings';
  const priceDisplay = getDisplayPrice(product.price);
  const productId = options.productId || getProductIdentifier(product);
  const productUrl = options.pageUrl || getProductPageUrl(product, true);
  const variationOrDetails = options.variation || options.selectedVariation || product.size;

  const lines = [
    'Hello Yash Cloth Stores! I would like to order this product.',
    '',
    `Product: ${productName}`,
    `Category: ${categoryName}`,
    `Price: ${priceDisplay}`,
    `Product ID: ${productId}`,
  ];

  if (variationOrDetails && variationOrDetails.trim()) {
    lines.push(`Details: ${variationOrDetails.trim()}`);
  }

  lines.push(`Product link: ${productUrl}`);
  lines.push('');
  lines.push('Please confirm availability and ordering details.');

  return lines.join('\n');
};

/**
 * Builds the direct WhatsApp click-to-chat URL with shop's WhatsApp number (+91 93565 91979)
 * and dynamically formatted pre-filled order message.
 */
export const getWhatsAppOrderUrl = (product, options = {}) => {
  const message = generateWhatsAppOrderMessage(product, options);
  const whatsappNumber = `91${storeInfo.whatsapp || '9356591979'}`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};
