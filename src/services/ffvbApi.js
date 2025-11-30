import { parseStandings, parseMatches } from './ffvbParser.js'
import { config } from '../config.js'

/**
 * Fetch FFVB data from mock server or live FFVB website
 *
 * @returns {Promise<{standings: Array, matches: Array}>}
 */
export async function fetchFFVBData() {
  try {
    let url

    if (config.dataMode === 'mock') {
      // Development mode: use local mock server
      url = config.mockServerUrl
    } else {
      // Production mode: use CORS proxy to fetch from FFVB
      url = config.corsProxy + config.liveDataUrl
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()

    return {
      standings: parseStandings(html),
      matches: parseMatches(html)
    }
  } catch (error) {
    console.error('Error fetching FFVB data:', error)
    throw error
  }
}