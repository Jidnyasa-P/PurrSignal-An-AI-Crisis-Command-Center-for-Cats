import { Incident, Mission, Rescuer } from './types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "inc_1",
    title: "Trapped gray tabby behind warehouse security gate",
    status: "prioritized",
    urgency: "high",
    catDescription: {
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
    reportedAt: "2026-07-06T19:42:00-07:00",
    reporter: {
      name: "Sarah Connor",
      contact: "+1 (555) 198-4221",
      type: "witness"
    },
    notes: "I've been watching her for two hours. She is absolutely terrified and won't come near the fence. I tried throwing some chicken over but she can barely put weight on her front paw. The gate is padlocked for the night, so we need someone with clearance or tool assistance to get through.",
    aiConfidence: 94,
    aiSummary: "CRISIS SIGHTING VERIFIED: Trapped feral/lost gray tabby inside locked commercial perimeter. Severity high due to obvious mobility trauma (right front limb lameness) and restricted egress. Requires site-access tool (bolt cutters or landlord contact) and drop-trap.",
    updates: [
      {
        id: "up_1_1",
        timestamp: "2026-07-06T19:45:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Parsed raw report text and extracted metadata. Structured color as Gray Tabby, status as Trapped, location as 5th Ave Commercial.",
        statusChanged: "structured"
      },
      {
        id: "up_1_2",
        timestamp: "2026-07-06T20:10:00-07:00",
        author: "Coordinator Chloe",
        message: "Phoned the warehouse manager. They confirmed we can access the perimeter if a volunteer arrives before 10 PM. Changing status to Verified and setting high priority.",
        statusChanged: "verified"
      },
      {
        id: "up_1_3",
        timestamp: "2026-07-06T20:15:00-07:00",
        author: "System Auto-Prioritize",
        message: "Urgency calculated as High due to combination of cold weather forecast, mobility impairment, and physical trapping.",
        statusChanged: "prioritized"
      }
    ],
    mediaUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "inc_2",
    title: "Missing: Fluffy white Persian 'Marshmallow' escaped during thunderstorm",
    status: "reported",
    urgency: "medium",
    catDescription: {
      name: "Marshmallow",
      color: "Pure White",
      distinctiveFeatures: "Extremely fluffy tail, striking blue eyes, pink breakaway collar with small bell",
      condition: "Healthy but likely terrified, completely unaccustomed to outdoor elements"
    },
    location: {
      name: "342 Pinecrest Rd, Residential Suburb",
      lat: 37.7833,
      lng: -122.4167,
      details: "Escaped from back door. Neighborhood has many mature oak trees and crawl spaces under wooden decks."
    },
    reportedAt: "2026-07-06T21:10:00-07:00",
    reporter: {
      name: "David Chen",
      contact: "+1 (555) 202-3984",
      type: "owner"
    },
    notes: "Marshmallow is an indoor-only cat and has never spent a night outside. He ran out when a heavy gust blew the screen door open. He is very skittish and will bolt if chased. Please let me know if anyone spots him!",
    aiConfidence: 89,
    aiSummary: "MISSING OWNED CAT: Indoor-only breed (Persian) escaped during storm event. High panic risk. AI recommends passive trapping, setting out scent items (litter box/bedding) on the porch, and searching dark crawlspaces in a strict 150-meter radius.",
    updates: [
      {
        id: "up_2_1",
        timestamp: "2026-07-06T21:12:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Parsed missing report. Scent-mapping initialized. Generated public flyer asset template for neighborhood distribution.",
        statusChanged: "reported"
      }
    ],
    mediaUrl: "https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "inc_3",
    title: "CRITICAL: Calico cat wedged inside storm drain intake",
    status: "mission_created",
    urgency: "critical",
    catDescription: {
      color: "Calico (Black/Orange/White)",
      distinctiveFeatures: "Large black patch over left eye, very small frame (possibly a juvenile)",
      condition: "Wet, shivering violently, wedged between drainage grate bars"
    },
    location: {
      name: "Intersection of Broadway & Lincoln St, Northeast Corner",
      lat: 37.7699,
      lng: -122.4468,
      details: "Located directly in front of the municipal library entrance."
    },
    reportedAt: "2026-07-06T21:55:00-07:00",
    reporter: {
      name: "Marcus Aurelius",
      contact: "+1 (555) 012-1920",
      type: "witness"
    },
    notes: "I heard faint meowing coming from the street drain. When I looked with my phone flashlight, I saw this poor calico stuck in the narrow bars. Heavy rain is expected in 2 hours, which will flood this entire intersection! We need to get this cat out immediately. I tried using grease but she is too wedged.",
    aiConfidence: 98,
    aiSummary: "CRITICAL LIFE THREAT: Juvenile calico trapped inside municipal storm sewer grate with impending weather risk. High drowning hazard if rain commences. Requires immediate dispatch of extraction unit with heavy-duty pry bars, catch poles, and rapid warming materials.",
    updates: [
      {
        id: "up_3_1",
        timestamp: "2026-07-06T21:56:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Flagged as CRITICAL: Hydrological hazard detected based on local weather integration. Auto-elevated urgency to CRITICAL.",
        statusChanged: "structured"
      },
      {
        id: "up_3_2",
        timestamp: "2026-07-06T22:02:00-07:00",
        author: "Coordinator Chloe",
        message: "Dispatched immediate responder squad and contacted municipal public works department to authorize grate removal.",
        statusChanged: "verified"
      },
      {
        id: "up_3_3",
        timestamp: "2026-07-06T22:05:00-07:00",
        author: "Coordinator Chloe",
        message: "Rescue Mission #MSN-804 launched. assigned Captain Jack and Officer Cooper.",
        statusChanged: "mission_created"
      }
    ],
    mediaUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "inc_4",
    title: "RECOVERED: Injured stray orange cat found in diner dumpster",
    status: "recovered",
    urgency: "low",
    catDescription: {
      color: "Ginger Orange",
      distinctiveFeatures: "Very friendly despite situation, torn ear tip (no microchip detected)",
      condition: "Covered in grease, mild dehydration, superficial scratches on ears"
    },
    location: {
      name: "Mel's 24-Hour Diner, Backyard Alley",
      lat: 37.7554,
      lng: -122.4350,
      details: "Found inside the main cardboard recycling bin."
    },
    reportedAt: "2026-07-06T14:30:00-07:00",
    reporter: {
      name: "Lily Potter",
      contact: "+1 (555) 394-2099",
      type: "volunteer"
    },
    notes: "The kitchen staff heard meowing from the bins. I brought a carrier and some wet food. He is incredibly sweet—walked right into the carrier. He has some dry oil on his coat but is now bathed, fed, and sleeping on a heating pad at our sub-station.",
    aiConfidence: 91,
    aiSummary: "RECOVERY REPORT: Stray orange male, friendly demeanor, rescued from waste bin. Microchip scanned negative. Transported to Foster Station Alpha for medical observation and standard holding window prior to neuter placement.",
    updates: [
      {
        id: "up_4_1",
        timestamp: "2026-07-06T14:32:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Report structured. Categorized as Sighting -> Captured.",
        statusChanged: "structured"
      },
      {
        id: "up_4_2",
        timestamp: "2026-07-06T16:00:00-07:00",
        author: "Lily Potter",
        message: "Cat has been successfully retrieved from the scene. Safe and resting.",
        statusChanged: "rescued"
      },
      {
        id: "up_4_3",
        timestamp: "2026-07-06T18:30:00-07:00",
        author: "Lily Potter",
        message: "Veterinary triage complete. Superficial scratches only. Moved to active recovery.",
        statusChanged: "recovered"
      }
    ],
    mediaUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "inc_5",
    title: "REUNITED: Found black cat with red collar in Elm Park",
    status: "reunited",
    urgency: "low",
    catDescription: {
      name: "Shadow",
      color: "Solid Black",
      distinctiveFeatures: "Small white patch on chest, wearing red collar with name 'Shadow' and phone number",
      condition: "Healthy, well-fed, energetic"
    },
    location: {
      name: "Elm Street Park, near the picnic gazebo",
      lat: 37.7620,
      lng: -122.4220,
      details: "Sighted wandering near the children's playground."
    },
    reportedAt: "2026-07-05T10:15:00-07:00",
    reporter: {
      name: "Thomas Higgins",
      contact: "+1 (555) 789-1022",
      type: "witness"
    },
    notes: "Spotted this lovely cat roaming around. I called the number on the collar and the owner was ecstatic. Kept him safe in my garage until they arrived. They had been searching for 3 days!",
    aiConfidence: 95,
    aiSummary: "REUNIFICATION LOGGED: Black feline 'Shadow' identified via physical collar tag. Sighted by community witness. Temporary holding verified by reporter. Direct coordination completed. Case closed as Reunited.",
    updates: [
      {
        id: "up_5_1",
        timestamp: "2026-07-05T10:18:00-07:00",
        author: "PurrSignal AI Assistant",
        message: "Parsing caller contact... Linked shadow report to owner profile database.",
        statusChanged: "structured"
      },
      {
        id: "up_5_2",
        timestamp: "2026-07-05T11:00:00-07:00",
        author: "Thomas Higgins",
        message: "Owner arrived. Shadow is safe in his carrier and heading back home!",
        statusChanged: "reunited"
      }
    ],
    mediaUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=600&q=80"
  }
];

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

export const REGISTERED_RESCUERS: Rescuer[] = [
  {
    id: "res_1",
    name: "Captain Jack",
    role: "field_rescuer",
    contact: "+1 (555) 901-0012",
    status: "on_mission",
    location: "Downtown District"
  },
  {
    id: "res_2",
    name: "Officer Cooper",
    role: "field_rescuer",
    contact: "+1 (555) 901-0013",
    status: "on_mission",
    location: "Downtown District"
  },
  {
    id: "res_3",
    name: "Dr. Rachel Green",
    role: "medical_volunteer",
    contact: "+1 (555) 901-0024",
    status: "available",
    location: "West End Vet Clinic"
  },
  {
    id: "res_4",
    name: "Elena Rostova",
    role: "coordinator",
    contact: "+1 (555) 901-0001",
    status: "available",
    location: "PurrSignal HQ"
  },
  {
    id: "res_5",
    name: "Chloe Smith",
    role: "coordinator",
    contact: "+1 (555) 901-0002",
    status: "available",
    location: "PurrSignal HQ"
  },
  {
    id: "res_6",
    name: "Lily Potter",
    role: "foster_care",
    contact: "+1 (555) 394-2099",
    status: "available",
    location: "Oak Lane Foster Haven"
  }
];
