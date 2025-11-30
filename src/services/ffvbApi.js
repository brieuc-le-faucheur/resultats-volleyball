import { parseStandings, parseMatches } from './ffvbParser.js'
import { config } from '../config.ts'

/**
 * Fetch FFVB data from mock server or live FFVB website
 *
 * @param {string} liveUrl - URL to fetch from in live mode (ignored in mock mode)
 * @returns {Promise<{standings: Array, matches: Array}>}
 */
export async function fetchFFVBData(liveUrl) {
  try {
    let url

    if (config.dataMode === 'mock') {
      // Development mode: use local mock server
      url = config.mockServerUrl
    } else {
      // Production mode: use CORS proxy to fetch from FFVB
      url = config.corsProxy + liveUrl
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