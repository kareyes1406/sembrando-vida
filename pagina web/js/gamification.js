// --- Gamification Logic ---
const GAMIFICATION = {
    RANKS: [
        { level: 1, name: "Semilla", minPoints: 0, icon: "🌰", color: "#8B5A2B" },
        { level: 2, name: "Brote", minPoints: 100, icon: "🌱", color: "#4CAF50" },
        { level: 3, name: "Arbusto", minPoints: 300, icon: "🌿", color: "#2E7D32" },
        { level: 4, name: "Árbol", minPoints: 600, icon: "🌳", color: "#1B5E20" },
        { level: 5, name: "Guardián del Bosque", minPoints: 1000, icon: "🏔️", color: "#D4A24E" }
    ],
    BADGES: [
        { id: "b_1", name: "Primera Semilla", desc: "Adoptaste tu primer árbol.", reqType: "trees", reqCount: 1, icon: "🌰" },
        { id: "b_2", name: "Cuidador Constante", desc: "Reportaste seguimiento 5 veces.", reqType: "reports", reqCount: 5, icon: "📸" },
        { id: "b_3", name: "Embajador Verde", desc: "Invitaste 3 aliados.", reqType: "invites", reqCount: 3, icon: "🤝" },
        { id: "b_4", name: "Finca Guardiana", desc: "Finca registrada oficialmente.", reqType: "finca", reqCount: 1, icon: "🏡" },
        { id: "b_5", name: "Héroe del Bosque", desc: "Alcanzaste rango Guardián.", reqType: "points", reqCount: 1000, icon: "🦸" }
    ]
};

function getRankInfo(points) {
    let currentRank = GAMIFICATION.RANKS[0];
    let nextRank = GAMIFICATION.RANKS[1];

    for (let i = 0; i < GAMIFICATION.RANKS.length; i++) {
        if (points >= GAMIFICATION.RANKS[i].minPoints) {
            currentRank = GAMIFICATION.RANKS[i];
            nextRank = GAMIFICATION.RANKS[i+1] || null;
        } else {
            break;
        }
    }

    return { currentRank, nextRank };
}

// Generate mock stats based on user points
function getMockUserStats(points) {
    // Just a deterministic mock generation based on points
    const trees = Math.floor(points / 50);
    const reports = Math.floor(points / 30);
    
    // Determine unlocked badges based on stats
    const unlockedBadges = [];
    GAMIFICATION.BADGES.forEach(b => {
        if (b.reqType === 'trees' && trees >= b.reqCount) unlockedBadges.push(b.id);
        if (b.reqType === 'reports' && reports >= b.reqCount) unlockedBadges.push(b.id);
        if (b.reqType === 'points' && points >= b.reqCount) unlockedBadges.push(b.id);
        if (b.reqType === 'finca' && points >= 100) unlockedBadges.push(b.id); // arbitrary mock
    });

    return { trees, reports, unlockedBadges };
}
