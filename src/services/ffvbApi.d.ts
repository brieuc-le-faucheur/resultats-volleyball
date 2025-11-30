export interface FFVBMatch {
  code: string
  journee: string
  date: string
  time: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  setScores: string
  played: boolean
}

export interface FFVBStanding {
  position: number
  team: string
  played: number
  won: number
  lost: number
  points: number
  setsFor: number
  setsAgainst: number
}

export interface FFVBData {
  matches: FFVBMatch[]
  standings: FFVBStanding[]
}

export function fetchFFVBData(liveUrl: string): Promise<FFVBData>
