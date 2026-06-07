// --- Dashboard Mini Map ---
document.addEventListener('DOMContentLoaded', async () => {
    const mapContainer = document.getElementById('dashboard-map');
    if (!mapContainer) return;

    const sessionStr = localStorage.getItem('sv_session');
    if (!sessionStr) return;
    const userSession = JSON.parse(sessionStr);

    // Initialize Map
    window.dashboardMap = L.map('dashboard-map').setView([4.8142, -74.3541], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(window.dashboardMap);

    const treeIcon = L.divIcon({
        className: 'custom-tree-icon',
        html: '<div style="background-color: var(--secondary); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border: 2px solid white;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/></svg></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    try {
        const allTrees = window.arbolesData;
        
        // Simular que el usuario tiene algunos árboles específicos
        // Para el prototipo, mostramos todos los árboles cuyo "guardian" coincida
        // O si no hay coincidencia exacta (como los estudiantes), asignamos al azar.
        let myTrees = allTrees.filter(t => t.guardian === userSession.nombre);
        
        if (myTrees.length === 0) {
            // Asignar los primeros 2 como mockup
            myTrees = allTrees.slice(0, 2);
        }

        // Render in Map
        const bounds = [];
        myTrees.forEach(tree => {
            const statusColor = tree.estado === 'saludable' ? '🟢' : (tree.estado === 'atencion' ? '🟡' : '🔴');
            const marker = L.marker([tree.lat, tree.lng], {icon: treeIcon}).addTo(window.dashboardMap);
            marker.bindPopup(`<b>${tree.nombre}</b><br>${tree.especie}<br>${statusColor} ${tree.estado}`);
            bounds.push([tree.lat, tree.lng]);
        });

        if (bounds.length > 0) {
            window.dashboardMap.fitBounds(bounds, { padding: [20, 20], maxZoom: 16 });
        }

        // Populate Form Select
        const select = document.getElementById('report-tree-select');
        if (select) {
            select.innerHTML = '<option value="">-- Selecciona un árbol --</option>';
            myTrees.forEach(t => {
                select.innerHTML += `<option value="${t.id}">${t.nombre} (${t.especie})</option>`;
            });
        }

        // Populate List below map
        const treesList = document.getElementById('trees-list');
        if (treesList && myTrees.length > 0) {
            treesList.innerHTML = '';
            myTrees.forEach(tree => {
                const statusColor = tree.estado === 'saludable' ? '🟢' : (tree.estado === 'atencion' ? '🟡' : '🔴');
                const html = `
                    <div class="card" style="padding: 1.5rem;">
                        <div style="font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem;"><i data-lucide="tree-pine"></i></div>
                        <h4 style="margin-bottom: 0.5rem;">${tree.nombre}</h4>
                        <p class="text-muted" style="font-size: 0.9rem;">Especie: ${tree.especie}</p>
                        <p class="text-muted" style="font-size: 0.9rem;">Fecha: ${tree.fecha}</p>
                        <div style="margin-top: 1rem; padding: 0.5rem; background: var(--bg-alt); border-radius: var(--radius-sm); font-size: 0.8rem; text-align: center;">
                            ${statusColor} ${tree.estado.toUpperCase()}
                        </div>
                    </div>
                `;
                treesList.insertAdjacentHTML('beforeend', html);
            });
            // Reinit lucide icons for new elements
            if(window.lucide) lucide.createIcons();
        }

    } catch (error) {
        console.error("Error loading my trees:", error);
    }
});
