/* ═══════════════════════════════════════════════════════════════════════
   Real content, taken from the LinkedIn profile export (Profile.pdf) and
   the project list in ../portfoliov2/src/data.ts.

   One rule when you edit this file: readout VALUES are facts, never
   estimates. Where a real number exists it is a number and the interface
   counts it up; where none exists the readout states a fact instead. Do
   not swap a fact for an invented percentage — the whole design is built
   on the claim that these numbers are measured.
   ═══════════════════════════════════════════════════════════════════════ */

export const IDENTITY = {
  name: 'Aryan Singh',
  first: 'ARYAN',
  last: 'SINGH',
  role: 'RAG & agentic AI systems · ML/DL · computer vision · data science',
  plateId: 'PLT-0001-AS',
  locale: 'Greater Surat Area, IN',
  email: 'reachforaryan@gmail.com',
  phone: '+91 88262 81309',
  github: 'https://github.com/reachforaryan',
  linkedin: 'https://linkedin.com/in/reachforaryan',
  resume: '/resume.pdf', // your LinkedIn profile export, copied from Profile.pdf
};

export const HERO = {
  kicker: '**not an exhaustive list',
  index: [
    { n: '01', label: 'Agentic & RAG systems' },
    { n: '02', label: 'Computer vision' },
    { n: '03', label: 'Applied data science' },
  ],
  /* Leader-line callouts tethered to the wordmark. x/y are % of its box. */
  annotations: [
    { id: 'a1', x: 26, y: 16, label: 'Reading', value: 'CS @ VIT ’26' },
    { id: 'a2', x: 77, y: 33, label: 'Status', value: 'Open to work' },
    { id: 'a3', x: 21, y: 68, label: 'Base', value: 'Surat, IN' },
    { id: 'a4', x: 81, y: 87, label: 'Archive', value: '05 plates' },
  ],
  scrollCue: 'Scroll to enter the archive',
};

export const MANIFEST = {
  kicker: 'Plate 02 — Manifest',
  heading: 'I build AI systems that reason and act.',
  body: [
    'From RAG pipelines to multi-agent workflows. I like picking unconventional problems: forecasting Delhi bus route demand with transformers and GTFS data, detecting sleep apnea from tracheal audio using cross-modal transformers, building an autonomous music-discovery bot on vector similarity search.',
    'I have worked both sides of applied AI — agentic document-processing pipelines with LangGraph and CrewAI, cutting hallucination rates through better vector indexing, and real-time computer vision models for low-light object detection. Currently exploring agentic orchestration, RAG systems, and where ML meets real-world data: GIS, transit, health.',
  ],
  quote: 'Open to AI/ML engineering, data science, and analyst roles.',
  /* The subject plate carries no photograph. It is a portrait made of what
     the subject does — the annotations are the likeness. */
  specimen: {
    fig: 'FIG. 02',
    title: 'Subject, rendered as signal',
    caption:
      'No photograph on file. The archive describes its subject the way it describes everything else — by what it does, measured and annotated.',
    spec: 'Non-photographic · 1000 × 1250 · generated',
  },
  // Leader-line callouts drawn onto the specimen plate.
  callouts: [
    { id: 'm1', x: 30, y: 22, label: 'Reasons with', value: 'LangGraph · CrewAI' },
    { id: 'm2', x: 74, y: 44, label: 'Trains in', value: 'PyTorch · TensorFlow' },
    { id: 'm3', x: 24, y: 68, label: 'Retrieves with', value: 'Pinecone · ChromaDB' },
    { id: 'm4', x: 68, y: 82, label: 'Grounds in', value: 'GIS · transit · health' },
  ],
  stats: [
    { value: 5, suffix: '', label: 'Plates catalogued' },
    { value: 4, suffix: '', label: 'Roles held' },
    { value: 2026, suffix: '', label: 'Graduating', raw: true },
  ],
};

/** A readout is either a measured number (counted up) or a stated fact. */
export type Readout = { value: number | string; suffix?: string; label: string };

export type Project = {
  n: string;
  title: string;
  kind: string;
  field: string;
  summary: string;
  detail: string;
  readouts: Readout[];
  stack: string[];
  href?: string;
};

