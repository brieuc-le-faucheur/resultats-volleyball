<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useFFVBData } from '../composables/useFFVBData'
import { useMatchFilters } from '../composables/useMatchFilters'
import { useDateFormatting } from '../composables/useDateFormatting'
import { useCompetitionSelector } from '../composables/useCompetitionSelector'
import { useFavoritePools } from '../composables/useFavoritePools'
import StandingsTable from './StandingsTable.vue'
import MatchCard from './MatchCard.vue'
import FavoriteButton from './FavoriteButton.vue'

const { matches, standings, loading } = useFFVBData()
const {
  selectedCompetitionId,
  selectedSaison,
  selectedPoolCode,
  selectedCompetition,
  selectedPool
} = useCompetitionSelector()

const { isFavorite, toggleFavorite } = useFavoritePools()

const isCurrentPoolFavorite = computed(() => {
  if (!selectedPool.value || !selectedCompetition.value) return false
  return isFavorite(
    selectedCompetitionId.value,
    selectedSaison.value,
    selectedPoolCode.value
  )
})

function toggleCurrentPoolFavorite() {
  if (!selectedPool.value || !selectedCompetition.value) return
  toggleFavorite({
    competitionId: selectedCompetitionId.value,
    saison: selectedSaison.value,
    poolCode: selectedPoolCode.value,
    poolName: selectedPool.value.name,
    competitionName: selectedCompetition.value.name
  })
}
const {
  selectedTeam,
  sortOrder,
  matchesByDate,
  selectTeam,
  toggleSortOrder
} = useMatchFilters(matches)

const { formatDateFull } = useDateFormatting()

// Onglet actif pour mobile
const activeTab = ref<'played' | 'upcoming'>('played')

// Afficher le bouton retour en haut
const showScrollTop = ref(false)

// Ref pour la section matchs à venir
const upcomingSection = ref<HTMLElement | null>(null)

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

function handleScroll() {
  showScrollTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToUpcoming() {
  upcomingSection.value?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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
          <span v-if="selectedPool" class="pool-name">- {{ selectedPool.name }}</span>
          <FavoriteButton
            v-if="selectedPool"
            :is-active="isCurrentPoolFavorite"
            size="sm"
            @toggle="toggleCurrentPoolFavorite"
          />
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
          <div class="matches-actions">
            <button
              v-if="upcomingMatchesByDate.length > 0"
              @click="scrollToUpcoming"
              class="goto-upcoming-btn desktop-only"
            >
              Matchs à venir ↓
            </button>
            <button @click="toggleSortOrder" class="sort-button">
              <span class="sort-icon">{{ sortOrder === 'desc' ? '↓' : '↑' }}</span>
              {{ sortOrder === 'desc' ? 'Plus récent' : 'Plus ancien' }}
            </button>
          </div>
        </div>

        <!-- Onglets mobile -->
        <div class="mobile-tabs">
          <button
            :class="['tab', { active: activeTab === 'played' }]"
            @click="activeTab = 'played'"
          >
            Joués ({{ pastMatchesByDate.reduce((acc, g) => acc + g.matches.length, 0) }})
          </button>
          <button
            :class="['tab', { active: activeTab === 'upcoming' }]"
            @click="activeTab = 'upcoming'"
          >
            À venir ({{ upcomingMatchesByDate.reduce((acc, g) => acc + g.matches.length, 0) }})
          </button>
        </div>

        <!-- Matchs joués -->
        <div v-if="pastMatchesByDate.length > 0" class="matches-group" :class="{ 'mobile-hidden': activeTab !== 'played' }">
          <h3 class="matches-group-title desktop-only">Matchs joués</h3>
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
        <div
          v-if="upcomingMatchesByDate.length > 0"
          ref="upcomingSection"
          class="matches-group"
          :class="{ 'mobile-hidden': activeTab !== 'upcoming' }"
        >
          <h3 class="matches-group-title desktop-only">Matchs à venir</h3>
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

    <!-- Bouton retour en haut -->
    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="scroll-top-btn"
      aria-label="Retour en haut"
    >
      ↑
    </button>
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
  flex-wrap: wrap;
  gap: var(--space-sm);
  color: var(--color-text);
}

.title-icon {
  font-size: var(--font-size-xl);
}

.pool-name {
  font-weight: 500;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
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

.sort-button,
.goto-upcoming-btn {
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-md);
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  transition: all 0.2s;
  font-size: var(--font-size-xs);
}

.sort-button {
  background: var(--color-primary);
}

.sort-button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.sort-icon {
  font-size: 1rem;
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

/* Matches actions */
.matches-actions {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

/* Onglets mobile */
.mobile-tabs {
  display: flex;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
  background: var(--color-background);
  padding: var(--space-xs);
  border-radius: 0.5rem;
}

.mobile-tabs .tab {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-weight: 600;
  font-size: var(--font-size-sm);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-tabs .tab.active {
  background: var(--color-primary);
  color: white;
}

.mobile-hidden {
  display: none;
}

/* Desktop only */
.desktop-only {
  display: none;
}

/* Bouton aller aux matchs à venir */
.goto-upcoming-btn {
  background: var(--color-secondary);
}

.goto-upcoming-btn:hover {
  background: var(--color-secondary-dark, #0891b2);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

/* Bouton retour en haut */
.scroll-top-btn {
  position: fixed;
  bottom: 5rem;
  right: var(--space-md);
  width: 44px;
  height: 44px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all 0.2s;
  z-index: 100;
}

.scroll-top-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

@media (min-width: 768px) {
  .scroll-top-btn {
    width: 52px;
    height: 52px;
    font-size: 1.5rem;
    right: var(--space-xl);
  }
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

  .sort-button,
  .goto-upcoming-btn {
    font-size: 0.875rem;
    padding: 0.75rem 1.5rem;
  }

  /* Cacher les onglets mobile */
  .mobile-tabs {
    display: none;
  }

  /* Afficher les éléments desktop */
  .desktop-only {
    display: block;
  }

  button.desktop-only {
    display: inline-flex;
  }

  /* Annuler le masquage mobile */
  .mobile-hidden {
    display: block;
  }
}
</style>