// Simplified world map SVG paths (Natural Earth projection, simplified)
// Only major continents needed as background context

export const CONTINENT_PATHS = {
  northAmerica: 'M 55 85 L 80 60 L 120 55 L 145 70 L 160 90 L 155 110 L 170 130 L 180 160 L 170 175 L 155 165 L 140 170 L 130 160 L 115 165 L 100 150 L 90 130 L 75 120 L 60 110 L 50 95 Z',
  southAmerica: 'M 155 175 L 170 175 L 185 195 L 190 220 L 195 250 L 190 280 L 180 300 L 170 310 L 160 300 L 155 280 L 150 255 L 145 230 L 148 210 L 150 195 Z',
  europe: 'M 255 55 L 275 50 L 295 55 L 310 60 L 300 75 L 290 85 L 280 90 L 270 95 L 260 90 L 250 80 L 245 70 Z',
  africa: 'M 255 110 L 275 105 L 295 110 L 310 120 L 315 140 L 320 165 L 315 195 L 305 220 L 290 240 L 275 245 L 265 235 L 255 215 L 245 190 L 240 165 L 242 140 L 248 120 Z',
  asia: 'M 310 50 L 340 40 L 370 35 L 400 40 L 430 50 L 450 60 L 460 75 L 450 90 L 435 100 L 420 110 L 400 120 L 380 130 L 360 125 L 340 120 L 320 110 L 310 95 L 305 80 L 308 65 Z',
  middleEast: 'M 310 95 L 330 90 L 345 100 L 340 115 L 325 120 L 310 115 L 305 105 Z',
  india: 'M 355 100 L 375 95 L 385 110 L 380 130 L 370 145 L 360 140 L 350 125 L 348 110 Z',
  southeastAsia: 'M 400 110 L 420 105 L 440 115 L 450 130 L 440 145 L 425 150 L 410 140 L 400 125 Z',
  australia: 'M 415 230 L 445 220 L 470 225 L 480 240 L 475 260 L 460 275 L 440 280 L 420 270 L 410 255 L 412 240 Z',
}

// Country pin positions (x, y on 520x340 SVG viewBox)
export const COUNTRY_PINS = {
  US: { x: 110, y: 105, name: 'United States', flag: '🇺🇸' },
  UK: { x: 260, y: 65, name: 'United Kingdom', flag: '🇬🇧' },
  AU: { x: 450, y: 255, name: 'Australia', flag: '🇦🇺' },
  AE: { x: 325, y: 110, name: 'Dubai, UAE', flag: '🇦🇪' },
  IN: { x: 365, y: 120, name: 'India', flag: '🇮🇳' },
  SG: { x: 420, y: 155, name: 'Singapore', flag: '🇸🇬' },
  FR: { x: 265, y: 75, name: 'France', flag: '🇫🇷' },
  JP: { x: 455, y: 85, name: 'Japan', flag: '🇯🇵' },
  DE: { x: 275, y: 68, name: 'Germany', flag: '🇩🇪' },
}
