import { ref, watch, onMounted } from 'vue'

export function useTheme() {
  // Détection préférence système
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  // Lecture localStorage ou fallback sur préférence système
  const savedTheme = localStorage.getItem('volleyball-theme')
  const isDark = ref(savedTheme ? savedTheme === 'dark' : prefersDark)

  // Appliquer le thème au DOM
  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }

  // Toggle manuel
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  // Watcher pour sauvegarder et appliquer
  watch(isDark, (newValue) => {
    localStorage.setItem('volleyball-theme', newValue ? 'dark' : 'light')
    applyTheme(newValue)
  }, { immediate: true })

  // Écoute des changements système
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      // Seulement si l'utilisateur n'a pas de préférence manuelle
      if (!localStorage.getItem('volleyball-theme')) {
        isDark.value = e.matches
      }
    }
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  })

  return {
    isDark,
    toggleTheme
  }
}
