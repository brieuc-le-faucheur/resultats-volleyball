/**
 * Tronque intelligemment les noms d'équipes pour l'affichage compact
 * Algorithme générique applicable à toutes les compétitions
 */
export function formatShortTeamName(name, maxLength = 15) {
  if (name.length <= maxLength) return name

  // Stratégie 1 : Garder les initiales si plusieurs mots
  const words = name.split(/\s+/)
  if (words.length >= 3) {
    // Ex: "RENNES VOLLEY BALL 35" -> "RVB 35"
    const initials = words
      .map(word => /^\d+$/.test(word) ? word : word[0])
      .join('')

    if (initials.length <= maxLength) return initials
  }

  // Stratégie 2 : Garder premier + dernier mot si 2 mots
  if (words.length === 2) {
    const short = words[0].substring(0, 8) + ' ' + words[1].substring(0, 5)
    if (short.length <= maxLength) return short.trim()
  }

  // Stratégie 3 : Tronquer avec ellipse
  return name.substring(0, maxLength - 1) + '…'
}

/**
 * Retourne le nom complet (identity function pour cohérence)
 */
export function formatFullTeamName(name) {
  return name
}
