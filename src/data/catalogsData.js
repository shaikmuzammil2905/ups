// Catalog Data for Online UPS and Batteries Sections
// Full content, pictorial representation, technical specifications, calculators, troubleshooting, and FAQs.

export const ONLINE_UPS_DROPDOWN = [
  {
    id: 'ups-manufacturer',
    title: 'UPS MANUFACTURER',
    items: [
      { slug: 'ups-manufacturers-in-bangalore-peenya', title: 'UPS Manufacturers In Bangalore Peenya' },
      { slug: 'power-backup-solutions-for-office', title: 'Power Backup Solutions for Office' },
      { slug: 'eaton-online-ups', title: 'Eaton online UPS' },
      { slug: 'power-backup-solutions', title: 'Power Backup Solutions' },
      { slug: 'power-backup-solutions-for-home', title: 'Power Backup Solutions For Home' },
    ]
  },
  {
    id: 'apc-ups',
    title: 'APC UPS',
    items: [
      { slug: 'smart-online-ups', title: 'Smart Online UPS' },
      { slug: 'battery-health-maintenance', title: 'Battery Health & Maintenance' },
    ]
  },
  {
    id: 'emerson-ups',
    title: 'EMERSON UPS',
    items: [
      { slug: 'luminous-ups', title: 'LUMINOUS UPS' },
      { slug: 'luminous-inverter-dealers-near-me', title: 'Luminous Inverter Dealers Near Me' },
      { slug: 'home-ups', title: 'Home UPS' },
    ]
  },
  {
    id: 'consul-online-ups',
    title: 'CONSUL ONLINE UPS',
    items: [
      { slug: '10-kva-online-ups', title: '10 KVA ONLINE UPS' },
      { slug: '20-kva-online-ups', title: '20 KVA ONLINE UPS' },
      { slug: 'server-power-backup-solutions', title: 'Server Power Backup Solutions' },
    ]
  },
  {
    id: 'microtek-ups',
    title: 'MICROTEK UPS',
    items: [
      { slug: 'delta-ups', title: 'DELTA UPS' },
    ]
  },
  {
    id: 'ups-for-ct-mri-scanners',
    title: 'Ups For Ct Mri Scanners',
    items: [
      { slug: 'ups-for-retail-showroom', title: 'UPS For Retail Showroom' },
      { slug: 'ups-for-multiplex-cinema-halls', title: 'UPS for multiplex cinema halls' },
      { slug: 'upu-for-treadmill', title: 'UPU For Treadmill' },
    ]
  },
  {
    id: 'vertiv-online-ups',
    title: 'VERTIV ONLINE UPS',
    items: [
      { slug: 'vertiv-industrial-ups', title: 'Vertiv Industrial UPS' },
      { slug: 'emerson-60-kva-ups-price', title: 'Emerson 60 kva ups Price' },
    ]
  },
  {
    id: 'numeric-ups',
    title: 'Numeric UPS',
    items: [
      { slug: 'bpe-online-ups', title: 'BPE Online UPS' },
    ]
  },
  {
    id: 'isolation-transformers',
    title: 'Isolation Transformers',
    items: [
      { slug: 'isolation-transformers', title: 'Ultra-Isolation Transformers (1kVA - 500kVA)' },
    ]
  }
];

export const BATTERIES_DROPDOWN = [
  {
    id: 'amaron-battery-wholesale-distributor',
    title: 'Amaron Battery Wholesale Distributor',
    items: [
      { slug: 'amaron-quanta-battery', title: 'Amaron Quanta Battery' },
      { slug: 'amaron-home-inverter-battery', title: 'Amaron Home Inverter Battery' },
      { slug: 'ups-battery-replacement', title: 'UPS Battery Replacement' },
    ]
  },
  {
    id: 'exide-battery-distributor-in-bangalore',
    title: 'Exide Battery Distributor In Bangalore',
    items: [
      { slug: 'exide-smf-battery-in-chennai', title: 'Exide Smf Battery In Chennai' },
      { slug: 'exide-smf-battery-in-kerala', title: 'Exide Smf Battery In Kerala' },
      { slug: 'exide-home-inverter-battery', title: 'EXIDE HOME INVERTER BATTERY' },
      { slug: 'battery-manufacturers-in-bangalore', title: 'Battery Manufacturers in Bangalore' },
    ]
  },
  {
    id: 'amaron-quanta-batteries-chennai',
    title: 'Amaron Quanta Batteries Chennai',
    items: [
      { slug: 'amaron-quanta-batteries-kerala', title: 'Amaron Quanta Batteries Kerala' },
      { slug: 'amaron-quanta-batteries-hyderabad', title: 'Amaron Quanta Batteries Hyderabad' },
      { slug: 'exide-smf-battery-in-hyderabad', title: 'Exide Smf Battery In Hyderabad' },
    ]
  }
];

export const APPLIANCES_LIST = [
  { name: 'Desktop', watts: 150 },
  { name: 'Laptop', watts: 100 },
  { name: 'LED Bulb', watts: 15 },
  { name: 'Room Cooler', watts: 250 },
  { name: 'Refrigerator (upto 200L)', watts: 300 },
  { name: 'Gaming Console', watts: 2000 },
  { name: 'Washing Machine', watts: 1200 },
  { name: 'Television LED (upto 40")', watts: 40 },
  { name: 'Ceiling Fan', watts: 75 },
  { name: 'Juicer Mixer Grinder', watts: 800 },
  { name: 'Wi-Fi Router', watts: 10 },
  { name: 'Room Heater', watts: 1500 },
  { name: 'Microwave', watts: 1200 },
  { name: 'Coffee Maker', watts: 800 },
];

