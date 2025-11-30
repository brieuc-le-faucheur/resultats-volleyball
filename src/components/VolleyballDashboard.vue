<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchFFVBData } from '../services/ffvbApi.js'

const matches = ref([])
const standings = ref([])
const selectedTeam = ref(null)
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

const filteredMatches = computed(() => {
  if (!selectedTeam.value) return matches.value

  return matches.value.filter(match =>
    match.teamA === selectedTeam.value || match.teamB === selectedTeam.value
  )
})

const matchesByDate = computed(() => {
  const groups = {}
  filteredMatches.value.forEach(match => {
    if (!groups[match.date]) {
      groups[match.date] = {
        date: match.date,
        played: match.played,
        matches: []
      }
    }
    groups[match.date].matches.push(match)
  })

  return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date))
})

const pastMatchesByDate = computed(() => {
  return matchesByDate.value.filter(group => group.played)
})

const upcomingMatchesByDate = computed(() => {
  return matchesByDate.value.filter(group => !group.played).reverse()
})

const selectedTeamStats = computed(() => {
  if (!selectedTeam.value) return null
  return standings.value.find(s => s.team === selectedTeam.value)
})

function selectTeam(team) {
  selectedTeam.value = selectedTeam.value === team ? null : team
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="dashboard">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des données...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- Classement -->
      <section class="standings-section">
        <h2 class="section-title">
          <span class="title-icon">📊</span>
          Classement
        </h2>
        <div class="standings-table-wrapper">
          <table class="standings-table">
            <thead>
              <tr>
                <th class="pos-col">#</th>
                <th class="team-col">Équipe</th>
                <th>J</th>
                <th>G</th>
                <th>P</th>
                <th>Pts</th>
                <th>Sets+</th>
                <th>Sets-</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="standing in standings"
                :key="standing.team"
                :class="{ 'selected': selectedTeam === standing.team, 'clickable': true }"
                @click="selectTeam(standing.team)"
              >
                <td class="pos-col">
                  <span class="position-badge" :class="`pos-${standing.position}`">
                    {{ standing.position }}
                  </span>
                </td>
                <td class="team-col">
                  <div class="team-name">
                    {{ standing.team }}
                    <span v-if="selectedTeam === standing.team" class="selected-indicator">✓</span>
                  </div>
                </td>
                <td>{{ standing.played }}</td>
                <td class="win-col">{{ standing.won }}</td>
                <td class="loss-col">{{ standing.lost }}</td>
                <td class="points-col">{{ standing.points }}</td>
                <td>{{ standing.setsFor }}</td>
                <td>{{ standing.setsAgainst }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Statistiques de l'équipe sélectionnée -->
      <section v-if="selectedTeamStats" class="team-stats-section">
        <div class="team-stats-header">
          <h3>{{ selectedTeamStats.team }}</h3>
          <button @click="selectedTeam = null" class="close-btn">✕</button>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ selectedTeamStats.points }}</div>
            <div class="stat-label">Points</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ selectedTeamStats.won }}</div>
            <div class="stat-label">Victoires</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ selectedTeamStats.lost }}</div>
            <div class="stat-label">Défaites</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ ((selectedTeamStats.won / selectedTeamStats.played) * 100).toFixed(0) }}%</div>
            <div class="stat-label">Taux de victoire</div>
          </div>
        </div>
      </section>

      <!-- Résultats -->
      <section class="matches-section">
        <h2 class="section-title">
          <span class="title-icon">🏐</span>
          {{ selectedTeam ? `Matchs de ${selectedTeam}` : 'Tous les matchs' }}
        </h2>

        <!-- Matchs passés par date -->
        <div v-if="pastMatchesByDate.length > 0" class="matches-group">
          <h3 class="matches-group-title">Matchs joués</h3>
          <div
            v-for="dateGroup in pastMatchesByDate"
            :key="dateGroup.date"
            class="date-group"
          >
            <div class="date-header">
              {{ formatDate(dateGroup.date) }}
            </div>
            <div class="matches-list">
              <div
                v-for="match in dateGroup.matches"
                :key="match.id"
                class="match-card played"
              >
                <div class="match-header">
                  <span class="journee-badge">J{{ match.journee }}</span>
                  <span class="match-time">{{ match.time }}</span>
                </div>
                <div class="match-teams">
                  <div class="team" :class="{ 'winner': match.scoreA > match.scoreB }">
                    <span class="team-name">{{ match.teamA }}</span>
                    <span class="score">{{ match.scoreA }}</span>
                  </div>
                  <div class="vs">VS</div>
                  <div class="team" :class="{ 'winner': match.scoreB > match.scoreA }">
                    <span class="team-name">{{ match.teamB }}</span>
                    <span class="score">{{ match.scoreB }}</span>
                  </div>
                </div>
                <div v-if="match.sets" class="match-sets">
                  {{ match.sets }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Matchs à venir par date -->
        <div v-if="upcomingMatchesByDate.length > 0" class="matches-group">
          <h3 class="matches-group-title">Matchs à venir</h3>
          <div
            v-for="dateGroup in upcomingMatchesByDate"
            :key="dateGroup.date"
            class="date-group"
          >
            <div class="date-header upcoming">
              {{ formatDate(dateGroup.date) }}
            </div>
            <div class="matches-list">
              <div
                v-for="match in dateGroup.matches"
                :key="match.id"
                class="match-card upcoming"
              >
                <div class="match-header">
                  <span class="journee-badge upcoming">J{{ match.journee }}</span>
                  <span class="match-time">{{ match.time }}</span>
                </div>
                <div class="match-teams">
                  <div class="team">
                    <span class="team-name">{{ match.teamA }}</span>
                  </div>
                  <div class="vs">VS</div>
                  <div class="team">
                    <span class="team-name">{{ match.teamB }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredMatches.length === 0" class="empty-state">
          <p>Aucun match trouvé</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text);
}

