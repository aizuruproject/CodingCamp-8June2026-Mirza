const transactions = [];
const COLORS = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8'];

const form = document.getElementById('transactionForm');
const nameInput = document.getElementById('itemName');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');

const listEl = document.getElementById('transactionList');
const balanceEl = document.getElementById('totalBalance');
const chartEl = document.getElementById('pieChart');
const legendEl = document.getElementById('chartLegend');

function updateUI() {
    listEl.innerHTML = '';
    legendEl.innerHTML = '';

    if (transactions.length === 0) {
        balanceEl.textContent = '$ 0.00';
        listEl.innerHTML = '<li class="empty-state">Belum ada transaksi.</li>';
        chartEl.style.backgroundImage = 'conic-gradient(#e2e8f0 0% 100%)';
        return;
    }

    let total = 0;
    const totals = {};

    transactions.forEach(t => {
        total += t.amount;
        totals[t.category] = (totals[t.category] || 0) + t.amount;

        const li = document.createElement('li');
        li.className = 'transaction-item';
        li.innerHTML = `
            <div class="item-info">
                <span class="item-name"></span>
                <span class="item-category">${t.category}</span>
            </div>
            <strong class="item-amount">$ ${t.amount.toFixed(2)}</strong>
        `;
        li.querySelector('.item-name').textContent = t.name;
        listEl.appendChild(li);
    });

    balanceEl.textContent = `$ ${total.toFixed(2)}`;

    const gradients = [];
    let currentPercent = 0;
    let colorIndex = 0;

    for (const category in totals) {
        const amount = totals[category];
        const percent = (amount / total) * 100;
        const color = COLORS[colorIndex % COLORS.length];
        colorIndex++;

        const nextPercent = currentPercent + percent;
        gradients.push(`${color} ${currentPercent.toFixed(2)}% ${nextPercent.toFixed(2)}%`);
        currentPercent = nextPercent;

        const li = document.createElement('li');
        li.className = 'legend-item';
        li.innerHTML = `
            <div class="legend-left">
                <span class="legend-color" style="background-color: ${color}"></span>
                <span class="legend-text">${category}</span>
            </div>
            <span class="legend-value">$ ${amount.toFixed(2)} (${percent.toFixed(0)}%)</span>
        `;
        legendEl.appendChild(li);
    }

    chartEl.style.backgroundImage = `conic-gradient(${gradients.join(', ')})`;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    transactions.push({
        name: nameInput.value.trim(),
        amount: parseFloat(amountInput.value),
        category: categoryInput.value.trim()
    });

    updateUI();
    form.reset();
});

updateUI();