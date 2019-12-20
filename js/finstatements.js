var statements = {
  load: async function (url) {
    if (!url) {
      return;
    }
    try {
      const t = await fetch(url).then(r => r.text());
      const lines = t.split('\n');
      data = [];
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].indexOf('Property, Plant & Equipment Net') > -1) {
          lines[i] = lines[i].replace('Property, Plant & Equipment Net', 'Property Plant & Equipment Net');
        }
        const temp = lines[i].split(',');
        data.push(temp);
      }
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  // addYearHeaders: function (data, results) {
  //   if (!data || !results) {
  //     return;
  //   }
  //   for (let i = 1; i < data[tenk.incomeConstants.DATE].length; i++) {
  //     const date = data[tenk.incomeConstants.DATE][i];
  //     results[0].push(date);
  //   }
  // },
  numberWithCommas: function(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
  },
  buildTable: function (data, ticker, type) {
    document.getElementById('title').innerHTML = '<h3>' + ticker.toUpperCase() + ' - ' + type + '</h3>';
    document.getElementById('table').innerHTML = '';
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
        let value = data[row][col];
        if (Math.abs(value) > 1) {
          value = statements.numberWithCommas(value);
        }
        td.appendChild(document.createTextNode(value));
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    document.getElementById('table').appendChild(table);
  },
  loadTable: async function (type) {
    let ticker = document.getElementById('ticker').value;
    if (!ticker || ticker.trim().length === 0) {
      return;
    }
    ticker = ticker.trim();
    let data = [];
    let text = '';
    document.getElementById('income-link').className = '';
    document.getElementById('balance-link').className = '';
    document.getElementById('cash-link').className = '';
    if (type === 'i') {
      text = 'Income Statement';
      document.getElementById('income-link').className = 'active';
      const incomeUrl = '/data/10k/' + ticker.toUpperCase() + '-income-statement.csv';
      data = await statements.load(incomeUrl);
    } else if (type === 'b') {
      text = 'Balance Sheet';
      document.getElementById('balance-link').className = 'active';
      const balanceUrl = '/data/10k/' + ticker.toUpperCase() + '-balance-sheet.csv';
      data = await statements.load(balanceUrl);
    } else if (type === 'c') {
      text = 'Cash Flow';
      document.getElementById('cash-link').className = 'active';
      const cashUrl = '/data/10k/' + ticker.toUpperCase() + '-cash-flow.csv';
      data = await statements.load(cashUrl);
    }
    if (data.length > 0 && data.length !== 15) {
      statements.buildTable(data, ticker, text);
    }
    // tenk.addYearHeaders(incomeData, results);
    // tenk.runCalcs(incomeData, balanceData, cashData, results);
    // tenk.buildTable(ticker, results);
  },
  // onKeyUpCalc: async function (event) {
  //   if (event.keyCode === 13) {
  //     tenk.calc(document.getElementById('ticker').value);
  //   }
  // }
};