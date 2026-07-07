import { 
  Incident, 
  Mission, 
  Rescuer, 
  UserRole, 
  IncidentType, 
  Urgency, 
  IncidentStatus, 
  MissionStatus 
} from './types';

// ============================================================================
// CENTRAL REGISTERED VOLUNTEERS & RESCUERS
// ============================================================================
export const REGISTERED_RESCUERS: Rescuer[] = [
  {
    id: "res_1",
    name: "Captain Jack",
    role: UserRole.RESCUER,
    contact: "+1 (555) 901-0012",
    status: "on_mission",
    location: "Downtown District"
  },
  {
    id: "res_2",
    name: "Officer Cooper",
    role: UserRole.RESCUER,
    contact: "+1 (555) 901-0013",
    status: "on_mission",
    location: "Downtown District"
  },
  {
    id: "res_3",
    name: "Dr. Rachel Green",
    role: UserRole.VOLUNTEER,
    contact: "+1 (555) 901-0024",
    status: "available",
    location: "West End Vet Clinic"
  },
  {
    id: "res_4",
    name: "Elena Rostova",
    role: UserRole.COORDINATOR,
    contact: "+1 (555) 901-0001",
    status: "available",
    location: "PurrSignal HQ"
  },
  {
    id: "res_5",
    name: "Chloe Smith",
    role: UserRole.COORDINATOR,
    contact: "+1 (555) 901-0002",
    status: "available",
    location: "PurrSignal HQ"
  },
  {
    id: "res_6",
    name: "Lily Potter",
    role: UserRole.VOLUNTEER,
    contact: "+1 (555) 394-2099",
    status: "available",
    location: "Oak Lane Foster Haven"
  }
];

