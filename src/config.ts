export interface Pool {
  code: string           // Ex: "DMA", "DMB", "DMC"
  name: string           // Ex: "DEPARTEMENTALE MASCULINE A"
  url?: string           // URL spécifique si besoin (optionnel)
}

export interface Competition {
  id: string             // Ex: "PTBR35-2025-2026"
  name: string           // Ex: "Comité d'Ille-et-Vilaine 2025/2026"
  codent: string         // Ex: "PTBR35"
  saison: string         // Ex: "2025/2026"
  pools: Pool[]          // Liste des poules disponibles
}

export interface AppConfig {
  dataMode: 'mock' | 'live'
  mockServerUrl: string
  corsProxy: string
  competitions: Competition[]
  defaultCompetitionId: string
  defaultPoolCode: string
  lastUpdated: string // Date de dernière extraction des codes de poules
}

export const config: AppConfig = {
  dataMode: 'mock',
  mockServerUrl: 'http://localhost:3001/ffvb-data',
  corsProxy: 'https://cors-anywhere.com/',

  // Configuration par défaut
  defaultCompetitionId: 'PTBR35-2025-2026',
  defaultPoolCode: 'DMA',

  // Date de dernière extraction des codes de poules depuis le HTML FFVB
  lastUpdated: '2025-11-30',

  // Liste des compétitions disponibles
  // NOTE: Pour l'instant une seule compétition, d'autres seront ajoutées ultérieurement
  competitions: [
    {
      id: 'PTBR35-2025-2026',
      name: 'Comité d\'Ille-et-Vilaine 2025/2026',
      codent: 'PTBR35',
      saison: '2025/2026',
      pools: [
        // DEPARTEMENTALE MASCULINE
        { code: 'DMA', name: 'DEPARTEMENTALE MASCULINE A' },
        { code: 'DMB', name: 'DEPARTEMENTALE MASCULINE B' },
        { code: 'DMC', name: 'DEPARTEMENTALE MASCULINE C' },

        // DEPARTEMENTALE FEMININE
        { code: 'DFA', name: 'DEPARTEMENTALE FEMININE A' },
        { code: 'DFB', name: 'DEPARTEMENTALE FEMININE B' },
        { code: 'DFC', name: 'DEPARTEMENTALE FEMININE C' },

        // PRE REGIONALE
        { code: '1PF', name: 'PRE REGIONALE FEMININE' },
        { code: '1PM', name: 'PRE REGIONALE MASCULINE' },

        // M18 HONNEURS FEMININES
        { code: 'CGF', name: 'M18 FILLES HONNEURS POULE G' },
        { code: 'CHA', name: 'M18 FILLES HONNEURS POULE A' },
        { code: 'CHB', name: 'M18 FILLES HONNEURS POULE B' },
        { code: 'CHE', name: 'M18 Filles HONNEURS POULE E' },
        { code: 'CHF', name: 'M18 FILLES HONNEURS POULE F' },
        { code: 'CMC', name: 'M18 FILLE HONNEURS Poule C' },
        { code: 'CMD', name: 'M18 FILLES HONNEURS POULE D' },

        // M18 HONNEURS MASCULINS
        { code: 'HCA', name: 'M18 MASCULINS HONNEUR POULE A' },
        { code: 'HCB', name: 'M18 MASCULINS HONNEUR POULE B' },
        { code: 'MCC', name: 'M18 MASCULIN HONNEURS POULE C' },

        // M15 HONNEURS FEMININES
        { code: 'MAF', name: 'M15 FILLES HONNEURS Poule A' },
        { code: 'MBF', name: 'M15 FILLES HONNEURS Poule B' },
        { code: 'MCF', name: 'M15 FILLES HONNEURS Poule C' },

        // M15 HONNEURS MASCULINS
        { code: 'MMA', name: 'M15 MASCULINS HONNEURS Poule A' },
        { code: 'MMB', name: 'M15 MASCULINS HONNEURS Poule B' },

        // M13
        { code: 'BAF', name: 'M13 Féminines OR' },
        { code: 'BFA', name: 'M13 Féminines ARGENT' },
        { code: 'BFC', name: 'M13 Féminines BRONZE POULE C' },
        { code: 'BFD', name: 'M13 Féminines BRONZE POULE D' },
        { code: 'BHM', name: 'M13 Masculins et Mixtes OR' },
        { code: 'BMA', name: 'M13 Masculins et Mixtes ARGENT A' },
        { code: 'BMB', name: 'M13 Masculins et Mixtes BRONZE B' },
        { code: 'BMC', name: 'M13 Masculins et Mixtes BRONZE C' },
        { code: 'BMD', name: 'M13 Masculins et Mixtes CUIVRE D' },
        { code: 'BME', name: 'M13 Masculins et Mixtes CUIVRE E' },

        // M11
        { code: 'PBA', name: 'M11 EXCELLENCE 1ère phase POULE A' },
        { code: 'PBB', name: 'M11 EXCELLENCE 1ère phase POULE B' },
        { code: 'PBC', name: 'M11 HONNEUR + Féminines 1ère phase POULE C' },

        // COUPES SPORT 2000
        { code: 'ACF', name: 'COUPE SPORT 2000 FEMININE POULE A' },
        { code: 'BCF', name: 'COUPE SPORT 2000 FEMININE POULE B' },
        { code: 'CCF', name: 'COUPE SPORT 2000 FEMININE POULE C' },
        { code: 'DCF', name: 'COUPE SPORT 2000 FEMININE POULE D' },
        { code: 'ECF', name: 'COUPE SPORT 2000 FEMININE POULE E' },
        { code: 'FCF', name: 'COUPE SPORT 2000 FEMININE POULE F' },
        { code: 'GCF', name: 'COUPE SPORT 2000 FEMININE POULE G' },
        { code: 'CAM', name: 'COUPE SPORT 2000 MASCULINE POULE A' },
        { code: 'CBM', name: 'COUPE SPORT 2000 MASCULINE POULE B' },
        { code: 'CCM', name: 'COUPE SPORT 2000 MASCULINE POULE C' },
        { code: 'CDM', name: 'COUPE SPORT 2000 MASCULINE POULE D' },
        { code: 'CEM', name: 'COUPE SPORT 2000 MASCULINE POULE E' },
        { code: 'CFM', name: 'COUPE SPORT 2000 MASCULINE POULE F' },
        { code: 'CGM', name: 'COUPE SPORT 2000 MASCULINE POULE G' },
        { code: 'CHM', name: 'COUPE SPORT 2000 MASCULINE POULE H' },

        // COUPE DU CD 35
        { code: 'GFA', name: 'COUPE DU CD 35 FEMININ POULE A' },
        { code: 'GFB', name: 'COUPE DU CD 35 FEMININ POULE B' },
        { code: 'GFC', name: 'COUPE DU CD 35 FEMININ POULE C' },
        { code: 'GFD', name: 'COUPE DU CD 35 FEMININ POULE D' },
        { code: 'GFE', name: 'COUPE DU CD 35 FEMININ POULE E' },
        { code: 'GFF', name: 'COUPE DU CD 35 FEMININ POULE F' },
        { code: 'GFG', name: 'COUPE DU CD 35 FEMININ POULE G' },
        { code: 'GFH', name: 'COUPE DU CD 35 FEMININ POULE H' },
        { code: 'GMA', name: 'COUPE DU CD 35 MASCULIN POULE A' },
        { code: 'GMB', name: 'COUPE DU CD 35 MASCULIN POULE B' },
        { code: 'GMC', name: 'COUPE DU CD 35 MASCULIN POULE C' },
        { code: 'GMD', name: 'COUPE DU CD 35 MASCULIN POULE D' },
        { code: 'GME', name: 'COUPE DU CD 35 MASCULIN POULE E' },
        { code: 'GMF', name: 'COUPE DU CD 35 MASCULIN POULE F' },
        { code: 'GMG', name: 'COUPE DU CD 35 MASCULIN POULE G' },
        { code: 'GMH', name: 'COUPE DU CD 35 MASCULIN POULE H' },

        // COMPET'LIB (sélection des principales poules)
        { code: 'X4E', name: 'COMPET LIB 4/4 POULE B (Est)' },
        { code: 'X4N', name: 'COMPET LIB 4/4 POULE A (Nord/Sud)' },
        { code: 'X4S', name: 'COMPET LIB 4/4 POULE C (Sud)' },
        { code: 'XAA', name: 'COMPET LIB\' POULE A bis' },
        { code: 'XAB', name: 'COMPET LIB\' POULE B bis' },
        { code: 'XAC', name: 'COMPET LIB\' POULE C bis' },
        { code: 'XSA', name: 'COMPET LIB\' POULE A' },
        { code: 'XSB', name: 'COMPET LIB\' POULE B' },
        { code: 'XSC', name: 'COMPET LIB\' POULE C' },
        { code: 'XSD', name: 'COMPET LIB\' POULE D' },
        { code: 'XSE', name: 'COMPET LIB\' POULE E' },
        { code: 'XSF', name: 'COMPET LIB\' POULE F' },
        { code: 'XSG', name: 'COMPET LIB\' POULE G' },
        { code: 'XSH', name: 'COMPET LIB\' POULE H' },
        { code: 'XSI', name: 'COMPET LIB\' POULE I' },
        { code: 'XSJ', name: 'COMPET LIB\' POULE J' },
        { code: 'XSK', name: 'COMPET LIB\' POULE K' },
        { code: 'XSL', name: 'COMPET LIB\' POULE L' },
        { code: 'XSM', name: 'COMPET LIB\' POULE M' },
        { code: 'XSN', name: 'COMPET LIB\' POULE N' },
        { code: 'XSO', name: 'COMPET LIB\' POULE O' },
        { code: 'XSP', name: 'COMPET LIB\' POULE P' },
        { code: 'XSQ', name: 'COMPET LIB\' POULE Q' },
        { code: 'XSR', name: 'COMPET LIB\' POULE R' },
        { code: 'XSS', name: 'COMPET LIB\' POULE S' },
        { code: 'XST', name: 'COMPET LIB\' POULE T' },
        { code: 'XSU', name: 'COMPET LIB\' POULE U' },
        { code: 'XSV', name: 'COMPET LIB\' POULE V' },
        { code: 'XSW', name: 'COMPET LIB\' POULE W' },
        { code: 'XSX', name: 'COMPET LIB\' POULE X' },
        { code: 'XSY', name: 'COMPET LIB\' POULE Y' },
        { code: 'XSZ', name: 'COMPET LIB\' POULE Z' },
      ]
    }
  ]
}
