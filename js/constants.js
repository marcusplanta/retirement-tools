// Constants and Configuration
// Shiller data (simplified historical returns - these are NOMINAL returns)
const historicalReturns = {
    stocks: { mean: 0.10, stdDev: 0.18 },  // ~10% nominal, ~7% real
    bonds: { mean: 0.055, stdDev: 0.08 },  // ~5.5% nominal, ~2.5% real
    cash: { mean: 0.035, stdDev: 0.02 },   // ~3.5% nominal, ~0.5% real
    inflation: { mean: 0.031, stdDev: 0.05 }
};

// Mortality tables (SSA 2022 Period Life Table data)
// Death probability = probability of dying within one year
const mortalityTables = {
    male: [
        { age: 40, prob: 0.003353 }, { age: 41, prob: 0.003499 }, { age: 42, prob: 0.003642 },
        { age: 43, prob: 0.003811 }, { age: 44, prob: 0.003996 }, { age: 45, prob: 0.004175 },
        { age: 46, prob: 0.004388 }, { age: 47, prob: 0.004666 }, { age: 48, prob: 0.004973 },
        { age: 49, prob: 0.005305 }, { age: 50, prob: 0.005666 }, { age: 51, prob: 0.006069 },
        { age: 52, prob: 0.006539 }, { age: 53, prob: 0.007073 }, { age: 54, prob: 0.007675 },
        { age: 55, prob: 0.008348 }, { age: 56, prob: 0.009051 }, { age: 57, prob: 0.009822 },
        { age: 58, prob: 0.010669 }, { age: 59, prob: 0.011548 }, { age: 60, prob: 0.012458 },
        { age: 61, prob: 0.013403 }, { age: 62, prob: 0.014450 }, { age: 63, prob: 0.015571 },
        { age: 64, prob: 0.016737 }, { age: 65, prob: 0.017897 }, { age: 66, prob: 0.019017 },
        { age: 67, prob: 0.020213 }, { age: 68, prob: 0.021569 }, { age: 69, prob: 0.023088 },
        { age: 70, prob: 0.024828 }, { age: 71, prob: 0.026705 }, { age: 72, prob: 0.028761 },
        { age: 73, prob: 0.031116 }, { age: 74, prob: 0.033861 }, { age: 75, prob: 0.037088 },
        { age: 76, prob: 0.041126 }, { age: 77, prob: 0.045241 }, { age: 78, prob: 0.049793 },
        { age: 79, prob: 0.054768 }, { age: 80, prob: 0.060660 }, { age: 81, prob: 0.067027 },
        { age: 82, prob: 0.073999 }, { age: 83, prob: 0.081737 }, { age: 84, prob: 0.090458 },
        { age: 85, prob: 0.100525 }, { age: 86, prob: 0.111793 }, { age: 87, prob: 0.124494 },
        { age: 88, prob: 0.138398 }, { age: 89, prob: 0.153207 }, { age: 90, prob: 0.169704 },
        { age: 91, prob: 0.187963 }, { age: 92, prob: 0.208395 }, { age: 93, prob: 0.230808 },
        { age: 94, prob: 0.253914 }, { age: 95, prob: 0.277402 }, { age: 96, prob: 0.300882 },
        { age: 97, prob: 0.324326 }, { age: 98, prob: 0.347332 }, { age: 99, prob: 0.369430 },
        { age: 100, prob: 0.391927 }, { age: 101, prob: 0.414726 }, { age: 102, prob: 0.437722 },
        { age: 103, prob: 0.460800 }, { age: 104, prob: 0.483840 }, { age: 105, prob: 0.508032 },
        { age: 106, prob: 0.533434 }, { age: 107, prob: 0.560105 }, { age: 108, prob: 0.588111 },
        { age: 109, prob: 0.617516 }, { age: 110, prob: 0.648392 }, { age: 115, prob: 0.827531 },
        { age: 119, prob: 1.000000 }
    ],
    female: [
        { age: 40, prob: 0.001803 }, { age: 41, prob: 0.001905 }, { age: 42, prob: 0.002009 },
        { age: 43, prob: 0.002116 }, { age: 44, prob: 0.002223 }, { age: 45, prob: 0.002352 },
        { age: 46, prob: 0.002516 }, { age: 47, prob: 0.002712 }, { age: 48, prob: 0.002936 },
        { age: 49, prob: 0.003177 }, { age: 50, prob: 0.003407 }, { age: 51, prob: 0.003642 },
        { age: 52, prob: 0.003917 }, { age: 53, prob: 0.004238 }, { age: 54, prob: 0.004619 },
        { age: 55, prob: 0.005040 }, { age: 56, prob: 0.005493 }, { age: 57, prob: 0.005987 },
        { age: 58, prob: 0.006509 }, { age: 59, prob: 0.007067 }, { age: 60, prob: 0.007658 },
        { age: 61, prob: 0.008305 }, { age: 62, prob: 0.008991 }, { age: 63, prob: 0.009681 },
        { age: 64, prob: 0.010343 }, { age: 65, prob: 0.011018 }, { age: 66, prob: 0.011743 },
        { age: 67, prob: 0.012532 }, { age: 68, prob: 0.013512 }, { age: 69, prob: 0.014684 },
        { age: 70, prob: 0.016025 }, { age: 71, prob: 0.017468 }, { age: 72, prob: 0.019195 },
        { age: 73, prob: 0.021195 }, { age: 74, prob: 0.023452 }, { age: 75, prob: 0.025980 },
        { age: 76, prob: 0.029153 }, { age: 77, prob: 0.032394 }, { age: 78, prob: 0.035888 },
        { age: 79, prob: 0.039676 }, { age: 80, prob: 0.044156 }, { age: 81, prob: 0.049087 },
        { age: 82, prob: 0.054635 }, { age: 83, prob: 0.061066 }, { age: 84, prob: 0.068431 },
        { age: 85, prob: 0.076841 }, { age: 86, prob: 0.086205 }, { age: 87, prob: 0.096851 },
        { age: 88, prob: 0.109019 }, { age: 89, prob: 0.121867 }, { age: 90, prob: 0.135805 },
        { age: 91, prob: 0.151108 }, { age: 92, prob: 0.168020 }, { age: 93, prob: 0.186340 },
        { age: 94, prob: 0.206432 }, { age: 95, prob: 0.228086 }, { age: 96, prob: 0.250406 },
        { age: 97, prob: 0.273699 }, { age: 98, prob: 0.296984 }, { age: 99, prob: 0.319502 },
        { age: 100, prob: 0.342716 }, { age: 101, prob: 0.366532 }, { age: 102, prob: 0.390844 },
        { age: 103, prob: 0.415531 }, { age: 104, prob: 0.440463 }, { age: 105, prob: 0.466891 },
        { age: 106, prob: 0.494904 }, { age: 107, prob: 0.524599 }, { age: 108, prob: 0.556075 },
        { age: 109, prob: 0.589439 }, { age: 110, prob: 0.624805 }, { age: 115, prob: 0.827531 },
        { age: 119, prob: 1.000000 }
    ]
};
