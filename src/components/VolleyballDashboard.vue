<script setup>
import { ref, computed, onMounted } from 'vue'

const matches = ref([])
const teams = ref([])
const standings = ref([])
const selectedTeam = ref(null)
const loading = ref(true)
const error = ref(null)

// Fonction pour convertir le format de date DD/MM/YY en YYYY-MM-DD
function parseFFVBDate(dateStr) {
  const [day, month, year] = dateStr.split('/')
  return `20${year}-${month}-${day}`
}

// Données réelles depuis FFVB
const mockData = {
  standings: [
    { position: 1, team: 'RENNES CPB 4', played: 6, won: 6, lost: 4, points: 16, setsFor: 18, setsAgainst: 4 },
    { position: 2, team: 'LES BLEUETS PORTES DE BZH 2', played: 6, won: 4, lost: 2, points: 13, setsFor: 15, setsAgainst: 8 },
    { position: 3, team: 'UGS GUIPEL / LANGAN 2', played: 5, won: 4, lost: 1, points: 12, setsFor: 14, setsAgainst: 7 },
    { position: 4, team: 'BETTON 1', played: 6, won: 4, lost: 2, points: 12, setsFor: 13, setsAgainst: 8 },
    { position: 5, team: 'RENNES TA 1', played: 6, won: 3, lost: 3, points: 10, setsFor: 12, setsAgainst: 11 },
    { position: 6, team: 'COMBOURG 1', played: 5, won: 1, lost: 4, points: 2, setsFor: 6, setsAgainst: 14 },
    { position: 7, team: 'MARPIRE CHAMPEAUX 2', played: 5, won: 0, lost: 5, points: 1, setsFor: 4, setsAgainst: 15 },
    { position: 8, team: 'ST MALO 3', played: 5, won: 0, lost: 5, points: 0, setsFor: 0, setsAgainst: 15 },
  ],
  matches: [
    { id: 'DMAA001', journee: 1, date: parseFFVBDate('25/10/25'), time: '18:30', teamA: 'BETTON 1', teamB: 'MARPIRE CHAMPEAUX 2', scoreA: 3, scoreB: 1, sets: '21:25, 25:15, 25:20, 25:19', played: true },
    { id: 'DMAA002', journee: 1, date: parseFFVBDate('04/10/25'), time: '-', teamA: 'UGS GUIPEL / LANGAN 2', teamB: 'RENNES TA 1', scoreA: 3, scoreB: 2, sets: '25:18, 10:25, 22:25, 25:23, 15:7', played: true },
    { id: 'DMAA003', journee: 1, date: parseFFVBDate('11/10/25'), time: '18:00', teamA: 'LES BLEUETS PORTES DE BZH 2', teamB: 'COMBOURG 1', scoreA: 3, scoreB: 1, sets: '25:11, 25:12, 20:25, 25:20', played: true },
    { id: 'DMAA004', journee: 1, date: parseFFVBDate('04/10/25'), time: '17:00', teamA: 'RENNES CPB 4', teamB: 'ST MALO 3', scoreA: 3, scoreB: 0, sets: '25:23, 25:17, 25:16', played: true },
    { id: 'DMAA005', journee: 2, date: parseFFVBDate('18/10/25'), time: '18:30', teamA: 'RENNES CPB 4', teamB: 'MARPIRE CHAMPEAUX 2', scoreA: 3, scoreB: 0, sets: '25:16, 27:25, 25:22', played: true },
    { id: 'DMAA006', journee: 2, date: parseFFVBDate('18/10/25'), time: '-', teamA: 'ST MALO 3', teamB: 'LES BLEUETS PORTES DE BZH 2', scoreA: 0, scoreB: 3, sets: '21:25, 20:25, 23:25', played: true },
    { id: 'DMAA007', journee: 2, date: parseFFVBDate('18/10/25'), time: '18:00', teamA: 'COMBOURG 1', teamB: 'UGS GUIPEL / LANGAN 2', scoreA: 1, scoreB: 3, sets: '25:15, 21:25, 16:25, 15:25', played: true },
    { id: 'DMAA008', journee: 2, date: parseFFVBDate('18/10/25'), time: '-', teamA: 'RENNES TA 1', teamB: 'BETTON 1', scoreA: 1, scoreB: 3, sets: '17:25, 16:25, 25:18, 22:25', played: true },
    { id: 'DMAA009', journee: 3, date: parseFFVBDate('01/11/25'), time: '-', teamA: 'MARPIRE CHAMPEAUX 2', teamB: 'RENNES TA 1', scoreA: 1, scoreB: 3, sets: '20:25, 22:25, 25:20, 18:25', played: true },
    { id: 'DMAA010', journee: 3, date: parseFFVBDate('01/11/25'), time: '-', teamA: 'BETTON 1', teamB: 'COMBOURG 1', scoreA: 3, scoreB: 0, sets: '25:23, 25:19, 25:23', played: true },
    { id: 'DMAA011', journee: 3, date: parseFFVBDate('01/11/25'), time: '-', teamA: 'UGS GUIPEL / LANGAN 2', teamB: 'ST MALO 3', scoreA: 3, scoreB: 0, sets: '25:17, 27:25, 25:22', played: true },
    { id: 'DMAA012', journee: 3, date: parseFFVBDate('01/11/25'), time: '18:00', teamA: 'LES BLEUETS PORTES DE BZH 2', teamB: 'RENNES CPB 4', scoreA: 2, scoreB: 3, sets: '25:18, 16:25, 22:25, 25:17, 13:15', played: true },
    { id: 'DMAA013', journee: 4, date: parseFFVBDate('14/11/25'), time: '21:00', teamA: 'LES BLEUETS PORTES DE BZH 2', teamB: 'MARPIRE CHAMPEAUX 2', scoreA: 3, scoreB: 0, sets: '25:22, 25:23, 25:23', played: true },
    { id: 'DMAA014', journee: 4, date: parseFFVBDate('15/11/25'), time: '21:00', teamA: 'RENNES CPB 4', teamB: 'UGS GUIPEL / LANGAN 2', scoreA: 3, scoreB: 2, sets: '27:25, 25:20, 22:25, 19:25, 15:11', played: true },
    { id: 'DMAA015', journee: 4, date: parseFFVBDate('15/11/25'), time: '-', teamA: 'ST MALO 3', teamB: 'BETTON 1', scoreA: 0, scoreB: 3, sets: '23:25, 21:25, 17:25', played: true },
    { id: 'DMAA016', journee: 4, date: parseFFVBDate('15/11/25'), time: '19:00', teamA: 'COMBOURG 1', teamB: 'RENNES TA 1', scoreA: 1, scoreB: 3, sets: '26:24, 23:25, 19:25, 21:25', played: true },
    { id: 'DMAA017', journee: 5, date: parseFFVBDate('22/11/25'), time: '-', teamA: 'MARPIRE CHAMPEAUX 2', teamB: 'COMBOURG 1', scoreA: 2, scoreB: 3, sets: '16:25, 15:25, 25:20, 26:24, 12:15', played: true },
    { id: 'DMAA018', journee: 5, date: parseFFVBDate('22/11/25'), time: '-', teamA: 'RENNES TA 1', teamB: 'ST MALO 3', scoreA: 3, scoreB: 0, sets: '25:16, 25:23, 25:17', played: true },
    { id: 'DMAA019', journee: 5, date: parseFFVBDate('22/11/25'), time: '-', teamA: 'BETTON 1', teamB: 'RENNES CPB 4', scoreA: 0, scoreB: 3, sets: '13:25, 20:25, 17:25', played: true },
    { id: 'DMAA020', journee: 5, date: parseFFVBDate('22/11/25'), time: '-', teamA: 'UGS GUIPEL / LANGAN 2', teamB: 'LES BLEUETS PORTES DE BZH 2', scoreA: 3, scoreB: 1, sets: '25:19, 17:25, 25:17, 25:22', played: true },
    { id: 'DMAA021', journee: 6, date: parseFFVBDate('29/11/25'), time: '-', teamA: 'UGS GUIPEL / LANGAN 2', teamB: 'MARPIRE CHAMPEAUX 2', scoreA: null, scoreB: null, sets: '', played: false },
    { id: 'DMAA022', journee: 6, date: parseFFVBDate('29/11/25'), time: '18:00', teamA: 'LES BLEUETS PORTES DE BZH 2', teamB: 'BETTON 1', scoreA: 3, scoreB: 1, sets: '25:21, 25:22, 21:25, 25:21', played: true },
    { id: 'DMAA023', journee: 6, date: parseFFVBDate('29/11/25'), time: '16:00', teamA: 'RENNES CPB 4', teamB: 'RENNES TA 1', scoreA: 3, scoreB: 0, sets: '25:16, 25:14, 25:22', played: true },
    { id: 'DMAA024', journee: 6, date: parseFFVBDate('29/11/25'), time: '21:00', teamA: 'ST MALO 3', teamB: 'COMBOURG 1', scoreA: null, scoreB: null, sets: '', played: false },
    { id: 'DMAA025', journee: 7, date: parseFFVBDate('06/12/25'), time: '-', teamA: 'MARPIRE CHAMPEAUX 2', teamB: 'ST MALO 3', scoreA: null, scoreB: null, sets: '', played: false },
    { id: 'DMAA026', journee: 7, date: parseFFVBDate('06/12/25'), time: '19:00', teamA: 'COMBOURG 1', teamB: 'RENNES CPB 4', scoreA: null, scoreB: null, sets: '', played: false },
    { id: 'DMAA027', journee: 7, date: parseFFVBDate('06/12/25'), time: '-', teamA: 'RENNES TA 1', teamB: 'LES BLEUETS PORTES DE BZH 2', scoreA: null, scoreB: null, sets: '', played: false },
    { id: 'DMAA028', journee: 7, date: parseFFVBDate('06/12/25'), time: '-', teamA: 'BETTON 1', teamB: 'UGS GUIPEL / LANGAN 2', scoreA: null, scoreB: null, sets: '', played: false },
  ]
}

