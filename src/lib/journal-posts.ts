// The Bliss Journal's shared types and helpers, plus the six starter articles.
// Live articles are managed in Admin > Journal (database). The starter set
// below is what "Add the starter articles" imports, and what the public page
// shows until the first article exists in the database.

export type JournalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string };

export type JournalPost = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  published: string; // ISO date
  body: JournalBlock[];
  cta: { title: string; body: string; label: string; href: string };
};

export const starterPosts: JournalPost[] = [
  {
    slug: "housewarming-gifts-that-arent-another-candle",
    tag: "Gift Guides",
    title: "12 Housewarming Gifts That Aren't Another Candle",
    excerpt:
      "Candles are lovely, but here's what to get when you want the new place to actually feel like home.",
    image: "/edit-minimalist.png",
    imageAlt: "A ceramic vase with dried flowers on linen",
    published: "2026-09-26",
    body: [
      {
        type: "p",
        text: "A housewarming gift has a small, specific job: help someone settle into a space that still smells of fresh paint and cardboard. A candle does that fine, but so does a lot of other things. Here are twelve ideas, grouped by the part of the home they belong in.",
      },
      { type: "h2", text: "For the kitchen" },
      {
        type: "ul",
        items: [
          "A set of ceramic tea or coffee cups. New homes run out of cups faster than anything else.",
          "A wooden serving board. It works for chai time snacks and for the first dinner party.",
          "A small hamper of pantry treats: good tea, honey, nuts, something sweet.",
        ],
      },
      { type: "h2", text: "For the living space" },
      {
        type: "ul",
        items: [
          "A vase with dried flowers. It needs no watering and looks finished on day one.",
          "A soft throw for the sofa. It makes a bare room feel lived in.",
          "A framed print or a blank frame with a note that says 'for your first photo here'.",
          "An aroma diffuser with a scent they choose themselves.",
        ],
      },
      { type: "h2", text: "For the doorway" },
      {
        type: "ul",
        items: [
          "A name plate. Personalised ones are a lovely way to say 'this is your home now'.",
          "A key holder or a small tray for the things that land by the door.",
        ],
      },
      { type: "h2", text: "For the sentimental" },
      {
        type: "ul",
        items: [
          "A photo of you together, framed. Simple, and it usually gets pride of place.",
          "A plant in a nice pot, with a care card so it survives the first month.",
        ],
      },
      { type: "h2", text: "How to choose" },
      {
        type: "p",
        text: "Think about what the person is missing rather than what looks impressive. If they have just moved from a hostel, kitchen basics will be used daily. If they have moved into a bigger place, something to fill a wall or a shelf will be appreciated. When in doubt, pick something they can use in the first week, because that is when a gift is remembered.",
      },
      {
        type: "p",
        text: "Add a short handwritten note, and if you like, a small extra: a pack of tea, a pretty coaster set. The extra is often what makes the whole thing feel considered.",
      },
    ],
    cta: {
      title: "Looking for something for the new home?",
      body: "Browse gifts for the home, from serveware to soft furnishings.",
      label: "Shop home gifts",
      href: "/shop?category=home-living",
    },
  },
  {
    slug: "how-to-write-a-gift-note-people-keep",
    tag: "Occasions",
    title: "How to Write a Gift Note People Actually Keep",
    excerpt:
      "The difference between 'Happy Birthday!' and a note someone tapes to their mirror.",
    image: "/moment-thankyou.png",
    imageAlt: "A thank you card, a kraft wrapped gift and a small succulent",
    published: "2026-09-26",
    body: [
      {
        type: "p",
        text: "Most gift notes say the same three words. They are polite, and they get thrown away with the wrapping. The notes people keep are the ones that sound like the person who wrote them and say one true thing.",
      },
      { type: "h2", text: "Start with one specific memory" },
      {
        type: "p",
        text: "Instead of 'Thanks for everything', try 'Thank you for driving me to the station at 5 a.m. and pretending it was no trouble'. A tiny, real detail is what makes a note feel personal. You do not need a long story. One sentence is enough.",
      },
      { type: "h2", text: "Say why you chose this gift" },
      {
        type: "p",
        text: "'I saw this and thought of you' is fine. 'I saw this and remembered how you always steal the good mug' is better. Connecting the gift to something about them shows you paid attention.",
      },
      { type: "h2", text: "Keep it short" },
      {
        type: "p",
        text: "Two to four lines is the sweet spot. A card that fits on one side gets read fully, and it leaves room for a signature that isn't crammed into a corner.",
      },
      { type: "h2", text: "A few openers that work" },
      {
        type: "ul",
        items: [
          "For a birthday: 'Another year, and you are still the person I call first.'",
          "For an anniversary: 'I would still choose the ordinary Tuesdays with you.'",
          "For a thank you: 'You made a hard week easier, and I noticed.'",
          "For a new home: 'May every corner of this place hold something happy.'",
        ],
      },
      { type: "h2", text: "Write it by hand" },
      {
        type: "p",
        text: "Even if your handwriting is not perfect, a handwritten note reads as warmer than a typed one. If you cannot be there in person, this is the part of the gift that travels best.",
      },
      {
        type: "quote",
        text: "A good note is not clever. It is specific, short and sincere.",
      },
      {
        type: "p",
        text: "You can add a free gift note to any order at checkout, so the message arrives with the parcel and stays private from the price.",
      },
    ],
    cta: {
      title: "Ready to pick the gift?",
      body: "Tell us who it's for and we'll help you find something worth writing about.",
      label: "Find a gift",
      href: "/gifting-assistant",
    },
  },
  {
    slug: "how-to-wrap-a-gift-beautifully-and-waste-less",
    tag: "How To",
    title: "How to Wrap a Gift Beautifully, and Waste Less",
    excerpt:
      "A simple wrapping guide that looks generous without plastic confetti or a mountain of tape.",
    image: "/edit-luxury.png",
    imageAlt: "A gold wrapped gift with a pearl strand and satin ribbon",
    published: "2026-09-26",
    body: [
      {
        type: "p",
        text: "The unwrapping is half of the gift. It is also where most of the waste happens: glossy paper that cannot be recycled, shiny confetti, tape on every edge. A beautiful wrap does not need any of that.",
      },
      { type: "h2", text: "Choose materials that can be reused or recycled" },
      {
        type: "ul",
        items: [
          "Kraft paper is plain, strong and easy to recycle. It also looks good with almost any ribbon.",
          "A fabric wrap, such as a scarf or a cotton cloth, becomes part of the gift.",
          "Skip foil and glitter papers, which usually cannot be recycled.",
        ],
      },
      { type: "h2", text: "A clean fold, step by step" },
      {
        type: "ol",
        items: [
          "Cut the paper so it wraps around the box with about 3 cm of overlap.",
          "Fold the edge under before taping, so the seam looks tidy.",
          "Fold the sides in like an envelope, crease firmly, and secure with a single strip of tape.",
          "Turn the box so the seam is underneath.",
        ],
      },
      { type: "h2", text: "Finish it like you mean it" },
      {
        type: "p",
        text: "Ribbon, twine or a strip of fabric does more than any pattern. Tie it loosely rather than tightly, add a sprig of dried flowers or a leaf, and tuck a small tag underneath. Three details are plenty: paper, tie, tag.",
      },
      { type: "h2", text: "What to use instead of plastic confetti" },
      {
        type: "ul",
        items: [
          "Shredded paper or crinkled kraft as filling.",
          "Dried petals or a few whole spices for scent and colour.",
          "A folded piece of tissue in a colour that matches the ribbon.",
        ],
      },
      {
        type: "p",
        text: "A wrap like this takes about ten minutes and costs very little. The person opening it will notice the care, not the price.",
      },
    ],
    cta: {
      title: "Would you rather it arrive wrapped?",
      body: "Many of our gifts are packed and ready to give, with a free note if you like.",
      label: "Shop gifts",
      href: "/shop",
    },
  },
  {
    slug: "the-anniversary-gift-ladder",
    tag: "Gift Guides",
    title: "The Anniversary Gift Ladder: Year 1 Through Year 10",
    excerpt: "A no-stress guide to what to get, and when, as the years add up.",
    image: "/moment-anniversary.png",
    imageAlt: "A bouquet with two champagne flutes and a satin ribbon",
    published: "2026-09-26",
    body: [
      {
        type: "p",
        text: "For a long time couples have marked each year with a traditional material. It is a lovely shortcut when you are stuck: it gives you a theme, and the theme does half the thinking. Here is a year by year guide to the first ten, with a modern twist for each.",
      },
      {
        type: "ul",
        items: [
          "Year 1, paper: a handwritten letter, a framed print, or a photo book of your first year.",
          "Year 2, cotton: a soft throw or a set of crisp cotton bedsheets.",
          "Year 3, leather: a wallet, a passport holder, or a journal with a leather cover.",
          "Year 4, linen or silk: a linen table set, or a silk scarf.",
          "Year 5, wood: an engraved wooden frame, or a small wooden keepsake box.",
          "Year 6, iron: a cast iron pan, or a garden lantern for the balcony.",
          "Year 7, wool or copper: a woollen shawl, or a copper mug set.",
          "Year 8, bronze: a brass or bronze decor piece for the shelf.",
          "Year 9, pottery: handmade ceramics, such as a vase or a set of bowls.",
          "Year 10, tin or aluminium: a personalised tin, or a piece of jewellery with a metallic finish.",
        ],
      },
      { type: "h2", text: "Do you have to follow the list?" },
      {
        type: "p",
        text: "Not at all. Treat it as a starting point. If your partner would rather have a great dinner than a wooden frame, book the dinner and add a small wooden something to the table. The tradition is only useful if it makes the gift easier.",
      },
      { type: "h2", text: "Make it personal" },
      {
        type: "p",
        text: "Whatever you pick, add something only the two of you would understand: the date engraved, a line from a song you both know, a photo from a trip. The material is the theme. The detail is the gift.",
      },
    ],
    cta: {
      title: "Celebrating an anniversary?",
      body: "Gifts for couples, from keepsakes to date night sets.",
      label: "Shop for couples",
      href: "/shop/couples",
    },
  },
  {
    slug: "corporate-gifting-without-the-corporate-feel",
    tag: "Occasions",
    title: "Corporate Gifting Without the Corporate Feel",
    excerpt:
      "How to send something your team or clients will actually want to open.",
    image: "/corporate-hero.png",
    imageAlt: "A notebook, a pen and a wrapped gift on olive and terracotta blocks",
    published: "2026-09-26",
    body: [
      {
        type: "p",
        text: "The gifts people remember from work are rarely the ones with a giant logo. They are the ones that felt chosen. Here is how to keep a corporate gift warm, whether it is for ten people or five hundred.",
      },
      { type: "h2", text: "Think about the person, not the budget line" },
      {
        type: "p",
        text: "Start with who is receiving it. A new joiner may want something to settle in with, like a notebook and a good pen. A long serving colleague may prefer something for home. A client will appreciate something they can share, like a hamper. The right gift usually comes from the relationship, not the price band.",
      },
      { type: "h2", text: "Keep branding light" },
      {
        type: "ul",
        items: [
          "Put your logo on the card or the packaging, not across the gift itself.",
          "Choose one small, tasteful mark over a large printed one.",
          "Let the quality do the talking. A well made object says more than a slogan.",
        ],
      },
      { type: "h2", text: "Add a personal touch at scale" },
      {
        type: "p",
        text: "A printed thank you card is fine, but a name and one line of real appreciation is better. If you are sending many, split the writing between managers so each note sounds like the person who wrote it.",
      },
      { type: "h2", text: "Plan the timing" },
      {
        type: "ul",
        items: [
          "Decide the quantity and the recipients early, and keep addresses in a single sheet.",
          "Allow extra time for personalised or branded items.",
          "For festivals, order well ahead of the week itself, because delivery slows down everywhere.",
        ],
      },
      {
        type: "p",
        text: "If you are gifting for a team, a client list or an event, tell us your headcount and budget and we will put together options for you.",
      },
    ],
    cta: {
      title: "Planning a corporate gift?",
      body: "Share your requirements and we will send a curated proposal.",
      label: "Request a quote",
      href: "/corporate/quote",
    },
  },
  {
    slug: "festival-season-gifting-sorted-early",
    tag: "Gift Guides",
    title: "Festival Season Gifting, Sorted Early",
    excerpt:
      "A planning ahead guide so you're not scrambling the week before Diwali.",
    image: "/moment-festivals.png",
    imageAlt: "A brass diya, marigolds and a box of sweets on a warm brown background",
    published: "2026-09-26",
    body: [
      {
        type: "p",
        text: "Every year the festive weeks arrive faster than we expect. The week before Diwali, Raksha Bandhan or Christmas is when delivery is slowest and the good options run out. A little planning turns it into a calm, enjoyable job.",
      },
      { type: "h2", text: "Start with a list" },
      {
        type: "p",
        text: "Write down everyone you want to give to: family, friends, colleagues, neighbours, the people who help at home. Next to each name, note a rough budget. Most people are surprised by how long the list is, which is exactly why it helps to see it early.",
      },
      { type: "h2", text: "Group people, then choose" },
      {
        type: "ul",
        items: [
          "Close family: one thoughtful gift each, ideally personalised.",
          "Extended family and friends: a shareable hamper works well for households.",
          "Colleagues and neighbours: something small and consumable, like sweets or dry fruits.",
          "Helpers and delivery staff: a simple, generous token, often cash with a card.",
        ],
      },
      { type: "h2", text: "Order two to three weeks ahead" },
      {
        type: "p",
        text: "Our usual delivery is 5 to 7 business days, and personalised or hamper orders can take a day or two longer to prepare. In festive weeks everything takes longer, so ordering two to three weeks before gives you a comfortable margin, and time to fix anything that goes wrong.",
      },
      { type: "h2", text: "Personalise what matters" },
      {
        type: "p",
        text: "Names, initials and a short message turn a nice gift into one that is kept. These items need a little more time to make, which is another reason to order early.",
      },
      { type: "h2", text: "A simple timeline" },
      {
        type: "ol",
        items: [
          "Four weeks before: make the list and set budgets.",
          "Three weeks before: order personalised and out of town gifts.",
          "Two weeks before: order everything else and check delivery dates.",
          "The week of: relax, wrap, and write your notes.",
        ],
      },
    ],
    cta: {
      title: "Get ahead of the season",
      body: "Browse festival gifts and hampers for every celebration.",
      label: "Shop festival gifts",
      href: "/occasions/festivals",
    },
  },
];

const WORDS_PER_MINUTE = 200;

export function readMinutes(post: { body: JournalBlock[] }): number {
  const text = post.body
    .map((b) => ("text" in b ? b.text : b.items.join(" ")))
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatPublished(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
}
