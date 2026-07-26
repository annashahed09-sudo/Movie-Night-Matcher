let drivers = [];
let tracks = {
    hungaroring: { technicalWeight: 0.9, powerWeight: 0.2, historicWeight: 0.4 },
    zandvoort:   { technicalWeight: 0.8, powerWeight: 0.4, historicWeight: 0.5 },
    monza:       { technicalWeight: 0.1, powerWeight: 1.0, historicWeight: 0.7 },
    spa:         { technicalWeight: 0.5, powerWeight: 0.8, historicWeight: 0.9 }
};
let currentTrack = 'hungaroring';

// Automated API Fetch Lifecycle Connection Engine
async function loadLiveF1Data() {
    try {
        const response = await fetch('https://openf1.org');
        const apiDrivers = await response.json();

        const uniqueDrivers = [];
        const seenNames = new Set();

        for (const d of apiDrivers) {
            if (d.full_name && !seenNames.has(d.full_name) && uniqueDrivers.length < 6) {
                seenNames.add(d.full_name);
                uniqueDrivers.push({
                    name: d.full_name,
                    team: d.team_name || "Independent",
                    color: d.team_color ? `#${d.team_color}` : "#ffffff",
                    img: d.headshot_url || "https://formula1.com",
                    dry: 80 + Math.floor(Math.random() * 15), 
                    wet: 75 + Math.floor(Math.random() * 20),
                    technical: 80 + Math.floor(Math.random() * 15),
                    power: 80 + Math.floor(Math.random() * 15),
                    history: [1, 2, 4, 3, 5] // Auto baseline history sequence configuration
                });
            }
        }

        drivers = uniqueDrivers;
        calculateProbabilities();

    } catch (error) {
        console.error("API error, executing safe offline matrices arrays fallback:", error);
        drivers = [
            { name: "Kimi Antonelli", team: "Mercedes", color: "#00a19c", img: "https://formula1.com/content/dam/fom-website/drivers/K/KIMANT01_Kimi_Antonelli/kimant01.png", dry: 88, wet: 78, technical: 85, power: 90, history: [1, 2, 1, 3, 2] },
            { name: "Lewis Hamilton", team: "Ferrari", color: "#ef1a2d", img: "https://formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png", dry: 84, wet: 86, technical: 88, power: 85, history: [3, 1, 4, 2, 5] },
            { name: "Max Verstappen", team: "Red Bull", color: "#0600ef", img: "https://formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png", dry: 78, wet: 95, technical: 90, power: 82, history: [2, 5, 3, 1, 1] }
        ];
        calculateProbabilities();
    }
}

function switchTrack(trackKey, element) {
    document.querySelectorAll('.track-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');
    currentTrack = trackKey;
    calculateProbabilities();
}

function calculateProbabilities() {
    if (drivers.length === 0) return;

    const moisture = parseInt(document.getElementById('moisture-slider').value);
    const upgrades = parseInt(document.getElementById('upgrade-slider').value);
    const trackSpec = tracks[currentTrack];

    document.getElementById('moisture-val').innerText = moisture === 0 ? "Bone Dry" : moisture < 40 ? "Damp Circuit" : moisture < 75 ? "Intermediate Conditions" : "Monsoon Downpour";
    document.getElementById('upgrade-val').innerText = upgrades === 0 ? "Baseline Form" : upgrades < 50 ? "Minor Package Applied" : "Major Overhaul Package";

    let calculationPool = [];
    let aggregateSum = 0;

    drivers.forEach(driver => {
        let weatherForm = ((driver.dry * (100 - moisture)) + (driver.wet * moisture)) / 100;
        let geometryEfficiency = (driver.technical * trackSpec.technicalWeight) + (driver.power * trackSpec.powerWeight);
        let performanceHistory = driver.history.reduce((acc, curr) => acc + (21 - curr), 0) / 5;
        let modifierWeight = 1 + (upgrades / 180);

        let rawCalculatedScore = (weatherForm + geometryEfficiency + (performanceHistory * trackSpec.historicWeight)) * modifierWeight;

        calculationPool.push({ driver: driver, rawScore: rawCalculatedScore });
        aggregateSum += rawCalculatedScore;
    });

    calculationPool.forEach(item => {
        item.percentage = Math.round((item.rawScore / aggregateSum) * 100);
    });

    calculationPool.sort((a, b) => b.percentage - a.percentage);

    renderPodium(calculationPool.slice(0, 3));
    renderTelemetryList(calculationPool);
}

function renderPodium(topThree) {
    const podiumArea = document.getElementById('podium-area');
    if (!podiumArea) return;

    const p1 = topThree[0] || { driver: { name: "Waiting...", img: "https://formula1.com" } };
    const p2 = topThree[1] || { driver: { name: "Waiting...", img: "https://formula1.com" } };
    const p3 = topThree[2] || { driver: { name: "Waiting...", img: "https://formula1.com" } };

    podiumArea.innerHTML = `
        <div class="podium-spot p2">
            <div class="driver-avatar-container">
                <img src="${p2.driver.img}" alt="${p2.driver.name}">
            </div>
            <div class="podium-name">${p2.driver.name.split(' ')[0]}</div>
            <div class="podium-block">2</div>
        </div>
        <div class="podium-spot p1">
            <div class="driver-avatar-container">
                <img src="${p1.driver.img}" alt="${p1.driver.name}">
            </div>
            <div class="podium-name">${p1.driver.name.split(' ')[0]}</div>
            <div class="podium-block">1</div>
        </div>
        <div class="podium-spot p3">
            <div class="driver-avatar-container">
                <img src="${p3.driver.img}" alt="${p3.driver.name}">
            </div>
            <div class="podium-name">${p3.driver.name.split(' ')[0]}</div>
            <div class="podium-block">3</div>
        </div>
    `;
}

function renderTelemetryList(pool) {
    const container = document.getElementById('telemetry-output');
    if (!container) return;
    container.innerHTML = '';

    pool.forEach(item => {
        const row = document.createElement('div');
        row.className = 'telemetry-row';
        row.innerHTML = `
            <div class="driver-meta">
                <div class="team-indicator" style="background-color: ${item.driver.color}"></div>
                <div class="meta-text">
                    <h4>${item.driver.name}</h4>
                    <span>${item.driver.team}</span>
                </div>
            </div>
            <div class="probability-bar-wrapper">
                <div class="progress-track">
                    <div class="progress-fill" style="background-color: ${item.driver.color}; width: ${item.percentage}%"></div>
                </div>
                <div class="percent-readout">${item.percentage}%</div>
            </div>
        `;
        container.appendChild(row);
    });
}

window.onload = loadLiveF1Data;
