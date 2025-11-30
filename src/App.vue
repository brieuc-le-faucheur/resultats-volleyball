<script setup>
import { ref, onMounted } from 'vue'
import VolleyballDashboard from './components/VolleyballDashboard.vue'

const loading = ref(true)

onMounted(() => {
  loading.value = false
})
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="volleyball-icon">🏐</div>
          <div>
            <h1>Volleyball Dashboard</h1>
            <p class="subtitle">Résultats et classement DMA - PTBR35</p>
          </div>
        </div>
      </div>
    </header>

    <main class="app-main">
      <VolleyballDashboard v-if="!loading" />
      <div v-else class="loading">
        <div class="spinner"></div>
        <p>Chargement...</p>
      </div>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-secondary: #10b981;
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-surface-light: #334155;
  --color-text: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-border: #334155;
  --color-win: #10b981;
  --color-loss: #ef4444;
  --color-draw: #f59e0b;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: var(--color-text);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

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
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
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

.app-header h1 {
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

.app-main {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-surface-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 1.5rem;
  }

  .volleyball-icon {
    font-size: 2rem;
  }

  .header-content {
    padding: 1rem;
  }

  .app-main {
    padding: 1rem;
  }
}
</style>
