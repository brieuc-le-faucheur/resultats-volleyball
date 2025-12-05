/**
 * Parse FFVB HTML to extract standings and matches
 */

/**
 * Parse the standings table from FFVB HTML
 * @param {string} html - The HTML content
 * @returns {Array} Array of team standings
 */
export function parseStandings(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const standings = []

  // Find all table rows with standings data
  // Standings rows have onMouseOver='changeCouleur(this);'
  const rows = doc.querySelectorAll("tr[onMouseOver=\"changeCouleur(this);\"]")

  // Helper to safely get cell text content
  const getCellText = (cells, index) => cells[index]?.textContent?.trim() || ''

  // Helper to parse integer or return 0 if empty
  const parseIntOrZero = (text) => {
    const trimmed = (text || '').trim()
    return trimmed === '' ? 0 : parseInt(trimmed)
  }

  // Helper to parse float or return 0 if empty
  const parseFloatOrZero = (text) => {
    const trimmed = (text || '').trim()
    return trimmed === '' ? 0 : parseFloat(trimmed)
  }

  // Filter only standings rows (not match rows)
  // Standings rows have a position number in the first cell
  Array.from(rows).forEach(row => {
    try {
      const cells = row.querySelectorAll('td')
      // Minimum 7 colonnes pour le format simplifié (pos, équipe, pts, joués, gagnés, perdus, +1)
      if (cells.length < 7) return

      const firstCell = getCellText(cells, 0)
      // Check if first cell is a position number (e.g., "1.", "2.")
      if (!/^\d+\.$/.test(firstCell)) return

      // Détecter le format : complet (19+ colonnes) ou simplifié (~10 colonnes)
      const isFullFormat = cells.length >= 19

      if (isFullFormat) {
        // Format complet avec détails des victoires/défaites par score
        standings.push({
          position: parseInt(firstCell),
          team: getCellText(cells, 1),
          points: parseIntOrZero(getCellText(cells, 2)),
          played: parseIntOrZero(getCellText(cells, 3)),
          won: parseIntOrZero(getCellText(cells, 4)),
          lost: parseIntOrZero(getCellText(cells, 5)),
          forfeits: parseIntOrZero(getCellText(cells, 6)),
          wins_3_0: parseIntOrZero(getCellText(cells, 7)),
          wins_3_1: parseIntOrZero(getCellText(cells, 8)),
          wins_3_2: parseIntOrZero(getCellText(cells, 9)),
          losses_2_3: parseIntOrZero(getCellText(cells, 10)),
          losses_1_3: parseIntOrZero(getCellText(cells, 11)),
          losses_0_3: parseIntOrZero(getCellText(cells, 12)),
          setsFor: parseIntOrZero(getCellText(cells, 13)),
          setsAgainst: parseIntOrZero(getCellText(cells, 14)),
          coeffSets: parseFloatOrZero(getCellText(cells, 15)),
          pointsFor: parseIntOrZero(getCellText(cells, 16)),
          pointsAgainst: parseIntOrZero(getCellText(cells, 17)),
          coeffPoints: parseFloatOrZero(getCellText(cells, 18))
        })
      } else {
        // Format simplifié (~10 colonnes) : pos, équipe, pts, joués, gagnés, perdus, setsFor, setsAgainst, coeffSets...
        standings.push({
          position: parseInt(firstCell),
          team: getCellText(cells, 1),
          points: parseIntOrZero(getCellText(cells, 2)),
          played: parseIntOrZero(getCellText(cells, 3)),
          won: parseIntOrZero(getCellText(cells, 4)),
          lost: parseIntOrZero(getCellText(cells, 5)),
          forfeits: 0,
          wins_3_0: 0,
          wins_3_1: 0,
          wins_3_2: 0,
          losses_2_3: 0,
          losses_1_3: 0,
          losses_0_3: 0,
          setsFor: parseIntOrZero(getCellText(cells, 6)),
          setsAgainst: parseIntOrZero(getCellText(cells, 7)),
          coeffSets: parseFloatOrZero(getCellText(cells, 8)),
          pointsFor: parseIntOrZero(getCellText(cells, 9)),
          pointsAgainst: parseIntOrZero(getCellText(cells, 10)),
          coeffPoints: parseFloatOrZero(getCellText(cells, 11))
        })
      }
    } catch (err) {
      console.warn('Erreur lors du parsing d\'une ligne de classement:', err)
    }
  })

  return standings
}

/**
 * Parse the match schedule from FFVB HTML
 * @param {string} html - The HTML content
 * @returns {Array} Array of matches
 */
export function parseMatches(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const matches = []
  let currentJournee = ''

  // Find all table rows
  const allRows = doc.querySelectorAll('TABLE[CELLSPACING="0"] tr')

  // Helper to safely get cell text content
  const getCellText = (cells, index) => cells[index]?.textContent?.trim() || ''

  Array.from(allRows).forEach(row => {
    try {
      // Check if this is a journée header row
      const journeeHeader = row.querySelector("td[background='../images/bkrg.gif'].lienblanc_pt[colspan='12']")
      if (journeeHeader) {
        currentJournee = journeeHeader.textContent?.trim() || ''
        return
      }

      // Check if this is a match row (has onMouseOver)
      if (!row.getAttribute('onMouseOver')) return

      const cells = row.querySelectorAll('td')
      if (cells.length < 6) return

      const matchCode = getCellText(cells, 0)
      // Skip if not a valid match code (should have at least 4 characters)
      if (!matchCode || matchCode.length < 4) return

      const date = getCellText(cells, 1)
      const time = getCellText(cells, 2)
      const homeTeam = getCellText(cells, 3)
      const awayTeam = getCellText(cells, 5)

      // Check if match has been played (has scores in cells 6 and 7)
      const homeScoreCell = cells[6]
      const awayScoreCell = cells[7]

      let played = false
      let homeScore = null
      let awayScore = null
      let setScores = ''

      // A match is played if the score cells have background color
      if (homeScoreCell?.getAttribute('bgcolor')) {
        played = true
        homeScore = parseInt(getCellText(cells, 6)) || null
        awayScore = parseInt(getCellText(cells, 7)) || null
        setScores = getCellText(cells, 8)
      }

      matches.push({
        code: matchCode,
        journee: currentJournee,
        date,
        time,
        homeTeam,
        awayTeam,
        played,
        homeScore,
        awayScore,
        setScores
      })
    } catch (err) {
      console.warn('Erreur lors du parsing d\'une ligne de match:', err)
    }
  })

  return matches
}