export const PROJECTS: Project[] = [
  {
    n: '01',
    title: 'Transit Demand',
    kind: 'Demand forecasting',
    field: 'AI & Intelligent Systems',
    summary:
      'Forecasting Delhi bus route demand from public GTFS schedule data with transformers — a problem where the data is open, messy, and largely unclaimed.',
    detail:
      'Route-level demand is a sequence problem wearing a geography costume. GTFS gives you stops, headways and trips; the modelling work is turning that into something a transformer can attend over without losing the spatial relationships that make a route a route.',
    readouts: [
      { value: 'Transformer', label: 'Architecture' },
      { value: 'GTFS', label: 'Data source' },
      { value: 'Route-level', label: 'Granularity' },
    ],
    stack: ['Python', 'PyTorch', 'Transformers', 'GeoPandas'],
  },
  {
    n: '02',
    title: 'Sleep-HiT',
    kind: 'Biomedical signal model',
    field: 'AI & Intelligent Systems',
    summary:
      'Detecting sleep apnea from tracheal audio using a hierarchical cross-modal transformer.',
    detail:
      'Breathing is a signal long before it is a diagnosis. The hierarchy matters because apnea events live at a different timescale than the breath cycle they interrupt — the encoder has to hold both at once.',
    readouts: [
      { value: 'Cross-modal', label: 'Fusion' },
      { value: 'Tracheal audio', label: 'Signal' },
      { value: 'Hierarchical', label: 'Encoder' },
    ],
    stack: ['Python', 'PyTorch', 'Transformers', 'Multimodal'],
  },
  {
    n: '03',
    title: 'Music Engine',
    kind: 'Autonomous discovery agent',
    field: 'AI & Intelligent Systems',
    summary:
      'An autonomous music-discovery bot. Natural language goes in; vector similarity search across audio embeddings comes back out.',
    detail:
      'A multi-modal engine that orchestrates natural language into audio waveforms. The interesting half is the embedding space — "something like this but slower" is a vector operation before it is a query.',
    readouts: [
      { value: 'Vector search', label: 'Retrieval' },
      { value: 'Autonomous', label: 'Operation' },
      { value: 'Multi-modal', label: 'Input' },
    ],
    stack: ['Python', 'LLM Agents', 'Audio DSP', 'Vector DB'],
  },
  {
    n: '04',
    title: 'Lokr',
    kind: 'Content-addressed vault',
    field: 'Systems, Web & Open Source',
    summary:
      'A production-grade secure file vault. SHA-256 content hashing gives cryptographic deduplication — storing the same bytes twice costs nothing.',
    detail:
      'Written in Go because the hot path is hashing and the cold path is boredom. The client is a thin React shell; the entire product is the guarantee that two identical uploads converge to one object.',
    readouts: [
      { value: 256, label: 'Bit digest' },
      { value: 'SHA-256', label: 'Hashing' },
      { value: 'Go', label: 'Core' },
    ],
    stack: ['Go', 'React', 'PostgreSQL', 'SHA-256'],
  },
  {
    n: '05',
    title: 'System Design Playground',
    kind: 'Visual modelling tool',
    field: 'Systems, Web & Open Source',
    summary:
      'A drag-and-drop tool for visually modelling persistent storage and URL shorteners — a thinking surface for distributed systems, not a diagram editor.',
    detail:
      'Every node carries its real constraints, so connecting two incompatible pieces surfaces the contradiction on the canvas instead of six months into an on-call rotation.',
    readouts: [
      { value: 'Drag & drop', label: 'Interaction' },
      { value: 'React Flow', label: 'Canvas' },
      { value: 'Storage', label: 'Domain' },
    ],
    stack: ['React', 'React Flow', 'TypeScript'],
  },
];

