// Stylized SVG bag silhouettes for each iconic model
// In production, replace with real product images from reseller APIs
const BAG_SVGS = {
  birkin: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M70 45 Q75 20 100 18 Q125 20 130 45" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <path d="M35 55 L40 155 Q42 165 55 165 L145 165 Q158 165 160 155 L165 55 Q165 45 155 45 L45 45 Q35 45 35 55Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap */}
      <path d="M45 45 L50 80 L150 80 L155 45" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5"/>
      {/* Sangles (straps) */}
      <line x1="75" y1="45" x2="78" y2="80" stroke={color} strokeWidth="1.5"/>
      <line x1="125" y1="45" x2="122" y2="80" stroke={color} strokeWidth="1.5"/>
      {/* Turn lock */}
      <circle cx="100" cy="82" r="6" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5"/>
      <rect x="97" y="79" width="6" height="6" rx="1" fill={color} fillOpacity="0.4"/>
      {/* Feet */}
      <circle cx="55" cy="167" r="2.5" fill={color} fillOpacity="0.4"/>
      <circle cx="145" cy="167" r="2.5" fill={color} fillOpacity="0.4"/>
      {/* Key clochette */}
      <path d="M82 80 L82 100 Q82 105 86 105 L90 105 Q94 105 94 100 L94 80" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1"/>
    </svg>
  ),

  kelly: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M80 42 Q85 15 100 13 Q115 15 120 42" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Body - more structured/boxy */}
      <path d="M42 50 L45 155 Q46 163 56 163 L144 163 Q154 163 155 155 L158 50 Q158 42 148 42 L52 42 Q42 42 42 50Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap - pointed */}
      <path d="M52 42 L60 90 L100 100 L140 90 L148 42" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5"/>
      {/* Turn lock */}
      <rect x="93" y="95" width="14" height="8" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
      {/* Strap */}
      <path d="M100 100 L100 130" stroke={color} strokeWidth="1.5" strokeDasharray="3 2"/>
      {/* Feet */}
      <circle cx="60" cy="165" r="2.5" fill={color} fillOpacity="0.4"/>
      <circle cx="140" cy="165" r="2.5" fill={color} fillOpacity="0.4"/>
    </svg>
  ),

  constance: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strap */}
      <path d="M45 30 Q100 10 155 30" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Body - compact rectangle */}
      <rect x="40" y="55" width="120" height="85" rx="6" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap */}
      <path d="M40 55 L40 105 L160 105 L160 55 Q160 50 155 50 L100 50 Q95 50 90 55 L45 105" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"/>
      {/* H clasp */}
      <rect x="88" y="88" width="24" height="30" rx="2" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2"/>
      <line x1="100" y1="88" x2="100" y2="118" stroke={color} strokeWidth="2"/>
      <line x1="88" y1="103" x2="112" y2="103" stroke={color} strokeWidth="2"/>
    </svg>
  ),

  picotin: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M75 50 Q80 20 100 18 Q120 20 125 50" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Bucket body */}
      <path d="M50 50 L55 155 Q56 165 70 165 L130 165 Q144 165 145 155 L150 50 Q150 42 140 42 L60 42 Q50 42 50 50Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Lock tab */}
      <rect x="92" y="40" width="16" height="20" rx="3" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
      <circle cx="100" cy="52" r="3" fill={color} fillOpacity="0.3"/>
    </svg>
  ),

  garden: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M65 55 Q70 25 85 22" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M135 55 Q130 25 115 22" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Tote body */}
      <path d="M35 55 L45 160 Q46 165 55 165 L145 165 Q154 165 155 160 L165 55 Q165 48 158 48 L42 48 Q35 48 35 55Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Leather trim top */}
      <rect x="35" y="48" width="130" height="15" rx="3" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1"/>
    </svg>
  ),

  classic: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chain strap */}
      <path d="M40 35 Q50 15 100 12 Q150 15 160 35" stroke={color} strokeWidth="2" fill="none" strokeDasharray="4 3"/>
      {/* Body */}
      <rect x="35" y="50" width="130" height="95" rx="8" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Quilting pattern */}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <line x1="35" y1={70 + i*22} x2="165" y2={70 + i*22} stroke={color} strokeWidth="0.5" strokeOpacity="0.3"/>
        </g>
      ))}
      {[0,1,2,3,4].map(i => (
        <line key={`v${i}`} x1={55 + i*25} y1="50" x2={55 + i*25} y2="145" stroke={color} strokeWidth="0.5" strokeOpacity="0.3"/>
      ))}
      {/* CC turn lock */}
      <circle cx="100" cy="95" r="10" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5"/>
      <text x="93" y="99" fontSize="11" fill={color} fillOpacity="0.5" fontFamily="serif" fontWeight="bold">CC</text>
      {/* Flap */}
      <path d="M35 50 L35 95 Q35 100 40 100 L160 100 Q165 100 165 95 L165 50" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.4"/>
    </svg>
  ),

  boy: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chain strap */}
      <path d="M35 40 Q50 18 100 15 Q150 18 165 40" stroke={color} strokeWidth="2.5" fill="none"/>
      {/* Body - more rectangular */}
      <rect x="30" y="55" width="140" height="90" rx="4" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Quilting - chevron pattern */}
      {[0,1,2].map(i => (
        <path key={i} d={`M30 ${75 + i*25} L100 ${65 + i*25} L170 ${75 + i*25}`} stroke={color} strokeWidth="0.6" strokeOpacity="0.3" fill="none"/>
      ))}
      {/* Boy clasp - rectangular */}
      <rect x="80" y="88" width="40" height="25" rx="2" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2"/>
      <line x1="100" y1="88" x2="100" y2="113" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),

  '19': (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Multi-chain strap */}
      <path d="M40 40 Q70 18 100 15 Q130 18 160 40" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M45 42 Q72 22 100 19 Q128 22 155 42" stroke={color} strokeWidth="1.5" fill="none" strokeOpacity="0.4"/>
      {/* Soft body */}
      <rect x="32" y="50" width="136" height="100" rx="12" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Quilting */}
      {[0,1,2,3].map(i => (
        <line key={i} x1="32" y1={72 + i*22} x2="168" y2={72 + i*22} stroke={color} strokeWidth="0.5" strokeOpacity="0.25"/>
      ))}
      {/* CC turn lock */}
      <circle cx="100" cy="100" r="12" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5"/>
      <text x="91" y="105" fontSize="13" fill={color} fillOpacity="0.4" fontFamily="serif" fontWeight="bold">CC</text>
    </svg>
  ),

  woc: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chain */}
      <path d="M30 45 Q60 10 100 8 Q140 10 170 45" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      {/* Slim body */}
      <rect x="35" y="60" width="130" height="75" rx="5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Quilting */}
      {[0,1,2].map(i => (
        <line key={i} x1="35" y1={78 + i*20} x2="165" y2={78 + i*20} stroke={color} strokeWidth="0.5" strokeOpacity="0.3"/>
      ))}
      {/* CC */}
      <circle cx="100" cy="95" r="8" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),

  deauville: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M60 52 Q65 22 80 20" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M140 52 Q135 22 120 20" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Large tote body */}
      <path d="M25 52 L35 160 Q36 167 48 167 L152 167 Q164 167 165 160 L175 52 Q175 45 165 45 L35 45 Q25 45 25 52Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Brand panel */}
      <rect x="60" y="75" width="80" height="55" rx="4" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1"/>
    </svg>
  ),

  gabrielle: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dual strap */}
      <path d="M50 48 Q75 20 100 18 Q125 20 150 48" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M55 48 Q78 25 100 23 Q122 25 145 48" stroke={color} strokeWidth="1.5" fill="none" strokeOpacity="0.5" strokeDasharray="4 2"/>
      {/* Hobo body */}
      <path d="M40 55 Q38 160 100 165 Q162 160 160 55 Q160 48 150 48 L50 48 Q40 48 40 55Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* CC logo */}
      <text x="88" y="112" fontSize="16" fill={color} fillOpacity="0.3" fontFamily="serif" fontWeight="bold">CC</text>
    </svg>
  ),

  lady: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M70 50 Q75 22 100 20 Q125 22 130 50" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Body - structured square */}
      <rect x="40" y="55" width="120" height="100" rx="5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Cannage quilting - diamond pattern */}
      {[0,1,2,3].map(i => (
        <line key={`d1${i}`} x1={40} y1={75 + i*22} x2={160} y2={75 + i*22} stroke={color} strokeWidth="0.5" strokeOpacity="0.25"/>
      ))}
      {[0,1,2,3,4].map(i => (
        <line key={`d2${i}`} x1={60 + i*22} y1="55" x2={60 + i*22} y2="155" stroke={color} strokeWidth="0.5" strokeOpacity="0.25"/>
      ))}
      {/* D-I-O-R charms */}
      {['D','I','O','R'].map((ch, i) => (
        <g key={ch}>
          <circle cx={138 + i*7} cy={50} r="4" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="0.8"/>
          <text x={135.5 + i*7} y={53} fontSize="5" fill={color} fillOpacity="0.6" fontWeight="bold">{ch}</text>
        </g>
      ))}
    </svg>
  ),

  saddle: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strap */}
      <path d="M50 40 Q80 15 120 30" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Saddle body - asymmetric */}
      <path d="M35 60 Q33 150 60 158 L130 158 Q165 155 168 60 Q168 45 150 42 L100 40 Q55 38 35 60Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap */}
      <path d="M35 60 Q80 50 100 65 Q120 80 168 60" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"/>
      {/* D stirrup */}
      <path d="M90 55 Q85 40 95 38 Q105 36 108 48" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  booktote: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M55 55 Q60 25 75 22" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M145 55 Q140 25 125 22" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Wide tote body */}
      <rect x="25" y="50" width="150" height="110" rx="4" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Oblique pattern */}
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i} x1={25 + i*25} y1="50" x2={45 + i*25} y2="160" stroke={color} strokeWidth="0.5" strokeOpacity="0.2"/>
      ))}
      {/* DIOR text */}
      <text x="62" y="115" fontSize="22" fill={color} fillOpacity="0.15" fontFamily="serif" fontWeight="bold" letterSpacing="8">DIOR</text>
    </svg>
  ),

  bobby: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strap */}
      <path d="M45 42 Q100 15 155 42" stroke={color} strokeWidth="2.5" fill="none"/>
      {/* Rounded body */}
      <path d="M35 60 Q33 155 100 160 Q167 155 165 60 Q165 45 150 45 L50 45 Q35 45 35 60Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap */}
      <path d="M50 45 L55 100 L145 100 L150 45" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"/>
      {/* CD clasp */}
      <circle cx="100" cy="102" r="10" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2"/>
    </svg>
  ),

  montaigne: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strap */}
      <path d="M40 45 Q100 15 160 45" stroke={color} strokeWidth="2" fill="none"/>
      {/* Body */}
      <rect x="32" y="50" width="136" height="95" rx="6" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap */}
      <path d="M32 50 L32 100 L168 100 L168 50" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1"/>
      {/* CD clasp */}
      <rect x="82" y="92" width="36" height="16" rx="3" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5"/>
      <text x="90" y="104" fontSize="10" fill={color} fillOpacity="0.4" fontFamily="serif" fontWeight="bold">CD</text>
    </svg>
  ),

  neverfull: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M55 52 Q60 20 78 18" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M145 52 Q140 20 122 18" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Tote body - cinched sides */}
      <path d="M30 52 L45 162 Q46 168 58 168 L142 168 Q154 168 155 162 L170 52 Q170 46 162 46 L38 46 Q30 46 30 52Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* LV monogram hints */}
      {[0,1,2].map(r => [0,1,2].map(c => (
        <circle key={`${r}${c}`} cx={70 + c*30} cy={80 + r*30} r="3" fill={color} fillOpacity="0.1"/>
      )))}
      {/* Side cinch */}
      <line x1="36" y1="90" x2="36" y2="130" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
      <line x1="164" y1="90" x2="164" y2="130" stroke={color} strokeWidth="1.5" strokeOpacity="0.4"/>
    </svg>
  ),

  speedy: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M65 52 Q70 22 90 18" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M135 52 Q130 22 110 18" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Barrel body */}
      <ellipse cx="100" cy="110" rx="68" ry="52" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Zipper */}
      <path d="M40 85 Q100 60 160 85" stroke={color} strokeWidth="1.5" strokeDasharray="3 2"/>
      {/* Lock */}
      <circle cx="100" cy="78" r="5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5"/>
      {/* Strap */}
      <path d="M55 95 Q50 45 60 40" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  ),

  alma: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M70 50 Q75 22 90 18" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M130 50 Q125 22 110 18" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Dome body */}
      <path d="M40 90 Q38 160 100 165 Q162 160 160 90 Q160 50 130 48 L70 48 Q40 50 40 90Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Zipper */}
      <path d="M55 60 Q100 48 145 60" stroke={color} strokeWidth="1.5" strokeDasharray="3 2"/>
      {/* Lock */}
      <rect x="93" y="52" width="14" height="10" rx="2" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1"/>
    </svg>
  ),

  capucines: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M75 48 Q80 20 100 18 Q120 20 125 48" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <rect x="38" y="52" width="124" height="100" rx="5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap with jewel clasp */}
      <path d="M38 52 L38 95 L162 95 L162 52" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1"/>
      {/* LV jewel */}
      <path d="M90 93 L100 83 L110 93" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.15"/>
      <path d="M90 93 L100 103 L110 93" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.15"/>
    </svg>
  ),

  twist: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chain strap */}
      <path d="M40 42 Q100 15 160 42" stroke={color} strokeWidth="2" fill="none"/>
      {/* Body */}
      <rect x="35" y="55" width="130" height="90" rx="6" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* LV twist lock */}
      <rect x="82" y="90" width="36" height="20" rx="4" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2" transform="rotate(-10, 100, 100)"/>
      <text x="88" y="104" fontSize="11" fill={color} fillOpacity="0.4" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-10, 100, 100)">LV</text>
    </svg>
  ),

  metis: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M78 50 Q82 30 100 28 Q118 30 122 50" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <rect x="42" y="52" width="116" height="100" rx="6" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap */}
      <path d="M42 52 L42 105 L158 105 L158 52" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1"/>
      {/* S-lock */}
      <path d="M94 98 Q92 92 98 90 Q104 88 106 94 Q108 100 102 102 Q96 104 94 98Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),

  onthego: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M50 55 Q55 22 72 18" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M150 55 Q145 22 128 18" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Large tote body */}
      <path d="M25 55 L38 160 Q40 168 52 168 L148 168 Q160 168 162 160 L175 55 Q175 48 165 48 L35 48 Q25 48 25 55Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Monogram pattern */}
      <text x="65" y="115" fontSize="28" fill={color} fillOpacity="0.18" fontFamily="serif" fontWeight="bold">LV</text>
    </svg>
  ),

  stlouis: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M60 52 Q65 20 80 16" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M140 52 Q135 20 120 16" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Tote body */}
      <path d="M28 50 L42 162 Q43 168 55 168 L145 168 Q157 168 158 162 L172 50 Q172 44 164 44 L36 44 Q28 44 28 50Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Chevron pattern */}
      {[0,1,2,3,4,5].map(i => (
        <path key={i} d={`M35 ${65 + i*18} L100 ${55 + i*18} L165 ${65 + i*18}`} stroke={color} strokeWidth="0.5" strokeOpacity="0.2" fill="none"/>
      ))}
    </svg>
  ),

  anjou: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M65 55 Q70 25 82 20" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M135 55 Q130 25 118 20" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Structured tote */}
      <rect x="32" y="50" width="136" height="112" rx="4" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Chevron pattern */}
      {[0,1,2,3].map(i => (
        <path key={i} d={`M32 ${72 + i*24} L100 ${62 + i*24} L168 ${72 + i*24}`} stroke={color} strokeWidth="0.5" strokeOpacity="0.2" fill="none"/>
      ))}
    </svg>
  ),

  capvert: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strap */}
      <path d="M45 40 Q100 15 155 40" stroke={color} strokeWidth="2" fill="none"/>
      {/* Crossbody body */}
      <rect x="40" y="50" width="120" height="90" rx="8" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap */}
      <path d="M40 50 L40 95 L160 95 L160 50" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1"/>
      {/* Chevron */}
      {[0,1].map(i => (
        <path key={i} d={`M40 ${68 + i*22} L100 ${58 + i*22} L160 ${68 + i*22}`} stroke={color} strokeWidth="0.5" strokeOpacity="0.2" fill="none"/>
      ))}
    </svg>
  ),

  jodie: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Knotted handle */}
      <path d="M80 48 Q60 30 65 20 Q70 10 82 18 Q90 25 88 40" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Hobo body */}
      <path d="M40 60 Q35 155 100 162 Q165 155 160 60 Q158 48 145 48 L55 48 Q42 48 40 60Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Intrecciato weave */}
      {[0,1,2,3].map(r => [0,1,2,3,4].map(c => (
        <rect key={`${r}${c}`} x={55 + c*20} y={72 + r*22} width="12" height="14" rx="2" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.4" strokeOpacity="0.3"/>
      )))}
    </svg>
  ),

  cassette: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strap */}
      <path d="M35 42 Q100 12 165 42" stroke={color} strokeWidth="2.5" fill="none"/>
      {/* Body */}
      <rect x="30" y="55" width="140" height="90" rx="8" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Intrecciato rows */}
      {[0,1,2].map(r => [0,1,2,3,4,5].map(c => (
        <rect key={`${r}${c}`} x={38 + c*22} y={65 + r*28} width="16" height="20" rx="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.5" strokeOpacity="0.3"/>
      )))}
      {/* Triangle clasp */}
      <path d="M92 52 L100 42 L108 52" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),

  pouch: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cloud/pouch body */}
      <path d="M25 80 Q25 50 60 48 Q80 46 100 48 Q120 46 140 48 Q175 50 175 80 L175 140 Q175 165 145 165 L55 165 Q25 165 25 140Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Gathered top */}
      <path d="M40 68 Q70 58 100 62 Q130 58 160 68" stroke={color} strokeWidth="1" strokeOpacity="0.4" fill="none"/>
      {/* Soft folds */}
      {[0,1,2].map(i => (
        <path key={i} d={`M${45 + i*42} 80 Q${65 + i*42} 75 ${85 + i*42} 80`} stroke={color} strokeWidth="0.5" strokeOpacity="0.2" fill="none"/>
      ))}
    </svg>
  ),

  arco: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M60 55 Q65 25 80 20" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M140 55 Q135 25 120 20" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Structured tote */}
      <rect x="30" y="50" width="140" height="112" rx="5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Intrecciato */}
      {[0,1,2,3].map(r => [0,1,2,3,4,5].map(c => (
        <rect key={`${r}${c}`} x={38 + c*22} y={60 + r*25} width="14" height="17" rx="2" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.4" strokeOpacity="0.25"/>
      )))}
    </svg>
  ),

  luggage: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M75 48 Q80 22 92 18" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M125 48 Q120 22 108 18" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Wings */}
      <path d="M32 52 L28 160 Q28 168 40 168 L50 168 L50 52Z" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5"/>
      <path d="M168 52 L172 160 Q172 168 160 168 L150 168 L150 52Z" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5"/>
      {/* Main body */}
      <rect x="50" y="48" width="100" height="118" rx="4" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Face - zipper smile */}
      <path d="M65 95 Q100 115 135 95" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Zipper pull */}
      <rect x="95" y="48" width="10" height="12" rx="2" fill={color} fillOpacity="0.2"/>
    </svg>
  ),

  belt: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M78 50 Q82 28 100 25 Q118 28 122 50" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <path d="M38 55 L42 158 Q43 165 55 165 L145 165 Q157 165 158 158 L162 55 Q162 48 152 48 L48 48 Q38 48 38 55Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Belt strap */}
      <rect x="88" y="42" width="24" height="30" rx="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"/>
      <circle cx="100" cy="60" r="3" fill={color} fillOpacity="0.3"/>
    </svg>
  ),

  triomphe: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strap */}
      <path d="M42 42 Q100 15 158 42" stroke={color} strokeWidth="2" fill="none"/>
      {/* Body */}
      <rect x="35" y="52" width="130" height="95" rx="6" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap */}
      <path d="M35 52 L35 100 L165 100 L165 52" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1"/>
      {/* Triomphe clasp */}
      <circle cx="100" cy="100" r="12" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="2"/>
      <circle cx="100" cy="100" r="7" fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),

  sangle: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strap */}
      <path d="M52 52 L52 20 Q52 12 60 12 L62 12" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Bucket body */}
      <rect x="35" y="48" width="130" height="115" rx="5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Zipper top */}
      <line x1="35" y1="65" x2="165" y2="65" stroke={color} strokeWidth="1" strokeDasharray="3 2"/>
    </svg>
  ),

  loulou: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chain */}
      <path d="M38 42 Q100 12 162 42" stroke={color} strokeWidth="2" fill="none"/>
      {/* Puffy body */}
      <rect x="30" y="52" width="140" height="98" rx="10" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Chevron quilting */}
      {[0,1,2,3].map(i => (
        <path key={i} d={`M30 ${72 + i*22} L100 ${62 + i*22} L170 ${72 + i*22}`} stroke={color} strokeWidth="0.6" strokeOpacity="0.3" fill="none"/>
      ))}
      {/* YSL logo */}
      <text x="85" y="108" fontSize="16" fill={color} fillOpacity="0.2" fontFamily="serif" fontWeight="bold">YSL</text>
    </svg>
  ),

  kate: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chain */}
      <path d="M35 40 Q100 10 165 40" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      {/* Slim envelope body */}
      <rect x="30" y="55" width="140" height="80" rx="3" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap */}
      <path d="M30 55 L30 95 L170 95 L170 55" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1"/>
      {/* YSL tassel */}
      <text x="88" y="92" fontSize="12" fill={color} fillOpacity="0.3" fontFamily="serif" fontWeight="bold">YSL</text>
      <line x1="100" y1="95" x2="100" y2="125" stroke={color} strokeWidth="1.5"/>
      {[0,1,2].map(i => (
        <line key={i} x1={96 + i*2} y1="118" x2={96 + i*2} y2="132" stroke={color} strokeWidth="0.8" strokeOpacity="0.5"/>
      ))}
    </svg>
  ),

  envelope: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chain */}
      <path d="M38 42 Q100 12 162 42" stroke={color} strokeWidth="2" fill="none"/>
      {/* Body */}
      <rect x="28" y="50" width="144" height="100" rx="5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Chevron quilting */}
      {[0,1,2,3].map(i => (
        <path key={i} d={`M28 ${70 + i*22} L100 ${60 + i*22} L172 ${70 + i*22}`} stroke={color} strokeWidth="0.6" strokeOpacity="0.25" fill="none"/>
      ))}
      {/* Pointed flap */}
      <path d="M28 50 L100 100 L172 50" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"/>
      {/* YSL */}
      <text x="88" y="98" fontSize="12" fill={color} fillOpacity="0.3" fontFamily="serif" fontWeight="bold">YSL</text>
    </svg>
  ),

  baguette: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Short handle */}
      <path d="M130 52 Q140 30 155 28 Q168 30 168 48" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Compact body */}
      <rect x="30" y="55" width="140" height="80" rx="6" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* FF pattern */}
      {[0,1,2].map(r => [0,1,2,3,4].map(c => (
        <text key={`${r}${c}`} x={40 + c*28} y={78 + r*25} fontSize="10" fill={color} fillOpacity="0.18" fontWeight="bold">FF</text>
      )))}
      {/* Magnetic clasp */}
      <rect x="150" y="80" width="18" height="28" rx="3" fill={color} fillOpacity="0.18" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),

  peekaboo: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M72 48 Q78 20 100 17 Q122 20 128 48" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <rect x="35" y="50" width="130" height="108" rx="5" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Open peek */}
      <path d="M35 50 Q100 62 165 50" stroke={color} strokeWidth="1.5" fill="none"/>
      {/* Turn locks */}
      <circle cx="55" cy="56" r="4" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1"/>
      <circle cx="145" cy="56" r="4" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1"/>
    </svg>
  ),

  first: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M60 50 Q65 25 80 20" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* Curved body */}
      <path d="M30 55 Q28 155 100 160 Q172 155 170 55 Q170 48 160 48 L40 48 Q30 48 30 55Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* F clasp */}
      <rect x="85" y="48" width="30" height="15" rx="3" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"/>
      <text x="94" y="59" fontSize="9" fill={color} fillOpacity="0.4" fontWeight="bold">FF</text>
    </svg>
  ),

  galleria: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M68 50 Q72 22 88 18" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M132 50 Q128 22 112 18" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Structured body */}
      <rect x="35" y="48" width="130" height="110" rx="4" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Saffiano texture - crosshatch */}
      {[0,1,2,3,4,5].map(i => (
        <g key={i}>
          <line x1={35} y1={60 + i*18} x2={165} y2={60 + i*18} stroke={color} strokeWidth="0.3" strokeOpacity="0.15"/>
          <line x1={50 + i*22} y1="48" x2={50 + i*22} y2="158" stroke={color} strokeWidth="0.3" strokeOpacity="0.15"/>
        </g>
      ))}
      {/* Triangle logo */}
      <path d="M88 95 L100 78 L112 95Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),

  reedition: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chain + nylon strap */}
      <path d="M35 50 Q100 20 165 50" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      <path d="M40 55 Q100 28 160 55" stroke={color} strokeWidth="2.5" fill="none"/>
      {/* Compact body */}
      <rect x="40" y="60" width="120" height="70" rx="8" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Front pocket */}
      <rect x="50" y="70" width="100" height="50" rx="5" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1"/>
      {/* Triangle logo */}
      <path d="M90 98 L100 82 L110 98Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"/>
      {/* Snap */}
      <circle cx="100" cy="60" r="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1"/>
    </svg>
  ),

  cleo: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Strap */}
      <path d="M45 42 Q100 15 155 42" stroke={color} strokeWidth="2" fill="none"/>
      {/* Curved body */}
      <path d="M35 55 Q32 150 100 158 Q168 150 165 55 Q165 48 155 48 L45 48 Q35 48 35 55Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Flap */}
      <path d="M45 48 L50 95 L150 95 L155 48" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5"/>
      {/* Prada text */}
      <text x="72" y="90" fontSize="12" fill={color} fillOpacity="0.15" fontFamily="serif" letterSpacing="4">PRADA</text>
    </svg>
  ),

  puzzle: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M75 48 Q80 22 100 18 Q120 22 125 48" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Geometric body */}
      <path d="M38 52 L42 160 Q43 165 55 165 L145 165 Q157 165 158 160 L162 52 Q162 48 155 48 L45 48 Q38 48 38 52Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Puzzle panels */}
      <line x1="100" y1="48" x2="100" y2="165" stroke={color} strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="38" y1="105" x2="100" y2="95" stroke={color} strokeWidth="1" strokeOpacity="0.3"/>
      <line x1="100" y1="95" x2="162" y2="115" stroke={color} strokeWidth="1" strokeOpacity="0.3"/>
      <path d="M38 52 L100 75 L162 52" stroke={color} strokeWidth="1" strokeOpacity="0.3" fill="none"/>
    </svg>
  ),

  hammock: (color) => (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handles */}
      <path d="M68 50 Q73 22 88 18" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M132 50 Q127 22 112 18" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Expandable body */}
      <path d="M35 50 L40 155 Q42 165 55 165 L145 165 Q158 165 160 155 L165 50 Q165 45 155 45 L45 45 Q35 45 35 50Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
      {/* Side wings */}
      <path d="M35 80 L20 120 L35 140" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15"/>
      <path d="M165 80 L180 120 L165 140" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15"/>
      {/* Zipper */}
      <line x1="45" y1="55" x2="155" y2="55" stroke={color} strokeWidth="1" strokeDasharray="3 2"/>
    </svg>
  ),
}

// Color mapping for SVG strokes
const BRAND_COLORS = {
  hermes: '#e8935a',
  chanel: '#a8a8a8',
  dior: '#7b9bc7',
  louisvuitton: '#c4943a',
  goyard: '#d4b84a',
  bottega: '#5a9a6a',
  celine: '#9a8a7a',
  ysl: '#c75a5a',
  fendi: '#d4a84a',
  prada: '#8a9aaa',
  loewe: '#5aa0a0',
}

export default function BagImage({ image, brand, className = '' }) {
  const color = BRAND_COLORS[brand] || '#c9a96e'
  const renderer = BAG_SVGS[image]

  if (!renderer) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M70 45 Q75 20 100 18 Q125 20 130 45" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
          <rect x="40" y="50" width="120" height="110" rx="8" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2"/>
        </svg>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {renderer(color)}
    </div>
  )
}
