#!/usr/bin/env node

/**
 * Script pour extraire automatiquement les codes de poules depuis le HTML FFVB
 * Usage: tsx scripts/extract-pools.ts <codent>
 * Exemple: tsx scripts/extract-pools.ts PTBR35
 */

interface Pool {
  category: string
  code: string
  name: string
}

async function extractPools(codent: string): Promise<void> {
  // Récupérer d'abord la saison actuelle (2025/2026 par défaut)
  // On essaie plusieurs saisons possibles
  const currentYear = new Date().getFullYear()
  const possibleSeasons = [
    `${currentYear}/${currentYear + 1}`,
    `${currentYear - 1}/${currentYear}`,
  ]

  let html: string = ''
  let saison: string | undefined
  let url: string = ''

  for (const testSaison of possibleSeasons) {
    url = `https://www.ffvbbeach.org/ffvbapp/resu/vbspo_home.php?saison=${encodeURIComponent(testSaison)}&codent=${codent}`
    console.error(`Trying ${url}...`)

    const response = await fetch(url)
    html = await response.text()

    // Vérifier si la page contient des poules
    if (html.includes('vbspo_calendrier.php')) {
      saison = testSaison
      console.error(`Found competition for season ${saison}`)
      break
    }
  }

  if (!saison) {
    throw new Error(`No valid season found for ${codent}`)
  }

  // Extraire le nom de la compétition depuis le HTML
  const nameMatch = html.match(/<TR><td[^>]*class='titreblanc'[^>]*>([^<]+)<\/td><\/TR>/)
  const competitionName = nameMatch ? nameMatch[1].trim() : `Competition ${codent}`

  console.error(`Competition: ${competitionName}`)
  console.error(`Season: ${saison}`)

  const pools: Pool[] = []
  let currentCategory = 'Autres'

  // Parser le HTML avec regex pour trouver les liens vers les poules
  // Format: <a href='vbspo_calendrier.php?saison=2025/2026&codent=PTBR35&poule=XXX' target='_parent'>XXX NOM</a>
  const linkRegex = /<a href='vbspo_calendrier\.php\?[^']*poule=([A-Z0-9]+)'[^>]*>([^<]+)<\/a>/g

  // Diviser le HTML en sections par catégorie
  const sections = html.split(/<a href="#">/)

  sections.forEach(section => {
    // Extraire le nom de la catégorie
    const categoryMatch = section.match(/^([^<]+)<\/a>/)
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim()
    }

    // Extraire tous les liens de poule dans cette section
    let match: RegExpExecArray | null
    while ((match = linkRegex.exec(section)) !== null) {
      const code = match[1]
      const fullText = match[2].trim()

      // Extraire le nom sans le code au début
      // Format: "XXX NOM DE LA POULE"
      const nameMatch = fullText.match(/^[A-Z0-9]+\s+(.+)$/)
      const name = nameMatch ? nameMatch[1] : fullText

      pools.push({
        category: currentCategory,
        code,
        name: name.trim()
      })
    }
  })

  // Grouper par catégorie
  const categories = new Map<string, Array<{ code: string; name: string }>>()
  pools.forEach(pool => {
    if (!categories.has(pool.category)) {
      categories.set(pool.category, [])
    }
    categories.get(pool.category)!.push({ code: pool.code, name: pool.name })
  })

  // Afficher le résultat en TypeScript
  console.log('\n// Codes de poules extraits automatiquement')
  console.log(`// Date: ${new Date().toISOString().split('T')[0]}`)
  console.log(`{
  id: '${codent}-${saison.replace('/', '-')}',
  name: '${competitionName}',
  codent: '${codent}',
  saison: '${saison}',
  pools: [`)

  for (const [category, poolList] of categories) {
    console.log(`    // ${category}`)
    poolList.forEach(pool => {
      console.log(`    { code: '${pool.code}', name: '${pool.name}' },`)
    })
    console.log('')
  }

  console.log('  ]')
  console.log('},')

  // Statistiques
  const totalPools = Array.from(categories.values()).reduce((sum, list) => sum + list.length, 0)
  console.error(`\n// Total: ${totalPools} poules dans ${categories.size} catégories`)
}

// Récupérer les arguments de ligne de commande
const codent = process.argv[2]

if (!codent) {
  console.error('Usage: tsx scripts/extract-pools.ts <codent>')
  console.error('Exemple: tsx scripts/extract-pools.ts PTBR35')
  process.exit(1)
}

extractPools(codent).catch(console.error)
