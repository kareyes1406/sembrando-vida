// --- Dashboard Main Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Session
    const sessionStr = localStorage.getItem('sv_session');
    if (!sessionStr) {
        window.location.href = 'login.html';
        return;
    }
    const userSession = JSON.parse(sessionStr);

    // 2. Populate UI with User Data
    const nameInitial = userSession.nombre.charAt(0).toUpperCase();
    
    // Header
    document.getElementById('header-user-name').innerText = userSession.nombre.split(' ')[0];
    const headerAvatar = document.getElementById('header-user-avatar');
    headerAvatar.innerText = nameInitial;
    headerAvatar.style.backgroundColor = '#' + userSession.avatarColor;

    // Profile Section
    document.getElementById('profile-name').innerText = userSession.nombre;
    document.getElementById('profile-role').innerText = userSession.rol + (userSession.finca !== "N/A" ? " | " + userSession.finca : "");
    const profileAvatar = document.getElementById('profile-avatar');
    profileAvatar.innerText = nameInitial;
    profileAvatar.style.backgroundColor = '#' + userSession.avatarColor;
    
    document.getElementById('input-name').value = userSession.nombre;
    document.getElementById('input-email').value = userSession.email;
    document.getElementById('input-finca').value = userSession.finca;

    // Gamification Stats
    const rankInfo = getRankInfo(userSession.puntos);
    const mockStats = getMockUserStats(userSession.puntos);
    
    document.getElementById('summary-points').innerText = userSession.puntos;
    document.getElementById('summary-trees').innerText = mockStats.trees;
    
    document.getElementById('profile-rank-badge').innerHTML = `${rankInfo.currentRank.icon} Nivel: ${rankInfo.currentRank.name}`;
    
    // Progress Bar
    const currentPts = userSession.puntos;
    const basePts = rankInfo.currentRank.minPoints;
    const nextPts = rankInfo.nextRank ? rankInfo.nextRank.minPoints : basePts;
    
    if (rankInfo.nextRank) {
        const progressPct = ((currentPts - basePts) / (nextPts - basePts)) * 100;
        setTimeout(() => {
            document.getElementById('profile-progress-bar').style.width = `${progressPct}%`;
        }, 500);
        document.getElementById('profile-progress-text').innerText = `${currentPts} / ${nextPts} pts`;
    } else {
        document.getElementById('profile-progress-bar').style.width = `100%`;
        document.getElementById('profile-progress-text').innerText = `Nivel Máximo`;
    }

    // Points Section
    document.getElementById('rank-icon').innerText = rankInfo.currentRank.icon;
    document.getElementById('rank-title').innerText = rankInfo.currentRank.name;
    document.getElementById('rank-points').innerText = `${userSession.puntos} Pts`;
    
    if (rankInfo.nextRank) {
        document.getElementById('next-rank-name').innerText = rankInfo.nextRank.name;
        document.getElementById('next-rank-pts').innerText = `Faltan ${nextPts - currentPts} pts`;
        setTimeout(() => {
            document.getElementById('rank-progress-bar').style.width = `${((currentPts - basePts) / (nextPts - basePts)) * 100}%`;
        }, 500);
    } else {
        document.getElementById('next-rank-name').innerText = "Máximo Nivel Alcanzado";
        document.getElementById('next-rank-pts').innerText = "¡Felicidades!";
    }

    // Badges Section
    const badgesContainer = document.getElementById('badges-container');
    GAMIFICATION.BADGES.forEach(badge => {
        const isUnlocked = mockStats.unlockedBadges.includes(badge.id);
        const html = `
            <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="badge-icon">${badge.icon}</div>
                <h4 style="margin-bottom: 0.5rem; color: ${isUnlocked ? 'var(--dark)' : 'var(--dark-soft)'};">${badge.name}</h4>
                <p style="font-size: 0.8rem; color: var(--dark-soft);">${badge.desc}</p>
                ${!isUnlocked ? `<p style="font-size: 0.7rem; color: var(--accent-warm); margin-top: 0.5rem;">Bloqueada</p>` : ''}
            </div>
        `;
        badgesContainer.insertAdjacentHTML('beforeend', html);
    });

    // 3. Navigation Logic
    const links = document.querySelectorAll('.sidebar-link[data-target]');
    const sections = document.querySelectorAll('.dashboard-section');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active classes
            links.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class
            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // If map section, resize Leaflet (fix display:none bug)
            if (targetId === 'section-arboles' && window.dashboardMap) {
                setTimeout(() => window.dashboardMap.invalidateSize(), 100);
            }
            
            // Close mobile sidebar
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('open');
            }
        });
    });

    // Mobile Sidebar Toggle
    const menuBtn = document.getElementById('dash-menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
        menuBtn.style.display = 'block';
    }
    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('sv_session');
        window.location.href = 'index.html';
    });

    // Report Form Submit
    const reportForm = document.getElementById('form-reporte');
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simular éxito y subir puntos
        userSession.puntos += 30;
        localStorage.setItem('sv_session', JSON.stringify(userSession));
        
        // Disparar confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1B5E3B', '#4CAF6E', '#D4A24E']
        });
        
        // Reset form
        reportForm.reset();
        
        // Update UI (simple reload for prototype to reflect new points)
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    });

    // Populate Leaderboard
    populateLeaderboard(userSession);
});

async function populateLeaderboard(currentUser) {
    const tbody = document.querySelector('#leaderboard-table tbody');
    if (!tbody) return;

    try {
        let users = window.usersData;
        
        // Actualizar los puntos del current user en la lista en memoria si cambió
        const uIndex = users.findIndex(u => u.id === currentUser.id);
        if(uIndex > -1) {
            users[uIndex].puntos = currentUser.puntos;
        }

        // Sort desc
        users.sort((a, b) => b.puntos - a.puntos);

        let html = '';
        users.forEach((u, index) => {
            let posStr = (index + 1).toString();
            if (index === 0) posStr = '🥇 1';
            if (index === 1) posStr = '🥈 2';
            if (index === 2) posStr = '🥉 3';

            const rInfo = getRankInfo(u.puntos);
            const isMe = u.id === currentUser.id;

            html += `
                <tr class="${isMe ? 'current-user' : ''}">
                    <td>${posStr}</td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <div style="width:24px; height:24px; border-radius:50%; background:#${u.avatarColor}; color:white; font-size:0.7rem; display:flex; align-items:center; justify-content:center;">
                                ${u.nombre.charAt(0)}
                            </div>
                            ${u.nombre} ${isMe ? '(Tú)' : ''}
                        </div>
                    </td>
                    <td>${rInfo.currentRank.icon} ${rInfo.currentRank.name}</td>
                    <td style="text-align: right; font-weight: bold;">${u.puntos}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;

    } catch (e) {
        console.error(e);
    }
}
