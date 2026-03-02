// Chart Rendering

function renderChart(data, initialSavings) {
    // Store data for toggle function
    currentChartData = data;
    currentInitialSavings = initialSavings;
    
    const showMortality = document.getElementById('showMortality').checked;
    const ages = data.map(d => d.age);

    // Choose which probabilities to use based on toggle
    let brokeProb, below1xProb, from1xTo2xProb, from2xTo5xProb, from5xTo10xProb, above10xProb, deathProb;
    
    if (showMortality) {
        // Use raw probabilities (include mortality impact, financial + death = 100%)
        brokeProb = data.map(d => d.brokeRaw * 100);
        below1xProb = data.map(d => d.below1xRaw * 100);
        from1xTo2xProb = data.map(d => d.from1xTo2xRaw * 100);
        from2xTo5xProb = data.map(d => d.from2xTo5xRaw * 100);
        from5xTo10xProb = data.map(d => d.from5xTo10xRaw * 100);
        above10xProb = data.map(d => d.above10xRaw * 100);
        deathProb = data.map(d => d.mortality * 100);
    } else {
        // Use normalized probabilities (conditional on being alive, financial = 100%)
        brokeProb = data.map(d => d.brokeNorm * 100);
        below1xProb = data.map(d => d.below1xNorm * 100);
        from1xTo2xProb = data.map(d => d.from1xTo2xNorm * 100);
        from2xTo5xProb = data.map(d => d.from2xTo5xNorm * 100);
        from5xTo10xProb = data.map(d => d.from5xTo10xNorm * 100);
        above10xProb = data.map(d => d.above10xNorm * 100);
        deathProb = null; // Don't show death layer
    }
    
    const traces = [];
    
    // Bottom layer: Broke (red)
    traces.push({
        x: ages,
        y: brokeProb,
        type: 'scatter',
        mode: 'none',
        name: 'Broke',
        fillcolor: 'rgba(214, 48, 49, 0.8)',
        fill: 'tozeroy',
        hovertemplate: 'Age %{x}<br>Broke: %{y:.1f}%<extra></extra>',
        stackgroup: 'one'
    });
    
    // Below initial (orange)
    traces.push({
        x: ages,
        y: below1xProb,
        type: 'scatter',
        mode: 'none',
        name: 'Below Initial',
        fillcolor: 'rgba(253, 203, 110, 0.7)',
        fill: 'tonexty',
        hovertemplate: 'Age %{x}<br>Below Initial: %{y:.1f}%<extra></extra>',
        stackgroup: 'one'
    });
    
    // 1-2x initial (light yellow/green)
    traces.push({
        x: ages,
        y: from1xTo2xProb,
        type: 'scatter',
        mode: 'none',
        name: '1-2x Initial',
        fillcolor: 'rgba(255, 234, 167, 0.7)',
        fill: 'tonexty',
        hovertemplate: 'Age %{x}<br>1-2x Initial: %{y:.1f}%<extra></extra>',
        stackgroup: 'one'
    });
    
    // 2-5x initial (light green)
    traces.push({
        x: ages,
        y: from2xTo5xProb,
        type: 'scatter',
        mode: 'none',
        name: '2-5x Initial',
        fillcolor: 'rgba(163, 228, 215, 0.7)',
        fill: 'tonexty',
        hovertemplate: 'Age %{x}<br>2-5x Initial: %{y:.1f}%<extra></extra>',
        stackgroup: 'one'
    });
    
    // 5-10x initial (medium green)
    traces.push({
        x: ages,
        y: from5xTo10xProb,
        type: 'scatter',
        mode: 'none',
        name: '5-10x Initial',
        fillcolor: 'rgba(0, 184, 148, 0.7)',
        fill: 'tonexty',
        hovertemplate: 'Age %{x}<br>5-10x Initial: %{y:.1f}%<extra></extra>',
        stackgroup: 'one'
    });
    
    // 10x+ initial (dark green)
    traces.push({
        x: ages,
        y: above10xProb,
        type: 'scatter',
        mode: 'none',
        name: '10x+ Initial',
        fillcolor: 'rgba(0, 148, 117, 0.9)',
        fill: 'tonexty',
        hovertemplate: 'Age %{x}<br>10x+ Initial: %{y:.1f}%<extra></extra>',
        stackgroup: 'one'
    });
    
    // Death layer (only if showing mortality)
    if (showMortality && deathProb) {
        traces.push({
            x: ages,
            y: deathProb,
            type: 'scatter',
            mode: 'none',
            name: 'Death',
            fillcolor: 'rgba(108, 117, 125, 0.6)',
            fill: 'tonexty',
            hovertemplate: 'Age %{x}<br>Death: %{y:.1f}%<extra></extra>',
            stackgroup: 'one'
        });
    }

    const layout = {
        title: '',
        xaxis: {
            title: 'Age',
            gridcolor: '#e9ecef',
            showgrid: true
        },
        yaxis: {
            title: 'Probability (%)',
            range: [0, 100],
            gridcolor: '#e9ecef',
            showgrid: true
        },
        hovermode: 'x unified',
        showlegend: true,
        legend: {
            orientation: 'h',
            yanchor: 'bottom',
            y: 1.02,
            xanchor: 'right',
            x: 1,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            bordercolor: '#e9ecef',
            borderwidth: 1
        },
        plot_bgcolor: '#ffffff',
        paper_bgcolor: '#ffffff',
        margin: { t: 20, b: 60, l: 70, r: 20 },
        font: {
            family: 'DM Sans, sans-serif',
            size: 12
        }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    Plotly.newPlot('chart', traces, layout, config);
}
