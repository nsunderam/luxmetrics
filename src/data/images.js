// Real bag image URLs from Pexels (free, no attribution required)
// Each model maps to a Pexels photo URL with auto-compress for fast loading
// Falls back to SVG silhouettes in BagImage component if image fails to load

const pexels = (id, w = 400, h = 400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`

export const BAG_IMAGES = {
  // Hermès - structured leather bags
  birkin: pexels(1152077),      // orange/brown structured leather satchel
  kelly: pexels(2977304),       // brown leather structured handbag
  constance: pexels(3777932),   // close-up leather handbag detail
  picotin: pexels(1936848),     // brown leather tote bag
  garden: pexels(9603489),      // white leather tote

  // Chanel
  classic: pexels(6062560),     // black Chanel bag on pink surface
  boy: pexels(1374910),         // black leather handbag
  '19': pexels(6650001),        // brown and black leather bags close-up
  woc: pexels(336372),          // shoes and bag close-up
  deauville: pexels(4068314),   // white tote bag
  gabrielle: pexels(6650009),   // person holding brown leather handbag

  // Dior
  lady: pexels(5591912),        // luxury handbag on armchair
  saddle: pexels(19197738),     // close-up handbag
  booktote: pexels(6786706),    // person holding tote bag
  bobby: pexels(22432984),      // beige handbag with gold hardware
  montaigne: pexels(157888),    // brown leather crossbody bag

  // Louis Vuitton
  neverfull: pexels(4276653),   // LV monogram leather handbag
  speedy: pexels(12194934),     // woman holding designer bag
  alma: pexels(575435),         // two brown and black handbags
  capucines: pexels(27151080),  // portrait woman holding bag
  twist: pexels(1653222),       // woman holding bag
  metis: pexels(167703),        // brown leather crossbody with accessories
  onthego: pexels(8991036),     // woman holding black bag

  // Goyard
  stlouis: pexels(5926245),     // colorful shopping bags
  anjou: pexels(15320823),      // woman holding handbag
  capvert: pexels(1004877),     // woman holding bags

  // Bottega Veneta
  jodie: pexels(2977304),       // structured leather handbag
  cassette: pexels(3777932),    // close-up leather detail
  pouch: pexels(6650009),       // holding leather handbag
  arco: pexels(575435),         // leather handbags

  // Celine
  luggage: pexels(1374910),     // black leather structured bag
  belt: pexels(167703),         // brown leather crossbody
  triomphe: pexels(336372),     // bag close-up
  sangle: pexels(1936848),      // leather tote

  // Saint Laurent
  loulou: pexels(6062560),      // black quilted bag
  kate: pexels(6650001),        // leather bags close-up
  envelope: pexels(1374910),    // black leather bag

  // Fendi
  baguette: pexels(22432984),   // handbag with hardware
  peekaboo: pexels(5591912),    // luxury handbag
  first: pexels(19197738),      // handbag close-up

  // Prada
  galleria: pexels(2977304),    // structured leather bag
  reedition: pexels(157888),    // crossbody bag
  cleo: pexels(3777932),        // leather handbag detail

  // Loewe
  puzzle: pexels(1152077),      // structured leather bag
  hammock: pexels(6650009),     // leather handbag
}
