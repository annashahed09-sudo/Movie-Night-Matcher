let currentTrack = 'hungaroring';

function switchTrack(trackKey, element) {
    document.querySelectorAll('.track-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');
    currentTrack = trackKey;
    calculateProbabilities();
}

function calculateProbabilities() {
    const moisture = parseInt(document.getElementById('moisture-slider').value);
    const upgrades = parseInt(document.getElementById('upgrade-slider').value);
    const trackSpec = tracks[currentTrack];

    // Update Slider Label Text Readouts
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

    const p2 = topThree[1];
    const p1 = topThree[0];
    const p3 = topThree[2];

    podiumArea.innerHTML = `
        <div class="podium-spot p2">
            <div class="driver-avatar-container">
                <img src="${p2.driver.img}" alt="${p2.driver.name}">
            </div>
            <div class="podium-name">${p2.driver.name.split(' ')[1]}</div>
            <div class="podium-block">2</div>
        </div>
        <div class="podium-spot p1">
            <div class="driver-avatar-container">
                <img src="${p1.driver.img}" alt="${p1.driver.name}">
            </div>
            <div class="podium-name">${p1.driver.name.split(' ')[1]}</div>
            <div class="podium-block">1</div>
        </div>
        <div class="podium-spot p3">
            <div class="driver-avatar-container">
                <img src="${p3.driver.img}" alt="${p3.driver.name}">
            </div>
            <div class="podium-name">${p3.driver.name.split(' ')[1]}</div>
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

// Initial engine kickoff on window setup completion
window.onload = calculateProbabilities;
