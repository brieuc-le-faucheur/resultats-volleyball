export interface UseDateFormattingReturn {
  formatDate: (dateStr: string, options?: Intl.DateTimeFormatOptions | null) => string
  formatDateCompact: (dateStr: string) => string
  formatDateFull: (dateStr: string) => string
}

export function useDateFormatting(): UseDateFormattingReturn {
  function formatDate(dateStr: string, options: Intl.DateTimeFormatOptions | null = null): string {
    const date = new Date(dateStr)
    const defaultOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
    return date.toLocaleDateString('fr-FR', options || defaultOptions)
  }

  function formatDateCompact(dateStr: string): string {
    return formatDate(dateStr, {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    })
  }

  function formatDateFull(dateStr: string): string {
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
