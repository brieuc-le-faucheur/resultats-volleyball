import { ref, computed } from 'vue'

export function useMatchFilters(matches) {
  const selectedTeam = ref(null)
  const sortOrder = ref('desc') // 'asc' or 'desc'

  const filteredMatches = computed(() => {
    if (!selectedTeam.value) return matches.value

    return matches.value.filter(match =>
      match.teamA === selectedTeam.value || match.teamB === selectedTeam.value
    )
  })

  const matchesByDate = computed(() => {
    const groups = {}
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
      groups[match.date].matches.push(match)
    })

    const sorted = Object.values(groups).sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
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
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  })

  function selectTeam(team) {
    selectedTeam.value = selectedTeam.value === team ? null : team
  }

  function toggleSortOrder() {
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
