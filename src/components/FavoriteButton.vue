<template>
  <button
    @click="$emit('toggle')"
    class="favorite-button"
    :class="[size, { active: isActive }]"
    :aria-label="isActive ? 'Fermer les favoris' : 'Ouvrir les favoris'"
  >
    <span class="star-icon">{{ isActive ? '★' : '☆' }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isActive?: boolean
  size?: 'sm' | 'md'
}>()

defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
.favorite-button {
  background: var(--color-surface-light);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.favorite-button:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.favorite-button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.star-icon {
  font-size: 1.125rem;
  line-height: 1;
  color: var(--color-text);
}

.favorite-button:hover .star-icon,
.favorite-button.active .star-icon {
  color: white;
}

/* Taille sm - pour le bouton à côté du titre */
.favorite-button.sm {
  padding: 0.25rem 0.375rem;
  border-radius: 0.25rem;
}

.favorite-button.sm .star-icon {
  font-size: 0.875rem;
}
</style>
