CREATE TABLE IF NOT EXISTS listings (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  brand         TEXT NOT NULL,
  brandName     TEXT NOT NULL,
  tier          TEXT NOT NULL,
  model         TEXT NOT NULL,
  modelKey      TEXT NOT NULL,
  material      TEXT,
  size          TEXT,
  color         TEXT,
  hardware      TEXT,
  condition     TEXT,
  year          INTEGER,
  accessories   TEXT,
  resellerId    TEXT NOT NULL,
  localPrice    REAL NOT NULL,
  localCurrency TEXT NOT NULL,
  priceUSD      REAL NOT NULL,
  fairValueUSD  REAL,
  mispricingPct REAL,
  daysListed    INTEGER,
  image         TEXT,
  sourceUrl     TEXT,
  sourceId      TEXT,
  firstSeen     TEXT DEFAULT (datetime('now')),
  lastSeen      TEXT DEFAULT (datetime('now')),
  isActive      INTEGER DEFAULT 1,
  UNIQUE(resellerId, sourceId)
);

CREATE INDEX IF NOT EXISTS idx_listings_brand ON listings(brand);
CREATE INDEX IF NOT EXISTS idx_listings_modelKey ON listings(modelKey);
CREATE INDEX IF NOT EXISTS idx_listings_resellerId ON listings(resellerId);
CREATE INDEX IF NOT EXISTS idx_listings_mispricing ON listings(mispricingPct);
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(isActive);

CREATE TABLE IF NOT EXISTS fair_values (
  modelKey      TEXT PRIMARY KEY,
  baseValueUSD  REAL NOT NULL,
  updatedAt     TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS scrape_runs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  resellerId    TEXT NOT NULL,
  startedAt     TEXT DEFAULT (datetime('now')),
  completedAt   TEXT,
  status        TEXT DEFAULT 'running',
  listingsFound INTEGER DEFAULT 0,
  listingsNew   INTEGER DEFAULT 0,
  listingsUpdated INTEGER DEFAULT 0,
  errorMessage  TEXT
);

CREATE TABLE IF NOT EXISTS currency_rates (
  currency      TEXT PRIMARY KEY,
  rateToUSD     REAL NOT NULL,
  updatedAt     TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS price_history (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  listingId     INTEGER NOT NULL,
  priceUSD      REAL NOT NULL,
  localPrice    REAL NOT NULL,
  recordedAt    TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (listingId) REFERENCES listings(id)
);

CREATE INDEX IF NOT EXISTS idx_price_history_listing ON price_history(listingId, recordedAt);

CREATE TABLE IF NOT EXISTS model_price_history (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  modelKey      TEXT NOT NULL,
  medianPriceUSD REAL NOT NULL,
  listingCount  INTEGER NOT NULL,
  recordedAt    TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_model_price_history ON model_price_history(modelKey, recordedAt);