.title-icon {
  font-size: 1.75rem;
}

/* Classement */
.standings-section {
  background: var(--color-surface);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.standings-table-wrapper {
  overflow-x: auto;
}

.standings-table {
  width: 100%;
  border-collapse: collapse;
}

.standings-table thead {
  background: var(--color-surface-light);
}

.standings-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.standings-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.standings-table tbody tr {
  transition: all 0.2s;
}

.standings-table tbody tr.clickable {
  cursor: pointer;
}

.standings-table tbody tr:hover {
  background: var(--color-surface-light);
}

.standings-table tbody tr.selected {
  background: linear-gradient(90deg, var(--color-primary), transparent);
  border-left: 4px solid var(--color-primary);
}

.pos-col {
  width: 60px;
  text-align: center;
}

.team-col {
  min-width: 250px;
}

.position-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-surface-light);
  font-weight: 700;
  font-size: 0.875rem;
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

.team-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.selected-indicator {
  color: var(--color-primary);
  font-weight: 700;
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
  font-size: 1.1rem;
  color: var(--color-primary);
}

/* Team Stats */
.team-stats-section {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.team-stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.team-stats-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Matches */
.matches-section {
  background: var(--color-surface);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}

.matches-group {
  margin-bottom: 2rem;
}

.matches-group:last-child {
  margin-bottom: 0;
}

.matches-group-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.date-group {
  margin-bottom: 1.5rem;
}

.date-group:last-child {
  margin-bottom: 0;
}

.date-header {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--color-surface-light);
  border-radius: 0.5rem;
  border-left: 4px solid var(--color-secondary);
}

.date-header.upcoming {
  border-left-color: var(--color-draw);
}

.matches-list {
  display: grid;
  gap: 0.75rem;
  margin-left: 1rem;
}

.match-card {
  background: var(--color-background);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  transition: all 0.2s;
}

.match-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.match-card.played {
  border-left: 4px solid var(--color-secondary);
}

.match-card.upcoming {
  border-left: 4px solid var(--color-draw);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.journee-badge {
  background: var(--color-secondary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.journee-badge.upcoming {
  background: var(--color-draw);
}

.match-time {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.match-teams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
}

.team {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--color-surface);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.team.winner {
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.2));
  border: 1px solid var(--color-win);
}

.team-name {
  font-weight: 500;
  flex: 1;
}

.score {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  min-width: 32px;
  text-align: center;
}

.team.winner .score {
  color: var(--color-win);
}

.vs {
  font-weight: 700;
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.match-sets {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

@media (max-width: 768px) {
  .standings-section,
  .matches-section,
  .team-stats-section {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .standings-table th,
  .standings-table td {
    padding: 0.5rem;
    font-size: 0.875rem;
  }

  .team-col {
    min-width: 180px;
  }

  .match-teams {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .vs {
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>