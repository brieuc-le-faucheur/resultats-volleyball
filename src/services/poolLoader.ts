import type { Pool } from '../config'
import { config } from '../config'

interface PoolsData {
  pools: Pool[]
  timestamp: number
}

// Cache duration for pools: 2 months in milliseconds
const POOLS_CACHE_DURATION = 2 * 30 * 24 * 60 * 60 * 1000

/**
 * Load pools for a competition from FFVB website
 */
export async function loadPoolsForCompetition(codent: string, saison: string): Promise<Pool[]> {
  const cacheKey = `pools-${codent}-${saison.replace('/', '-')}`

  // Try loading from cache first
  const cached = loadFromCache(cacheKey)
  if (cached) {
    console.log(`Pools loaded from cache for ${codent}`)
    return cached
  }

  // Fetch from FFVB
  const url = `https://www.ffvbbeach.org/ffvbapp/resu/vbspo_home.php?saison=${encodeURIComponent(saison)}&codent=${codent}`
  const corsUrl = config.corsProxy + url

  try {
    const response = await fetch(corsUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch pools: ${response.status}`)
    }

    // Get response as blob and decode with ISO-8859-1 (Latin-1) encoding
    // FFVB uses ISO-8859-1 encoding, not UTF-8
    const blob = await response.blob()
    const html = new TextDecoder('iso-8859-1').decode(await blob.arrayBuffer())
    const pools = parsePoolsFromHTML(html)

    // Save to cache
    saveToCache(cacheKey, pools)
    console.log(`Pools loaded from FFVB for ${codent}: ${pools.length} pools`)

    return pools
  } catch (error) {
    console.error('Error loading pools:', error)
    return []
  }
}

/**
 * Parse pools from FFVB HTML
 */
function parsePoolsFromHTML(html: string): Pool[] {
  const pools: Pool[] = []
  let currentCategory = ''

  // Split HTML by category sections
  const sections = html.split(/<a href="#">/)

  sections.forEach(section => {
    // Extract category name
    const categoryMatch = section.match(/^([^<]+)<\/a>/)
    if (categoryMatch?.[1]) {
      currentCategory = categoryMatch[1].trim()
    }

    // Extract pool links
    // Format: <a href='vbspo_calendrier.php?saison=2025/2026&codent=PTBR35&poule=XXX' target='_parent'>XXX NOM</a>
    const linkRegex = /<a href='vbspo_calendrier\.php\?[^']*poule=([A-Z0-9]+)'[^>]*>([^<]+)<\/a>/g
    let match: RegExpExecArray | null

    while ((match = linkRegex.exec(section)) !== null) {
      const code = match[1]
      const fullText = match[2]
      if (!code || !fullText) continue

      // Extract name without code prefix
      // Format: "XXX NOM DE LA POULE"
      const nameMatch = fullText.trim().match(/^[A-Z0-9]+\s+(.+)$/)
      const name = nameMatch?.[1] ?? fullText.trim()

      pools.push({
        code,
        name,
        category: currentCategory || undefined
      })
    }
  })

  return pools
}

/**
 * Load pools from localStorage cache
 */
function loadFromCache(key: string): Pool[] | null {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const data: PoolsData = JSON.parse(cached)
    const now = Date.now()

    // Check if cache is still valid (2 months)
    if (now - data.timestamp > POOLS_CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }

    return data.pools
  } catch (error) {
    console.error('Error reading pools cache:', error)
    return null
  }
}

/**
 * Save pools to localStorage cache
 */
function saveToCache(key: string, pools: Pool[]): void {
  try {
    const data: PoolsData = {
      pools,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving pools cache:', error)
  }
}
