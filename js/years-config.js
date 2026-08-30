/* ==================== YEARS-CONFIG.JS - PHARMACY YEARS CONFIGURATION ==================== */

const YEARS_CONFIG = {
    'year1': {
        id: 'year1',
        pageId: 'page2', // Legacy mapping for backwards compatibility
        name: '1ère Année Pharmacie',
        shortName: '1ère Année',
        icon: 'fas fa-graduation-cap',
        description: 'Calcul des notes de la 1ère année de Pharmacie avec examens, tests et TP',
        isLegacy: true,
        subjects: [
            { key: 'organic', name: 'Chimie Organique', coef: 3, type: 'exams', count: 2, hasTP: false },
            { key: 'generalchemistry', name: 'Chimie Générale', coef: 3, type: 'exams', count: 2, hasTP: false },
            { key: 'cellbiology', name: 'Biologie Cellulaire', coef: 3, type: 'tests', count: 3, tpToggleable: true, hasTP: false },
            { key: 'plantbiology', name: 'Biologie Végétale', coef: 2, type: 'tests', count: 2, hasTP: true, tpOptional: false },
            { key: 'biostatistics', name: 'Biostatistique', coef: 1.5, type: 'single', hasTP: false },
            { key: 'informatics', name: 'Informatique', coef: 1.5, type: 'single', hasTP: false },
            { key: 'anatomy', name: 'Anatomie', coef: 2, type: 'single', hasTP: false },
            { key: 'physiology', name: 'Physiologie', coef: 2, type: 'single', hasTP: false },
            { key: 'physics', name: 'Physique', coef: 2, type: 'tests', count: 1, hasTP: false },
            { key: 'history', name: 'Histoire de la Pharmacie', coef: 1, type: 'tests', count: 1, hasTP: false },
            { key: 'english', name: 'English', coef: 1, type: 'single', hasTP: false }
        ]
    },
    'year2': {
        id: 'year2',
        pageId: 'year2-page',
        name: '2ème Année Pharmacie',
        shortName: '2ème Année',
        icon: 'fas fa-flask-vial',
        description: 'Calcul des notes de la 2ème année de Pharmacie (2T/3T + TP Optionnel)',
        subjects: [
            { 
                key: 'chimie_minerale', 
                name: 'Chimie minérale', 
                coef: 2, 
                type: 'tests', 
                count: 2, 
                allowTestCountChoice: true,
                options: [2, 3],
                defaultCount: 2,
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'chimie_analytique', 
                name: 'Chimie analytique', 
                coef: 2, 
                type: 'tests', 
                count: 2, 
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'biophysique', 
                name: 'Biophysique', 
                coef: 2, 
                type: 'tests', 
                count: 2, 
                hasTP: false 
            },
            { 
                key: 'genetique', 
                name: 'Génétique', 
                coef: 2, 
                type: 'tests', 
                count: 2, 
                hasTP: false 
            },
            { 
                key: 'physiopathologie', 
                name: 'Physiopathologie', 
                coef: 2, 
                type: 'tests', 
                count: 2, 
                hasTP: false 
            },
            { 
                key: 'english', 
                name: 'English', 
                coef: 1, 
                type: 'tests', 
                count: 1, 
                hasTP: false 
            },
            { 
                key: 'biochimie', 
                name: 'Biochimie', 
                coef: 2, 
                type: 'tests', 
                count: 3, 
                hasTP: false 
            },
            { 
                key: 'botanique', 
                name: 'Botanique', 
                coef: 2, 
                type: 'tests', 
                count: 2, 
                hasTP: true, 
                tpOptional: true 
            }
        ]
    },
    'year3': {
        id: 'year3',
        pageId: 'year3-page',
        name: '3ème Année Pharmacie',
        shortName: '3ème Année',
        icon: 'fas fa-pills',
        description: 'Calcul des notes de la 3ème année de Pharmacie (TP Optionnel)',
        subjects: [
            { 
                key: 'therapeutique', 
                name: 'Thérapeutique', 
                coef: 3, 
                type: 'tests', 
                count: 1, 
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'pharmacologie', 
                name: 'Pharmacologie', 
                coef: 3, 
                type: 'tests', 
                count: 3, 
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'galenique', 
                name: 'Galénique', 
                coef: 3, 
                type: 'tests', 
                count: 1, 
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'chimie_analytique', 
                name: 'Chimie analytique', 
                coef: 2, 
                type: 'tests', 
                count: 2, 
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'pharmacognosie', 
                name: 'Pharmacognosie', 
                coef: 2, 
                type: 'tests', 
                count: 2, 
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'semiologie', 
                name: 'Sémiologie', 
                coef: 1, 
                type: 'tests', 
                count: 1, 
                hasTP: false 
            }
        ]
    },
    'year4': {
        id: 'year4',
        pageId: 'year4-page',
        name: '4ème Année Pharmacie',
        shortName: '4ème Année',
        icon: 'fas fa-microscope',
        description: 'Calcul des notes de la 4ème année de Pharmacie (3 Tests par matière + TP Optionnel)',
        subjects: [
            { 
                key: 'parasitologie', 
                name: 'Parasitologie', 
                coef: 2, 
                type: 'tests', 
                count: 3, 
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'microbiologie', 
                name: 'Microbiologie', 
                coef: 2, 
                type: 'tests', 
                count: 3, 
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'biochimie', 
                name: 'Biochimie', 
                coef: 2, 
                type: 'tests', 
                count: 3, 
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'immunologie', 
                name: 'Immunologie', 
                coef: 2, 
                type: 'tests', 
                count: 3, 
                hasTP: false 
            },
            { 
                key: 'hemobiologie', 
                name: 'Hémobiologie', 
                coef: 2, 
                type: 'tests', 
                count: 3, 
                hasTP: true, 
                tpOptional: true 
            }
        ]
    },
    'year5': {
        id: 'year5',
        pageId: 'year5-page',
        name: '5ème Année Pharmacie',
        shortName: '5ème Année',
        icon: 'fas fa-user-md',
        description: 'Calcul des notes de la 5ème année de Pharmacie',
        subjects: [
            { 
                key: 'toxicologie', 
                name: 'Toxicologie', 
                coef: 3, 
                type: 'tests', 
                count: 3, 
                badge: 'Trimestre = 3T',
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'pharmacie_clinique', 
                name: 'Pharmacie clinique', 
                coef: 2, 
                type: 'tests', 
                count: 2, 
                hasTP: false 
            },
            { 
                key: 'hydro_bromatologie', 
                name: 'Hydro-bromatologie', 
                coef: 2, 
                type: 'tests', 
                count: 1, 
                hasTP: true, 
                tpOptional: true 
            },
            { 
                key: 'pharmacie_industrielle', 
                name: 'Pharmacie industrielle', 
                coef: 2, 
                type: 'tests', 
                count: 2, 
                hasTP: false 
            },
            { 
                key: 'gestion', 
                name: 'Gestion', 
                coef: 1, 
                type: 'tests', 
                count: 1, 
                hasTP: false 
            },
            { 
                key: 'droit', 
                name: 'Droit', 
                coef: 1, 
                type: 'tests', 
                count: 1, 
                hasTP: false 
            },
            { 
                key: 'pharmacie_hospitaliere', 
                name: 'Pharmacie hospitalière', 
                coef: 1, 
                type: 'tests', 
                count: 1, 
                hasTP: false 
            },
            { 
                key: 'epidemiologie', 
                name: 'Épidémiologie', 
                coef: 1, 
                type: 'tests', 
                count: 1, 
                hasTP: false 
            }
        ]
    }
};