export const TROUBLESHOOTING_STEPS = [
  {
    step: 'Check Battery Connections',
    solution: 'Ensure that the terminals are clean and corrosion-free. Tighten loose connections if any.',
    details: 'Corrosion can prevent the battery from charging properly. Use a wire brush to clean the terminals. Also, ensure the battery cables are tightly connected to the terminals. Loose connections can cause the battery to intermittently lose power.'
  },
  {
    step: 'Check Battery Voltage',
    solution: 'Use a multimeter to check the battery\'s voltage. A fully charged 12V battery should read around 12.6 volts or higher.',
    details: 'If the battery voltage is lower than 12.6 volts, it indicates that the battery is discharged. In such a case, you need to charge the battery or check charger output.'
  },
  {
    step: 'Check Charging Voltage',
    solution: 'While the battery is being charged, the voltage across terminals should be between 13.7 to 14.7 volts.',
    details: 'If the charging voltage is not within this range, it suggests that there might be a problem with the internal charger, DC bus rectifier, or charging circuit.'
  },
  {
    step: 'Boost Charge',
    solution: 'If the battery is not holding charge, you might need to boost charge it at 13.8 - 14.2 volts.',
    details: 'A boost charge can help in case of a deeply discharged battery. However, remember to monitor the battery temperature during the boost charge process to prevent thermal runaway.'
  },
  {
    step: 'Check/Adjust Charger Settings',
    solution: 'Ensure that the charger settings match the battery requirements (SMF VRLA vs Tubular vs Lithium).',
    details: 'Different battery chemistries have different charging curves. Consult Livkam engineering team to set proper float and boost voltages for your battery bank.'
  }
];

export const INSTALLATION_STEPS = [
  {
    step: 1,
    title: 'Initial Assessment & Safety Check',
    desc: 'Our certified engineers evaluate the facility\'s electrical service board, earthing resistance, and load profile.',
    points: [
      'Evaluate existing UPS system and battery condition',
      'Check electrical connections and safety grounding protocols',
      'Assess power load requirements and runtime needs',
      'Verify compatibility of new batteries with your UPS model'
    ]
  },
  {
    step: 2,
    title: 'Site Preparation & Battery Rack Assembly',
    desc: 'Setting up dedicated, well-ventilated tiered powder-coated racks with acid-resistant insulation pads.',
    points: [
      'Position heavy duty powder-coated steel racks',
      'Ensure 100mm clearance for heat dissipation and convection',
      'Install battery disconnect switch and fast-acting DC fuses',
      'Place acid-resistant rubber containment mats'
    ]
  },
  {
    step: 3,
    title: 'Inter-Cell Link Cabling & Torque Calibration',
    desc: 'High-grade copper link busbars and insulated cables torqued to manufacturer specification.',
    points: [
      'Connect pure copper flexible links between battery posts',
      'Torque each terminal bolt with calibrated torque wrench (5.5 - 7.0 Nm)',
      'Apply anti-oxidant terminal petroleum jelly to eliminate sulfate build-up',
      'Number and label each battery cell sequentially'
    ]
  },
  {
    step: 4,
    title: 'Float Voltage Calibration & High-Rate Load Test',
    desc: 'Multi-meter string balance verification, charging current limit set, and simulated blackout load transfer.',
    points: [
      'Measure total DC string voltage and individual open-circuit voltages',
      'Configure UPS float (13.65V/cell) and equalize (14.1V/cell) parameters',
      'Perform live mains cut-off test to confirm 0 ms seamless transition',
      'Thermal scan of all electrical lugs under full continuous load'
    ]
  },
  {
    step: 5,
    title: 'Customer Handover, Commissioning Certificate & Warranty',
    desc: 'Formal commissioning report handover with stamped manufacturer warranty cards and SLA activation.',
    points: [
      'Deliver signed installation and testing compliance certificate',
      'Provide emergency bypass protocol and customer operator training',
      'Hand over official OEM warranty cards (Exide, Quanta, Amaron, Livkam)',
      'Activate 24/7 breakdown helpline registration for Bangalore'
    ]
  }
];

