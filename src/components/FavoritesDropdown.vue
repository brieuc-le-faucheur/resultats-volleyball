<template>
  <div class="favorites-dropdown" ref="dropdownRef">
    <div class="dropdown-header">
      <span class="dropdown-title">Poules favorites</span>
    </div>

    <div v-if="favorites.length === 0" class="empty-state">
      <p>Aucune poule favorite</p>
      <p class="hint">Ajoutez des poules via le selecteur ou le classement</p>
    </div>

    <ul v-else class="favorites-list">
      <li
        v-for="pool in favorites"
        :key="`${pool.competitionId}-${pool.saison}-${pool.poolCode}`"
        class="favorite-item"
      >
        <button class="favorite-link" @click="$emit('navigate', pool)">
          <span class="pool-name">{{ pool.poolName }}</span>
          <span class="competition-name">{{ pool.competitionName }}</span>
        </button>
        <button
          class="remove-btn"
          @click.stop="$emit('remove', pool)"
          :aria-label="`Supprimer ${pool.poolName} des favoris`"
        >
          &times;
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { FavoritePool } from '../composables/useFavoritePools'

defineProps<{
  favorites: FavoritePool[]
}>()

const emit = defineEmits<{
  close: []
  navigate: [pool: FavoritePool]
  remove: [pool: FavoritePool]
}>()

const dropdownRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    const target = event.target as HTMLElement
    if (!target.closest('.favorite-button')) {
      emit('close')
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.favorites-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  min-width: 280px;
  max-width: 350px;
  z-index: 200;
  overflow: hidden;
}

.dropdown-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-light);
}

.dropdown-title {
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.empty-state {
  padding: 1.5rem 1rem;
  text-align: center;
  color: var(--color-text-muted);
}

.empty-state p {
  margin: 0;
}

.empty-state .hint {
  font-size: var(--font-size-xs);
  margin-top: 0.5rem;
}

.favorites-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
}

.favorite-item {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid var(--color-border);
}

.favorite-item:last-child {
  border-bottom: none;
}

.favorite-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

.favorite-link:hover {
  background: var(--color-surface-light);
}

.pool-name {
  font-weight: 600;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.competition-name {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.remove-btn {
  padding: 0 1rem;
  background: none;
  border: none;
  border-left: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: var(--color-loss);
  color: white;
}

/* Mobile */
@media (max-width: 767px) {
  .favorites-dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    margin-top: 0;
    max-width: none;
    border-radius: 1rem 1rem 0 0;
    max-height: 60vh;
  }

  .favorites-list {
    max-height: calc(60vh - 60px);
  }
}
</style>
