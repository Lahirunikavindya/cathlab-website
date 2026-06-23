const cathLabInventory = [
  {
    inventoryGroup: "Diagnostic Coronary Procedure Inventory",
    categories: [
      {
        category: "Vascular Access",
        subCategories: [
          {
            name: "Needles",
            items: ["Micropuncture needle", "Standard access needle"],
          },
          {
            name: "Introducer Sheaths",
            items: [
              "4F sheath",
              "5F sheath",
              "6F sheath",
              "7F sheath",
              "8F sheath",
              "Long sheaths",
              "Radial sheaths",
              "Femoral sheaths",
            ],
          },
          {
            name: "Radial Specific",
            items: [
              "Hydrophilic radial sheath",
              "Slender sheath",
              "Sheathless guide system",
            ],
          },
        ],
      },
      {
        category: "Guidewires",
        subCategories: [
          {
            name: "Diagnostic Wires",
            items: ['0.035" J-tip wire', "Straight wire", "Angled wire"],
          },
          {
            name: "Specialty Wires",
            items: ["Hydrophilic wire", "Stiff wire", "Exchange wire"],
          },
        ],
      },
      {
        category: "Diagnostic Catheters",
        subCategories: [
          {
            name: "Judkins",
            items: ["JL 3.5", "JL 4.0", "JL 5.0", "JR 3.5", "JR 4.0"],
          },
          {
            name: "Extra Backup",
            items: ["EBU 3.0", "EBU 3.5", "EBU 4.0"],
          },
          {
            name: "Amplatz",
            items: ["AL1", "AL2", "AR1", "AR2"],
          },
          {
            name: "Multipurpose",
            items: ["MPA", "MPB"],
          },
          {
            name: "Pigtail Catheters",
            items: ["Straight pigtail", "Angled pigtail"],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "PCI Inventory",
    categories: [
      {
        category: "Guiding Catheters",
        subCategories: [
          {
            name: "Left Coronary",
            items: ["EBU", "XB", "JL guide"],
          },
          {
            name: "Right Coronary",
            items: ["JR guide", "AR guide", "AL guide"],
          },
          {
            name: "Sizes",
            items: ["5F", "6F", "7F", "8F"],
          },
        ],
      },
      {
        category: "Coronary Guidewires",
        subCategories: [
          {
            name: "Workhorse Wires",
            items: ["BMW", "Runthrough", "Sion", "Cougar"],
          },
          {
            name: "Hydrophilic Wires",
            items: ["Fielder FC", "Fielder XT", "Whisper"],
          },
          {
            name: "CTO Wires",
            items: [
              "Gaia First",
              "Gaia Second",
              "Gaia Third",
              "Pilot 50",
              "Pilot 150",
              "Pilot 200",
              "Confianza Pro 12",
              "Miracle Series",
            ],
          },
          {
            name: "Rotational Atherectomy Wires",
            items: ["Rotawire Floppy", "Rotawire Extra Support"],
          },
        ],
      },
      {
        category: "Balloon Catheters",
        subCategories: [
          {
            name: "Semi-Compliant Balloons",
            items: [
              "1.25 mm",
              "1.5 mm",
              "2.0 mm",
              "2.5 mm",
              "3.0 mm",
              "3.5 mm",
              "4.0 mm",
            ],
          },
          {
            name: "Non-Compliant Balloons",
            items: ["All coronary sizes"],
          },
          {
            name: "Specialty Balloons",
            items: [
              "Cutting balloon",
              "Scoring balloon",
              "CTO balloon",
              "Microcatheter-compatible balloon",
            ],
          },
          {
            name: "Drug-Coated Balloons",
            items: ["Coronary DCB", "Peripheral DCB"],
          },
        ],
      },
      {
        category: "Coronary Stents",
        subCategories: [
          {
            name: "Drug Eluting Stents",
            items: [
              "Everolimus Eluting",
              "Sirolimus Eluting",
              "Zotarolimus Eluting",
            ],
          },
          {
            name: "Specialty Stents",
            items: [
              "Ultrathin Strut DES",
              "Small vessel DES",
              "Long lesion DES",
              "Bifurcation stent",
              "CTO stent",
              "Left main stent",
            ],
          },
          {
            name: "Covered Stents",
            items: ["Coronary perforation stents"],
          },
        ],
      },
      {
        category: "Adjunct PCI Devices",
        subCategories: [
          {
            name: "Microcatheters",
            items: ["Finecross", "Corsair", "Caravel", "Turnpike"],
          },
          {
            name: "Aspiration Catheters",
            items: ["Thrombus aspiration devices"],
          },
          {
            name: "Distal Protection Devices",
            items: ["Filter devices", "Occlusion devices"],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "Atherectomy Devices",
    categories: [
      {
        category: "Rotational Atherectomy",
        subCategories: [
          {
            name: "Burrs",
            items: ["1.25 mm", "1.5 mm", "1.75 mm", "2.0 mm"],
          },
        ],
      },
      {
        category: "Orbital Atherectomy",
        subCategories: [
          {
            name: "Crown systems",
            items: ["Crown systems"],
          },
        ],
      },
      {
        category: "Laser Atherectomy",
        subCategories: [
          {
            name: "Excimer laser catheters",
            items: ["Excimer laser catheters"],
          },
        ],
      },
      {
        category: "Intravascular Lithotripsy",
        subCategories: [
          {
            name: "Coronary IVL balloons",
            items: ["Coronary IVL balloons"],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "Physiological Assessment",
    categories: [
      {
        category: "FFR",
        subCategories: [
          {
            name: "FFR",
            items: ["Pressure wires", "FFR console"],
          },
        ],
      },
      {
        category: "iFR",
        subCategories: [
          {
            name: "iFR",
            items: ["iFR wire", "Interface cable"],
          },
        ],
      },
      {
        category: "RFR / DFR",
        subCategories: [
          {
            name: "RFR / DFR",
            items: ["Physiological assessment wires"],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "Intravascular Imaging",
    categories: [
      {
        category: "IVUS",
        subCategories: [
          {
            name: "Catheters",
            items: ["Coronary IVUS", "Peripheral IVUS"],
          },
        ],
      },
      {
        category: "OCT",
        subCategories: [
          {
            name: "OCT Catheters",
            items: ["Coronary OCT catheter"],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "Temporary & Permanent Pacing",
    categories: [
      {
        category: "Temporary Pacing",
        subCategories: [
          {
            name: "Temporary Pacing",
            items: ["Temporary pacing leads", "External pacemaker"],
          },
        ],
      },
      {
        category: "Permanent Pacemaker Inventory",
        subCategories: [
          {
            name: "Pulse Generators",
            items: ["Single chamber", "Dual chamber", "CRT-P"],
          },
          {
            name: "Leads",
            items: ["RA lead", "RV lead", "LV lead"],
          },
          {
            name: "Leadless Pacemakers",
            items: ["Micra systems"],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "ICD Inventory",
    categories: [
      {
        category: "Devices",
        subCategories: [
          {
            name: "Devices",
            items: ["Single chamber ICD", "Dual chamber ICD", "CRT-D"],
          },
        ],
      },
      {
        category: "Leads",
        subCategories: [
          {
            name: "Leads",
            items: ["ICD shock lead", "DF-1 lead", "DF-4 lead"],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "Electrophysiology Diagnostic Inventory",
    categories: [
      {
        category: "EP Catheters",
        subCategories: [
          {
            name: "Diagnostic Catheters",
            items: [
              "Quadripolar",
              "Decapolar",
              "Duodecapolar",
              "Coronary sinus catheter",
              "His catheter",
              "RV catheter",
            ],
          },
        ],
      },
      {
        category: "Transseptal Equipment",
        subCategories: [
          {
            name: "Needles",
            items: ["BRK Needle", "BRK XS Needle"],
          },
          {
            name: "Sheaths",
            items: ["SL0", "Agilis", "Vizigo", "FlexCath"],
          },
          {
            name: "Guidewires",
            items: ["J-tip wire", "Amplatz wire", "SafeSept wire"],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "Ablation Inventory",
    categories: [
      {
        category: "Radiofrequency Ablation",
        subCategories: [
          {
            name: "RF Ablation Catheters",
            items: [
              "Irrigated tip",
              "Contact force catheter",
              "High-density mapping catheter",
            ],
          },
          {
            name: "RF Accessories",
            items: ["Irrigation pump", "Tubing set"],
          },
        ],
      },
      {
        category: "Cryoablation",
        subCategories: [
          {
            name: "Cryoballoon",
            items: ["23 mm", "28 mm"],
          },
          {
            name: "Accessories",
            items: ["Mapping catheter", "Cryoconsole"],
          },
        ],
      },
      {
        category: "Pulsed Field Ablation",
        subCategories: [
          {
            name: "PFA Catheters",
            items: ["Farapulse system", "PulseSelect system"],
          },
          {
            name: "PFA Generator",
            items: ["Energy generator"],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "Structural Heart Inventory",
    categories: [
      {
        category: "ASD/PFO Closure",
        subCategories: [
          {
            name: "ASD/PFO Closure",
            items: ["PFO occluder", "ASD occluder"],
          },
        ],
      },
      {
        category: "LAA Closure",
        subCategories: [
          {
            name: "LAA Closure",
            items: ["Watchman-type devices", "Amulet-type devices"],
          },
        ],
      },
      {
        category: "TAVR/TAVI",
        subCategories: [
          {
            name: "TAVR/TAVI",
            items: ["Balloon-expandable valves", "Self-expanding valves"],
          },
        ],
      },
      {
        category: "Mitral Interventions",
        subCategories: [
          {
            name: "Mitral Interventions",
            items: ["MitraClip systems", "Transcatheter mitral valves"],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "Mechanical Circulatory Support",
    categories: [
      {
        category: "IABP",
        subCategories: [
          {
            name: "IABP",
            items: ["Balloon catheters", "Console"],
          },
        ],
      },
      {
        category: "Impella",
        subCategories: [
          {
            name: "Impella",
            items: ["Impella CP", "Impella 5.0"],
          },
        ],
      },
      {
        category: "ECMO",
        subCategories: [
          {
            name: "ECMO",
            items: [
              "Arterial cannulas",
              "Venous cannulas",
              "Oxygenators",
              "Circuits",
            ],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "Contrast & Medications",
    categories: [
      {
        category: "Contrast Media",
        subCategories: [
          {
            name: "Contrast Media",
            items: ["Low-osmolar contrast", "Iso-osmolar contrast"],
          },
        ],
      },
      {
        category: "Anticoagulants",
        subCategories: [
          {
            name: "Anticoagulants",
            items: ["Heparin", "Bivalirudin"],
          },
        ],
      },
      {
        category: "Antiplatelets",
        subCategories: [
          {
            name: "Antiplatelets",
            items: ["Aspirin", "Clopidogrel", "Prasugrel", "Ticagrelor"],
          },
        ],
      },
      {
        category: "Emergency Drugs",
        subCategories: [
          {
            name: "Emergency Drugs",
            items: [
              "Adenosine",
              "Atropine",
              "Amiodarone",
              "Epinephrine",
              "Norepinephrine",
              "Lidocaine",
              "Verapamil",
              "Nitroglycerin",
            ],
          },
        ],
      },
    ],
  },
  {
    inventoryGroup: "Consumables",
    categories: [
      {
        category: "Sterile Consumables",
        subCategories: [
          {
            name: "Sterile Consumables",
            items: [
              "Procedure drapes",
              "Radial drapes",
              "Femoral drapes",
              "Gowns",
              "Gloves",
            ],
          },
        ],
      },
      {
        category: "Injection Equipment",
        subCategories: [
          {
            name: "Injection Equipment",
            items: [
              "Manifolds",
              "Stopcocks",
              "Pressure tubing",
              "Contrast syringes",
            ],
          },
        ],
      },
      {
        category: "Closure Devices",
        subCategories: [
          {
            name: "Radial",
            items: ["TR Band", "Compression devices"],
          },
          {
            name: "Femoral",
            items: ["Angio-Seal", "Perclose ProGlide", "Mynx"],
          },
        ],
      },
    ],
  },
];

export default cathLabInventory;
