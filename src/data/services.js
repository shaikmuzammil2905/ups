// Comprehensive Services & Categories Data for Livkam Power Technologies
// Matches Image Copy 70 through 79:
// 8 Categories with flyout sub-catalogues, detailed range lists, grand level benefits, and photo representations.

export const SERVICE_CATEGORIES = [
  {
    id: 'apc-ups-amc-service',
    title: 'APC UPS AMC SERVICE',
    catalogues: [
      { slug: 'apc-ups-service', title: 'APC UPS SERVICE' }
    ]
  },
  {
    id: 'emerson-ups-service',
    title: 'EMERSON UPS SERVICE',
    catalogues: [
      { slug: 'emerson-vertiv-ups-amc-services', title: 'EMERSON VERTIV UPS AMC SERVICES' }
    ]
  },
  {
    id: 'delta-ups-repair-services',
    title: 'DELTA UPS REPAIR SERVICES',
    catalogues: [
      { slug: 'delta-ups-amc-service', title: 'DELTA UPS AMC SERVICE' }
    ]
  },
  {
    id: 'microtek-ups-service',
    title: 'MICROTEK UPS SERVICE',
    catalogues: [
      { slug: 'microtek-inverter-repair', title: 'Microtek Inverter Repair' },
      { slug: 'microtek-ups-amc-services', title: 'MICROTEK UPS AMC SERVICES' }
    ]
  },
  {
    id: 'eaton-amc-services',
    title: 'EATON AMC SERVICES',
    catalogues: [
      { slug: 'eaton-ups-repair-services', title: 'EATON UPS REPAIR SERVICES' }
    ]
  },
  {
    id: 'numeric-ups-service',
    title: 'NUMERIC UPS SERVICE',
    catalogues: [
      { slug: 'ups-service-in-bangalore', title: 'UPS SERVICE IN BANAGALOR' },
      { slug: 'numeric-ups-amc-service', title: 'NUMERIC UPS AMC SERVICE' }
    ]
  },
  {
    id: 'ups-amc-services',
    title: 'UPS AMC Services',
    catalogues: [
      { slug: 'ups-service-center-near-you', title: 'UPS SERVICE CENTER NEAR YOU' },
      { slug: 'online-ups-services', title: 'Online UPS Services' }
    ]
  },
  {
    id: 'online-ups-service-in-chennai',
    title: 'Online UPS Service in Chennai',
    catalogues: [
      { slug: 'ups-service-in-hyderabad', title: 'Ups Service In Hyderabad' },
      { slug: 'ups-services-in-kerala', title: 'Ups Services in Kerala' }
    ]
  }
];

