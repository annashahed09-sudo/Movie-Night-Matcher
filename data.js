const drivers = [
    { 
        name: "Kimi Antonelli", 
        team: "Mercedes", 
        color: "#00a19c", 
        img: "https://formula1.com", 
        dry: 88, wet: 78, technical: 85, power: 90, 
        history: [1, 3, 2, 1, 4]
    },
    { 
        name: "Lewis Hamilton", 
        team: "Ferrari", 
        color: "#ef1a2d", 
        img: "https://formula1.com", 
        dry: 84, wet: 86, technical: 88, power: 85, 
        history: [2, 1, 4, 3, 2]
    },
    { 
        name: "George Russell", 
        team: "Mercedes", 
        color: "#00a19c", 
        img: "https://formula1.com", 
        dry: 82, wet: 76, technical: 80, power: 94, 
        history: [4, 2, 1, 5, 3]
    },
    { 
        name: "Charles Leclerc", 
        team: "Ferrari", 
        color: "#ef1a2d", 
        img: "https://formula1.com", 
        dry: 80, wet: 74, technical: 92, power: 86, 
        history: [3, 5, 3, 2, 1]
    },
    { 
        name: "Lando Norris", 
        team: "McLaren", 
        color: "#ff8700", 
        img: "https://formula1.com", 
        dry: 83, wet: 80, technical: 84, power: 84, 
        history: [5, 4, 5, 4, 5]
    },
    { 
        name: "Max Verstappen", 
        team: "Red Bull", 
        color: "#0600ef", 
        img: "https://formula1.com", 
        dry: 78, wet: 95, technical: 90, power: 82, 
        history: [6, 6, 6, 6, 6]
    }
];

const tracks = {
    hungaroring: { technicalWeight: 0.9, powerWeight: 0.2, historicWeight: 0.4 },
    zandvoort:   { technicalWeight: 0.8, powerWeight: 0.4, historicWeight: 0.5 },
    monza:       { technicalWeight: 0.1, powerWeight: 1.0, historicWeight: 0.7 },
    spa:         { technicalWeight: 0.5, powerWeight: 0.8, historicWeight: 0.9 }
};
