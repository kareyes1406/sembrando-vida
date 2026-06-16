// --- Leaflet Map Configuration ---
document.addEventListener('DOMContentLoaded', async () => {
    // Only init if map container exists (index.html)
    const mapElement = document.getElementById('leaflet-map');
    if (!mapElement) return;

    // Center coordinates for Pueblo Viejo, Facatativá
    const map = L.map('leaflet-map').setView([4.8142, -74.3541], 15);

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Custom tree icon
    const treeIcon = L.divIcon({
        className: 'custom-tree-icon',
        html: '<div style="background-color: var(--primary); color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid white;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/></svg></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const markers = L.markerClusterGroup({
        showCoverageOnHover: false
    });
    
    let allTrees = [];

    // Load data
    try {
        allTrees = window.arbolesData;
        renderMarkers(allTrees);
    } catch (error) {
        console.error("Error loading tree data:", error);
    }

    function renderMarkers(data) {
        markers.clearLayers();
        
        data.forEach(tree => {
            const statusColor = tree.estado === 'saludable' ? '🟢' : (tree.estado === 'atencion' ? '🟡' : '🔴');
            const popupContent = `
                <div class="popup-custom">
                    <div class="popup-header">
                        ${tree.nombre}
                    </div>
                    <div class="popup-body">
                        <p><strong>Especie:</strong> ${tree.especie}</p>
                        <p><strong>Guardián:</strong> ${tree.guardian}</p>
                        <p><strong>Finca:</strong> ${tree.finca}</p>
                        <p><strong>Estado:</strong> ${statusColor} ${tree.estado}</p>
                        <p><strong>Fecha:</strong> ${tree.fecha}</p>
                    </div>
                </div>
            `;
            const marker = L.marker([tree.lat, tree.lng], {icon: treeIcon})
                .bindPopup(popupContent);
            markers.addLayer(marker);
        });

        map.addLayer(markers);
    }

    // Filters
    const filterEspecie = document.getElementById('filter-especie');
    if(filterEspecie) {
        filterEspecie.addEventListener('change', (e) => {
            const especie = e.target.value;
            if (especie === 'all') {
                renderMarkers(allTrees);
            } else {
                const filtered = allTrees.filter(t => t.especie === especie);
                renderMarkers(filtered);
            }
        });
    }

    // Chart.js Impact Chart
    const ctx = document.getElementById('impactChart');
    if(ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Árboles Plantados por Mes',
                    data: [15, 30, 45, 25, 35],
                    backgroundColor: '#4CAF6E',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
