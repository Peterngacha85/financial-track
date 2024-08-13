let categoryChart;

function createCategoryChart() {
    const ctx = document.getElementById('category-chart').getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'right'
            },
            title: {
                display: true,
                text: 'Spending by Category'
            }
        }
    });
}

function updateCategoryChart() {
    const categories = getCategoryData();

    // Combine income and expense categories into one chart
    const combinedCategories = {
        labels: [],
        data: [],
        backgroundColor: []
    };

    // Add income categories
    Object.entries(categories.income).forEach(([category, amount]) => {
        combinedCategories.labels.push(`${category} (Income)`);
        combinedCategories.data.push(amount);
        combinedCategories.backgroundColor.push('#36A2EB'); // Blue color for income
    });

    // Add expense categories
    Object.entries(categories.expense).forEach(([category, amount]) => {
        combinedCategories.labels.push(`${category} (Expense)`);
        combinedCategories.data.push(amount);
        combinedCategories.backgroundColor.push('#FF6384'); // Red color for expense
    });

    // Update the chart
    categoryChart.data.labels = combinedCategories.labels;
    categoryChart.data.datasets[0].data = combinedCategories.data;
    categoryChart.data.datasets[0].backgroundColor = combinedCategories.backgroundColor;
    categoryChart.update();
}
