import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { Match } from './useFFVBData'

export interface MatchGroup {
  date: string
  isPast: boolean
  matches: Match[]
}

export interface UseMatchFiltersReturn {
  selectedTeam: Ref<string | null>
  sortOrder: Ref<'asc' | 'desc'>
  filteredMatches: ComputedRef<Match[]>
  matchesByDate: ComputedRef<MatchGroup[]>
  pastMatches: ComputedRef<MatchGroup[]>
  upcomingMatches: ComputedRef<Match[]>
  selectTeam: (team: string) => void
  toggleSortOrder: () => void
}

export function useMatchFilters(matches: Ref<Match[]>): UseMatchFiltersReturn {
  const selectedTeam = ref<string | null>(null)
  const sortOrder = ref<'asc' | 'desc'>('asc')

  const filteredMatches = computed(() => {
    if (!selectedTeam.value) return matches.value

    return matches.value.filter(match =>
      match.teamA === selectedTeam.value || match.teamB === selectedTeam.value
    )
  })

  const matchesByDate = computed(() => {
    const groups: Record<string, MatchGroup> = {}
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    filteredMatches.value.forEach(match => {
      if (!groups[match.date]) {
        const matchDate = new Date(match.date)
        matchDate.setHours(0, 0, 0, 0)

        groups[match.date] = {
          date: match.date,
          isPast: matchDate < today,
          matches: []
        }
      }
      groups[match.date]!.matches.push(match)
    })

    const sorted = Object.values(groups).sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return sortOrder.value === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })

    return sorted
  })

  const pastMatches = computed(() => {
    return matchesByDate.value.filter(group => group.isPast)
  })

  const upcomingMatches = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return matches.value
      .filter(match => {
        const matchDate = new Date(match.date)
        matchDate.setHours(0, 0, 0, 0)
        return matchDate >= today
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  function selectTeam(team: string): void {
    selectedTeam.value = selectedTeam.value === team ? null : team
  }

  function toggleSortOrder(): void {
    sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  }

  return {
    selectedTeam,
    sortOrder,
    filteredMatches,
    matchesByDate,
    pastMatches,
    upcomingMatches,
    selectTeam,
    toggleSortOrder
  }
}
