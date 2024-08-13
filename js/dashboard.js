let transactions = [];
let authManager;

document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
    loadTransactions();
    document.getElementById('transaction-form').addEventListener('submit', addTransaction);
    updateSummary();
    updateTransactionTable();
    createCategoryChart();
});

function loadTransactions() {
    const currentUser = authManager.getCurrentUser();
    if (currentUser) {
        transactions = JSON.parse(localStorage.getItem(`transactions_${currentUser.username}`)) || [];
    }
}

function saveTransactions() {
    const currentUser = authManager.getCurrentUser();
    if (currentUser) {
        localStorage.setItem(`transactions_${currentUser.username}`, JSON.stringify(transactions));
    }
}

function addTransaction(e) {
    e.preventDefault();
    const type = document.getElementById('transaction-type').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const category = document.getElementById('transaction-category').value;
    const date = document.getElementById('transaction-date').value;

    transactions.push({ type, amount, category, date });
    saveTransactions();
    updateSummary();
    updateTransactionTable();
    updateCategoryChart();
    e.target.reset();
}

function updateSummary() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    document.getElementById('total-income').textContent = `$${income.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `$${expenses.toFixed(2)}`;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
}

function updateTransactionTable() {
    const tableBody = document.getElementById('transactions-table-body');
    tableBody.innerHTML = '';

    transactions.slice().reverse().forEach(transaction => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.type}</td>
            <td>${transaction.category}</td>
            <td>$${transaction.amount.toFixed(2)}</td>
        `;
    });
}

function getCategoryData() {
    const categories = {};
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            if (categories[transaction.category]) {
                categories[transaction.category] += transaction.amount;
            } else {
                categories[transaction.category] = transaction.amount;
            }
        }
    });
    return categories;
}