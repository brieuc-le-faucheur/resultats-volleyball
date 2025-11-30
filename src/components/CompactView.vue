<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchFFVBData } from '../services/ffvbApi.js'

const matches = ref([])
const standings = ref([])
const loading = ref(true)

// Fonction pour convertir le format de date DD/MM/YY en YYYY-MM-DD
function parseFFVBDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return ''
  const [day, month, year] = dateStr.split('/')
  return `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

onMounted(async () => {
  loading.value = true
  try {
    const data = await fetchFFVBData()
    standings.value = data.standings

    // Transform matches to match the expected format
    matches.value = data.matches.map(match => {
      const journeeMatch = match.journee.match(/\d+/)
      return {
        id: match.code,
        journee: journeeMatch ? parseInt(journeeMatch[0]) : 0,
        date: parseFFVBDate(match.date),
        time: match.time || '-',
        teamA: match.homeTeam,
        teamB: match.awayTeam,
        scoreA: match.homeScore,
        scoreB: match.awayScore,
        sets: match.setScores,
        played: match.played
      }
    })
  } catch (error) {
    console.error('Erreur lors du chargement des données FFVB:', error)
  } finally {
    loading.value = false
  }
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
    .slice(0, 8) // Limit to next 8 matches
})

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })
}

function formatShortTeamName(name) {
  // Simplify long team names for compact display
  return name
    .replace('LES BLEUETS PORTES DE BZH', 'BLEUETS BZH')
    .replace('UGS GUIPEL / LANGAN', 'UGS G/L')
    .replace('MARPIRE CHAMPEAUX', 'MARPIRE')
    .replace('RENNES CPB', 'CPB')
    .replace('RENNES TA', 'TA')
}
</script>

<template>
  <div class="compact-view">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>

    <div v-else class="compact-grid">
      <!-- Classement -->
      <section class="standings-panel">
        <h2 class="panel-title">Classement DMA</h2>
        <div class="standings-compact">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th class="team-col">Équipe</th>
                <th>J</th>
                <th>V</th>
                <th>D</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="standing in standings"
                :key="standing.team"
                :class="{ 'highlight': standing.position <= 3 }"
              >
                <td class="pos-col">
                  <span class="position-badge" :class="`pos-${standing.position}`">
                    {{ standing.position }}
                  </span>
                </td>
                <td class="team-col">{{ formatShortTeamName(standing.team) }}</td>
                <td>{{ standing.played }}</td>
                <td class="win-col">{{ standing.won }}</td>
                <td class="loss-col">{{ standing.lost }}</td>
                <td class="points-col">{{ standing.points }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Prochains matchs -->
      <section class="matches-panel">
        <h2 class="panel-title">Prochains matchs</h2>
        <div class="matches-compact">
          <div
            v-for="match in upcomingMatches"
            :key="match.id"
            class="match-compact"
          >
            <div class="match-date">
              {{ formatDate(match.date) }}
              <span class="match-time">{{ match.time }}</span>
            </div>
            <div class="match-teams-compact">
              <div class="team">{{ formatShortTeamName(match.teamA) }}</div>
              <div class="vs">vs</div>
              <div class="team">{{ formatShortTeamName(match.teamB) }}</div>
            </div>
          </div>

          <div v-if="upcomingMatches.length === 0" class="empty-state">
            Aucun match à venir
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.compact-view {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1.5rem;
  background: var(--color-background);
  display: flex;
  flex-direction: column;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1rem;
}

.compact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.standings-panel,
.matches-panel {
  background: var(--color-surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text);
  flex-shrink: 0;
}

.standings-compact {
  flex: 1;
  overflow-y: auto;
  margin: -0.5rem;
  padding: 0.5rem;
}

.standings-compact table {
  width: 100%;
  border-collapse: collapse;
}

.standings-compact thead {
  position: sticky;
  top: 0;
  background: var(--color-surface);
  z-index: 1;
}

.standings-compact th {
  padding: 0.75rem 0.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border);
}

.standings-compact td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.875rem;
}

.standings-compact tbody tr:hover {
  background: var(--color-surface-light);
}

.standings-compact tbody tr.highlight {
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1));
}

.pos-col {
  width: 50px;
  text-align: center;
}

.team-col {
  font-weight: 500;
}

.position-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-surface-light);
  font-weight: 700;
  font-size: 0.75rem;
}

.position-badge.pos-1 {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #1e293b;
}

.position-badge.pos-2 {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #1e293b;
}

.position-badge.pos-3 {
  background: linear-gradient(135deg, #cd7f32, #daa06d);
  color: #1e293b;
}

.win-col {
  color: var(--color-win);
  font-weight: 600;
}

.loss-col {
  color: var(--color-loss);
  font-weight: 600;
}

.points-col {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-primary);
}

/* Matches */
.matches-compact {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: -0.5rem;
  padding: 0.5rem;
}

.match-compact {
  background: var(--color-background);
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-primary);
  transition: all 0.2s;
}

.match-compact:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow);
}

.match-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.match-time {
  color: var(--color-text-muted);
  font-weight: 500;
}

.match-teams-compact {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.match-teams-compact .team {
  flex: 1;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem;
  background: var(--color-surface);
  border-radius: 0.5rem;
  text-align: center;
}

.match-teams-compact .vs {
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .compact-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .standings-panel {
    max-height: 40vh;
  }
}
</style>
