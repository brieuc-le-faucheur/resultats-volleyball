<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import CompetitionSelector from './CompetitionSelector.vue'

const route = useRoute()
const isCompactView = computed(() => route.name === 'compact')
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

      <nav class="nav-links">
        <ThemeToggle />
        <router-link to="/full" class="nav-link">Vue complète</router-link>
        <router-link to="/compact" class="nav-link">Vue compacte</router-link>
      </nav>
    </div>
  </header>
</template>

<style scoped>
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
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.volleyball-icon {
  font-size: 3rem;
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
  font-size: 1.875rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.nav-link:hover {
  background: var(--color-surface-light);
  color: var(--color-text);
}

.nav-link.router-link-active {
  background: var(--color-primary);
  color: white;
}

@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }

  .volleyball-icon {
    font-size: 2rem;
  }

  .header-content {
    padding: 1rem;
  }
}
</style>