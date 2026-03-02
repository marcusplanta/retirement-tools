// Monte Carlo Simulation

function runSimulation() {
    const currentAge = parseInt(document.getElementById('currentAge').value);
    const retirementAge = parseInt(document.getElementById('retirementAge').value);
    const lifeExpectancy = parseInt(document.getElementById('lifeExpectancy').value);
    const savings = parseFloat(document.getElementById('savings').value);
    const spending = parseFloat(document.getElementById('spending').value);
    const stocks = parseFloat(document.getElementById('stocks').value) / 100;
    const bonds = parseFloat(document.getElementById('bonds').value) / 100;
    const cash = parseFloat(document.getElementById('cash').value) / 100;
    const taxRate = parseFloat(document.getElementById('taxRate').value) / 100;
    const fees = parseFloat(document.getElementById('fees').value) / 100;
    const flexibility = parseFloat(document.getElementById('flexibility').value) / 100;
    const threshold = parseFloat(document.getElementById('threshold').value) / 100;
    const sex = document.getElementById('sex').value;
    const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) / 100;

    const numSimulations = 10000;
    const years = lifeExpectancy;
    const results = [];

    // Calculate portfolio expected real return based on user input and asset allocation
    // User enters expected REAL return (above inflation)
    // We need to generate nominal returns and subtract inflation
    
    for (let sim = 0; sim < numSimulations; sim++) {
        let balance = savings;
        let yearlyBalances = [balance];
        let initialBalance = balance;

        for (let year = 0; year < years; year++) {
            const age = retirementAge + year;

            // Generate random inflation for this year
            const inflation = randomNormal(historicalReturns.inflation.mean, historicalReturns.inflation.stdDev);
            
            // Generate nominal returns with historical volatility
            // We'll adjust the mean to achieve the user's expected REAL return
            const stockReturn = randomNormal(historicalReturns.stocks.mean, historicalReturns.stocks.stdDev);
            const bondReturn = randomNormal(historicalReturns.bonds.mean, historicalReturns.bonds.stdDev);
            const cashReturn = randomNormal(historicalReturns.cash.mean, historicalReturns.cash.stdDev);
            
            // Calculate nominal portfolio return
            const nominalPortfolioReturn = (stocks * stockReturn + bonds * bondReturn + cash * cashReturn) - fees;
            
            // Convert to real return (this is what matters for purchasing power)
            const realPortfolioReturn = (1 + nominalPortfolioReturn) / (1 + inflation) - 1;
            
            // Adjust to match user's expected real return (shift the distribution)
            const adjustedRealReturn = realPortfolioReturn + (expectedReturn - 0.05); // 5% is baseline real return
            
            // Calculate spending (in today's dollars - we'll adjust balance by real returns)
            let currentSpending = spending;
            
            // Apply flexibility if below threshold (in real terms)
            if (balance < initialBalance * threshold) {
                currentSpending *= (1 - flexibility);
            }

            // Add income streams (in today's dollars)
            incomeStreams.forEach(stream => {
                if (age >= stream.startAge && age <= stream.endAge) {
                    currentSpending -= stream.amount;
                }
            });

            // Add expense streams (in today's dollars)
            expenseStreams.forEach(stream => {
                if (age >= stream.startAge && age <= stream.endAge) {
                    currentSpending += stream.amount;
                }
            });

            // Apply taxes
            const withdrawal = currentSpending / (1 - taxRate);

            // Update balance using REAL return (automatically maintains purchasing power)
            balance = balance * (1 + adjustedRealReturn) - withdrawal;

            yearlyBalances.push(Math.max(0, balance));

            if (balance <= 0) break;
        }

        results.push(yearlyBalances);
    }

    return results;
}