onMounted(() => {
  setTimeout(() => {
    standings.value = mockData.standings
    matches.value = mockData.matches
    teams.value = [...new Set(mockData.standings.map(s => s.team))].sort()
    loading.value = false
  }, 500)
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
    const date = match.date
    if (!groups[date]) {
      groups[date] = {
        date: date,
        played: match.played,
        matches: []
      }
    }
    groups[date].matches.push(match)
  })

  // Convertir en tableau et trier par date
  return Object.values(groups).sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })
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

function getMatchResult(match, team) {
  if (!match.played) return 'upcoming'
  if (match.teamA === team) {
    return match.scoreA > match.scoreB ? 'win' : 'loss'
  } else {
    return match.scoreB > match.scoreA ? 'win' : 'loss'
  }
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

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
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
                <th>Diff</th>
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
                <td :class="standing.setsFor - standing.setsAgainst >= 0 ? 'positive' : 'negative'">
                  {{ standing.setsFor - standing.setsAgainst > 0 ? '+' : '' }}{{ standing.setsFor - standing.setsAgainst }}
                </td>
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

.positive {
  color: var(--color-win);
  font-weight: 600;
}

.negative {
  color: var(--color-loss);
  font-weight: 600;
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

.error-state {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-loss);
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  color: var(--color-loss);
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