export const CATALOG_ENTRIES = {
  // ─── ONLINE UPS CATALOGS ──────────────────────────────────────────────────────────
  'ups-manufacturers-in-bangalore-peenya': {
    slug: 'ups-manufacturers-in-bangalore-peenya',
    type: 'online-ups',
    categoryName: 'UPS MANUFACTURER',
    title: 'UPS Manufacturers In Bangalore Peenya',
    banner: '/images/hero-desktop.png',
    heading: 'Ups Manufacturers In Bangalore Peenya - Livkam Power Technologies',
    subheading: 'ISO Certified High-Efficiency True Double-Conversion Online UPS Solutions for Heavy Industrial Machining, CNC, and CNC Automation in Peenya Industrial Area.',
    editorialContent: `Livkam Power Technologies is your trusted manufacturing and engineering partner for all your online UPS needs in Bangalore, Peenya Industrial Area. With over a decade of specialized expertise in designing and manufacturing high-efficiency, galvanically isolated UPS systems, we cater to a wide range of industries including BPO and IT call centers, CNC machining facilities, textile mills, pharmaceutical laboratories, and mission-critical government infrastructure.

Our commitment to engineering excellence and localized Bangalore service guarantees that every Online UPS manufactured by Livkam features pure DSP micro-controller processing, high-speed IGBT inverter stages, and ultra-low THD (< 2%), giving complete protection against surges, blackouts, frequency fluctuations, and utility brownouts.`,
    models: [
      { name: 'Livkam Industrial 10kVA - 30kVA', specs: '3P/3P or 3P/1P • High Frequency IGBT • Double Conversion', image: '/images/products/online-ups.jpg' },
      { name: 'Livkam Tower Series 1kVA - 6kVA', specs: '1P/1P • 0.99 Power Factor • Pure Sine Wave • Zero Transfer', image: '/images/products/small-backup.jpg' },
      { name: 'Livkam Modular 40kVA - 200kVA', specs: 'Hot-Swappable Power Modules • Redundant N+X • SCADA/SNMP', image: '/images/products/stabilizer.jpg' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    specsData: [
      { param: 'Rated Capacity', m1: '1 kVA / 0.9 kW', m2: '2 kVA / 1.8 kW', m3: '3 kVA / 2.7 kW', m4: '5 kVA / 4.5 kW', m5: '6 kVA / 5.4 kW' },
      { param: 'Topology / Control', m1: 'Online True Double-Conversion with DSP digital control across all models' },
      { param: 'Phase Configuration', m1: 'Single Phase In / Single Phase Out (1P/1P) or Three Phase In / Three Phase Out (3P/3P)' },
      { param: 'Input Voltage Window', m1: '110 VAC – 300 VAC at 50% load; 160 VAC – 300 VAC at 100% load' },
      { param: 'Output Power Factor', m1: '0.9 standard (Unity 1.0 optional for Data Centers)' },
      { param: 'Transfer Time', m1: '0 ms (Absolute Zero Transfer Time from Mains to Battery and vice versa)' },
      { param: 'Inverter Overload', m1: '110% for 10 min; 130% for 1 min; 150% for 200 ms with auto static bypass' }
    ],
    faqs: [
      { q: 'Why is Livkam considered a premier UPS manufacturer in Peenya Bangalore?', a: 'Livkam Power Technologies maintains dedicated testing facilities in Bengaluru, providing tailor-made galvanic isolation, robust tropicalized cooling, and guaranteed 4-hour on-site breakdown response across all Peenya industrial sectors.' },
      { q: 'Can Livkam Online UPS handle high inrush currents from CNC machines?', a: 'Yes. Our industrial online UPS systems are equipped with heavy-duty IGBT inverters and built-in isolation transformers capable of handling 300% instantaneous inductive inrush currents without dropping DC bus voltage.' },
      { q: 'Do you offer comprehensive on-site AMC for Peenya manufacturing plants?', a: 'Yes, we provide both non-comprehensive and comprehensive 24/7 Annual Maintenance Contracts (AMC) with standby replacement units and quarterly preventive maintenance checkups.' },
      { q: 'What is the delivery and commissioning timeline in Bangalore?', a: 'Standard capacities (1kVA to 30kVA) are available for same-day delivery and certified installation within 24 hours anywhere in Bengaluru.' },
      { q: 'Are your UPS systems compatible with diesel generator (DG) sets?', a: 'Yes, all Livkam online UPS feature a wide input frequency window (40Hz to 70Hz) with soft-walk-in generator compatibility.' }
    ]
  },

  'power-backup-solutions-for-office': {
    slug: 'power-backup-solutions-for-office',
    type: 'online-ups',
    categoryName: 'UPS MANUFACTURER',
    title: 'Power Backup Solutions for Office',
    banner: '/images/about-showcase.png',
    heading: 'Complete Enterprise Power Backup Solutions for Offices - Bengaluru',
    subheading: 'Zero-Downtime Power Protection for Server Rooms, Workstations, Cloud Terminals, and Corporate Network Infrastructure.',
    editorialContent: `Modern commercial offices in Bangalore depend on continuous high-speed connectivity, active VoIP lines, server infrastructure, and uninterrupted computer systems. A power fluctuation or sudden outage can result in unsaved project data loss, server reboot cycles, and hardware component degradation.

Livkam Power Technologies delivers turn-key office power backup architectures. From silent rack-mount UPS units for server racks to central floor-level 3-phase UPS distribution boards, our solutions keep your workforce fully productive without noticeable flicker or system reboot.`,
    models: [
      { name: 'Office Server Online UPS (3kVA - 10kVA)', specs: 'Rackmount 19-inch / Tower • Ultra-low acoustic noise (<45dB)', image: '/images/products/online-ups.jpg' },
      { name: 'Floor-Wide Distribution UPS (20kVA - 60kVA)', specs: 'Central 3-phase clean power conditioning for up to 150 PCs', image: '/images/products/stabilizer.jpg' },
      { name: 'Compact Workstation Backups (600VA - 2kVA)', specs: 'Line-interactive with AVR for CAD/graphic design workstations', image: '/images/products/small-backup.jpg' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    specsData: [
      { param: 'Power Capacity', m1: '3 kVA / 2.7 kW', m2: '6 kVA / 5.4 kW', m3: '10 kVA / 9 kW', m4: '20 kVA / 18 kW', m5: '40 kVA / 36 kW' },
      { param: 'Form Factor', m1: '19-inch Rackmount 2U/3U and Slim Floor Tower designs' },
      { param: 'Noise Level', m1: 'Acoustically dampened cooling fans: < 45 dBA at 1 meter' },
      { param: 'Network Management', m1: 'SNMP Web Card with auto graceful OS shutdown for Windows/Linux/VMware' },
      { param: 'Output Waveform', m1: 'Pure Sine Wave with < 2% THD (Total Harmonic Distortion)' }
    ],
    faqs: [
      { q: 'How much UPS capacity does a 50-person office in Bangalore need?', a: 'A typical 50-person workstation office with laptops, dual monitors, switches, and server requires a 10 kVA to 15 kVA Online UPS. Our engineers provide free on-site load audits to size the exact kVA.' },
      { q: 'Will the UPS fit in a standard 19-inch IT network rack?', a: 'Yes, our 1kVA, 2kVA, 3kVA, and 6kVA RT models feature convertible 2U rackmount brackets specifically designed for standard server racks.' },
      { q: 'Can the UPS safely shut down our servers during extended night blackouts?', a: 'Yes, our network SNMP cards send automated shutdown scripts over the LAN to gracefully save data on VMware, Windows Server, and Linux machines.' },
      { q: 'Do you offer weekend or after-hours installation for offices?', a: 'Yes, Livkam technicians regularly perform site cabling and UPS commissioning on weekends to avoid interrupting your active business hours.' },
      { q: 'What battery backup duration is recommended for office IT?', a: 'Most offices opt for 30 to 60 minutes of battery backup to bridge the gap until the building diesel generator turns on.' }
    ]
  },

  'eaton-online-ups': {
    slug: 'eaton-online-ups',
    type: 'online-ups',
    categoryName: 'UPS MANUFACTURER',
    title: 'Eaton online UPS',
    banner: '/images/hero-slide-2.png',
    heading: 'Authorized Eaton Online UPS Sales & Engineering Services - Bangalore',
    subheading: 'High-Density 9SX, 9PX, and 93E Series Eaton Online UPS with ABM Smart Battery Charging and Advanced Virtualization Integration.',
    editorialContent: `Eaton Online UPS systems are world-renowned for their unmatched energy efficiency, compact rack densities, and patented Advanced Battery Management (ABM) that extends battery service life by 50%. As authorized power partners in Bangalore, Livkam Power Technologies supplies factory-sealed Eaton units with full OEM warranty and factory-trained technical support.

Whether you require an Eaton 9SX for mission-critical edge servers or an Eaton 93E for commercial data rooms, Livkam provides seamless sizing, professional cabling, battery rack integration, and rapid on-site maintenance.`,
    models: [
      { name: 'Eaton 9SX Series (1kVA - 3kVA)', specs: 'Online Double Conversion • 0.9 PF • Graphical LCD Display', image: '/images/products/online-ups.jpg' },
      { name: 'Eaton 9PX Series (5kVA - 11kVA)', specs: 'Unity Power Factor (1.0) • Up to 94% online efficiency • Hot-swap', image: '/images/products/online-ups.jpg' },
      { name: 'Eaton 93E Series (15kVA - 80kVA)', specs: 'Double Conversion 3-phase • Internal batteries • Compact footprint', image: '/images/products/stabilizer.jpg' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    specsData: [
      { param: 'Eaton Series', m1: '9SX (1-3kVA)', m2: '9PX (5-11kVA)', m3: '93E (15-80kVA)' },
      { param: 'Efficiency', m1: 'Up to 95% in double-conversion mode; 98% in Energy Saver System (ESS)' },
      { param: 'Battery Management', m1: 'Patented ABM 3-stage charging technology doubles battery lifespan' },
      { param: 'Virtualization', m1: 'Integrates natively with VMware vCenter, Microsoft Hyper-V, and Nutanix' }
    ],
    faqs: [
      { q: 'Are your Eaton UPS units genuine and factory-sealed?', a: 'Yes, Livkam Power Technologies supplies 100% authentic, brand-new Eaton UPS units with serial number validation and official manufacturer warranty.' },
      { q: 'Can Eaton UPS batteries be hot-swapped while running?', a: 'Yes, the Eaton 9PX and 9SX series support hot-swappable battery modules without dropping power to connected equipment.' },
      { q: 'What is the warranty coverage on Eaton UPS?', a: 'Eaton systems come with a 2-year comprehensive on-site warranty covering both electronics and original internal battery packs.' },
      { q: 'Do you carry spare battery banks for Eaton systems in Bangalore?', a: 'Yes, we stock genuine external battery modules (EBM) and custom SMF battery banks in our Bengaluru facility for same-day dispatch.' },
      { q: 'Can Livkam service our existing Eaton UPS under AMC?', a: 'Yes, our certified service team provides comprehensive AMC, capacitor replacements, and firmware diagnostics for all Eaton models.' }
    ]
  },

  'smart-online-ups': {
    slug: 'smart-online-ups',
    type: 'online-ups',
    categoryName: 'APC UPS',
    title: 'Smart Online UPS',
    banner: '/images/hero-slide-3.png',
    heading: 'APC Smart-UPS On-Line Systems (1kVA to 20kVA) - Livkam Bangalore',
    subheading: 'High-Density Double-Conversion Power Protection with Embedded SmartConnect Cloud Monitoring and Scalable Runtime.',
    editorialContent: `APC by Schneider Electric Smart-UPS On-Line provides high-density, double-conversion power protection for medical laboratories, data networks, and industrial manufacturing plants. Featuring scalable runtime with external battery packs and SmartSlot accessories, APC Smart-UPS On-Line is the global benchmark for enterprise reliability.

Livkam Power Technologies is an authorized supplier and certified service partner in Karnataka, stocking the complete SRT and SURT product lines with professional commissioning and prompt warranty execution.`,
    models: [
      { name: 'APC SRT 1000VA - 3000VA', specs: 'SRT1000XLI / SRT3000XLI • Unity PF • Embedded SmartConnect', image: '/images/products/online-ups.jpg' },
      { name: 'APC SRT 5kVA - 10kVA', specs: 'SRT5KXLI / SRT10KXLI • Hardwire / IEC • Parallel Redundancy', image: '/images/products/online-ups.jpg' },
      { name: 'APC SURTD 15kVA - 20kVA', specs: 'SURTD15KUXI • 3:1 / 3:3 Phase • External Battery Bank Ready', image: '/images/products/stabilizer.jpg' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    specsData: [
      { param: 'APC Model', m1: 'SRT1000XLI', m2: 'SRT2200XLI', m3: 'SRT3000XLI', m4: 'SRT5KXLI', m5: 'SRT10KXLI' },
      { param: 'Power Capacity', m1: '1000W / 1kVA', m2: '1980W / 2.2kVA', m3: '2700W / 3kVA', m4: '4500W / 5kVA', m5: '10000W / 10kVA' },
      { param: 'Output Connections', m1: 'IEC 320 C13, IEC 320 C19, and Hardwire Terminal Blocks' },
      { param: 'Display', m1: 'Multi-function LCD status and control console with intuitive navigation keys' }
    ],
    faqs: [
      { q: 'What is the benefit of APC SmartConnect?', a: 'APC SmartConnect allows you to view the health and status of your UPS through a secure web portal with automatic firmware updates and battery life alerts.' },
      { q: 'How many external battery packs can be connected to APC SRT UPS?', a: 'You can connect up to 10 external battery packs (SRT192BP2 / SRT96BP) to achieve multiple hours of continuous full-load runtime.' },
      { q: 'Does Livkam provide genuine APC replacement battery cartridges (RBC)?', a: 'Yes, we stock OEM APC RBC battery kits and certified heavy-duty external SMF battery banks in Bangalore.' },
      { q: 'Can this UPS run on single phase and three phase?', a: 'The APC SRT 5kVA to 10kVA units feature convertible 1:1 single-phase or 3:1 three-phase electrical input configurations.' },
      { q: 'What is the on-site warranty support procedure in Bengaluru?', a: 'Livkam handles priority on-site support across Bengaluru with doorstep engineer inspection within 4 hours.' }
    ]
  },

  'vertiv-industrial-ups': {
    slug: 'vertiv-industrial-ups',
    type: 'online-ups',
    categoryName: 'VERTIV ONLINE UPS',
    title: 'Vertiv Industrial UPS',
    banner: '/images/about-showcase.png',
    heading: 'Vertiv Liebert Industrial Online UPS (10kVA - 200kVA) - Bangalore',
    subheading: 'Heavy-Duty Liebert GXT5, ITA2, and EXM Series for Medical Diagnostics, Industrial CNC, and Critical Facilities.',
    editorialContent: `Vertiv Liebert Online UPS systems deliver high availability and resilient power architecture engineered for challenging electrical environments. With wide input tolerances, compact footprint, unity power factor, and intelligent battery health diagnostics, Vertiv Liebert protects sensitive diagnostic scanners (MRI/CT), industrial robotics, and modern data halls.

Livkam Power Technologies provides end-to-end solutions for Vertiv Liebert systems in South India, including supply, battery bank assembly, commissioning, and AMC maintenance contracts.`,
    models: [
      { name: 'Liebert GXT5 (1kVA - 10kVA)', specs: 'Unity PF • Rack/Tower Convertible • Integrated Maintenance Bypass', image: '/images/products/online-ups.jpg' },
      { name: 'Liebert ITA2 (10kVA - 30kVA)', specs: '3:3 Phase • Up to 96% Efficiency • High Ambient Operating (0-50°C)', image: '/images/products/online-ups.jpg' },
      { name: 'Liebert EXM (40kVA - 200kVA)', specs: 'Modular Scalable Architecture • Touchscreen Display • Native Li-ion Ready', image: '/images/products/stabilizer.jpg' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    specsData: [
      { param: 'Liebert Series', m1: 'GXT5 (1-10kVA)', m2: 'ITA2 (10-30kVA)', m3: 'EXM (40-200kVA)' },
      { param: 'Power Factor', m1: 'Unity (kVA = kW across all models for maximum active load capacity)' },
      { param: 'Operating Temp', m1: 'Full power delivery up to 40°C without derating (up to 50°C derated)' },
      { param: 'Isolation', m1: 'Optional built-in Galvanic Isolation Transformer for zero neutral noise' }
    ],
    faqs: [
      { q: 'Why is Vertiv Liebert preferred for hospitals and CT/MRI scanners?', a: 'Vertiv Liebert systems provide galvanic isolation and ultra-low THD (<1.5%), shielding sensitive imaging tubes from line harmonics and RF noise.' },
      { q: 'Can Vertiv UPS be connected to Lithium LiFePO4 battery banks?', a: 'Yes, the Liebert ITA2 and EXM series feature certified firmware algorithms designed for high-rate Lithium battery cabinets.' },
      { q: 'What is the typical lifespan of a Vertiv Liebert UPS?', a: 'Vertiv industrial systems are engineered for a design lifespan of 10 to 15 years with periodic capacitor and fan replacements.' },
      { q: 'Does Livkam offer emergency breakdown service for Liebert UPS in Karnataka?', a: 'Yes, our emergency squad is available 24/7 with authentic OEM replacement PCBs, IGBT modules, and loaner standby systems.' },
      { q: 'What certifications do Vertiv UPS systems carry?', a: 'Vertiv Liebert systems are CE, UL 1778, RoHS, and BIS certified for industrial installation across India.' }
    ]
  },

  'isolation-transformers': {
    slug: 'isolation-transformers',
    type: 'online-ups',
    categoryName: 'Isolation Transformers',
    title: 'Ultra-Isolation Transformers',
    banner: '/images/hero-desktop.png',
    heading: 'Ultra-Isolation Transformers & Harmonic Filters (1kVA to 500kVA) - Bangalore',
    subheading: 'Galvanic Isolation, Common-Mode Noise Attenuation (>120dB), and True Neutral Generation for Sensitive Medical & Industrial Equipment.',
    editorialContent: `An Ultra-Isolation Transformer provides total galvanic separation between commercial utility power and sensitive connected loads. By decoupling the output from the electrical input, it completely prevents common-mode noise, neutral-to-ground voltage drift, and dangerous high-energy lightning transients from reaching your high-precision instruments.

Livkam Power Technologies custom-engineers copper-wound and aluminum-wound isolation transformers in Bangalore, incorporating double copper Faraday electrostatic shielding and Class H insulation.`,
    models: [
      { name: 'Medical Grade Isolation Transformer', specs: 'Leakage < 100uA • Electrostatic Faraday Shield • Low Noise', image: '/images/products/stabilizer.jpg' },
      { name: 'Industrial CNC Isolation Transformer', specs: '3P/3P 415V • Delta-Wye Vector • High Inrush Overload Capacity', image: '/images/products/stabilizer.jpg' },
      { name: 'Data Center K-Factor Transformer', specs: 'K-13 / K-20 rated • Mitigates triplen harmonics from server PSUs', image: '/images/products/online-ups.jpg' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    specsData: [
      { param: 'Power Capacity', m1: '1 kVA to 500 kVA (Custom engineered per site specification)' },
      { param: 'Noise Attenuation', m1: 'Common Mode: > 120 dB; Transverse Mode: > 60 dB' },
      { param: 'Insulation Class', m1: 'Class H (180°C) with vacuum pressure impregnation (VPI)' },
      { param: 'Inter-Winding Capacitance', m1: '< 0.005 pF between primary and secondary windings' }
    ],
    faqs: [
      { q: 'Why do MRI and CNC machines require an isolation transformer?', a: 'Sensitive instruments can malfunction or burn motherboards if neutral-to-earth voltage exceeds 1-2V. An isolation transformer creates a clean, local zero-reference neutral ground.' },
      { q: 'Can an isolation transformer be used together with an Online UPS?', a: 'Yes, installing an isolation transformer at the input or output of the UPS provides the ultimate dual protection against both power cuts and grid surges.' },
      { q: 'What is the difference between copper and aluminum wound transformers?', a: 'Copper winding offers lower resistance, higher electrical efficiency, and more compact physical dimensions, making it the preferred choice for medical and data center applications.' },
      { q: 'Do you manufacture custom input/output voltages (e.g. 110V US or 415V Indian)?', a: 'Yes, Livkam engineers step-down, step-up, and multi-tap transformers tailored to imported Japanese, European, or US industrial equipment.' },
      { q: 'Where are Livkam isolation transformers manufactured?', a: 'They are precision-wound, tested, and assembled at our facilities in Bengaluru, Karnataka.' }
    ]
  },

  // ─── BATTERIES CATALOGS ──────────────────────────────────────────────────────────
  'amaron-quanta-battery': {
    slug: 'amaron-quanta-battery',
    type: 'batteries',
    categoryName: 'Amaron Battery Wholesale Distributor',
    title: 'Amaron Quanta Battery',
    banner: '/images/products/smf-battery.jpg',
    heading: 'Amaron Quanta Battery Wholesale Distributor in Bangalore - Livkam',
    subheading: 'Official Wholesale Stockist of Amaron Quanta 12V SMF VRLA Batteries (26Ah, 42Ah, 65Ah, 84Ah, 100Ah, 120Ah, 150Ah, 200Ah) with Pan-India Dispatch.',
    editorialContent: `Choose Livkam Power Technologies as your authorized Amaron Quanta Battery Wholesale Distributor and enjoy factory-direct pricing, 100% genuine fresh-manufacturing date stock, and comprehensive installation services across Bangalore and South India.

Amaron Quanta batteries, manufactured by Amara Raja Batteries Limited in technical collaboration with Johnson Controls, are the undisputed market leader in standby power. Featuring patented Radgrid technology and heavy-duty lead-calcium-tin alloy grids, Quanta batteries provide superior discharge performance, high thermal tolerance, and proven service life of 4 to 6 years.

Livkam Power Technologies maintains ready warehouse stock in Bengaluru, supplying corporate offices, data center server banks, hospitals, and electrical contractors with rapid same-day delivery and certified battery rack commissioning.`,
    models: [
      { name: 'Amaron Quanta 12V 26Ah - 65Ah', specs: '12AL026 / 12AL042 / 12AL065 • Compact AGM VRLA • 36M Warranty', image: '/images/products/smf-battery.jpg' },
      { name: 'Amaron Quanta 12V 84Ah - 120Ah', specs: '12AL084 / 12AL100 / 12AL120 • Medium Bank Standby • Heavy Duty', image: '/images/products/smf-battery.jpg' },
      { name: 'Amaron Quanta 12V 150Ah - 200Ah', specs: '12AL150 / 12AL200 • High-Rate Discharge • Data Center Grade', image: '/images/products/smf-battery.jpg' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    specsData: [
      { param: 'Quanta Model', m1: '12AL026 (26Ah)', m2: '12AL065 (65Ah)', m3: '12AL100 (100Ah)', m4: '12AL150 (150Ah)', m5: '12AL200 (200Ah)' },
      { param: 'Nominal Voltage', m1: '12 Volts DC across all models' },
      { param: 'Design Life', m1: '10 years float life at 27°C (4 to 6 years operational service life)' },
      { param: 'Grid Alloy', m1: 'Patented heavy-duty Lead-Calcium-Silver-Tin Radgrid formulation' },
      { param: 'Internal Resistance', m1: '< 4.0 mΩ for instantaneous high-rate current discharge' },
      { param: 'Self Discharge', m1: 'Extremely low: < 2% per month at 25°C storage temperature' }
    ],
    faqs: [
      { q: 'Is Amaron Quanta battery good for Online UPS applications?', a: 'Yes, Amaron Quanta is the number one choice for enterprise Online UPS in India. Its Radgrid design delivers higher current per plate, excellent recovery from deep discharge, and robust resistance to thermal dry-out.' },
      { q: 'How long does an Amaron Quanta SMF battery last?', a: 'Under normal operating conditions and controlled ambient room temperature (25°C), Amaron Quanta batteries typically last 4 to 6 years.' },
      { q: 'What is the price of an Amaron Quanta 12V 150Ah battery in Bangalore?', a: 'Wholesale prices for genuine fresh 12AL150 batteries range between INR 12,500 and INR 13,800 depending on volume and old scrap buyback exchange rebates. Contact Livkam for best contractor pricing.' },
      { q: 'Do you offer scrap battery buyback rebates on old battery banks?', a: 'Yes! Livkam offers top market scrap buyback credits for your spent lead-acid and SMF batteries, compliant with pollution control environmental standards.' },
      { q: 'Are your batteries supplied with fresh manufacturing date codes?', a: 'Every battery dispatched by Livkam is guaranteed factory-fresh with transparent month and year stamped on the terminal covers.' }
    ]
  },

  'exide-smf-battery-in-chennai': {
    slug: 'exide-smf-battery-in-chennai',
    type: 'batteries',
    categoryName: 'Exide Battery Distributor In Bangalore',
    title: 'Exide Smf Battery',
    banner: '/images/products/tubular-battery.jpg',
    heading: 'Exide Powersafe Plus SMF VRLA Batteries - Wholesale Distribution',
    subheading: 'Heavy-Duty Sealed Maintenance Free Batteries (7Ah to 200Ah) with AGM Technology and High-Rate Reliability for Critical Infrastructure.',
    editorialContent: `Exide Powersafe Plus is the trusted sealed maintenance-free lead acid battery from India\'s premier battery manufacturer, Exide Industries. Engineered with high-integrity Absorbed Glass Mat (AGM) separators and computerized grid casting, Exide SMF batteries deliver unmatched power reliability across telecom exchanges, data hubs, medical monitors, and enterprise UPS setups.

Livkam Power Technologies distributes the full line of Exide Powersafe Plus batteries with direct doorstep delivery, professional string cabling, and warranty support.`,
    models: [
      { name: 'Exide Powersafe 7Ah - 18Ah', specs: 'EP 7-12 / EP 12-12 / EP 18-12 • Compact UPS & Fire Alarm Backup', image: '/images/products/small-backup.jpg' },
      { name: 'Exide Powersafe 26Ah - 65Ah', specs: 'EP 26-12 / EP 42-12 / EP 65-12 • Standard 3-Phase Online UPS Banks', image: '/images/products/smf-battery.jpg' },
      { name: 'Exide Powersafe 100Ah - 200Ah', specs: 'EP 100-12 / EP 150-12 / EP 200-12 • Heavy Industrial Duty Standby', image: '/images/products/tubular-battery.jpg' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    specsData: [
      { param: 'Exide Model', m1: 'EP 26-12', m2: 'EP 42-12', m3: 'EP 65-12', m4: 'EP 100-12', m5: 'EP 150-12' },
      { param: 'Capacity (Ah @ C20)', m1: '26 Ah', m2: '42 Ah', m3: '65 Ah', m4: '100 Ah', m5: '150 Ah' },
      { param: 'Terminal Type', m1: 'L-terminal with brass insert for minimal connection resistance' },
      { param: 'Container Material', m1: 'Flame-retardant ABS / Polypropylene plastic' }
    ],
    faqs: [
      { q: 'What is the warranty period for Exide Powersafe SMF batteries?', a: 'Exide Powersafe Plus batteries come with an official 24-month comprehensive replacement warranty directly backed by Exide service centers.' },
      { q: 'Can Exide SMF batteries be installed in any orientation?', a: 'Yes, because the electrolyte is fully absorbed in AGM separators and the cells are valve-regulated, they can be mounted horizontally or vertically without leaking.' },
      { q: 'What is the difference between Exide Powersafe and Tubular batteries?', a: 'Powersafe SMF batteries are sealed and require zero water topping, making them ideal for indoor server rooms, whereas Tubular batteries are flooded and best suited for home inverters with high cycle life.' },
      { q: 'How do I know when my Exide battery bank needs replacement?', a: 'Signs include diminished backup duration, battery container swelling, terminal voltage dropping below 11V under load, or high internal impedance.' },
      { q: 'Does Livkam provide battery impedance and conductance testing?', a: 'Yes, we provide digital internal resistance (IR) and conductance testing with itemized health reports on every battery cell.' }
    ]
  },

  'ups-battery-replacement': {
    slug: 'ups-battery-replacement',
    type: 'batteries',
    categoryName: 'Amaron Battery Wholesale Distributor',
    title: 'UPS Battery Replacement',
    banner: '/images/services/battery-service.jpg',
    heading: 'Professional UPS Battery Replacement & String Upgrades - Bangalore',
    subheading: 'Turnkey Replacement for Dead or Weak Battery Banks with Safe Removal, Free Old Battery Buyback Rebate, and 4-Hour On-Site Service.',
    editorialContent: `When an existing UPS battery bank reaches the end of its operational lifecycle, backup runtime drops drastically, putting your enterprise at serious risk during a power cut. Faulty or bulged batteries can even damage internal UPS charging rectifiers or cause thermal runaway.

Livkam Power Technologies provides turnkey UPS battery replacement across Bengaluru. Our certified field engineers arrive on-site, test individual battery voltages and internal impedance, safely disconnect the old bank, assemble brand-new factory-sealed battery modules with heavy-duty copper links, and calibrate the UPS charging parameters for maximum lifespan.`,
    models: [
      { name: '1kVA - 3kVA UPS Battery Swap', specs: '36V / 72V / 96V DC Bus • 26Ah - 42Ah SMF Replacement in 2 Hours', image: '/images/products/smf-battery.jpg' },
      { name: '5kVA - 10kVA UPS Battery Bank', specs: '192V / 240V DC Bus • 16-20 Batteries • Tiered Racks & Copper Busbars', image: '/images/products/smf-battery.jpg' },
      { name: '20kVA - 60kVA High Capacity Upgrade', specs: '384V DC Bus • 32-64 Batteries • Heavy Duty Industrial Installation', image: '/images/products/tubular-battery.jpg' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    specsData: [
      { param: 'Turnaround Time', m1: '2 to 4 Hours emergency dispatch across Bengaluru commercial zones' },
      { param: 'Supported Brands', m1: 'Amaron Quanta, Exide Powersafe, Rocket, HBL, Livguard, Panasonic' },
      { param: 'Scrap Rebate', m1: 'Instant cash discount credited against your new battery purchase invoice' },
      { param: 'Testing Included', m1: 'Pre-dispatch OCV check, inter-cell resistance, and simulated load test' }
    ],
    faqs: [
      { q: 'Can I replace only one bad battery in a 16-battery string?', a: 'We strongly advise replacing the entire string together. Mixing new and degraded batteries causes voltage imbalance, causing the new battery to be overcharged and degraded rapidly.' },
      { q: 'How much do you pay for old scrap UPS batteries in Bangalore?', a: 'Old scrap lead-acid batteries fetch significant market rebates based on their Ah rating (ranging from ₹400 for a 26Ah battery up to ₹2,800+ for a 150Ah battery).' },
      { q: 'Will our critical servers experience downtime during battery replacement?', a: 'No. Our engineers can perform hot-swapping or power the server load via external bypass or a temporary standby loaner UPS during the battery installation.' },
      { q: 'Do you dispose of old batteries in an environmentally certified manner?', a: 'Yes, Livkam adheres strictly to the Battery Waste Management Rules, sending all spent batteries to authorized smelters for eco-friendly recycling.' },
      { q: 'How do I book an emergency battery replacement?', a: 'Call our 24/7 hotline at +91 8884988990 or message us on WhatsApp for instantaneous dispatch.' }
    ]
  }
};

// Helper function to get or generate catalog entry for any slug
export function getCatalogEntry(slug, type = 'online-ups') {
  const safeSlug = slug || (type === 'batteries' ? 'amaron-quanta-battery' : 'online-ups-systems');
  if (CATALOG_ENTRIES[safeSlug]) {
    return CATALOG_ENTRIES[safeSlug];
  }

  // Generate dynamic, realistic, highly detailed fallback entry based on slug
  const title = safeSlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const isBattery = type === 'batteries' || safeSlug.includes('battery') || safeSlug.includes('quanta') || safeSlug.includes('exide') || safeSlug.includes('amaron');

  return {
    slug: safeSlug,
    type: isBattery ? 'batteries' : 'online-ups',
    categoryName: isBattery ? 'BATTERIES & STORAGE' : 'ONLINE UPS SYSTEMS',
    title: title,
    banner: isBattery ? '/images/products/tubular-battery.jpg' : '/images/hero-desktop.png',
    heading: `${title} - Livkam Power Technologies`,
    subheading: `Certified High-Performance ${isBattery ? 'Industrial Battery Solutions' : 'Pure Sine Wave Double-Conversion Online UPS Systems'} in Bengaluru, Karnataka.`,
    editorialContent: `Livkam Power Technologies provides state-of-the-art power protection and storage solutions engineered for modern commercial, medical, and industrial infrastructure. Our ${title} solutions ensure complete electrical isolation, zero transfer time, and reliable backup continuity across South India.

With full OEM authorized partnerships covering APC by Schneider Electric, Vertiv Liebert, Delta, Numeric, Exide, and Amaron Quanta, Livkam guarantees 100% genuine factory-sealed equipment backed by over a decade of certified field engineering expertise.`,
    models: isBattery ? [
      { name: 'Amaron Quanta 12V 100Ah - 150Ah', specs: 'Radgrid Technology • AGM VRLA • 36M Warranty', image: '/images/products/smf-battery.jpg' },
      { name: 'Exide Powersafe Plus 12V 65Ah - 120Ah', specs: 'Heavy Duty Standby • Low Self Discharge • High Rate', image: '/images/products/tubular-battery.jpg' },
      { name: 'Livkam Lithium LiFePO4 Energy Bank', specs: '5000+ Cycle Life • Smart BMS • 1-Hour Fast Recharge', image: '/images/products/lithium-ups.jpg' }
    ] : [
      { name: `${title} 1kVA - 3kVA`, specs: '1P/1P • Pure Sine Wave • True Double Conversion • 0 ms Transfer', image: '/images/products/online-ups.jpg' },
      { name: `${title} 5kVA - 10kVA`, specs: '1P/1P or 3P/1P • High Frequency IGBT • LCD Console', image: '/images/products/small-backup.jpg' },
      { name: `${title} 20kVA - 60kVA`, specs: '3P/3P Industrial • Galvanic Isolation • SNMP Remote Control', image: '/images/products/stabilizer.jpg' }
    ],
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    specsData: isBattery ? [
      { param: 'Nominal Voltage', m1: '12 Volts DC standard cell rating' },
      { param: 'Chemistry Options', m1: 'SMF VRLA (AGM), Tall Tubular Deep Cycle, or LiFePO4 Lithium' },
      { param: 'Design Life', m1: '4 to 6 Years operational service life under 27°C float' },
      { param: 'Warranty', m1: '24 to 48 Months comprehensive on-site warranty' }
    ] : [
      { param: 'Capacity Range', m1: '1 kVA to 120 kVA (Single & Three Phase)' },
      { param: 'Topology', m1: 'Online True Double-Conversion with DSP microcontroller' },
      { param: 'Transfer Time', m1: '0 ms (Zero millisecond transfer to battery and bypass)' },
      { param: 'Power Factor', m1: '0.9 standard (Unity 1.0 optional for Data Centers)' }
    ],
    faqs: [
      { q: `What makes Livkam ${title} reliable for commercial facilities?`, a: `Livkam Power Technologies delivers authenticated OEM equipment, single-line power safety audits, and guaranteed 4-hour breakdown response across Bengaluru and Karnataka.` },
      { q: `Can we schedule a free on-site power assessment?`, a: `Yes! Our certified engineers provide complimentary on-site load inspections and battery impedance testing throughout Bangalore.` },
      { q: `What is the warranty coverage?`, a: `All systems come with official manufacturer warranty and priority local support from our Bengaluru service hub.` },
      { q: `Do you provide standby loaner units during major overhauls?`, a: `Yes, for critical mission loads like hospitals and data servers, we maintain loaner standby units to ensure zero downtime.` },
      { q: `How can I request an itemized quotation?`, a: `You can submit the quotation form below or call our senior engineer directly at +91 8884988990.` }
    ]
  };
}
