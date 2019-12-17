var tenk = {
  load: async function(url) {
    if (!url) {
      return;
    }
    try {
      const t = await fetch(url).then(r => r.text());
      const lines = t.split('\n');
      const data = [];
      for (let i = 0; i < lines.length; i++) {
        data.push(lines[i].split(','));
      }
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  addYearHeaders: function(data, results) {
    if (!data || !results) {
      return;
    }
    for (let i = 1; i < data[0].length; i++) {
      results[0].push(data[0][i]);
    }
  },
  calcIncome: function(data, results) {
    if (!data || !results) {
      return;
    }
    for (let i = 1; i < data[0].length; i++) {
      // gross profit margin
      const revenue = parseFloat(data[1][i]);
      const cogs = parseFloat(data[3][i]);
      const grossProftMargin = (revenue - cogs) / revenue;
      const gpmPercent = Math.round(grossProftMargin * 10000) / 100;
      results[1].push(gpmPercent + '%');
    }
  },
  buildTable: function(ticker, data) {
    document.getElementById('result').innerHTML = '<h3>' + ticker.toUpperCase() + ' Calculations</h3>';
    const table = document.createElement('table');
    table.className = 'fin-table';
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    for (let i = 0; i < data[0].length; i++) {
      const th = document.createElement('th');
      th.appendChild(document.createTextNode(data[0][i]));
      tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);
    for (let row = 1; row < data.length; row++) {
      const tr = document.createElement('tr');
      for (let col = 0; col < data[row].length; col++) {
        const td = document.createElement('td');
        td.appendChild(document.createTextNode(data[row][col]));
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    document.getElementById('result').appendChild(table);
  },
  calc: async function(ticker) {
    if (!ticker) {
      return;
    }
    const incomeUrl = '/data/10k/' + ticker.toUpperCase() + '-income-statement.csv';
    const balanceUrl = '/data/10k/' + ticker.toUpperCase() + '-balance-sheet.csv';
    const cashUrl = '/data/10k/' + ticker.toUpperCase() + '-cash-flow.csv';
    const incomeData = await tenk.load(incomeUrl);
    const balanceData = await tenk.load(balanceUrl);
    const cashData = await tenk.load(cashUrl);
    const results = [
      ['Name', 'Computation', 'Desired'],
      ['Gross Profit Margin', '(Revenue - COGS) / Revenue', '> 40% for past 10 years']
    ];
    tenk.addYearHeaders(incomeData, results);
    tenk.calcIncome(incomeData, results);
    console.dir(incomeData);
    console.dir(results);
    tenk.buildTable(ticker, results);
  }
};