/* The apparatus sheet — printed as a specimen index on the inverted plate. */
export const STACK = [
  {
    n: 'I',
    group: 'Intelligence',
    note: 'Models, agents, and the orchestration between them.',
    items: ['PyTorch', 'TensorFlow', 'Transformers', 'LangGraph', 'CrewAI', 'LangChain'],
  },
  {
    n: 'II',
    group: 'Retrieval & Vision',
    note: 'Finding the right thing, and seeing it in poor light.',
    items: ['Pinecone', 'ChromaDB', 'OpenCV', 'EasyOCR', 'Tesseract', 'RAG'],
  },
  {
    n: 'III',
    group: 'Data & Systems',
    note: 'Where the numbers actually live.',
    items: ['Python', 'SQL', 'Pandas', 'GeoPandas', 'PostgreSQL', 'Go'],
  },
  {
    n: 'IV',
    group: 'Interface & Ground',
    note: 'The half that decides whether the other half is believed.',
    items: ['React', 'TypeScript', 'Figma', 'AWS', 'Azure', 'Material UI'],
  },
];

/* Career read as an atmospheric strata scale — ref #3, re-tuned.
   Ordered top (highest, most recent) to bottom (ground). */
export const TRAJECTORY = [
  {
    n: '05',
    layer: 'Exosphere',
    band: '700–10 000 km',
    year: 'Jan – Mar 2026',
    title: 'Artificial Intelligence Intern',
    org: 'Beans.ai',
    note: 'Built a lightweight OCR pipeline in Python (Tesseract, EasyOCR) to read unit numbers off driver photos, with OpenCV preprocessing for low light. Labelled spatial point-of-interest datasets the team trained detection models on, and validated extracted text against internal geocoded databases.',
  },
  {
    n: '04',
    layer: 'Thermosphere',
    band: '80–700 km',
    year: 'May – Jul 2025',
    title: 'Artificial Intelligence Intern',
    org: 'Beans.ai',
    note: 'Built a RAG pipeline with LangChain and ChromaDB answering drivers’ plain-English questions about building access. Chunked thousands of unstructured delivery notes, gate manuals and property FAQs into embeddings, then tuned prompt templates across open-source LLMs to cut hallucinations and keep answers short.',
  },
  {
    n: '03',
    layer: 'Mesosphere',
    band: '50–80 km',
    year: 'Jun – Dec 2024',
    title: 'Design Head',
    org: 'VIT_Animation · Vellore',
    note: 'Ran design for the campus animation body. Seven months of deciding what things look like before anyone argues about how they work.',
  },
  {
    n: '02',
    layer: 'Stratosphere',
    band: '12–50 km',
    year: 'Jun – Jul 2024',
    title: 'Frontend Intern',
    org: 'Smart Valyou Pte. Ltd.',
    note: 'Designed and shipped a UI/UX prototype in Figma and Material UI, cutting design iteration time by 20%. Built a dynamic React dashboard on React-Grid-Layout that presented data 25% faster.',
  },
  {
    n: '01',
    layer: 'Troposphere',
    band: '0–10 km',
    year: '2022 – 2026',
    title: 'B.Tech, Computer Science',
    org: 'Vellore Institute of Technology',
    note: 'Where the habit of taking things apart got institutional cover.',
  },
];

export const CERTIFICATIONS = [
  'Oracle Cloud Infrastructure 2025 — Certified Generative AI Professional',
  'Oracle Cloud Infrastructure 2025 — Certified AI Foundations Associate',
  'Intro to Machine Learning',
];

export const COLOPHON = {
  heading: 'Say something',
  body: 'The archive is open. If any plate here is close to a problem you have, the fastest route is email — I answer within a day.',
  links: [
    { label: 'Email', value: 'reachforaryan@gmail.com', href: 'mailto:reachforaryan@gmail.com' },
    { label: 'LinkedIn', value: 'in/reachforaryan', href: 'https://linkedin.com/in/reachforaryan' },
    { label: 'GitHub', value: '@reachforaryan', href: 'https://github.com/reachforaryan' },
    { label: 'Résumé', value: 'PDF · 51 KB', href: '/resume.pdf' },
  ],
  set: 'Set in Bodoni Moda, Archivo and Martian Mono. Built with React, GSAP and Lenis.',
};

export const SECTIONS = [
  { id: 'hero', n: '01', label: 'Frontispiece' },
  { id: 'manifest', n: '02', label: 'Manifest' },
  { id: 'trajectory', n: '03', label: 'Trajectory' },
  { id: 'index', n: '04', label: 'Index' },
  { id: 'work', n: '05', label: 'Plates' },
  { id: 'stack', n: '06', label: 'Apparatus' },
  { id: 'colophon', n: '07', label: 'Colophon' },
];
