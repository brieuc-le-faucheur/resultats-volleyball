<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import CompetitionSelector from './CompetitionSelector.vue'
import FavoriteButton from './FavoriteButton.vue'
import FavoritesDropdown from './FavoritesDropdown.vue'
import { useFavoritePools, type FavoritePool } from '../composables/useFavoritePools'
import { useCompetitionSelector } from '../composables/useCompetitionSelector'

const route = useRoute()
const isCompactView = computed(() => route.name === 'compact')

const { favorites, removeFavorite } = useFavoritePools()
const { selectCompetition } = useCompetitionSelector()

const dropdownOpen = ref(false)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function closeDropdown() {
  dropdownOpen.value = false
}

async function navigateToPool(pool: FavoritePool) {
  await selectCompetition(pool.competitionId, pool.saison, pool.poolCode)
  closeDropdown()
}

function handleRemove(pool: FavoritePool) {
  removeFavorite(pool.competitionId, pool.saison, pool.poolCode)
}

// Preserve query params when navigating between views
const fullViewLink = computed(() => ({
  path: '/full',
  query: route.query
}))

const compactViewLink = computed(() => ({
  path: '/compact',
  query: route.query
}))
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Logo + Favoris -->
      <div class="logo-section">
        <div class="volleyball-icon">🏐</div>
        <h1>Résultats</h1>
        <div class="favorites-wrapper">
          <FavoriteButton :is-active="dropdownOpen" @toggle="toggleDropdown" />
          <FavoritesDropdown
            v-if="dropdownOpen"
            :favorites="favorites"
            @close="closeDropdown"
            @navigate="navigateToPool"
            @remove="handleRemove"
          />
        </div>
      </div>

      <!-- Sélecteurs + Navigation -->
      <div class="header-controls">
        <CompetitionSelector />
        <nav class="nav-links desktop-only">
          <router-link :to="fullViewLink" class="nav-link">Vue complète</router-link>
          <router-link :to="compactViewLink" class="nav-link">Vue compacte</router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Mobile-first base styles */
.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--space-sm);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-sm);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  justify-content: center;
}

.favorites-wrapper {
  position: relative;
}

.header-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.volleyball-icon {
  font-size: 1.5rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

h1 {
  font-size: var(--font-size-lg);
  font-weight: 700;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  flex-wrap: wrap;
}

.nav-link {
  padding: var(--space-sm) var(--space-md);
  border-radius: 0.5rem;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--font-size-sm);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.desktop-only {
  display: none;
}

.nav-link:hover {
  background: var(--color-surface-light);
  color: var(--color-text);
}

.nav-link.router-link-active {
  background: var(--color-primary);
  color: white;
}

/* md: 768px+ */
@media (min-width: 768px) {
  .header-content {
    padding: var(--space-md);
    gap: var(--space-md);
  }

  h1 {
    font-size: var(--font-size-xl);
  }

  .volleyball-icon {
    font-size: 2rem;
  }
}

/* lg: 1024px+ - Tout sur une ligne */
@media (min-width: 1024px) {
  .header-content {
    flex-direction: row;
    align-items: center;
    padding: 1rem 2rem;
    gap: 1.5rem;
  }

  .logo-section {
    flex-shrink: 0;
    gap: 0.75rem;
  }

  .volleyball-icon {
    font-size: 2rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .header-controls {
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
  }

  .nav-links {
    flex-shrink: 0;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .desktop-only {
    display: flex;
  }
}
</style>