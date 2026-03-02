// Calculation and Analysis

function calculate() {
    const retirementAge = parseInt(document.getElementById('retirementAge').value);
    const lifeExpectancy = parseInt(document.getElementById('lifeExpectancy').value);
    const savings = parseFloat(document.getElementById('savings').value);
    const spending = parseFloat(document.getElementById('spending').value);
    const sex = document.getElementById('sex').value;

    // Run simulation
    const results = runSimulation();

    // Calculate percentiles for each year
    const years = lifeExpectancy;
    const percentiles = [];
    let cumulativeSurvival = 1.0; // Start with 100% alive

    for (let year = 0; year <= years; year++) {
        const yearBalances = [];
        
        // Get all balances for this year
        for (let sim = 0; sim < results.length; sim++) {
            if (results[sim].length > year) {
                yearBalances.push(results[sim][year]);
            } else {
                yearBalances.push(0); // Ran out of money
            }
        }
        
        yearBalances.sort((a, b) => a - b);
        
        // Calculate ANNUAL probability of death at this age
        const annualDeathProb = getMortalityProb(retirementAge + year, sex);
        
        // Update cumulative survival probability
        cumulativeSurvival *= (1 - annualDeathProb);
        
        // Cumulative probability of being dead by this age
        const cumulativeDeathProb = 1 - cumulativeSurvival;
        
        // The probability of being alive at this age
        const aliveProb = cumulativeSurvival;
        
        // Among those alive, calculate financial outcome probabilities
        const totalSims = yearBalances.length;
        const numBroke = yearBalances.filter(b => b === 0).length;
        const numBelow1x = yearBalances.filter(b => b > 0 && b < savings).length;
        const num1xTo2x = yearBalances.filter(b => b >= savings && b < savings * 2).length;
        const num2xTo5x = yearBalances.filter(b => b >= savings * 2 && b < savings * 5).length;
        const num5xTo10x = yearBalances.filter(b => b >= savings * 5 && b < savings * 10).length;
        const numAbove10x = yearBalances.filter(b => b >= savings * 10).length;
        
        // These are the probabilities GIVEN that you're alive (conditional probabilities)
        const brokeGivenAlive = numBroke / totalSims;
        const below1xGivenAlive = numBelow1x / totalSims;
        const from1xTo2xGivenAlive = num1xTo2x / totalSims;
        const from2xTo5xGivenAlive = num2xTo5x / totalSims;
        const from5xTo10xGivenAlive = num5xTo10x / totalSims;
        const above10xGivenAlive = numAbove10x / totalSims;
        
        // Store both versions: 
        // - raw: includes mortality (financial outcomes scaled by aliveProb)
        // - normalized: conditional on being alive (always sums to 100%)
        percentiles.push({
            year,
            age: retirementAge + year,
            p10: yearBalances[Math.floor(yearBalances.length * 0.1)],
            p25: yearBalances[Math.floor(yearBalances.length * 0.25)],
            p50: yearBalances[Math.floor(yearBalances.length * 0.5)],
            p75: yearBalances[Math.floor(yearBalances.length * 0.75)],
            p90: yearBalances[Math.floor(yearBalances.length * 0.9)],
            // Raw probabilities (include mortality impact)
            brokeRaw: brokeGivenAlive * aliveProb,
            below1xRaw: below1xGivenAlive * aliveProb,
            from1xTo2xRaw: from1xTo2xGivenAlive * aliveProb,
            from2xTo5xRaw: from2xTo5xGivenAlive * aliveProb,
            from5xTo10xRaw: from5xTo10xGivenAlive * aliveProb,
            above10xRaw: above10xGivenAlive * aliveProb,
            // Normalized probabilities (conditional on being alive)
            brokeNorm: brokeGivenAlive,
            below1xNorm: below1xGivenAlive,
            from1xTo2xNorm: from1xTo2xGivenAlive,
            from2xTo5xNorm: from2xTo5xGivenAlive,
            from5xTo10xNorm: from5xTo10xGivenAlive,
            above10xNorm: above10xGivenAlive,
            mortality: cumulativeDeathProb  // Cumulative probability of being dead by this age
        });
    }

    // Calculate success rate (not broke at end, conditional on being alive)
    const finalYear = percentiles[percentiles.length - 1];
    
    // Debug: Check if we have valid data
    if (!finalYear || finalYear.p50 === undefined) {
        console.error('Final year data is invalid:', finalYear);
        document.getElementById('successRate').textContent = 'Error';
        document.getElementById('withdrawalRate').textContent = 'Error';
        document.getElementById('medianBalance').textContent = 'Error';
        return;
    }
    
    const brokeAtEnd = finalYear.brokeNorm;
    const successRate = ((1 - brokeAtEnd) * 100).toFixed(1);
    const withdrawalRate = ((spending / savings) * 100).toFixed(2);
    
    // Display median balance
    const medianBalance = finalYear.p50;

    // Update stats
    document.getElementById('successRate').textContent = successRate + '%';
    document.getElementById('withdrawalRate').textContent = withdrawalRate + '%';
    document.getElementById('medianBalance').textContent = formatNumber(medianBalance);

    // Render chart
    renderChart(percentiles, savings);
}
