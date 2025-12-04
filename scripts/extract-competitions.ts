#!/usr/bin/env node

/**
 * Script pour extraire automatiquement les codes de compétitions depuis les pages FFVB
 * Usage: tsx scripts/extract-competitions.ts
 *
 * Scrape les 4 pages sources et génère src/data/competitions.json
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface Competition {
  codent: string
  name: string
  category: string
}

interface CompetitionsData {
  lastUpdated: string
  competitions: Competition[]
}

// Pages sources à scraper
const SOURCES = [
  {
    url: 'http://www.ffvb.org/front/119-159-1-Championnats-Nationaux',
    category: 'National'
  },
  {
    url: 'http://www.ffvb.org/front/120-37-1-Championnats-Regionaux',
    category: 'Régional'
  },
  {
    url: 'http://www.ffvb.org/front/122-37-1-Championnats-Departementaux',
    category: 'Départemental'
  },
  {
    url: 'http://www.ffvb.org/front/124-167-1-Coupes-de-France-Jeunes',
    category: 'Coupe de France'
  }
]

// Regex pour extraire les liens de compétition
// Format: <a href="https://www.ffvbbeach.org/ffvbapp/resu/vbspo_home.php?codent=PTBR35">35 Ille-et-Vilaine</a>
const COMPETITION_LINK_REGEX = /<a[^>]*href="[^"]*vbspo_home\.php\?codent=([A-Z0-9]+)"[^>]*>([^<]+)<\/a>/gi

// Compétitions nationales hardcodées (la page nationale utilise un format différent)
const NATIONAL_COMPETITIONS: Competition[] = [
  { codent: 'ABCCS', name: 'Championnats Nationaux', category: 'National' }
]

// Mapping des codes de ligues régionales vers leurs noms
const REGIONAL_LEAGUE_NAMES: Record<string, string> = {
  'LIRA': 'Auvergne-Rhône-Alpes',
  'LIBOUR': 'Bourgogne-Franche-Comté',
  'LIBR': 'Bretagne',
  'LICE': 'Centre-Val de Loire',
  'LICO': 'Corse',
  'LILO': 'Grand Est',
  'LIGU': 'Grand Est (ex-Alsace)',
  'LIGY': 'Grand Est (ex-Champagne)',
  'LIFL': 'Hauts-de-France',
  'LIIDF': 'Île-de-France',
  'LIRE': 'La Réunion',
  'LIMART': 'Martinique',
  'LIMY': 'Mayotte',
  'LILBNV': 'Normandie',
  'LIAQ': 'Nouvelle-Aquitaine',
  'LILR': 'Occitanie',
  'LIPL': 'Pays de la Loire',
  'LICA': 'Provence-Alpes-Côte d\'Azur'
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&acirc;/g, 'â')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&icirc;/g, 'î')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&ucirc;/g, 'û')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&iuml;/g, 'ï')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim()
}

async function fetchPage(url: string): Promise<string> {
  console.error(`Fetching ${url}...`)
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }
  return response.text()
}

function extractCompetitions(html: string, category: string): Competition[] {
  const competitions: Competition[] = []
  const seen = new Set<string>()

  let match: RegExpExecArray | null
  while ((match = COMPETITION_LINK_REGEX.exec(html)) !== null) {
    const codent = match[1]
    const rawName = match[2]

    // Ignorer les doublons
    if (seen.has(codent)) continue
    seen.add(codent)

    let name = decodeHtmlEntities(rawName)

    // Si le nom est générique, utiliser le mapping des ligues régionales
    if (name.startsWith('>') || name === 'Compétitions') {
      if (REGIONAL_LEAGUE_NAMES[codent]) {
        name = REGIONAL_LEAGUE_NAMES[codent]
      } else {
        // Ignorer si pas dans le mapping
        continue
      }
    }

    competitions.push({
      codent,
      name,
      category
    })
  }

  return competitions
}

async function main(): Promise<void> {
  console.error('Extracting FFVB competitions...\n')

  const allCompetitions: Competition[] = []

  // Ajouter les compétitions nationales hardcodées
  allCompetitions.push(...NATIONAL_COMPETITIONS)
  console.error(`  National: ${NATIONAL_COMPETITIONS.length} competitions (hardcoded)`)

  for (const source of SOURCES) {
    // Skip national page (uses different URL format, handled via hardcoded list)
    if (source.category === 'National') continue

    try {
      const html = await fetchPage(source.url)
      const competitions = extractCompetitions(html, source.category)
      console.error(`  ${source.category}: ${competitions.length} competitions found`)
      allCompetitions.push(...competitions)
    } catch (error) {
      console.error(`  Error fetching ${source.category}: ${error}`)
    }
  }

  // Trier par catégorie puis par nom
  allCompetitions.sort((a, b) => {
    if (a.category !== b.category) {
      const categoryOrder = ['National', 'Régional', 'Départemental', 'Coupe de France']
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    }
    return a.name.localeCompare(b.name, 'fr')
  })

  const data: CompetitionsData = {
    lastUpdated: new Date().toISOString().split('T')[0],
    competitions: allCompetitions
  }

  // Créer le dossier data s'il n'existe pas
  const dataDir = join(__dirname, '..', 'src', 'data')
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }

  // Écrire le fichier JSON
  const outputPath = join(dataDir, 'competitions.json')
  writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8')

  console.error(`\nTotal: ${allCompetitions.length} competitions`)
  console.error(`Output: ${outputPath}`)
}

main().catch(console.error)
