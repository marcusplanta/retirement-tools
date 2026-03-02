// Utility Functions

// Format numbers with K for thousands, M for millions, B for billions
function formatNumber(num) {
    if (num >= 1e9) {
        return '$' + (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return '$' + (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return '$' + (num / 1e3).toFixed(1) + 'K';
    } else {
        return '$' + num.toFixed(0);
    }
}

// Random normal distribution (Box-Muller transform)
function randomNormal(mean, stdDev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
}

// Get mortality probability for a given age and sex
function getMortalityProb(age, sex) {
    const table = mortalityTables[sex];
    
    // Find surrounding points
    let lower = table[0];
    let upper = table[table.length - 1];
    
    for (let i = 0; i < table.length - 1; i++) {
        if (age >= table[i].age && age < table[i + 1].age) {
            lower = table[i];
            upper = table[i + 1];
            break;
        }
    }

    // Linear interpolation
    if (age <= lower.age) return lower.prob;
    if (age >= upper.age) return upper.prob;
    
    const ratio = (age - lower.age) / (upper.age - lower.age);
    return lower.prob + ratio * (upper.prob - lower.prob);
}
