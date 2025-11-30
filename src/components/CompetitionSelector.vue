<script setup lang="ts">
import { useCompetitionSelector } from '../composables/useCompetitionSelector'

const {
  competitions,
  selectedCompetitionId,
  selectedPoolCode,
  availablePools,
  selectCompetition,
  selectPool
} = useCompetitionSelector()

function handleCompetitionChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  selectCompetition(target.value)
}

function handlePoolChange(event: Event): void {
  const target = event.target as HTMLSelectElement
  selectPool(target.value)
}
</script>

<template>
  <div class="competition-selector">
    <!-- Masquer le dropdown de compétition si une seule option -->
    <div v-if="competitions.length > 1" class="selector-group">
      <label for="competition-select">Compétition</label>
      <select
        id="competition-select"
        :value="selectedCompetitionId"
        @change="handleCompetitionChange"
        class="selector"
      >
        <option
          v-for="comp in competitions"
          :key="comp.id"
          :value="comp.id"
        >
          {{ comp.name }}
        </option>
      </select>
    </div>

    <div class="selector-group">
      <label for="pool-select">Poule</label>
      <select
        id="pool-select"
        :value="selectedPoolCode"
        @change="handlePoolChange"
        class="selector"
      >
        <option
          v-for="pool in availablePools"
          :key="pool.code"
          :value="pool.code"
        >
          {{ pool.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.competition-selector {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.selector {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.selector:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
}

.selector:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

@media (max-width: 768px) {
  .competition-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .selector-group {
    min-width: 100%;
  }
}
</style>
