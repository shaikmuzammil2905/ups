export const services = [
  {
    id: 'ups-installation',
    slug: 'ups-installation',
    title: 'UPS Installation & Commissioning',
    shortDesc: 'End-to-end professional installation, cabling, load testing, and electrical safety commissioning. Our certified engineers handle complete physical and electrical installation for 1kVA to 200kVA UPS systems. Available across residential, corporate data centers, hospitals, and industrial facilities in Bengaluru and throughout Karnataka.',
    introduction: 'Professional UPS installation and commissioning solutions designed to provide reliable and uninterrupted power protection for homes, offices and commercial environments.',
    badge: 'Most Popular',
    priceStartsAt: '₹ 1,499',
    turnaround: 'Same Day / 24 Hours',
    icon: 'Wrench',
    banner: '/images/services/ups-technician.jpg',
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=1200',
    features: [
      'Precision load calculation & input/output wire sizing',
      'Earth fault testing & neutral grounding verification',
      'Battery rack assembly & inter-cell torque calibration',
      'Full load testing with safety circuit verification',
      'Official warranty registration and handover report'
    ],
    fullDesc: 'Our certified engineers handle complete physical and electrical installation for 1kVA to 200kVA UPS systems across residential, corporate data centers, hospitals, and industrial facilities in Bengaluru and Karnataka.',
    aboutContent: [
      { title: 'What is UPS Installation?', desc: 'Professional UPS installation involves site assessment, load consideration, UPS placement, electrical connections, and commissioning to ensure your backup power is ready when needed.' },
      { title: 'Why it is important?', desc: 'Proper installation guarantees safety, longevity, and optimal performance of your UPS and batteries.' }
    ],
    fourColumns: [
      { heading: 'WHAT WE PROVIDE', items: ['Professional Service', 'Site Assessment', 'Installation Support', 'Technical Assistance'] },
      { heading: 'KEY BENEFITS', items: ['Reliable Power', 'Better Performance', 'Professional Support', 'Reduced Downtime'] },
      { heading: 'SERVICE PROCESS', items: ['Consultation', 'Assessment', 'Installation/Service', 'Testing'] },
      { heading: 'SUITABLE FOR', items: ['Homes', 'Offices', 'Commercial Spaces', 'Industrial Applications'] }
    ],
    process: ['Requirement Discussion', 'Site Assessment', 'Solution Recommendation', 'Installation/Service', 'Testing', 'Customer Handover'],
    technicalInfo: 'We handle installations up to 200kVA for APC, Delta, Vertiv, and more.',
    relatedProducts: [
      { name: 'APC Smart-UPS', slug: 'apc-smart-ups' },
      { name: 'Delta Amplon', slug: 'delta-amplon' }
    ]
  },
  {
    id: "ups-maintenance",
    slug: "ups-maintenance",
    title: "Preventive UPS Maintenance",
    shortDesc: "Scheduled diagnostic health checks, capacitor inspections, and thermal heat imaging. Avoid catastrophic sudden outages with quarterly and bi-annual preventive maintenance protocols tailored to protect sensitive servers and medical electronics. Service available in Bengaluru and across Karnataka.",
    introduction: "Ensure the longevity and reliability of your UPS systems with our comprehensive preventive maintenance programs.",
    badge: "Recommended",
    priceStartsAt: "₹ 999",
    turnaround: "Scheduled Visit",
    icon: "ShieldCheck",
    banner: "/images/services/ups-technician.jpg",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200",
    features: [
      "DC bus capacitor ripple voltage analysis",
      "Internal thermal scanning for hotspot detection",
      "Cooling fan bearing check and dust cleaning",
      "Firmware updates and alarm history diagnostics",
      "Battery internal impedance & conductance audit"
    ],
    fullDesc: "Avoid catastrophic sudden outages with quarterly and bi-annual preventive maintenance protocols tailored to protect sensitive servers and medical electronics.",
    aboutContent: [
      { title: 'What is UPS Maintenance?', desc: 'Routine diagnostic health checks to identify potential issues before they cause unexpected power failures or hardware damage.' },
      { title: 'Why it is important?', desc: 'Routine maintenance extends the lifespan of your critical power infrastructure and ensures you are never left in the dark during an outage.' }
    ],
    fourColumns: [
      { heading: 'WHAT WE PROVIDE', items: ['Diagnostic Scans', 'Thermal Imaging', 'Firmware Updates', 'Cleaning'] },
      { heading: 'KEY BENEFITS', items: ['Prevents Outages', 'Extends Lifespan', 'Ensures Safety', 'Optimizes Efficiency'] },
      { heading: 'SERVICE PROCESS', items: ['Visual Inspection', 'Testing', 'Cleaning', 'Reporting'] },
      { heading: 'SUITABLE FOR', items: ['Data Centers', 'Hospitals', 'Corporate Offices', 'Industrial Plants'] }
    ],
    process: ['Schedule Visit', 'Visual Inspection', 'Electrical Testing', 'Thermal Scanning', 'Cleaning & Calibration', 'Maintenance Report'],
    technicalInfo: 'Includes comprehensive testing of IGBTs, rectifiers, and inverter circuits.',
    relatedProducts: []
  },
  {
    id: "ups-repair",
    slug: "ups-repair",
    title: "Emergency UPS Repair & Component Service",
    shortDesc: "Rapid fault isolation, motherboard PCB repair, IGBT replacement, and inverter rectifiers. When your power backup fails, our on-call mobile squad arrives with emergency diagnostic gear and genuine OEM replacement components to restore uptime fast. Emergency service available 24/7 across Bengaluru.",
    introduction: "Fast, reliable emergency UPS repair services to get your critical systems back online with minimal downtime.",
    badge: "24/7 Emergency",
    priceStartsAt: "₹ 1,299",
    turnaround: "2 - 4 Hours Emergency SLA",
    icon: "AlertTriangle",
    banner: "/images/services/ups-technician.jpg",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1200",
    features: [
      "Genuine OEM spare replacement (APC, Delta, Vertiv, etc.)",
      "Faulty IGBT & power module component level repair",
      "Microcontroller calibration and bypass circuit diagnostics",
      "Loaner/Standby UPS provision for critical clients",
      "90-day comprehensive repair warranty"
    ],
    fullDesc: "When your power backup fails, our on-call Bangalore mobile squad arrives with emergency diagnostic gear and genuine OEM replacement components to restore uptime fast.",
    aboutContent: [
      { title: 'Emergency Repair Services', desc: 'When your UPS fails, our expert technicians isolate faults down to the component level to rapidly restore your power protection.' },
      { title: 'Why choose our service?', desc: 'We offer 24/7 emergency dispatch, genuine spare parts, and loaner UPS systems to keep your business running.' }
    ],
    fourColumns: [
      { heading: 'WHAT WE PROVIDE', items: ['Rapid Response', 'Component Repair', 'Genuine Spares', 'Standby Units'] },
      { heading: 'KEY BENEFITS', items: ['Minimizes Downtime', 'Cost-Effective', 'Guaranteed Fix', '24/7 Availability'] },
      { heading: 'SERVICE PROCESS', items: ['Fault Diagnosis', 'Quotation', 'Component Repair', 'Load Testing'] },
      { heading: 'SUITABLE FOR', items: ['Critical IT', 'Medical Systems', 'Manufacturing', 'Commercial Hubs'] }
    ],
    process: ['Emergency Call', 'Dispatch Technician', 'Fault Diagnosis', 'Repair/Replace Components', 'Testing', 'Handover'],
    technicalInfo: 'We repair PCBs, replace faulty IGBTs, and restore inverter/rectifier functionality for all major brands.',
    relatedProducts: []
  },
  {
    id: 'battery-replacement',
    slug: 'battery-replacement',
    title: 'Battery Replacement & Buyback',
    shortDesc: 'Fresh factory-sealed SMF/Tubular battery swap with doorstep installation and old battery scrap buyback. Upgrade sagging backup time with authentic batteries. We provide free doorstep collection of old batteries with maximum scrap discounts. Doorstep service available everywhere in Bengaluru and Karnataka.',
    introduction: 'Professional battery replacement services ensuring your backup power systems run smoothly with fresh, high-quality batteries.',
    badge: 'Best Buyback Value',
    priceStartsAt: 'Exchange Discounts Available',
    turnaround: 'Instant Doorstep Delivery',
    icon: 'BatteryCharging',
    banner: '/images/services/battery-replacement.jpg',
    image: 'https://images.unsplash.com/photo-1590489958742-8c105ab8bda3?auto=format&fit=crop&q=80&w=1200',
    features: [
      '100% genuine fresh manufacturing date batteries',
      'Safe eco-friendly recycling with highest scrap rebate',
      'Heavy duty copper link connectors replacement',
      'Float/Equalize charging voltage calibration on UPS',
      'Free terminal greasing and corrosion removal'
    ],
    fullDesc: 'Upgrade sagging backup time with authentic Exide, Amaron, Quanta, or Luminous batteries. We provide free doorstep collection of old batteries with maximum scrap discounts.',
    aboutContent: [
      { title: 'What is Battery Replacement?', desc: 'Replacing old, degraded batteries with brand new units to restore the backup time of your UPS or Inverter.' },
      { title: 'Why choose our service?', desc: 'We offer genuine batteries from top brands, eco-friendly disposal of old batteries, and professional installation.' }
    ],
    fourColumns: [
      { heading: 'WHAT WE PROVIDE', items: ['Genuine Batteries', 'Old Battery Buyback', 'Doorstep Installation', 'Warranty Support'] },
      { heading: 'KEY BENEFITS', items: ['Extended Backup Time', 'Peace of Mind', 'Safe Disposal', 'Cost Savings'] },
      { heading: 'SERVICE PROCESS', items: ['Battery Selection', 'Delivery', 'Installation', 'Old Battery Pickup'] },
      { heading: 'SUITABLE FOR', items: ['Home Inverters', 'UPS Systems', 'Solar Setups', 'Industrial Equipment'] }
    ],
    process: ['Requirement Discussion', 'Battery Recommendation', 'Doorstep Delivery', 'Installation', 'Testing', 'Old Battery Handover'],
    technicalInfo: 'We deal with 12V SMF, Tubular, and Lithium batteries of all AH ratings.',
    relatedProducts: [
      { name: 'Exide Tubular', slug: 'exide-tubular' },
      { name: 'Amaron Quanta', slug: 'amaron-quanta' }
    ]
  },
  {
    id: "amc-maintenance",
    slug: "amc-maintenance",
    title: "Annual Maintenance Contracts (AMC)",
    shortDesc: "Comprehensive & non-comprehensive AMC agreements with 4hr response time SLA for offices and factories. Zero-stress enterprise power assurance covering single workstation UPS units to multi-kVA parallel redundant enterprise UPS banks. Contractual availability and fast response SLA across Bengaluru and Karnataka.",
    introduction: "Zero-stress enterprise power assurance with guaranteed SLAs and dedicated priority support.",
    badge: "Enterprise SLA",
    priceStartsAt: "Custom Corporate Quote",
    turnaround: "Contractual SLA Guarantee",
    icon: "FileCheck",
    banner: "/images/services/ups-technician.jpg",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
    features: [
      "Guaranteed 4-hour breakdown turnaround time",
      "4 mandatory quarterly preventive maintenance visits",
      "Unlimited breakdown emergency callouts",
      "Comprehensive option covering all PCB & spare parts",
      "Dedicated account manager & priority phone line"
    ],
    fullDesc: "Zero-stress enterprise power assurance. Our AMC plans cover single workstation UPS units to multi-kVA parallel redundant enterprise UPS banks with guaranteed uptime.",
    aboutContent: [
      { title: 'What is an AMC?', desc: 'An Annual Maintenance Contract ensures your power infrastructure is professionally managed year-round with guaranteed response times.' },
      { title: 'Why do you need it?', desc: 'It provides predictable maintenance costs, minimizes sudden breakdowns, and extends the operational life of expensive UPS equipment.' }
    ],
    fourColumns: [
      { heading: 'WHAT WE PROVIDE', items: ['Comprehensive Coverage', 'Quarterly Visits', 'Priority Support', 'Account Management'] },
      { heading: 'KEY BENEFITS', items: ['Zero Stress', 'Guaranteed Uptime', 'Predictable Costs', 'Fast SLA'] },
      { heading: 'SERVICE PROCESS', items: ['Audit', 'Agreement', 'Scheduled Maintenance', 'Emergency Callouts'] },
      { heading: 'SUITABLE FOR', items: ['Enterprises', 'IT Parks', 'Hospitals', 'Government Facilities'] }
    ],
    process: ['Initial Site Audit', 'Custom Quote Generation', 'Contract Signing', 'First Preventive Maintenance', 'Ongoing Priority Support'],
    technicalInfo: 'Available in Comprehensive (includes parts) and Non-Comprehensive (service only) formats.',
    relatedProducts: []
  },
  {
    id: "power-backup-consultation",
    slug: "power-backup-consultation",
    title: "Power Backup Consultation & Sizing",
    shortDesc: "Free expert sizing calculation for solar hybrid, lithium storage, and online UPS architecture. Don't overspend on oversized systems or risk undersized inverters tripping. Speak directly with our seasoned engineering team for custom engineering advice. Consultation available on-site in Bengaluru or via remote support.",
    introduction: "Professional consultation to help you architect the perfect power backup solution tailored to your exact load requirements.",
    badge: "Free Consultation",
    priceStartsAt: "FREE",
    turnaround: "Same Day Call / Video",
    icon: "Headphones",
    banner: "/images/services/ups-technician.jpg",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200",
    features: [
      "Total connected load (VA/Watts) & inrush current audit",
      "Runtime duration calculation based on discharge curves",
      "Solar inverter hybrid ROI estimation",
      "Cost-optimized brand comparisons without bias",
      "Architectural single-line diagrams (SLD) review"
    ],
    fullDesc: "Don't overspend on oversized systems or risk undersized inverters tripping. Speak directly with Venu B N and our seasoned engineering team for custom engineering advice.",
    aboutContent: [
      { title: 'Expert Consultation', desc: 'We calculate your exact power requirements, considering inrush currents and future expansion, to recommend the optimal UPS or inverter system.' },
      { title: 'Why it is important?', desc: 'Improper sizing can lead to frequent tripping, hardware damage, or wasted capital on oversized equipment.' }
    ],
    fourColumns: [
      { heading: 'WHAT WE PROVIDE', items: ['Load Calculation', 'Brand Comparison', 'ROI Estimation', 'Architecture Review'] },
      { heading: 'KEY BENEFITS', items: ['Cost Optimization', 'Right-Sized Systems', 'Unbiased Advice', 'Future Proofing'] },
      { heading: 'SERVICE PROCESS', items: ['Discovery Call', 'Load Audit', 'Solution Design', 'Recommendation'] },
      { heading: 'SUITABLE FOR', items: ['New Constructions', 'Data Centers', 'Factories', 'Large Homes'] }
    ],
    process: ['Initial Contact', 'Load Data Collection', 'Engineering Analysis', 'System Design', 'Proposal Presentation'],
    technicalInfo: 'We utilize advanced sizing calculators for precise KVA/KW ratings and battery AH calculations.',
    relatedProducts: []
  },
  {
    id: "site-inspection",
    slug: "site-inspection",
    title: "Site Inspection & Power Quality Audit",
    shortDesc: "Physical site readiness inspection, voltage harmonic analysis, and thermal load assessment. Ensure your commercial premises are ready for large 3-phase online UPS installations, preventing neutral floats and premature battery sulfation. Available for commercial sites throughout Bengaluru and Karnataka.",
    introduction: "Comprehensive power quality audits and site readiness inspections to ensure a flawless installation environment.",
    badge: "Bengaluru Wide",
    priceStartsAt: "₹ 499 (Waived upon order)",
    turnaround: "Within 24 Hours",
    icon: "Search",
    banner: "/images/services/ups-technician.jpg",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200",
    features: [
      "Physical room ventilation & ambient heat inspection",
      "Neutral-to-Earth voltage spike measurement",
      "Circuit breaker rating and cable gauge validation",
      "Harmonic distortion (THDi) evaluation",
      "Detailed site readiness certification report"
    ],
    fullDesc: "Ensure your commercial premises are ready for large 3-phase online UPS installations, preventing neutral floats and premature battery sulfation.",
    aboutContent: [
      { title: 'Site Inspection Services', desc: 'Our engineers physically inspect your site for ventilation, cabling, grounding, and harmonic distortions before installing sensitive power equipment.' },
      { title: 'Why it matters?', desc: 'A poor electrical environment can instantly void UPS warranties and drastically reduce battery lifespan.' }
    ],
    fourColumns: [
      { heading: 'WHAT WE PROVIDE', items: ['Harmonic Analysis', 'Grounding Checks', 'Thermal Assessment', 'Wiring Audit'] },
      { heading: 'KEY BENEFITS', items: ['Prevents Failures', 'Ensures Warranty', 'Improves Safety', 'Identifies Faults'] },
      { heading: 'SERVICE PROCESS', items: ['Site Visit', 'Measurement', 'Analysis', 'Certification'] },
      { heading: 'SUITABLE FOR', items: ['Commercial Buildings', 'Manufacturing', 'Server Rooms', 'Hospitals'] }
    ],
    process: ['Schedule Visit', 'Visual Inspection', 'Power Quality Measurement', 'Load Assessment', 'Readiness Report Delivery'],
    technicalInfo: 'Includes THDi evaluation and neutral-to-earth voltage spike measurement.',
    relatedProducts: []
  },
  {
    id: "technical-support",
    slug: "technical-support",
    title: "Dedicated Technical Support & Helpdesk",
    shortDesc: "Direct helpline for troubleshooting error codes, battery beeps, and bypass operational guidance. Immediate over-the-phone and remote technical assistance for all your power backup operational queries. Our Bengaluru-based technical team is on standby to guide you step-by-step or dispatch emergency technicians anywhere in Karnataka.",
    introduction: "Immediate over-the-phone and remote technical assistance for all your power backup operational queries.",
    badge: "Direct Helpline",
    priceStartsAt: "FREE for Livkam Customers",
    turnaround: "Immediate Phone / WhatsApp",
    icon: "HelpCircle",
    banner: "/images/services/ups-technician.jpg",
    image: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=1200",
    features: [
      "Immediate troubleshooting of fault codes (F01, Overload, E04, etc.)",
      "Guidance on manual maintenance bypass operation",
      "Inverter solar settings & battery mode configuration",
      "Warranty claim facilitation with APC, Vertiv, Luminous & Exide",
      "Multilingual support in Kannada, English, Hindi, and Tamil"
    ],
    fullDesc: "Got a flashing red light or continuous alarm beep? Our Bangalore technical team is on standby to guide you step-by-step or dispatch emergency technicians.",
    aboutContent: [
      { title: 'Technical Helpdesk', desc: 'A dedicated line for instant remote troubleshooting of annoying beeps, error codes, and operational uncertainties.' },
      { title: 'Why call us?', desc: 'Most common UPS issues can be resolved remotely in minutes without the need for an expensive technician visit.' }
    ],
    fourColumns: [
      { heading: 'WHAT WE PROVIDE', items: ['Error Troubleshooting', 'Bypass Guidance', 'Warranty Facilitation', 'Multilingual Support'] },
      { heading: 'KEY BENEFITS', items: ['Instant Resolution', 'Free for Customers', 'Zero Downtime', 'Expert Advice'] },
      { heading: 'SERVICE PROCESS', items: ['Call Helpdesk', 'Describe Issue', 'Follow Guidance', 'Resolve or Dispatch'] },
      { heading: 'SUITABLE FOR', items: ['All Customers', 'Facility Managers', 'IT Admins', 'Homeowners'] }
    ],
    process: ['Call Support Line', 'Identify Error Code', 'Remote Troubleshooting', 'Resolution or Ticket Escalation'],
    technicalInfo: 'Support covers all major brands including APC, Vertiv, Microtek, and Luminous.',
    relatedProducts: []
  }
];
