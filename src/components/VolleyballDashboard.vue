<script setup lang="ts">
import { computed } from 'vue'
import { useFFVBData } from '../composables/useFFVBData'
import { useMatchFilters } from '../composables/useMatchFilters'
import { useDateFormatting } from '../composables/useDateFormatting'
import StandingsTable from './StandingsTable.vue'
import MatchCard from './MatchCard.vue'

const { matches, standings, loading } = useFFVBData()
const {
  selectedTeam,
  sortOrder,
  matchesByDate,
  selectTeam,
  toggleSortOrder
} = useMatchFilters(matches)

const { formatDateFull } = useDateFormatting()

const selectedTeamStats = computed(() => {
  if (!selectedTeam.value) return null
  return standings.value.find(s => s.team === selectedTeam.value)
})

const pastMatchesByDate = computed(() => {
  return matchesByDate.value.filter(group => group.isPast)
})

const upcomingMatchesByDate = computed(() => {
  return matchesByDate.value.filter(group => !group.isPast)
})

const filteredMatches = computed(() => {
  return matchesByDate.value.flatMap(group => group.matches)
})
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
        <StandingsTable
          :standings="standings"
          variant="full"
          :selectable="true"
          :selected-team="selectedTeam"
          :use-short-names="false"
          @team-select="selectTeam"
        />
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
        <div class="matches-header">
          <h2 class="section-title">
            <span class="title-icon">🏐</span>
            {{ selectedTeam ? `Matchs de ${selectedTeam}` : 'Tous les matchs' }}
          </h2>
          <button @click="toggleSortOrder" class="sort-button">
            <span class="sort-icon">{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
            {{ sortOrder === 'desc' ? 'Plus récent en premier' : 'Plus ancien en premier' }}
          </button>
        </div>

        <!-- Matchs joués -->
        <div v-if="pastMatchesByDate.length > 0" class="matches-group">
          <h3 class="matches-group-title">Matchs joués</h3>
          <div
            v-for="dateGroup in pastMatchesByDate"
            :key="dateGroup.date"
            class="date-group"
          >
            <div class="date-header">
              {{ formatDateFull(dateGroup.date) }}
            </div>
            <div class="matches-list">
              <MatchCard
                v-for="match in dateGroup.matches"
                :key="match.id"
                :match="match"
                variant="full"
                :use-short-names="false"
                :selected-team="selectedTeam"
              />
            </div>
          </div>
        </div>

        <!-- Matchs à venir -->
        <div v-if="upcomingMatchesByDate.length > 0" class="matches-group">
          <h3 class="matches-group-title">Matchs à venir</h3>
          <div
            v-for="dateGroup in upcomingMatchesByDate"
            :key="dateGroup.date"
            class="date-group"
          >
            <div class="date-header upcoming">
              {{ formatDateFull(dateGroup.date) }}
            </div>
            <div class="matches-list">
              <MatchCard
                v-for="match in dateGroup.matches"
                :key="match.id"
                :match="match"
                variant="full"
                :use-short-names="false"
                :selected-team="selectedTeam"
              />
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
  max-width: 100%;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Sections - Mobile first */
.standings-section,
.matches-section {
  background: var(--color-surface);
  border-radius: 0.75rem;
  padding: var(--space-md);
  box-shadow: var(--shadow-lg);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text);
}

.title-icon {
  font-size: var(--font-size-xl);
}

/* Team Stats - Mobile first */
.team-stats-section {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: 0.75rem;
  padding: var(--space-md);
  box-shadow: var(--shadow-lg);
}

.team-stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.team-stats-header h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: var(--space-md);
  text-align: center;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: white;
  margin-bottom: var(--space-xs);
}

.stat-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--font-size-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Matches */
.matches-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.sort-button {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  transition: all 0.2s;
  font-size: var(--font-size-xs);
}

.sort-button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.sort-icon {
  font-size: 1.25rem;
}

.matches-group {
  margin-bottom: 2rem;
}

.matches-group-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border);
}

.date-group {
  margin-bottom: 1.5rem;
}

.date-header {
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: var(--color-surface-light);
  border-radius: 0.5rem;
  border-left: 3px solid var(--color-secondary);
}

.date-header.upcoming {
  border-left-color: var(--color-draw);
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
  font-size: 1.125rem;
}

/* md: 768px+ */
@media (min-width: 768px) {
  .standings-section,
  .matches-section,
  .team-stats-section {
    padding: var(--space-xl);
    border-radius: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    gap: 0.75rem;
  }

  .title-icon {
    font-size: 1.75rem;
  }

  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.875rem;
  }

  .sort-button {
    font-size: 0.875rem;
    padding: 0.75rem 1.5rem;
  }
}
</style>