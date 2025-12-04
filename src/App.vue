<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
const isCompactView = computed(() => route.name === 'compact')
</script>

<template>
  <div class="app" :class="{ 'compact-mode': isCompactView }">
    <AppHeader />

    <main class="app-main" :class="{ 'compact-main': isCompactView }">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Thème DARK (par défaut) */
:root,
:root[data-theme="dark"] {
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

  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Typography scale */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
}

/* Thème LIGHT */
:root[data-theme="light"] {
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-secondary: #059669;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-light: #f1f5f9;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
  --color-win: #059669;
  --color-loss: #dc2626;
  --color-draw: #d97706;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.15), 0 4px 6px -4px rgb(0 0 0 / 0.15);
}

/* Ajustements spécifiques pour le mode light */
[data-theme="light"] .volleyball-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--color-background);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-md);
  width: 100%;
}

.app.compact-mode {
  height: 100vh;
  overflow: hidden;
}

.app-main.compact-main {
  max-width: 100%;
  padding: 0;
  flex: 1;
  overflow: hidden;
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

@media (min-width: 768px) {
  .app-main {
    padding: var(--space-xl);
  }
}
</style>
