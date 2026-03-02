// UI Event Handlers

// Sync spending and withdrawal rate
function updateFromSpending() {
    const spending = parseFloat(document.getElementById('spending').value);
    const savings = parseFloat(document.getElementById('savings').value);
    const rate = ((spending / savings) * 100).toFixed(2);
    document.getElementById('withdrawalRateInput').value = rate;
    calculate();
}

function updateFromWithdrawalRate() {
    const rate = parseFloat(document.getElementById('withdrawalRateInput').value);
    const savings = parseFloat(document.getElementById('savings').value);
    const spending = Math.round((rate / 100) * savings);
    document.getElementById('spending').value = spending;
    calculate();
}

// Update withdrawal rate when savings changes
function updateSavings() {
    updateFromSpending();
}

// Update allocation to sum to 100%
function updateAllocation() {
    const stocks = parseFloat(document.getElementById('stocks').value) || 0;
    const bonds = parseFloat(document.getElementById('bonds').value) || 0;
    const cash = parseFloat(document.getElementById('cash').value) || 0;
    
    const total = stocks + bonds + cash;
    if (total !== 100 && total > 0) {
        document.getElementById('cash').value = Math.max(0, 100 - stocks - bonds);
    }
    calculate();
}

// Tab switching
function switchTab(tab) {
    const incomeTab = document.getElementById('income-tab');
    const expensesTab = document.getElementById('expenses-tab');
    const buttons = document.querySelectorAll('.toggle-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'income') {
        incomeTab.classList.add('active');
        expensesTab.classList.remove('active');
        document.querySelector('button[onclick="switchTab(\'income\')"]').classList.add('active');
    } else {
        expensesTab.classList.add('active');
        incomeTab.classList.remove('active');
        document.querySelector('button[onclick="switchTab(\'expenses\')"]').classList.add('active');
    }
}

// Add income/expense stream
function addStream(type) {
    const name = prompt(`Enter ${type} name (e.g., Social Security, Pension):`);
    if (!name) return;

    const amount = parseFloat(prompt('Enter annual amount:'));
    if (!amount) return;

    const startAge = parseInt(prompt('Enter starting age:'));
    if (!startAge) return;

    const endAge = parseInt(prompt('Enter ending age (or leave blank for lifetime):'));

    const stream = {
        id: streamIdCounter++,
        name,
        amount,
        startAge,
        endAge: endAge || 999,
        type
    };

    if (type === 'income') {
        incomeStreams.push(stream);
    } else {
        expenseStreams.push(stream);
    }

    renderStreams();
    calculate();
}

// Remove stream
function removeStream(type, id) {
    if (type === 'income') {
        incomeStreams = incomeStreams.filter(s => s.id !== id);
    } else {
        expenseStreams = expenseStreams.filter(s => s.id !== id);
    }
    renderStreams();
    calculate();
}

// Render income/expense streams
function renderStreams() {
    const incomeList = document.getElementById('income-list');
    const expenseList = document.getElementById('expense-list');

    incomeList.innerHTML = incomeStreams.map(s => `
        <div class="stream-item">
            <div class="stream-header">
                <span class="stream-name">${s.name}</span>
                <button class="btn-remove" onclick="removeStream('income', ${s.id})">Remove</button>
            </div>
            <div class="stream-details">
                ${formatNumber(s.amount)}/yr from age ${s.startAge}${s.endAge < 999 ? ` to ${s.endAge}` : ''}
            </div>
        </div>
    `).join('');

    expenseList.innerHTML = expenseStreams.map(s => `
        <div class="stream-item">
            <div class="stream-header">
                <span class="stream-name">${s.name}</span>
                <button class="btn-remove" onclick="removeStream('expense', ${s.id})">Remove</button>
            </div>
            <div class="stream-details">
                ${formatNumber(s.amount)}/yr from age ${s.startAge}${s.endAge < 999 ? ` to ${s.endAge}` : ''}
            </div>
        </div>
    `).join('');
}

// Toggle mortality display
function toggleMortality() {
    if (currentChartData) {
        renderChart(currentChartData, currentInitialSavings);
    }
}

// Reset form
function reset() {
    document.getElementById('currentAge').value = 40;
    document.getElementById('retirementAge').value = 50;
    document.getElementById('lifeExpectancy').value = 40;
    document.getElementById('savings').value = 1000000;
    document.getElementById('spending').value = 40000;
    document.getElementById('withdrawalRateInput').value = 4.0;
    document.getElementById('expectedReturn').value = 5.0;
    document.getElementById('stocks').value = 60;
    document.getElementById('bonds').value = 30;
    document.getElementById('cash').value = 10;
    document.getElementById('taxRate').value = 15;
    document.getElementById('fees').value = 0.3;
    document.getElementById('flexibility').value = 20;
    document.getElementById('threshold').value = 80;
    incomeStreams = [];
    expenseStreams = [];
    renderStreams();
    calculate();
}
