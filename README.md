# Retirement Calculator

A Monte Carlo simulation-based retirement calculator that runs 10,000 simulations using historical market data (1871-2024) to project retirement outcomes.

## File Structure

```
retirement-calculator/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styling
├── js/
│   ├── constants.js       # Historical returns & mortality tables
│   ├── state.js           # Global state management
│   ├── utils.js           # Utility functions (formatting, random numbers, mortality)
│   ├── simulation.js      # Monte Carlo simulation engine
│   ├── calculator.js      # Main calculation and analysis logic
│   ├── chart.js           # Plotly chart rendering
│   ├── ui-handlers.js     # UI event handlers and user interactions
│   └── init.js            # Initialization on page load
└── README.md              # This file
```

## Module Descriptions

### constants.js
Contains:
- Historical market returns (stocks, bonds, cash, inflation)
- SSA 2022 mortality tables for males and females (ages 40-119)

### state.js
Global state variables:
- Income and expense streams
- Chart data for re-rendering
- Stream ID counter

### utils.js
Helper functions:
- `formatNumber()` - Formats numbers with K/M/B suffixes
- `randomNormal()` - Box-Muller transform for normal distribution
- `getMortalityProb()` - Interpolates mortality probability by age/sex

### simulation.js
- `runSimulation()` - Runs 10,000 Monte Carlo simulations
- Calculates real returns (adjusts for inflation)
- Applies spending flexibility, income/expense streams, taxes, fees
- Returns array of year-by-year portfolio balances for each simulation

### calculator.js
- `calculate()` - Main calculation function
- Analyzes simulation results
- Calculates percentiles (p10, p25, p50, p75, p90)
- Computes success rates and probabilities for each outcome bucket
- Handles both raw probabilities (with mortality) and normalized (conditional on survival)

### chart.js
- `renderChart()` - Renders stacked area chart using Plotly
- Displays 6 financial outcome buckets + optional death layer
- Toggles between showing mortality or normalized financial outcomes
- Color-coded from red (broke) to dark green (10x+ wealth)

### ui-handlers.js
Event handlers for:
- Spending/withdrawal rate synchronization
- Asset allocation updates
- Income/expense stream management
- Tab switching
- Mortality toggle
- Form reset

### init.js
- Page initialization
- Runs initial calculation on load

## Dependencies

- [Plotly.js](https://plotly.com/javascript/) - Chart rendering
- Google Fonts (Crimson Pro & DM Sans)

## Usage

Simply open `index.html` in a web browser. All files must be in the correct directory structure for the app to work.

For development, you can use a local server:
```bash
python -m http.server 8000
# Navigate to http://localhost:8000
```

## Features

- **Monte Carlo Simulation**: 10,000 simulations with historical volatility
- **Real Returns**: Properly accounts for inflation
- **Mortality Analysis**: SSA 2022 actuarial tables
- **Outcome Buckets**: Broke, Below Initial, 1-2x, 2-5x, 5-10x, 10x+
- **Advanced Settings**: Taxes, fees, spending flexibility, portfolio threshold
- **Income/Expense Streams**: Add Social Security, pensions, one-time expenses
- **Interactive Chart**: Toggle mortality view, hover for details

## License

Open source - use freely.
