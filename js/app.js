// OpenSincera Dashboard - Main Application (Static Data via GitHub Pages)

// Cached data
let publishersCache = null;
let ecosystemCache = null;

// Chart instances
let performanceChart = null;
let radarChart = null;
let supplyChainChart = null;

// Chart.js default config for dark mode
Chart.defaults.color = '#8b949e';
Chart.defaults.borderColor = '#30363d';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchHint = document.getElementById('searchHint');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadEcosystemData();
    
    // Enter key to search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Auto-detect input type
    searchInput.addEventListener('input', () => {
        const value = searchInput.value.trim();
        if (!value) {
            searchHint.textContent = 'Auto-detects ID vs Domain';
        } else if (isNumeric(value)) {
            searchHint.textContent = '🔢 Detected: Publisher ID';
        } else {
            searchHint.textContent = '🌐 Detected: Domain';
        }
    });
});

// Check if input is numeric (publisher ID)
function isNumeric(value) {
    return /^\d+$/.test(value);
}

// Perform search
async function performSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showError('Please enter a Publisher ID or Domain');
        return;
    }

    setLoading(true);
    hideError();
    hideResults();

    try {
        // Load publishers cache if not already loaded
        if (!publishersCache) {
            const response = await fetch('data/publishers.json');
            if (!response.ok) {
                throw new Error('Data not loaded. Run sync-data.ps1 or wait for the daily sync.');
            }
            publishersCache = await response.json();
        }

        // Search by ID or domain
        let data;
        if (isNumeric(query)) {
            data = publishersCache[query];
        } else {
            const domain = query.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
            data = publishersCache[domain];

            // Try partial match if exact match not found
            if (!data) {
                const matchingKey = Object.keys(publishersCache).find(key =>
                    key.includes(domain) || domain.includes(key)
                );
                if (matchingKey) {
                    data = publishersCache[matchingKey];
                }
            }
        }

        if (!data) {
            throw new Error('Publisher not found. Try a different ID or domain.');
        }

        displayResults(data);

    } catch (error) {
        console.error('Search error:', error);
        showError(error.message || 'Failed to load publisher data.');
    } finally {
        setLoading(false);
    }
}

