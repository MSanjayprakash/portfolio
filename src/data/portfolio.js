const profile = {
  name: "Vaideeshwaran",
  role: "UI/UX Designer",
  whatsapp: {
    label: "WhatsApp",
    number: "+91 95660 29018",
    url: "https://wa.me/919566029018?text=Hi%20Vaideeshwaran%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.",
  },
  available: true,
  portrait: "/media/Vaideeshwaran dp.jpg.jpeg",
  showreel: {
    videoUrl: "",
    poster: "",
    duration: "01:30",
    youtubeUrl: "",
  },
};

const masterDriveFolder = "";

const projects = [
  {
    id: "saas-animation",
    title: "SaaS UI Animation",
    subtitle: "Claude AI Workflow Velocity",
    category: "SaaS Animation",
    projectUrl: "",
    poster: "/assets/ChatGPT Image Jul 16, 2026, 10_23_57 AM 1.jpg.jpeg",
    description:
      "Dynamic UI walkthrough with custom kinetic transitions, highlighting AI workflow velocity.",
    tags: ["SaaS", "After Effects", "UI Animation"],
    badge: "Featured",
  },
  {
    id: "nokujob-saas",
    title: "SaaS Product Motion",
    subtitle: "Nokujob Product Demo",
    category: "SaaS Animation",
    projectUrl: "",
    poster: "/assets/ChatGPT Image Jun 24, 2026, 11_50_07 AM 1.jpg.jpeg", 
    description:
      "High-conversion SaaS promotional motion edit explaining platform capabilities with fluid typography and pacing.",
    tags: ["SaaS Motion", "Product Demo", "Pacing"],
  },
  {
    id: "cinematic-edit",
    title: "Tech Verse Cinematic",
    subtitle: "Talking-Head Retention Edit",
    category: "Talking-Head Videos",
    projectUrl: "",
    poster: "/assets/ChatGPT Image Mar 29, 2026, 02_16_58 AM 1 1.jpg.jpeg",
    description:
      "Fast-paced YouTube/podcast edit with seamless sound design, motion graphics, and graphic callouts.",
    tags: ["Cinematic", "Sound Design", "Storytelling"],
    badge: "YouTube",
  },
  {
    id: "motion-design",
    title: "Figma Brand Motion",
    subtitle: "Design Tool Motion Graphics",
    category: "Motion Graphics",
    projectUrl: "",
    poster: "/assets/Connfit Fitness Community App 1.jpg.jpeg",
    description:
      "Sleek geometric motion design emphasizing modern design tool features and collaboration.",
    tags: ["Motion Design", "Typography", "Figma"],
    badge: "Brand",
  },
  {
    id: "gemini-ai",
    title: "Gemini AI Showcase",
    subtitle: "Multimodal AI Motion Walkthrough",
    category: "SaaS Animation",
    projectUrl: "",
    poster: "/assets/CONNFIT_ Torn Paper Fitness Revolution 1.jpg.jpeg",
    description:
      "Visualizing multimodal AI intelligence with responsive motion typography, custom sound design, and clean interfaces.",
    tags: ["AI Motion", "Kinetic UI", "Sound SFX"],
  },
  {
    id: "2d-animation",
    title: "Spotify 2D Animation",
    subtitle: "Beat-Synced Lyrical Motion",
    category: "2D Lyrical Animation",
    projectUrl: "",
    poster: "/assets/Cover image 1.jpg.jpeg",
    description:
      "Expressive rhythm-synced text animators, fluid shape morphing, and musical beat matching.",
    tags: ["2D Lyrical", "Music Sync", "Typography"],
  },

];

const services = [
  {
    id: "saas-anim",
    title: "SaaS Animation",
    priceLabel: "Starts from",
    price: "₹10,000",
    iconType: "compass",
    featured: true,
  },
  {
    id: "motion-video",
    title: "Motion Graphics Video",
    priceLabel: "From – to",
    price: "₹2,000 – ₹10,000",
    iconType: "film",
  },
  {
    id: "talking-head",
    title: "Talking-Head Videos",
    priceLabel: "From – to",
    price: "₹1,500 – ₹4,000",
    iconType: "tv",
  },
  {
    id: "documentary",
    title: "Documentary Videos",
    priceLabel: "From – to",
    price: "₹3,000 – ₹8,000",
    iconType: "clapperboard",
  },
  {
    id: "2d-lyrical",
    title: "2D Lyrical Animation",
    priceLabel: "From – to",
    price: "₹3,000 – ₹10,000",
    iconType: "wand",
  },
];

const clientMetrics = [
  { id: "clients", value: 2, suffix: "+", label: "Years Experience" },
  { id: "edits", value: 10, suffix: "+", label: "Projects" },
  { id: "views", value: 5, suffix: "+", label: "Satisfied Clients" },
];

export { profile, masterDriveFolder, projects, services, clientMetrics };