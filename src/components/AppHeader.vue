<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import CompetitionSelector from './CompetitionSelector.vue'

const route = useRoute()
const isCompactView = computed(() => route.name === 'compact')

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
      <div class="logo-section">
        <div class="volleyball-icon">🏐</div>
        <div>
          <h1>Résultats</h1>
          <p v-if="!isCompactView" class="subtitle">Classement et matchs</p>
        </div>
      </div>

      <!-- Sélecteur de compétition (visible dans toutes les vues) -->
      <CompetitionSelector />

      <nav class="nav-links desktop-only">
        <router-link :to="fullViewLink" class="nav-link">Vue complète</router-link>
        <router-link :to="compactViewLink" class="nav-link">Vue compacte</router-link>
      </nav>
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
  gap: var(--space-xs);
  justify-content: center;
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

.subtitle {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  margin-top: 0.25rem;
  display: none;
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
  font-size: var(--font-size-xs);
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

/* md: 768px+ - Slightly larger header */
@media (min-width: 768px) {
  .header-content {
    padding: var(--space-md);
    gap: var(--space-md);
  }

  .logo-section {
    gap: var(--space-sm);
  }

  h1 {
    font-size: var(--font-size-xl);
  }

  .volleyball-icon {
    font-size: 2rem;
  }
}

/* lg: 1024px+ - Horizontal layout + show desktop elements */
@media (min-width: 1024px) {
  .header-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    gap: 2rem;
  }

  .logo-section {
    justify-content: flex-start;
    gap: 1rem;
  }

  .volleyball-icon {
    font-size: 3rem;
  }

  h1 {
    font-size: 1.875rem;
  }

  .subtitle {
    display: block;
  }

  .nav-links {
    gap: 1rem;
    justify-content: flex-end;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    flex: none;
  }

  .desktop-only {
    display: flex;
  }
}
</style>