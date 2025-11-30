<template>
  <div class="standings-table-wrapper" :class="`variant-${variant}`">
    <table class="standings-table">
      <thead>
        <tr>
          <th class="pos-col">#</th>
          <th class="team-col">Équipe</th>
          <th>J</th>
          <th v-if="variant === 'full'">G</th>
          <th v-if="variant === 'full'">P</th>
          <th v-if="variant === 'compact'">V</th>
          <th v-if="variant === 'compact'">D</th>
          <th>Pts</th>
          <th v-if="variant === 'full'">Sets+</th>
          <th v-if="variant === 'full'">Sets-</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="standing in standings"
          :key="standing.team"
          :class="{
            'selected': selectable && selectedTeam === standing.team,
            'clickable': selectable,
            'highlight': variant === 'compact' && standing.position <= 3
          }"
          @click="handleRowClick(standing.team)"
        >
          <td class="pos-col">
            <span class="position-badge" :class="`pos-${standing.position}`">
              {{ standing.position }}
            </span>
          </td>
          <td class="team-col">
            {{ displayTeamName(standing.team) }}
            <span v-if="selectable && selectedTeam === standing.team" class="selected-indicator">✓</span>
          </td>
          <td>{{ standing.played }}</td>
          <td :class="variant === 'full' ? 'win-col' : ''">{{ standing.won }}</td>
          <td :class="variant === 'full' ? 'loss-col' : ''">{{ standing.lost }}</td>
          <td class="points-col">{{ standing.points }}</td>
          <td v-if="variant === 'full'">{{ standing.setsFor }}</td>
          <td v-if="variant === 'full'">{{ standing.setsAgainst }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatShortTeamName } from '../utils/teamNames'

const props = defineProps({
  standings: {
    type: Array,
    required: true
  },
  variant: {
    type: String,
    default: 'full',
    validator: (v) => ['full', 'compact'].includes(v)
  },
  selectable: {
    type: Boolean,
    default: false
  },
  selectedTeam: {
    type: String,
    default: null
  },
  useShortNames: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['team-select'])

function handleRowClick(team) {
  if (props.selectable) {
    emit('team-select', team)
  }
}

function displayTeamName(team) {
  return props.useShortNames ? formatShortTeamName(team) : team
}
</script>

<style scoped>
/* Styles communs */
.standings-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.standings-table {
  width: 100%;
  border-collapse: collapse;
}

.standings-table thead {
  position: sticky;
  top: 0;
  background: var(--color-surface);
  z-index: 1;
}

.standings-table th {
  padding: 0.75rem 0.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border);
}

.standings-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.standings-table tbody tr:hover {
  background: var(--color-surface-light);
}

.standings-table tbody tr.clickable {
  cursor: pointer;
}

.standings-table tbody tr.selected {
  background: rgba(37, 99, 235, 0.15);
  border-left: 3px solid var(--color-primary);
}

.standings-table tbody tr.highlight {
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.1));
}

.pos-col {
  width: 50px;
  text-align: center;
}

.team-col {
  font-weight: 500;
  min-width: 150px;
}

.selected-indicator {
  margin-left: 0.5rem;
  color: var(--color-primary);
  font-weight: 700;
}

.position-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-surface-light);
  font-weight: 700;
  font-size: 0.75rem;
}

.position-badge.pos-1 {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #1e293b;
}

.position-badge.pos-2 {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #1e293b;
}

.position-badge.pos-3 {
  background: linear-gradient(135deg, #cd7f32, #daa06d);
  color: #1e293b;
}

.win-col {
  color: var(--color-win);
  font-weight: 600;
}

.loss-col {
  color: var(--color-loss);
  font-weight: 600;
}

.points-col {
  font-weight: 700;
  color: var(--color-primary);
}

/* Variant compact */
.variant-compact .standings-table td {
  font-size: 0.875rem;
}

.variant-compact .points-col {
  font-size: 1rem;
}
</style>
