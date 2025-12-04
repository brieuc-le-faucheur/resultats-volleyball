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
      <!-- Logo -->
      <div class="logo-section">
        <div class="volleyball-icon">🏐</div>
        <h1>Résultats</h1>
      </div>

      <!-- Sélecteurs + Favoris -->
      <div class="selectors-section">
        <CompetitionSelector />
        <div class="favorites-group">
          <label>Favoris</label>
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
      </div>

      <!-- Toggle vue (desktop only) -->
      <router-link
        :to="isCompactView ? fullViewLink : compactViewLink"
        class="view-toggle-btn"
        :title="isCompactView ? 'Vue classique' : 'Vue compacte'"
      >
        {{ isCompactView ? 'Vue classique' : 'Vue compacte' }}
      </router-link>
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

.selectors-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.favorites-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.favorites-group label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.favorites-wrapper {
  position: relative;
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

.desktop-only {
  display: none;
}

/* Bouton toggle vue - caché en mobile */
.view-toggle-btn {
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  margin-left: auto;
  background: var(--color-surface-light);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  transition: all 0.2s;
}

.view-toggle-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
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

  .selectors-section {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .favorites-group {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
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

  .selectors-section {
    flex: 1;
  }

  .volleyball-icon {
    font-size: 2rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .desktop-only {
    display: flex;
  }

  .view-toggle-btn {
    display: flex;
  }
}
</style>