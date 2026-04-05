// Test different Fashionphile collection endpoints
async function test() {
  var urls = [
    'https://www.fashionphile.com/collections/handbags/products.json?limit=3',
    'https://www.fashionphile.com/collections/all/products.json?limit=3',
    'https://www.fashionphile.com/products.json?limit=3',
  ]

  for (var url of urls) {
    console.log('Testing: ' + url)
    try {
      var res = await fetch(url)
      if (!res.ok) {
        console.log('  Status: ' + res.status + '\n')
        continue
      }
      var data = await res.json()
      console.log('  Products: ' + (data.products ? data.products.length : 0))
      if (data.products && data.products[0]) {
        console.log('  First: ' + data.products[0].title + ' - $' + (data.products[0].variants[0]?.price || 'N/A'))
        console.log('  Vendor: ' + data.products[0].vendor)
      }
      console.log()
    } catch(e) {
      console.log('  Error: ' + e.message + '\n')
    }
  }

  // Try paginating the handbags collection
  console.log('Pagination test (handbags):')
  for (var p = 1; p <= 3; p++) {
    var res = await fetch('https://www.fashionphile.com/collections/handbags/products.json?limit=50&page=' + p)
    if (!res.ok) { console.log('  Page ' + p + ': ' + res.status); break }
    var data = await res.json()
    console.log('  Page ' + p + ': ' + (data.products ? data.products.length : 0) + ' products')
    if (!data.products || data.products.length === 0) break
  }
}

test().catch(function(e) { console.error(e.message) })