// ============================================================================
// INITIAL SEEDED INCIDENTS (INCLUDING MISO DEMONSTRATION STORY)
// ============================================================================
export const INITIAL_INCIDENTS: Incident[] = [
  // --- MISO GINGER STORY INGREDIENT 1: THE OWNER'S MISSING REPORT ---
  {
    id: "inc_miso",
    title: "Missing: Beloved orange tabby 'Miso' escaped near Golden Gate Park",
    type: IncidentType.MISSING,
    status: IncidentStatus.NEEDS_VERIFICATION,
    urgency: Urgency.HIGH,
    reportedAt: "2026-07-06T15:00:00-07:00",
    notes: "Miso is an indoor-only kitty. He got terrified by the sirens outside and jumped through a loose window screen. He is extremely gentle but very skittish around strangers. Please help me bring my boy home, he has never been outside!",
    mediaUrl: "https://images.unsplash.com/photo-1574158622643-69d34d72650a?auto=format&fit=crop&w=600&q=80",
    
    // Nested Clean Entities
    catProfile: {
      name: "Miso",
      breed: "Domestic Shorthair (Orange Tabby)",
      color: "Bright Ginger / Orange Tabby",
      distinctiveFeatures: "Very swirly dark orange stripes, distinct white bib/chest patch, tiny dark freckle on his nose, blue flea collar with a bell.",
      condition: "Healthy but high anxiety risk. Indoor-only."
    },
    location: {
      name: "8th Ave near Fulton Street, San Francisco",
      lat: 37.7720,
      lng: -122.4660,
      details: "Residential apartment building near the North entry of the park."
    },
    reporter: {
      name: "Sarah Jennings",
      contact: "+1 (555) 722-9014",
      type: "owner",
      role: UserRole.PUBLIC_REPORTER
    },
    aiAnalysis: {
      confidence: 96,
      summary: "MISSING FELINE REPORT: Standard home escape, orange breed signature matches. Area profile indicates low escape radius. Placing scent markers and active local warning is prioritized.",
      threatLevel: Urgency.HIGH,
      recommendedGear: ["Humane Box Trap", "Familiar scent bedding", "Owner clothing lures"]
    },
    evidence: [
      {
        id: "ev_miso_1",
        type: "image",
        url: "https://images.unsplash.com/photo-1574158622643-69d34d72650a?auto=format&fit=crop&w=600&q=80",
        capturedAt: "2026-07-06T15:00:00-07:00"
      }
    ],
    timeline: [
      {
        id: "tl_miso_1",
        timestamp: "2026-07-06T15:05:00-07:00",
        author: "PurrSignal AI Parser",
        message: "Missing report processed. Created profile for Miso. Scent vectors activated.",
        statusChanged: IncidentStatus.NEW
      },
      {
        id: "tl_miso_2",
        timestamp: "2026-07-06T15:10:00-07:00",
        author: "Coordinator Elena",
        message: "Verified ownership documents. Set status to Needs Verification. Sighting correlation scanner is tracking local neighborhood posts.",
        statusChanged: IncidentStatus.NEEDS_VERIFICATION
      }
    ],
    possibleMatches: [
      {
        id: "match_miso_1",
        incidentIdA: "inc_miso",
        incidentIdB: "inc_sighting_1",
        confidenceScore: 94,
        status: "PENDING",
        reason: "94% Visual Match: Orange tabby with a blue neckband reported 150m from Miso's escape coordinate."
      },
      {
        id: "match_miso_2",
        incidentIdA: "inc_miso",
        incidentIdB: "inc_sighting_2",
        confidenceScore: 88,
        status: "PENDING",
        reason: "88% Visual Match: Ginger cat with swirly coat eating scraps 300m from escape location."
      }
    ],

    // Backward Compatibility
    catDescription: {
      name: "Miso",
      color: "Ginger / Orange Tabby",
      distinctiveFeatures: "Very swirly orange stripes, white chest bib, blue flea collar.",
      condition: "Anxious, indoor-only, skittish."
    },
    aiConfidence: 96,
    aiSummary: "MISSING OWNED CAT: Scent mapping coordinates configured. PurrSignal AI has scanned local telemetry and flagged two neighborhood sightings with >85% visual/spatial match indices.",
    updates: [
      {
        id: "up_miso_1",
        timestamp: "2026-07-06T15:05:00-07:00",
        author: "PurrSignal AI Parser",
        message: "Missing report parsed cleanly. Visual search token 'miso_stripes' registered.",
        statusChanged: "reported"
      },
      {
        id: "up_miso_2",
        timestamp: "2026-07-06T15:10:00-07:00",
        author: "Coordinator Elena",
        message: "Set status to Needs Verification. AI scanning has detected multiple physical sighting duplicates in local catch basins.",
        statusChanged: "prioritized"
      }
    ]
  },

  // --- MISO GINGER STORY INGREDIENT 2: PUBLIC SIGHTING A (FULTON ST) ---
  {
    id: "inc_sighting_1",
    title: "Sighting: Terrified orange cat crying in backyard rose bushes",
    type: IncidentType.SIGHTING,
    status: IncidentStatus.NEW,
    urgency: Urgency.MEDIUM,
    reportedAt: "2026-07-06T17:15:00-07:00",
    notes: "I was watering my roses when my dog started barking at the side fence. There is a gorgeous orange tabby wedged behind the bushes. He looks like he has some sort of dark blue flea band on his neck. He is extremely frightened and mewing non-stop.",
    mediaUrl: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=600&q=80",

    catProfile: {
      color: "Orange Tabby",
      distinctiveFeatures: "Striking orange stripes, possible blue collar.",
      condition: "Shivering, highly vocal, refusing to move."
    },
    location: {
      name: "10th Ave & Fulton Street (Rose Garden Alley)",
      lat: 37.7725,
      lng: -122.4688,
      details: "Right behind the municipal garden stone wall, tucked under climbing vines."
    },
    reporter: {
      name: "Dave Andrews",
      contact: "+1 (555) 123-4567",
      type: "witness",
      role: UserRole.PUBLIC_REPORTER
    },
    aiAnalysis: {
      confidence: 94,
      summary: "SIGHTING DETECTED: Physical and spatial traits align with 94% confidence to active missing report 'Miso' (inc_miso). High threat level due to heavy predator stray presence in Rose Garden area.",
      threatLevel: Urgency.MEDIUM,
      recommendedGear: ["Drop Trap", "Calming feline towels"]
    },
    evidence: [],
    timeline: [
      {
        id: "tl_s1_1",
        timestamp: "2026-07-06T17:15:00-07:00",
        author: "PurrSignal AI Parser",
        message: "Sighting received. Automated image analysis detected orange coat patterns. Geocoded to Park Border.",
        statusChanged: IncidentStatus.NEW
      }
    ],

    catDescription: {
      color: "Orange Tabby",
      distinctiveFeatures: "Very vibrant orange stripes, possible blue collar visible.",
      condition: "Terrified, hiding under deep foliage."
    },
    aiConfidence: 94,
    aiSummary: "AUTOMATED ALERT: Sighting overlaps with Missing profile 'Miso' (inc_miso) within 150m boundary. Collar signature matches perfectly.",
    updates: [
      {
        id: "up_s1_1",
        timestamp: "2026-07-06T17:15:00-07:00",
        author: "PurrSignal AI Parser",
        message: "Sighting parsed. Spatial cross-match triggered with inc_miso.",
        statusChanged: "reported"
      }
    ]
  },

  // --- MISO GINGER STORY INGREDIENT 3: PUBLIC SIGHTING B (LINCOLN WAY) ---
  {
    id: "inc_sighting_2",
    title: "Sighting: Hungry orange cat spotted near diner trash bins",
    type: IncidentType.SIGHTING,
    status: IncidentStatus.NEW,
    urgency: Urgency.LOW,
    reportedAt: "2026-07-06T19:30:00-07:00",
    notes: "Ginger cat has been crying near our trash bins since sundown. Left some turkey scraps out, he ran, grabbed it, and retreated under the wooden deck. He has swirly orange markings and a white patch on his chest.",
    mediaUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",

    catProfile: {
      color: "Ginger Orange Tabby",
      distinctiveFeatures: "White chest patch, swirly stripes.",
      condition: "Hungry, looking for scraps, highly mobile."
    },
    location: {
      name: "9th Ave & Lincoln Way (Pizzeria Alley)",
      lat: 37.7662,
      lng: -122.4655,
      details: "Under the wooden recycling pallets behind Luigi's Pizzeria."
    },
    reporter: {
      name: "Chef Luigi",
      contact: "+1 (555) 987-6543",
      type: "witness",
      role: UserRole.PUBLIC_REPORTER
    },
    aiAnalysis: {
      confidence: 88,
      summary: "SIGHTING CORRELATION: Orange coat, swirly patterns, and chest bib matches missing report 'Miso' (inc_miso) with 88% confidence index. Distance is 300m from center point.",
      threatLevel: Urgency.LOW,
      recommendedGear: ["High-protein liquid treats"]
    },
    evidence: [],
    timeline: [
      {
        id: "tl_s2_1",
        timestamp: "2026-07-06T19:30:00-07:00",
        author: "PurrSignal AI Parser",
        message: "Sighting logged near pizzeria alley. Scent path suggests migration from Fulton street.",
        statusChanged: IncidentStatus.NEW
      }
    ],

    catDescription: {
      color: "Ginger Orange",
      distinctiveFeatures: "Swirly orange pattern, white chest patch.",
      condition: "Hungry, active, hiding under trash pallets."
    },
    aiConfidence: 88,
    aiSummary: "CROSS-MATCH RADAR: 88% visual correlation to Missing Miso. High proximity rating.",
    updates: [
      {
        id: "up_s2_1",
        timestamp: "2026-07-06T19:30:00-07:00",
        author: "PurrSignal AI Parser",
        message: "Pizzeria sighting registered.",
        statusChanged: "reported"
      }
    ]
  },

  // --- LEGACY INCIDENT 1: THE TRAPPED GRAY TABBY ---
  {
    id: "inc_1",
    title: "Trapped gray tabby behind warehouse security gate",
    type: IncidentType.TRAPPED,
    status: IncidentStatus.NEEDS_VERIFICATION,
    urgency: Urgency.HIGH,
    reportedAt: "2026-07-06T19:42:00-07:00",
    notes: "I've been watching her for two hours. She is absolutely terrified and won't come near the fence. I tried throwing some chicken over but she can barely put weight on her front paw. The gate is padlocked for the night, so we need someone with clearance or tool assistance to get through.",
    mediaUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",

    catProfile: {
      color: "Gray Tabby",
      distinctiveFeatures: "White socks on front paws, distinct v-notch in left ear, silver collar with no tags",
      condition: "Limping heavily on front-right paw, dehydrated, crying loudly"
    },
    location: {
      name: "Industrial Sector - Alleyway D behind Central Warehouses, 5th Ave",
      lat: 37.7749,
      lng: -122.4194,
      details: "Enter via the side alley next to the auto repair shop. The cat is inside the chain-link security fence, under some wooden pallets."
    },
    reporter: {
      name: "Sarah Connor",
      contact: "+1 (555) 198-4221",
      type: "witness",
      role: UserRole.PUBLIC_REPORTER
    },
    evidence: [],
    timeline: [
      {
        id: "tl_1_1",
        timestamp: "2026-07-06T19:45:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Parsed raw report text and extracted metadata.",
        statusChanged: IncidentStatus.AI_ANALYZED
      },
      {
        id: "tl_1_2",
        timestamp: "2026-07-06T20:10:00-07:00",
        author: "Coordinator Chloe",
        message: "Phoned the warehouse manager. They confirmed we can access the perimeter if a volunteer arrives before 10 PM.",
        statusChanged: IncidentStatus.VERIFIED
      }
    ],

    catDescription: {
      color: "Gray Tabby",
      distinctiveFeatures: "White socks on front paws, distinct v-notch in left ear, silver collar",
      condition: "Limping heavily on front-right paw, dehydrated, crying"
    },
    aiConfidence: 94,
    aiSummary: "CRISIS SIGHTING VERIFIED: Trapped feral/lost gray tabby inside locked commercial perimeter. Severity high due to obvious mobility trauma (right front limb lameness) and restricted egress.",
    updates: [
      {
        id: "up_1_1",
        timestamp: "2026-07-06T19:45:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Structured coat color as Gray Tabby, status as Trapped, location verified.",
        statusChanged: "structured"
      },
      {
        id: "up_1_2",
        timestamp: "2026-07-06T20:10:00-07:00",
        author: "Coordinator Chloe",
        message: "Phoned warehouse manager. Access allowed before 10 PM.",
        statusChanged: "verified"
      }
    ]
  },

  // --- LEGACY INCIDENT 2: MARSHMALLOW ---
  {
    id: "inc_2",
    title: "Missing: Fluffy white Persian 'Marshmallow' escaped during thunderstorm",
    type: IncidentType.MISSING,
    status: IncidentStatus.NEW,
    urgency: Urgency.MEDIUM,
    reportedAt: "2026-07-06T21:10:00-07:00",
    notes: "Marshmallow is an indoor-only cat and has never spent a night outside. He ran out when a heavy gust blew the screen door open. He is very skittish and will bolt if chased. Please let me know if anyone spots him!",
    mediaUrl: "https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&w=600&q=80",

    catProfile: {
      name: "Marshmallow",
      color: "Pure White",
      distinctiveFeatures: "Extremely fluffy tail, striking blue eyes, pink breakaway collar with small bell",
      condition: "Healthy but likely terrified, completely unaccustomed to outdoor elements"
    },
    location: {
      name: "342 Pinecrest Rd, Residential Suburb",
      lat: 37.7833,
      lng: -122.4167,
      details: "Escaped from back door. Neighborhood has many mature oak trees and crawl spaces."
    },
    reporter: {
      name: "David Chen",
      contact: "+1 (555) 202-3984",
      type: "owner",
      role: UserRole.PUBLIC_REPORTER
    },
    evidence: [],
    timeline: [],

    catDescription: {
      name: "Marshmallow",
      color: "Pure White",
      distinctiveFeatures: "Extremely fluffy tail, striking blue eyes, pink breakaway collar",
      condition: "Healthy but likely terrified"
    },
    aiConfidence: 89,
    aiSummary: "MISSING OWNED CAT: Indoor-only Persian escaped. High panic risk. AI recommends passive trapping and setting out scent items.",
    updates: [
      {
        id: "up_2_1",
        timestamp: "2026-07-06T21:12:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Parsed missing report. Public flyer asset template generated.",
        statusChanged: "reported"
      }
    ]
  },

  // --- LEGACY INCIDENT 3: CALICO GRATE WATER HAZARD ---
  {
    id: "inc_3",
    title: "CRITICAL: Calico cat wedged inside storm drain intake",
    type: IncidentType.TRAPPED,
    status: IncidentStatus.MISSION_CREATED,
    urgency: Urgency.CRITICAL,
    reportedAt: "2026-07-06T21:55:00-07:00",
    notes: "I heard faint meowing coming from the street drain. When I looked with my phone flashlight, I saw this poor calico stuck in the narrow bars. Heavy rain is expected in 2 hours, which will flood this entire intersection! We need to get this cat out immediately.",
    mediaUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80",

    catProfile: {
      color: "Calico (Black/Orange/White)",
      distinctiveFeatures: "Large black patch over left eye, very small frame",
      condition: "Wet, shivering violently, wedged between drainage grate bars"
    },
    location: {
      name: "Intersection of Broadway & Lincoln St, Northeast Corner",
      lat: 37.7699,
      lng: -122.4468,
      details: "Located directly in front of the municipal library entrance."
    },
    reporter: {
      name: "Marcus Aurelius",
      contact: "+1 (555) 012-1920",
      type: "witness",
      role: UserRole.PUBLIC_REPORTER
    },
    evidence: [],
    timeline: [],

    catDescription: {
      color: "Calico (Black/Orange/White)",
      distinctiveFeatures: "Large black patch over left eye, very small frame",
      condition: "Wet, shivering violently, wedged in drainage grate"
    },
    aiConfidence: 98,
    aiSummary: "CRITICAL LIFE THREAT: Juvenile calico trapped inside municipal storm sewer grate with impending weather risk. High drowning hazard if rain commences.",
    updates: [
      {
        id: "up_3_1",
        timestamp: "2026-07-06T21:56:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Flagged as CRITICAL: Hydrological water level hazard detected based on local weather integration.",
        statusChanged: "structured"
      },
      {
        id: "up_3_2",
        timestamp: "2026-07-06T22:02:00-07:00",
        author: "Coordinator Chloe",
        message: "Dispatched immediate responder squad and contacted municipal public works department.",
        statusChanged: "verified"
      }
    ]
  },

  // --- LEGACY INCIDENT 4: RECOVERED GINGER IN DUMPSTER ---
  {
    id: "inc_4",
    title: "RECOVERED: Injured stray orange cat found in diner dumpster",
    type: IncidentType.FOUND,
    status: IncidentStatus.CLOSED,
    urgency: Urgency.LOW,
    reportedAt: "2026-07-06T14:30:00-07:00",
    notes: "The kitchen staff heard meowing from the bins. I brought a carrier and some wet food. He is incredibly sweet—walked right into the carrier. He has some dry oil on his coat but is now bathed, fed, and sleeping on a heating pad.",
    mediaUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80",

    catProfile: {
      color: "Ginger Orange",
      distinctiveFeatures: "Very friendly, torn ear tip (no microchip detected)",
      condition: "Bathed, fed, sleeping peacefully"
    },
    location: {
      name: "Mel's 24-Hour Diner, Backyard Alley",
      lat: 37.7554,
      lng: -122.4350,
      details: "Found inside the main cardboard recycling bin."
    },
    reporter: {
      name: "Lily Potter",
      contact: "+1 (555) 394-2099",
      type: "volunteer",
      role: UserRole.VOLUNTEER
    },
    evidence: [],
    timeline: [],

    catDescription: {
      color: "Ginger Orange",
      distinctiveFeatures: "Friendly, torn ear tip, grease-covered when found",
      condition: "Mild dehydration, superfical scratches, bathed & warm"
    },
    aiConfidence: 91,
    aiSummary: "RECOVERY REPORT: Stray orange male, rescued from dumpster cardboard recyclers. Microchip negative.",
    updates: [
      {
        id: "up_4_1",
        timestamp: "2026-07-06T14:32:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Report structured as Sighting -> Captured.",
        statusChanged: "structured"
      }
    ]
  },

  // --- LEGACY INCIDENT 5: SHADOW REUNITED ---
  {
    id: "inc_5",
    title: "REUNITED: Found black cat with red collar in Elm Park",
    type: IncidentType.FOUND,
    status: IncidentStatus.REUNITED,
    urgency: Urgency.LOW,
    reportedAt: "2026-07-05T10:15:00-07:00",
    notes: "Spotted this lovely cat roaming around. I called the number on the collar and the owner was ecstatic. Kept him safe in my garage until they arrived.",
    mediaUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=600&q=80",

    catProfile: {
      name: "Shadow",
      color: "Solid Black",
      distinctiveFeatures: "Small white patch on chest, red collar with name Shadow and owner contact",
      condition: "Healthy, well-fed, energetic"
    },
    location: {
      name: "Elm Street Park, near picnic gazebo",
      lat: 37.7620,
      lng: -122.4220,
      details: "Sighted roaming around playground."
    },
    reporter: {
      name: "Thomas Higgins",
      contact: "+1 (555) 789-1022",
      type: "witness",
      role: UserRole.PUBLIC_REPORTER
    },
    evidence: [],
    timeline: [],

    catDescription: {
      name: "Shadow",
      color: "Solid Black",
      distinctiveFeatures: "White chest patch, red name-collar",
      condition: "Healthy, active, sweet"
    },
    aiConfidence: 95,
    aiSummary: "REUNIFICATION SUCCESS: Microchip scanned, collar parameters aligned, returned to registered owner.",
    updates: [
      {
        id: "up_5_1",
        timestamp: "2026-07-05T10:18:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Parsed collar. Verified match in missing database.",
        statusChanged: "structured"
      }
    ]
  }
];

// ============================================================================
// INITIAL SEEDED MISSIONS
// ============================================================================
export const INITIAL_MISSIONS: Mission[] = [
  {
    id: "msn_1",
    incidentId: "inc_3",
    title: "Broadway Storm Drain Extraction",
    status: "active",
    assignedRescuers: ["Captain Jack", "Officer Cooper"],
    priority: "critical",
    createdAt: "2026-07-06T22:05:00-07:00",
    equipmentNeeded: ["Heavy Crowbar", "Extendable Catch Pole", "Thermal Heat Pads", "Kitten Formula & Bottle", "Ultra-Bright Headlamps"],
    updates: [
      {
        id: "mu_1_1",
        timestamp: "2026-07-06T22:10:00-07:00",
        author: "Captain Jack",
        message: "En route to scene with public works emergency contact. Rain clouds are darkening. Estimated arrival 8 mins."
      },
      {
        id: "mu_1_2",
        timestamp: "2026-07-06T22:25:00-07:00",
        author: "Officer Cooper",
        message: "Arrived on site. Grate lid is bolted, but public works has bypassed it. We can see the Calico, she is shivering. Lowering soft-mesh transport container."
      }
    ]
  }
];