export const services = [
  // 1. APC UPS SERVICE (Image Copy 70, 78, 79)
  {
    id: 'apc-ups-service',
    slug: 'apc-ups-service',
    title: 'APC UPS Service',
    category: 'APC UPS AMC SERVICE',
    categoryId: 'apc-ups-amc-service',
    badge: 'Authorized Specialist',
    priceStartsAt: '₹ 1,499',
    turnaround: 'Same Day / 2 - 4 Hrs',
    icon: 'ShieldCheck',
    banner: '/images/services/apc-service-cabinets.jpg',
    image: '/images/services/apc-service-cabinets.jpg',
    imageUrl: '/images/services/apc-service-cabinets.jpg',
    shortDesc: 'Livkam Power Technologies is your go-to source for comprehensive APC UPS services. Our team of experienced professionals is dedicated to providing reliable and efficient solutions for your APC UPS systems, ensuring optimal performance and minimal downtime.',
    introduction: 'Livkam Power Technologies is your go-to source for comprehensive APC UPS services. Our team of experienced professionals is dedicated to providing reliable and efficient solutions for your APC UPS systems, ensuring optimal performance and minimal downtime.',
    rangeHeading: 'Our Comprehensive Range of APC UPS Services',
    rangeSubheading: 'Our extensive APC UPS services include:',
    rangeItems: [
      'APC UPS installation and setup, ensuring your systems are correctly configured for optimal performance.',
      'Regular preventive maintenance to keep your APC UPS systems running smoothly and efficiently.',
      'Troubleshooting and repair services to address any issues or breakdowns promptly.',
      'System upgrades and replacements to enhance the efficiency and reliability of your APC UPS infrastructure.',
      'Expert consultation and advice on power management solutions tailored to your business needs.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for APC UPS Services',
    benefitsSubheading: 'Choosing Livkam Power Technologies for your APC ONLINE UPS services offers several benefits, such as:',
    benefitsItems: [
      'Access to a team of experienced professionals with in-depth knowledge of APC UPS systems.',
      'Reliable and efficient solutions to minimize downtime and disruptions for your business.',
      'Competitive pricing for top-quality UPS services.',
      'Responsive customer support, ensuring your concerns are promptly addressed.',
      'A commitment to maintaining the highest standards of service and satisfaction.'
    ],
    features: [
      'APC Smart-UPS, Symmetra & Easy UPS certified engineers',
      'Original Schneider Electric OEM spare parts & battery cartridges',
      'Annual Maintenance Contracts (AMC) with guaranteed SLA',
      'Doorstep diagnostic testing across Bengaluru & South India'
    ],
    display_order: 1,
    is_published: true
  },

  // 2. EMERSON VERTIV UPS AMC SERVICES (Image Copy 71)
  {
    id: 'emerson-vertiv-ups-amc-services',
    slug: 'emerson-vertiv-ups-amc-services',
    title: 'Emerson Vertiv UPS AMC Services',
    category: 'EMERSON UPS SERVICE',
    categoryId: 'emerson-ups-service',
    badge: 'Enterprise SLA',
    priceStartsAt: 'Custom Enterprise Quote',
    turnaround: 'Guaranteed 4-Hr SLA',
    icon: 'Server',
    banner: '/images/services/vertiv-service-ups.jpg',
    image: '/images/services/vertiv-service-ups.jpg',
    imageUrl: '/images/services/vertiv-service-ups.jpg',
    shortDesc: 'Livkam Power Technologies delivers premier Emerson and Vertiv Liebert UPS AMC services and maintenance across corporate, data center, and hospital power facilities.',
    introduction: 'Livkam Power Technologies is your premier engineering partner for Emerson and Vertiv Liebert UPS maintenance and comprehensive AMC contracts.',
    rangeHeading: 'Our Comprehensive Range of Emerson Vertiv UPS Services',
    rangeSubheading: 'Our extensive Emerson and Vertiv Liebert UPS services include:',
    rangeItems: [
      'Emerson Liebert Hipulse, APM, and ITA UPS comprehensive electrical commissioning and installation.',
      'Routine quarterly preventive maintenance audits with full thermal infrared scanning.',
      'DC bus capacitor bank ripple analysis, cooling fan maintenance, and bypass static switch testing.',
      'Emergency component-level motherboard and IGBT rectifier bridge troubleshooting and repairs.',
      'Tailored Comprehensive and Non-Comprehensive Annual Maintenance Contracts with prioritized response.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for Emerson Vertiv UPS Services',
    benefitsSubheading: 'Choosing Livkam Power Technologies for Emerson & Vertiv services provides your enterprise with:',
    benefitsItems: [
      'Engineers trained specifically on Vertiv Liebert power protection architectures.',
      'Guaranteed 4-hour emergency turnaround SLA to minimize any business disruption.',
      'Access to 100% authentic Emerson and Vertiv OEM replacement components.',
      'Detailed power quality certification and annual performance logs.',
      'Predictable maintenance costs with zero unexpected diagnostic fees.'
    ],
    features: [
      'Dedicated support for Emerson Liebert APM, Hipulse & ITA series',
      'Thermal imaging inspection for early hotspot detection',
      'Battery conductance impedance testing included in AMC',
      '24/7 dedicated enterprise helpline and emergency mobile dispatch'
    ],
    display_order: 2,
    is_published: true
  },

  // 3. DELTA UPS AMC SERVICE (Image Copy 72)
  {
    id: 'delta-ups-amc-service',
    slug: 'delta-ups-amc-service',
    title: 'Delta UPS AMC Service',
    category: 'DELTA UPS REPAIR SERVICES',
    categoryId: 'delta-ups-repair-services',
    badge: 'High Efficiency',
    priceStartsAt: '₹ 999',
    turnaround: 'Same Day / 24 Hours',
    icon: 'Zap',
    banner: '/images/services/delta-eaton-ups.jpg',
    image: '/images/services/delta-eaton-ups.jpg',
    imageUrl: '/images/services/delta-eaton-ups.jpg',
    shortDesc: 'Specialized Delta UPS repair and AMC services by Livkam Power Technologies for Amplon, Ultron, and Modulon series UPS systems.',
    introduction: 'Livkam Power Technologies offers specialized Delta UPS AMC services and component-level repair solutions for Amplon, Ultron, and Modulon series UPS systems.',
    rangeHeading: 'Our Comprehensive Range of Delta UPS Services',
    rangeSubheading: 'Our extensive Delta UPS repair and maintenance offerings include:',
    rangeItems: [
      'Delta online UPS modular installation, bypass cabling, and multi-module synchronization.',
      'Scheduled preventive maintenance visits with internal dust purge and connector torque calibration.',
      'Troubleshooting and component repair for high-speed IGBT inverters and rectifier modules.',
      'Battery string health monitoring, individual cell replacement, and float charge calibration.',
      'Fast-track spare board replacement and modular hot-swap module servicing.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for Delta UPS Services',
    benefitsSubheading: 'Partnering with Livkam Power Technologies for Delta UPS support ensures:',
    benefitsItems: [
      'Deep domain expertise in Delta green energy and high-efficiency modular power systems.',
      'Zero downtime architecture support with fast standby/loaner unit provisioning.',
      'Competitive corporate and SME pricing for all AMC tiers.',
      'Round-the-clock priority customer service helpline and WhatsApp ticketing.',
      'Comprehensive repair warranties on all installed Delta electronic modules.'
    ],
    features: [
      'Certified on Delta Amplon (1kVA-10kVA) and Ultron (10kVA-400kVA)',
      'Rapid component-level PCB and gate drive repairs',
      'Quarterly scheduled preventive checkups',
      'Genuine factory-tested Delta spare parts'
    ],
    display_order: 3,
    is_published: true
  },

  // 4. MICROTEK INVERTER REPAIR (Image Copy 73)
  {
    id: 'microtek-inverter-repair',
    slug: 'microtek-inverter-repair',
    title: 'Microtek Inverter Repair',
    category: 'MICROTEK UPS SERVICE',
    categoryId: 'microtek-ups-service',
    badge: 'Quick Doorstep Fix',
    priceStartsAt: '₹ 499',
    turnaround: '2 - 3 Hours',
    icon: 'Wrench',
    banner: '/images/services/microtek-numeric-ups.jpg',
    image: '/images/services/microtek-numeric-ups.jpg',
    imageUrl: '/images/services/microtek-numeric-ups.jpg',
    shortDesc: 'Doorstep rapid Microtek inverter repair, PCB servicing, MOSFET replacement, and transformer rewinding by Livkam Power Technologies.',
    introduction: 'Fast, reliable Microtek inverter and home UPS repair services by Livkam Power Technologies, restoring power backup to your home and office in hours.',
    rangeHeading: 'Our Comprehensive Range of Microtek Inverter Repair Services',
    rangeSubheading: 'Our specialized Microtek inverter repair services include:',
    rangeItems: [
      'Microtek Pure Sine Wave and Square Wave inverter diagnostic troubleshooting and fault isolation.',
      'MOSFET power stage replacement, driver circuit rebuilding, and transformer repair.',
      'Overload buzzer alarm, low voltage cutoff, and battery charging failure resolution.',
      'Battery terminal desulfation, electrolyte top-up, and gravity calibration.',
      'Doorstep collection, bench testing, and re-installation services across Bengaluru.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for Microtek Inverter Repair',
    benefitsSubheading: 'Choosing Livkam Power Technologies for your Microtek inverter ensures:',
    benefitsItems: [
      'Certified repair specialists with extensive hands-on Microtek hardware experience.',
      '100% genuine Microtek replacement PCBs, relays, and heavy-duty transformers.',
      '90-day comprehensive service warranty on all repaired components.',
      'Affordable, upfront flat-rate pricing with zero hidden inspection fees.',
      'Prompt doorstep arrival anywhere in Bengaluru and Karnataka.'
    ],
    features: [
      'Same-day doorstep technician visits',
      'Repairs for Microtek Sinewave, Merlyn, and Heavy Duty models',
      'Digital load testing before customer handover',
      'Doorstep battery health checks included'
    ],
    display_order: 4,
    is_published: true
  },

  // 5. MICROTEK UPS AMC SERVICES (Image Copy 73)
  {
    id: 'microtek-ups-amc-services',
    slug: 'microtek-ups-amc-services',
    title: 'Microtek UPS AMC Services',
    category: 'MICROTEK UPS SERVICE',
    categoryId: 'microtek-ups-service',
    badge: 'Total Peace of Mind',
    priceStartsAt: '₹ 899 / Year',
    turnaround: 'Scheduled Quarterly Visits',
    icon: 'ShieldCheck',
    banner: '/images/services/microtek-numeric-ups.jpg',
    image: '/images/services/microtek-numeric-ups.jpg',
    imageUrl: '/images/services/microtek-numeric-ups.jpg',
    shortDesc: 'Annual maintenance contracts for Microtek line-interactive and online UPS units, keeping small offices, retail shops, and clinics powered without interruption.',
    introduction: 'Keep your Microtek UPS running year-round with Livkam Power Technologies’ comprehensive and non-comprehensive AMC maintenance contracts.',
    rangeHeading: 'Our Comprehensive Range of Microtek UPS AMC Services',
    rangeSubheading: 'Our annual Microtek UPS maintenance contracts include:',
    rangeItems: [
      'Scheduled preventive inspections covering internal electronics, capacitors, and cooling fans.',
      'Microcontroller calibration and battery charge float/boost voltage optimization.',
      'Periodic full-load battery backup duration testing to verify actual runtime.',
      'Priority emergency callouts with guaranteed technician dispatch during power outages.',
      'Comprehensive spare replacement options for all PCBs, switches, and wiring.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for Microtek AMC Services',
    benefitsSubheading: 'Signing an AMC with Livkam Power Technologies offers your business:',
    benefitsItems: [
      'Drastically reduced risk of sudden failure during grid power cuts.',
      'Prolonged operational life for both Microtek UPS units and attached batteries.',
      'Fixed low annual cost protecting your operational budget from surprise repair bills.',
      'Dedicated relationship engineer and instant WhatsApp support channel.',
      'Free loaner units provided if extensive workshop bench service is ever required.'
    ],
    features: [
      '4 quarterly preventive maintenance visits per year',
      'Unlimited emergency breakdown callout visits',
      'Battery health impedance audit included',
      'Applicable for Microtek Line-Interactive & Maxi Online UPS'
    ],
    display_order: 5,
    is_published: true
  },

  // 6. EATON UPS REPAIR SERVICES (Image Copy 74)
  {
    id: 'eaton-ups-repair-services',
    slug: 'eaton-ups-repair-services',
    title: 'Eaton UPS Repair Services',
    category: 'EATON AMC SERVICES',
    categoryId: 'eaton-amc-services',
    badge: 'Eaton Certified',
    priceStartsAt: '₹ 1,499',
    turnaround: 'Same Day / 24 Hours',
    icon: 'Cpu',
    banner: '/images/services/delta-eaton-ups.jpg',
    image: '/images/services/delta-eaton-ups.jpg',
    imageUrl: '/images/services/delta-eaton-ups.jpg',
    shortDesc: 'Component-level repair and AMC for Eaton 9E, 93E, 9395, and Powerware Online UPS series by certified engineers at Livkam Power Technologies.',
    introduction: 'Livkam Power Technologies delivers expert Eaton UPS repair and AMC services, handling 9E, 93E, 9395, and Powerware systems with precision engineering.',
    rangeHeading: 'Our Comprehensive Range of Eaton UPS Repair Services',
    rangeSubheading: 'Our extensive Eaton UPS repair capabilities include:',
    rangeItems: [
      'Eaton 9E, 93E, and 9395 industrial online UPS component diagnostic fault analysis.',
      'Advanced Battery Management (ABM) sensor testing and charging circuit recalibration.',
      'Replacement of high-voltage IGBT modules, rectifier diodes, and DC link capacitors.',
      'Firmware updates, event log extraction, and synchronization parameter tuning.',
      'Emergency breakdown service with mobile diagnostic instruments across Karnataka.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for Eaton UPS Services',
    benefitsSubheading: 'Choosing Livkam Power Technologies for Eaton UPS repair ensures:',
    benefitsItems: [
      'Specialized knowledge of Eaton proprietary power electronics and ABM battery management.',
      'Direct procurement of authentic Eaton OEM replacement parts and power modules.',
      'Rapid turnaround to safeguard continuous power for banking, health, and IT servers.',
      'Competitive transparent pricing with detailed inspection and handover reports.',
      'Post-repair load bank certification to prove 100% capacity readiness.'
    ],
    features: [
      'Support for Eaton 9E, 93E, 9355, 9395 and Powerware systems',
      'Genuine Eaton components with 90-day warranty',
      'Preventive capacitor aging assessment',
      'Emergency on-site response in 2-4 hours'
    ],
    display_order: 6,
    is_published: true
  },

  // 7. UPS SERVICE IN BANGALORE (Image Copy 75)
  {
    id: 'ups-service-in-bangalore',
    slug: 'ups-service-in-bangalore',
    title: 'UPS Service In Bangalore',
    category: 'NUMERIC UPS SERVICE',
    categoryId: 'numeric-ups-service',
    badge: 'Bengaluru No. 1',
    priceStartsAt: '₹ 499',
    turnaround: '2 Hours Doorstep',
    icon: 'MapPin',
    banner: '/images/services/microtek-numeric-ups.jpg',
    image: '/images/services/microtek-numeric-ups.jpg',
    imageUrl: '/images/services/microtek-numeric-ups.jpg',
    shortDesc: 'Bengaluru’s leading doorstep multi-brand UPS repair and maintenance network. Fast 2-hour dispatch across Peenya, Banashankari, Whitefield, Electronic City, and all zones.',
    introduction: 'Bengaluru’s most trusted UPS repair and maintenance service network by Livkam Power Technologies, providing doorstep technical support across the city.',
    rangeHeading: 'Our Comprehensive Range of UPS Services in Bangalore',
    rangeSubheading: 'Our Bengaluru citywide UPS service portfolio includes:',
    rangeItems: [
      'Doorstep mobile engineer visits covering all zones of Bengaluru within 2 hours of booking.',
      'Comprehensive repairs for APC, Vertiv, Delta, Numeric, Microtek, and Luminous UPS units.',
      'Doorstep battery replacement with free collection of old battery scrap at top buyback rates.',
      'Preventive maintenance contracts for homes, offices, schools, and industrial manufacturing plants.',
      'Turnkey electrical cabling, isolation transformer integration, and earthing audits.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for UPS Service in Bangalore',
    benefitsSubheading: 'Why Bengaluru residents and enterprises choose Livkam Power Technologies:',
    benefitsItems: [
      'Local Bengaluru headquarters in Banashankari and Vidyaranyapura warehouse for immediate parts dispatch.',
      'Over 8+ years of dedicated excellence with 5,000+ satisfied clients across Karnataka.',
      'Honest, transparent pricing with no hidden charges and free initial load assessments.',
      'Certified, verified, and courteous power technicians equipped with mobile testing kits.',
      '100% customer satisfaction guarantee with comprehensive service warranty on every job.'
    ],
    features: [
      'Average 2-hour response time in Bengaluru urban and industrial belts',
      'Multi-brand expertise under one single helpline',
      'Doorstep old battery buyback with instant cash rebate',
      'Emergency 24/7 hotline for critical facilities'
    ],
    display_order: 7,
    is_published: true
  },

  // 8. NUMERIC UPS AMC SERVICE (Image Copy 75)
  {
    id: 'numeric-ups-amc-service',
    slug: 'numeric-ups-amc-service',
    title: 'Numeric UPS AMC Service',
    category: 'NUMERIC UPS SERVICE',
    categoryId: 'numeric-ups-service',
    badge: 'Numeric Legrand Specialist',
    priceStartsAt: '₹ 1,199 / Year',
    turnaround: 'Scheduled Quarterly Visits',
    icon: 'Wrench',
    banner: '/images/services/microtek-numeric-ups.jpg',
    image: '/images/services/microtek-numeric-ups.jpg',
    imageUrl: '/images/services/microtek-numeric-ups.jpg',
    shortDesc: 'Annual maintenance contracts for Numeric Digital HP, Onfiniti, and HPI series online UPS systems across offices, banks, and production lines.',
    introduction: 'Keep your Numeric Digital HP, Onfiniti, and HPI series UPS systems at peak performance with Livkam Power Technologies tailored AMC service contracts.',
    rangeHeading: 'Our Comprehensive Range of Numeric UPS AMC Services',
    rangeSubheading: 'Our annual Numeric UPS maintenance agreements include:',
    rangeItems: [
      'Complete diagnostic inspections of Numeric single-phase and three-phase online UPS hardware.',
      'Thermal scanning, internal cleaning, and loose terminal re-torqueing.',
      'Battery bank cell impedance testing, conductance audits, and inter-battery link replacements.',
      'Fast resolution of Numeric fault codes, inverter overload trips, and bypass alerts.',
      'Priority dispatch with guaranteed response time SLAs for commercial and industrial clients.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for Numeric AMC Services',
    benefitsSubheading: 'Enjoy dependable uninterrupted power with our Numeric AMC contracts:',
    benefitsItems: [
      'Extensive engineering experience with Legrand-Numeric industrial power electronics.',
      'Minimized risk of sudden power drops during critical production and server operations.',
      'Cost savings through regular preventive care that extends equipment and battery lifespan.',
      'Dedicated helpline with direct phone and WhatsApp contact with our lead engineers.',
      'Official service logbook and safety compliance certification after each maintenance cycle.'
    ],
    features: [
      'Covers Numeric Digital HP, Onfiniti, and Keor T EVO series',
      'Comprehensive (with spares) & Non-Comprehensive options',
      '4 scheduled visits + unlimited emergency callouts',
      'Battery string life expectancy reports provided'
    ],
    display_order: 8,
    is_published: true
  },

  // 9. UPS SERVICE CENTER NEAR YOU (Image Copy 76)
  {
    id: 'ups-service-center-near-you',
    slug: 'ups-service-center-near-you',
    title: 'UPS Service Center Near You',
    category: 'UPS AMC Services',
    categoryId: 'ups-amc-services',
    badge: 'Local Doorstep Help',
    priceStartsAt: '₹ 499',
    turnaround: '1 - 2 Hours',
    icon: 'MapPin',
    banner: '/images/services/ups-technician.jpg',
    image: '/images/services/ups-technician.jpg',
    imageUrl: '/images/services/ups-technician.jpg',
    shortDesc: 'Looking for a reliable UPS service center near you? Livkam Power Technologies provides doorstep technician visits for all major UPS and inverter brands.',
    introduction: 'Looking for an authorized, reliable UPS service center near you? Livkam Power Technologies brings doorstep repairs and multi-brand service right to your doorstep.',
    rangeHeading: 'Our Comprehensive Range of Local UPS Services',
    rangeSubheading: 'Our nearby doorstep service center offerings include:',
    rangeItems: [
      'Instant doorstep booking and dispatch of qualified power engineers to your home or office.',
      'On-site diagnosis of UPS continuous beeping, failure to power on, and battery backup drops.',
      'Component-level board repair, fuse replacement, and transformer recalibration.',
      'Doorstep battery capacity testing, terminal cleaning, and replacement with genuine brands.',
      'Convenient pick-up and drop service with standby loaner UPS units for major repairs.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies Local Service Center',
    benefitsSubheading: 'Why Livkam Power Technologies is the top choice for local UPS service:',
    benefitsItems: [
      'Fastest response time in your locality with mobile technicians stationed across the city.',
      'Universal brand competency across APC, Vertiv, Delta, Luminous, Microtek, and Exide.',
      'Transparent estimates provided upfront before any repair work commences.',
      'Authentic OEM replacement spares accompanied by clear warranty documentation.',
      'Friendly, certified technicians dedicated to courteous customer service.'
    ],
    features: [
      'Doorstep visits within 1-2 hours of request',
      'Repairs for home inverters, office UPS, and online UPS',
      'Doorstep replacement for SMF and Tubular batteries',
      'Full safety check and load testing before handover'
    ],
    display_order: 9,
    is_published: true
  },

  // 10. ONLINE UPS SERVICES (Image Copy 76)
  {
    id: 'online-ups-services',
    slug: 'online-ups-services',
    title: 'Online UPS Services',
    category: 'UPS AMC Services',
    categoryId: 'ups-amc-services',
    badge: 'Mission-Critical Ready',
    priceStartsAt: '₹ 1,499',
    turnaround: 'Same Day / 24x7 Support',
    icon: 'Zap',
    banner: '/images/services/apc-service-cabinets.jpg',
    image: '/images/services/apc-service-cabinets.jpg',
    imageUrl: '/images/services/apc-service-cabinets.jpg',
    shortDesc: 'Complete Online UPS engineering solutions for 1kVA to 500kVA systems. Double conversion topology, isolation transformers, battery strings, and enterprise AMC contracts.',
    introduction: 'Comprehensive Online UPS engineering services covering 1kVA to 500kVA setups, high-frequency double conversion systems, and parallel redundant configurations.',
    rangeHeading: 'Our Comprehensive Range of Online UPS Services',
    rangeSubheading: 'Our end-to-end Online UPS service portfolio includes:',
    rangeItems: [
      'Turnkey electrical installation, 3-phase cabling, circuit breaker sizing, and grounding audits.',
      'Scheduled preventive maintenance, thermal imaging scans, and harmonic distortion (THDi) audits.',
      'Emergency fault repair for IGBT inverters, SCR rectifiers, and DSP control logic boards.',
      'High-voltage battery bank management, cell impedance testing, and battery rack assembly.',
      'Comprehensive and non-comprehensive enterprise AMC agreements with 4-hour SLA guarantee.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for Online UPS Services',
    benefitsSubheading: 'Ensure uninterrupted mission-critical power with Livkam Power Technologies:',
    benefitsItems: [
      'Certified senior power engineers with deep experience on industrial double-conversion UPS.',
      'Zero downtime protection for data centers, medical imaging, and continuous manufacturing.',
      'Reduced total cost of ownership through scheduled preventive maintenance and component tuning.',
      '24/7 priority emergency dispatch line and dedicated enterprise account management.',
      'Compliance certification and electrical safety documentation provided with every service.'
    ],
    features: [
      'Supports 1kVA to 500kVA single-phase and 3-phase online UPS',
      'True double-conversion zero-transfer-time assurance',
      'Isolation transformer integration and load balancing',
      '24/7 breakdown support with spare parts backup'
    ],
    display_order: 10,
    is_published: true
  },

  // 11. UPS SERVICE IN HYDERABAD (Image Copy 77)
  {
    id: 'ups-service-in-hyderabad',
    slug: 'ups-service-in-hyderabad',
    title: 'UPS Service In Hyderabad',
    category: 'Online UPS Service in Chennai',
    categoryId: 'online-ups-service-in-chennai',
    badge: 'Regional Network',
    priceStartsAt: '₹ 999',
    turnaround: 'Same Day Support',
    icon: 'MapPin',
    banner: '/images/services/vertiv-service-ups.jpg',
    image: '/images/services/vertiv-service-ups.jpg',
    imageUrl: '/images/services/vertiv-service-ups.jpg',
    shortDesc: 'Premier power engineering services across Hyderabad, Secunderabad, HITEC City, Gachibowli, and Telangana industrial estates for all UPS brands.',
    introduction: 'Livkam Power Technologies regional power engineering network provides high-standard UPS installation, repair, and AMC services across Hyderabad and Secunderabad.',
    rangeHeading: 'Our Comprehensive Range of UPS Services in Hyderabad',
    rangeSubheading: 'Our Hyderabad and Telangana UPS engineering offerings include:',
    rangeItems: [
      'On-site technical support covering HITEC City, Gachibowli, Madhapur, and industrial estates.',
      'Emergency component repair for corporate data centers, financial institutions, and hospitals.',
      'Doorstep industrial SMF battery replacement and eco-friendly scrap battery buyback.',
      'Annual Maintenance Contracts (AMC) with dedicated local technical squads and SLA backing.',
      'Engineering consultation and turnkey setup for large 3-phase online UPS systems.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies in Hyderabad',
    benefitsSubheading: 'Why Telangana businesses trust Livkam Power Technologies:',
    benefitsItems: [
      'Prompt local engineer dispatch across all Hyderabad metropolitan zones.',
      'High technical acumen covering APC, Vertiv, Delta, Numeric, and Eaton systems.',
      'Transparent corporate pricing with flexible contract and service tiers.',
      'Fast delivery of authentic replacement batteries and verified OEM spare boards.',
      'Dependable, long-term power protection partner with proven regional track record.'
    ],
    features: [
      'Coverage across HITEC City, Cyberabad, and surrounding industrial hubs',
      'Multi-brand repairs for 1kVA to 200kVA UPS systems',
      'Doorstep battery replacement with top buyback value',
      'Custom AMC plans for IT parks and healthcare facilities'
    ],
    display_order: 11,
    is_published: true
  },

  // 12. UPS SERVICES IN KERALA (Image Copy 77)
  {
    id: 'ups-services-in-kerala',
    slug: 'ups-services-in-kerala',
    title: 'UPS Services in Kerala',
    category: 'Online UPS Service in Chennai',
    categoryId: 'online-ups-service-in-chennai',
    badge: 'Regional Network',
    priceStartsAt: '₹ 999',
    turnaround: 'Same Day Support',
    icon: 'MapPin',
    banner: '/images/services/apc-service-cabinets.jpg',
    image: '/images/services/apc-service-cabinets.jpg',
    imageUrl: '/images/services/apc-service-cabinets.jpg',
    shortDesc: 'Complete UPS servicing, repairs, and AMC contracts adapted for Kerala’s climate. Serving Kochi, Thiruvananthapuram, Kozhikode, and all districts.',
    introduction: 'Livkam Power Technologies brings premium multi-brand UPS maintenance, repair, and AMC engineering services to Kochi, Thiruvananthapuram, and throughout Kerala.',
    rangeHeading: 'Our Comprehensive Range of UPS Services in Kerala',
    rangeSubheading: 'Our Kerala statewide UPS engineering services include:',
    rangeItems: [
      'Tropical climate-adapted UPS servicing with moisture protection and anti-corrosion PCB coatings.',
      'Fast on-site emergency repair for solar hybrids, online UPS, and tubular inverter batteries.',
      'Scheduled preventive AMC maintenance visits with full electrical parameter logging.',
      'Battery health impedance audits, individual cell revival, and certified scrap recycling.',
      'Industrial, hospital, and residential power backup support across Kochi, Trivandrum, and Calicut.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies in Kerala',
    benefitsSubheading: 'Why Kerala commercial and residential clients count on us:',
    benefitsItems: [
      'Experienced engineers adept at handling regional grid voltage surges and storm fluctuations.',
      '100% genuine OEM spare parts supply with full manufacturer backing.',
      'Doorstep fresh-date battery replacement with certified green recycling.',
      'Dedicated helpline and regional customer relationship managers.',
      'Reliable power assurance protecting vital tourism, medical, and IT operations.'
    ],
    features: [
      'Statewide network across Kochi, Trivandrum, Thrissur, and Calicut',
      'Surge and moisture-resistant engineering protocols',
      'Comprehensive solar hybrid & online UPS maintenance',
      'Fast emergency dispatch and loaner unit support'
    ],
    display_order: 12,
    is_published: true
  },

  // PRESERVED COMPATIBILITY SERVICES (for existing direct links)
  {
    id: 'ups-installation',
    slug: 'ups-installation',
    title: 'UPS Installation & Commissioning',
    category: 'UPS AMC Services',
    categoryId: 'ups-amc-services',
    badge: 'Most Popular',
    priceStartsAt: '₹ 1,499',
    turnaround: 'Same Day / 24 Hours',
    icon: 'Wrench',
    banner: '/images/services/ups-installation.png',
    image: '/images/services/ups-installation.png',
    imageUrl: '/images/services/ups-installation.png',
    shortDesc: 'End-to-end professional installation, cabling, load testing, and electrical safety commissioning for 1kVA to 200kVA UPS systems.',
    introduction: 'Professional UPS installation and commissioning solutions designed to provide reliable and uninterrupted power protection for homes, offices and commercial environments.',
    rangeHeading: 'Our Comprehensive Range of UPS Installation Services',
    rangeSubheading: 'Our extensive installation services include:',
    rangeItems: [
      'Precision load calculation and input/output wire sizing.',
      'Earth fault testing and neutral grounding verification.',
      'Battery rack assembly and inter-cell torque calibration.',
      'Full load testing with safety circuit verification.',
      'Official warranty registration and handover report.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for UPS Installation',
    benefitsSubheading: 'Professional installation ensures your system runs safely and effectively:',
    benefitsItems: [
      'Certified engineers with years of high-voltage commissioning experience.',
      'Guaranteed compliance with Indian electrical standards and OEM specifications.',
      'Prolonged battery life through correct charging calibration from day one.',
      'Full documentation and handover safety training for your staff.',
      'Prompt post-installation checkup and warranty assurance.'
    ],
    features: [
      'Precision load calculation & input/output wire sizing',
      'Earth fault testing & neutral grounding verification',
      'Battery rack assembly & inter-cell torque calibration',
      'Full load testing with safety circuit verification'
    ],
    display_order: 13,
    is_published: true
  },
  {
    id: 'battery-replacement',
    slug: 'battery-replacement',
    title: 'Battery Replacement & Buyback',
    category: 'UPS AMC Services',
    categoryId: 'ups-amc-services',
    badge: 'Best Buyback Value',
    priceStartsAt: 'Exchange Discounts Available',
    turnaround: 'Instant Doorstep Delivery',
    icon: 'BatteryCharging',
    banner: '/images/services/battery-replacement.png',
    image: '/images/services/battery-replacement.png',
    imageUrl: '/images/services/battery-replacement.png',
    shortDesc: 'Fresh factory-sealed SMF/Tubular battery swap with doorstep installation and old battery scrap buyback.',
    introduction: 'Professional battery replacement services ensuring your backup power systems run smoothly with fresh, high-quality batteries.',
    rangeHeading: 'Our Comprehensive Range of Battery Replacement Services',
    rangeSubheading: 'Our battery replacement solutions include:',
    rangeItems: [
      '100% genuine fresh manufacturing date batteries from Exide, Amaron, and Quanta.',
      'Doorstep delivery, physical removal, and heavy-duty terminal connection replacement.',
      'Float and equalize charging voltage calibration on your existing UPS/inverter.',
      'Safe eco-friendly recycling with the highest scrap rebate in Bengaluru.',
      'Manufacturer warranty card activation on-site.'
    ],
    benefitsHeading: 'Benefits of Choosing Livkam Power Technologies for Battery Replacement',
    benefitsSubheading: 'Why customers trust our doorstep battery replacement:',
    benefitsItems: [
      'Maximum scrap buyback value credited instantly toward your new batteries.',
      'Freshly manufactured stock ensuring maximum Ah capacity and backup hours.',
      'Professional installation preventing terminal corrosion and loose contact hazards.',
      'Hassle-free warranty support with doorstep replacement assistance.',
      'Free disposal and certified green recycling compliance.'
    ],
    features: [
      '100% genuine fresh manufacturing date batteries',
      'Safe eco-friendly recycling with highest scrap rebate',
      'Heavy duty copper link connectors replacement',
      'Float/Equalize charging voltage calibration on UPS'
    ],
    display_order: 14,
    is_published: true
  }
];
