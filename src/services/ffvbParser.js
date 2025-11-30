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

  // Filter only standings rows (not match rows)
  // Standings rows have a position number in the first cell
  Array.from(rows).forEach(row => {
    const cells = row.querySelectorAll('td')
    if (cells.length < 5) return

    const firstCell = cells[0].textContent.trim()
    // Check if first cell is a position number (e.g., "1.", "2.")
    if (!/^\d+\.$/.test(firstCell)) return

    // Helper to parse integer or return 0 if empty
    const parseIntOrZero = (text) => {
      const trimmed = text.trim()
      return trimmed === '' ? 0 : parseInt(trimmed)
    }

    // Helper to parse float or return 0 if empty
    const parseFloatOrZero = (text) => {
      const trimmed = text.trim()
      return trimmed === '' ? 0 : parseFloat(trimmed)
    }

    standings.push({
      position: parseInt(firstCell),
      team: cells[1].textContent.trim(),
      points: parseIntOrZero(cells[2].textContent),
      played: parseIntOrZero(cells[3].textContent),
      won: parseIntOrZero(cells[4].textContent),
      lost: parseIntOrZero(cells[5].textContent),
      forfeits: parseIntOrZero(cells[6].textContent),
      wins_3_0: parseIntOrZero(cells[7].textContent),
      wins_3_1: parseIntOrZero(cells[8].textContent),
      wins_3_2: parseIntOrZero(cells[9].textContent),
      losses_2_3: parseIntOrZero(cells[10].textContent),
      losses_1_3: parseIntOrZero(cells[11].textContent),
      losses_0_3: parseIntOrZero(cells[12].textContent),
      setsFor: parseIntOrZero(cells[13].textContent),
      setsAgainst: parseIntOrZero(cells[14].textContent),
      coeffSets: parseFloatOrZero(cells[15].textContent),
      pointsFor: parseIntOrZero(cells[16].textContent),
      pointsAgainst: parseIntOrZero(cells[17].textContent),
      coeffPoints: parseFloatOrZero(cells[18].textContent)
    })
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

  Array.from(allRows).forEach(row => {
    // Check if this is a journée header row
    const journeeHeader = row.querySelector("td[background='../images/bkrg.gif'].lienblanc_pt[colspan='12']")
    if (journeeHeader) {
      currentJournee = journeeHeader.textContent.trim()
      return
    }

    // Check if this is a match row (has onMouseOver)
    if (!row.getAttribute('onMouseOver')) return

    const cells = row.querySelectorAll('td')
    if (cells.length < 6) return

    const matchCode = cells[0].textContent.trim()
    if (!matchCode.startsWith('DMAA')) return

    const date = cells[1].textContent.trim()
    const time = cells[2].textContent.trim()
    const homeTeam = cells[3].textContent.trim()
    const awayTeam = cells[5].textContent.trim()

    // Check if match has been played (has scores in cells 6 and 7)
    const homeScoreCell = cells[6]
    const awayScoreCell = cells[7]

    let played = false
    let homeScore = null
    let awayScore = null
    let setScores = ''

    // A match is played if the score cells have background color
    if (homeScoreCell && homeScoreCell.getAttribute('bgcolor')) {
      played = true
      homeScore = parseInt(homeScoreCell.textContent.trim())
      awayScore = parseInt(awayScoreCell.textContent.trim())
      setScores = cells[8] ? cells[8].textContent.trim() : ''
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
  })

  return matches
}