// Display publisher results
function displayResults(data) {
    // Publisher name and status
    document.getElementById('publisherName').textContent = data.name || 'Unknown Publisher';
    
    const statusBadge = document.getElementById('statusBadge');
    const status = data.status || 'unknown';
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${status.toLowerCase()}`;

    // Description
    document.getElementById('publisherDescription').textContent = 
        data.pub_description || 'No description available.';

    // Basic Info
    document.getElementById('domain').textContent = data.domain || '-';
    document.getElementById('primarySupplyType').textContent = data.primary_supply_type || '-';
    document.getElementById('publisherId').textContent = data.publisher_id || '-';

    // Metrics with visual indicators
    setMetricWithBar('avgAdsInView', 'avgAdsInViewBar', data.avg_ads_in_view, 10, 1);
    setMetricWithBar('avgAdRefresh', 'avgAdRefreshBar', data.avg_ad_refresh, 60, 1);
    setMetricWithBar('totalUniqueGpids', 'totalUniqueGpidsBar', data.total_unique_gpids, 1000, 0);
    setMetricWithBar('avgPageWeight', 'avgPageWeightBar', data.avg_page_weight, 10, 2);
    setMetricWithBar('avgCpu', 'avgCpuBar', data.avg_cpu, 5, 2);
    setMetricWithBar('totalSupplyPaths', 'totalSupplyPathsBar', data.total_supply_paths, 500, 0);
    setMetricWithBar('resellerCount', 'resellerCountBar', data.reseller_count, 100, 0);

    // Categories
    const categoriesContainer = document.getElementById('categoriesList');
    categoriesContainer.innerHTML = '';
    
    if (data.categories && data.categories.length > 0) {
        data.categories.forEach(category => {
            const tag = document.createElement('span');
            tag.className = 'category-tag';
            tag.textContent = category;
            categoriesContainer.appendChild(tag);
        });
    } else {
        categoriesContainer.innerHTML = '<span class="category-tag">No categories</span>';
    }

    resultsSection.classList.remove('hidden');
    
    // Render charts
    renderCharts(data);
}

// Set metric value with progress bar
function setMetricWithBar(valueId, barId, value, maxValue, decimals = 0) {
    const valueEl = document.getElementById(valueId);
    const barEl = document.getElementById(barId);

    if (value === null || value === undefined) {
        valueEl.textContent = '-';
        barEl.style.width = '0%';
        return;
    }

    const numValue = parseFloat(value);
    valueEl.textContent = formatNumber(numValue, decimals);
    
    // Calculate percentage for bar (capped at 100%)
    const percentage = Math.min((numValue / maxValue) * 100, 100);
    barEl.style.width = `${percentage}%`;
}

// Format number for display
function formatNumber(num, decimals = 0) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(decimals);
}

// Load ecosystem data
async function loadEcosystemData() {
    try {
        const response = await fetch('data/ecosystem.json');
        if (!response.ok) {
            console.warn('Ecosystem data not available.');
            return;
        }

        const data = await response.json();
        ecosystemCache = data;
        document.getElementById('ecoPublishers').textContent = 
            formatNumber(data.sincera_ecosystem_size || 0);
        document.getElementById('ecoAdSystems').textContent = 
            formatNumber(data.known_adsystems || 0);
        document.getElementById('ecoGpids').textContent = 
            formatNumber(data.global_gpids || 0);
        document.getElementById('ecoLastUpdated').textContent = 
            data.date ? new Date(data.date).toLocaleDateString() : '-';
    } catch (error) {
        console.warn('Error loading ecosystem data:', error);
    }
}

// UI Helpers
function setLoading(loading) {
    const btnText = searchBtn.querySelector('.btn-text');
    const btnLoader = searchBtn.querySelector('.btn-loader');
    
    if (loading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        searchBtn.disabled = true;
        searchInput.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        searchBtn.disabled = false;
        searchInput.disabled = false;
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
}

function hideError() {
    errorSection.classList.add('hidden');
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

// Render all charts
function renderCharts(data) {
    renderPerformanceChart(data);
    renderRadarChart(data);
    renderSupplyChainChart(data);
}

// Performance Bar Chart
function renderPerformanceChart(data) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Destroy existing chart
    if (performanceChart) {
        performanceChart.destroy();
    }

    const metrics = [
        { label: 'Ads in View', value: data.avg_ads_in_view || 0, max: 10 },
        { label: 'Ad Refresh (s)', value: data.avg_ad_refresh || 0, max: 60 },
        { label: 'Page Weight (MB)', value: data.avg_page_weight || 0, max: 10 },
        { label: 'CPU Usage (s)', value: data.avg_cpu || 0, max: 5 }
    ];

    performanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: metrics.map(m => m.label),
            datasets: [{
                label: 'Value',
                data: metrics.map(m => m.value),
                backgroundColor: [
                    'rgba(88, 166, 255, 0.8)',
                    'rgba(163, 113, 247, 0.8)',
                    'rgba(210, 153, 34, 0.8)',
                    'rgba(248, 81, 73, 0.8)'
                ],
                borderColor: [
                    'rgba(88, 166, 255, 1)',
                    'rgba(163, 113, 247, 1)',
                    'rgba(210, 153, 34, 1)',
                    'rgba(248, 81, 73, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#21262d',
                    titleColor: '#e6edf3',
                    bodyColor: '#8b949e',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Quality Radar Chart
function renderRadarChart(data) {
    const ctx = document.getElementById('radarChart').getContext('2d');
    
    if (radarChart) {
        radarChart.destroy();
    }

    // Normalize values to 0-100 scale for radar
    const normalize = (val, max) => Math.min((val / max) * 100, 100);
    
    const values = [
        normalize(data.avg_ads_in_view || 0, 10),
        normalize(data.total_unique_gpids || 0, 500),
        100 - normalize(data.avg_page_weight || 0, 10), // Invert - lower is better
        100 - normalize(data.avg_cpu || 0, 5), // Invert - lower is better
        normalize(data.avg_ad_refresh || 0, 60),
        normalize(data.total_supply_paths || 0, 300)
    ];

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Ad Visibility', 'GPID Coverage', 'Page Speed', 'CPU Efficiency', 'Ad Refresh', 'Supply Paths'],
            datasets: [{
                label: 'Publisher Score',
                data: values,
                backgroundColor: 'rgba(88, 166, 255, 0.2)',
                borderColor: 'rgba(88, 166, 255, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(88, 166, 255, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(88, 166, 255, 1)',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#21262d',
                    titleColor: '#e6edf3',
                    bodyColor: '#8b949e',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `Score: ${context.raw.toFixed(0)}%`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 25,
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(48, 54, 61, 0.5)'
                    },
                    angleLines: {
                        color: 'rgba(48, 54, 61, 0.5)'
                    },
                    pointLabels: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Supply Chain Doughnut Chart
function renderSupplyChainChart(data) {
    const ctx = document.getElementById('supplyChainChart').getContext('2d');
    
    if (supplyChainChart) {
        supplyChainChart.destroy();
    }

    const supplyPaths = data.total_supply_paths || 0;
    const resellers = data.reseller_count || 0;
    const directPaths = Math.max(supplyPaths - resellers, 0);

    supplyChainChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Direct Paths', 'Resellers'],
            datasets: [{
                data: [directPaths, resellers],
                backgroundColor: [
                    'rgba(63, 185, 80, 0.8)',
                    'rgba(163, 113, 247, 0.8)'
                ],
                borderColor: [
                    'rgba(63, 185, 80, 1)',
                    'rgba(163, 113, 247, 1)'
                ],
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: '#21262d',
                    titleColor: '#e6edf3',
                    bodyColor: '#8b949e',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw: function(chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                ctx.restore();
                
                const fontSize = (height / 114).toFixed(2);
                ctx.font = `bold ${fontSize}em sans-serif`;
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#e6edf3';
                
                const total = supplyPaths;
                const text = total.toLocaleString();
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2 - 10;
                
                ctx.fillText(text, textX, textY);
                
                ctx.font = `${fontSize * 0.5}em sans-serif`;
                ctx.fillStyle = '#8b949e';
                const subText = 'Total Paths';
                const subTextX = Math.round((width - ctx.measureText(subText).width) / 2);
                ctx.fillText(subText, subTextX, textY + 25);
                
                ctx.save();
            }
        }]
    });
}
