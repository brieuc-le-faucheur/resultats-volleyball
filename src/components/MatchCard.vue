<template>
  <div
    class="match-card"
    :class="[
      `variant-${variant}`,
      match.played ? 'played' : 'upcoming'
    ]"
  >
    <!-- Vue compacte -->
    <template v-if="variant === 'compact'">
      <div class="match-date">
        {{ formattedDate }}
        <span class="match-time">{{ match.time }}</span>
      </div>
      <div class="match-teams-compact">
        <div class="team">{{ displayTeamName(match.teamA) }}</div>
        <div class="vs">vs</div>
        <div class="team">{{ displayTeamName(match.teamB) }}</div>
      </div>
    </template>

    <!-- Vue complète -->
    <template v-else>
      <div class="match-header">
        <span class="journee-badge" :class="{ 'upcoming': !match.played }">
          J{{ match.journee }}
        </span>
        <span class="match-time">{{ match.time }}</span>
      </div>
      <div class="match-teams">
        <div class="team" :class="getTeamClass(match.teamA, match.scoreA, match.scoreB)">
          <span class="team-name">{{ displayTeamName(match.teamA) }}</span>
          <span v-if="match.played" class="score">{{ match.scoreA }}</span>
        </div>
        <div class="vs">VS</div>
        <div class="team" :class="getTeamClass(match.teamB, match.scoreB, match.scoreA)">
          <span class="team-name">{{ displayTeamName(match.teamB) }}</span>
          <span v-if="match.played" class="score">{{ match.scoreB }}</span>
        </div>
      </div>
      <div v-if="match.played && match.sets" class="match-sets">
        {{ match.sets }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatShortTeamName } from '../utils/teamNames'
import { useDateFormatting } from '../composables/useDateFormatting'
import type { Match } from '../composables/useFFVBData'

interface Props {
  match: Match
  variant?: 'full' | 'compact'
  useShortNames?: boolean
  dateFormatter?: ((date: string) => string) | null
  selectedTeam?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'full',
  useShortNames: false,
  dateFormatter: null,
  selectedTeam: null
})

// Calcul du style pour l'équipe sélectionnée
function getTeamClass(team: string, score: number | null, opponentScore: number | null): Record<string, boolean> {
  const isWinner = props.match.played && score !== null && opponentScore !== null && score > opponentScore
  const isSelected = props.selectedTeam === team

  if (isSelected && props.match.played && score !== null && opponentScore !== null) {
    return {
      'selected-win': score > opponentScore,
      'selected-loss': score < opponentScore
    }
  }

  return {
    'winner': isWinner && !props.selectedTeam
  }
}

const { formatDateFull, formatDateCompact } = useDateFormatting()

const formattedDate = computed(() => {
  if (props.dateFormatter) {
    return props.dateFormatter(props.match.date)
  }
  return props.variant === 'compact'
    ? formatDateCompact(props.match.date)
    : formatDateFull(props.match.date)
})

function displayTeamName(team: string): string {
  return props.useShortNames ? formatShortTeamName(team) : team
}
</script>

<style scoped>
.match-card {
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  transition: all 0.2s;
}

/* Compact variant */
.match-card.variant-compact {
  background: var(--color-background);
  border-left: 3px solid var(--color-primary);
}

.match-card.variant-compact:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow);
}

.match-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.match-time {
  color: var(--color-text-muted);
  font-weight: 500;
}

.match-teams-compact {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.match-teams-compact .team {
  flex: 1;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem;
  background: var(--color-surface);
  border-radius: 0.5rem;
  text-align: center;
}

.match-teams-compact .vs {
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

/* Full variant */
.match-card.variant-full {
  background: var(--color-surface);
}

.match-card.variant-full.played {
  border-left: 3px solid var(--color-secondary);
}

.match-card.variant-full.upcoming {
  border-left: 3px solid var(--color-draw);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.journee-badge {
  background: var(--color-secondary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 0.75rem;
}

.journee-badge.upcoming {
  background: var(--color-draw);
}

.match-teams {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.match-teams .team {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-background);
  border-radius: 0.5rem;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.match-teams .team.winner,
.match-teams .team.selected-win {
  background: rgba(16, 185, 129, 0.15);
  border-color: var(--color-win);
}

.match-teams .team.selected-loss {
  background: rgba(239, 68, 68, 0.15);
  border-color: var(--color-loss);
}

.match-teams .team-name {
  font-weight: 600;
  font-size: 1rem;
}

.match-teams .score {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.match-teams .vs {
  font-weight: 700;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.match-sets {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: var(--color-surface-light);
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-family: 'Courier New', monospace;
}

/* Mobile-first responsive styles */

/* Compact variant - mobile */
.match-teams-compact {
  flex-direction: column;
  gap: var(--space-sm);
}

.match-teams-compact .vs {
  display: none;
}

.match-teams-compact .team {
  font-size: var(--font-size-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Full variant - mobile */
.match-teams {
  flex-direction: column;
  gap: var(--space-sm);
}

.match-teams .vs {
  display: none;
}

.match-teams .team {
  padding: var(--space-sm) var(--space-md);
}

.match-teams .team-name {
  font-size: var(--font-size-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
}

.match-teams .score {
  font-size: var(--font-size-xl);
}

/* sm: 480px+ - Restore horizontal layout */
@media (min-width: 480px) {
  .match-teams-compact {
    flex-direction: row;
    gap: 0.75rem;
  }

  .match-teams-compact .vs {
    display: block;
  }

  .match-teams-compact .team {
    font-size: 0.875rem;
  }

  .match-teams {
    flex-direction: row;
    gap: 1rem;
  }

  .match-teams .vs {
    display: block;
  }

  .match-teams .team {
    padding: 1rem;
  }

  .match-teams .team-name {
    font-size: 1rem;
    max-width: none;
    white-space: normal;
  }

  .match-teams .score {
    font-size: 1.5rem;
  }
}
</style>
