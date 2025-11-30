export function useDateFormatting() {
  function formatDate(dateStr, options = null) {
    const date = new Date(dateStr)
    const defaultOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
    return date.toLocaleDateString('fr-FR', options || defaultOptions)
  }

  function formatDateCompact(dateStr) {
    return formatDate(dateStr, {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    })
  }

  function formatDateFull(dateStr) {
    return formatDate(dateStr, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return {
    formatDate,
    formatDateCompact,
    formatDateFull
  }
}
