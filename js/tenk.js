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
  calcIncome: function(incomeData, balanceData, cashData, results) {
    if (!incomeData || !results) {
      return;
    }
    for (let i = 1; i < incomeData[0].length; i++) {
      // gross profit margin
      const revenue = parseFloat(incomeData[1][i]);
      const cogs = parseFloat(incomeData[3][i]);
      const grossProftMargin = (revenue - cogs) / revenue;
      const gpmPercent = Math.round(grossProftMargin * 10000) / 100;
      results[1].push(gpmPercent + '%');
      // SGA / Gross Profit
      const sga = parseFloat(incomeData[6][i]);
      const grossProfit = parseFloat(incomeData[4][i]);
      const sgaByGrossProfit = Math.round((sga / grossProfit) * 10000) / 100;
      results[2].push(sgaByGrossProfit + '%');
      // R&D / Gross Profit
      const rd = parseFloat(incomeData[5][i]);
      const rdByGrossProfit = Math.round((rd / grossProfit) * 10000) / 100;
      results[3].push(rdByGrossProfit + '%');
      // Depreciation / Gross Profit
      const depreciation = parseFloat(cashData[1][i]);
      const depreciationByGrossProfit = Math.round((depreciation / grossProfit) * 10000) / 100;
      results[4].push(depreciationByGrossProfit + '%');
      // Interest Expenses / Operating Income
      const interestExpenses = parseFloat(incomeData[9][i]);
      const operatingIncome = parseFloat(incomeData[8][i]);
      const interestExpensesByOperatingIncome = Math.round((interestExpenses / operatingIncome) * 10000) / 100;
      results[5].push(interestExpensesByOperatingIncome + '%');
      // Income Tax / Pretax Operating Income
      const incomeTax = parseFloat(incomeData[11][i]);
      const operatingExpenses = parseFloat(incomeData[7][i]);
      const pretaxOperatingIncome = revenue - operatingExpenses - depreciation;
      const incomeTaxByPretaxOperatingIncome = Math.round((incomeTax / pretaxOperatingIncome) * 10000) / 100;
      // results[6].push(incomeTaxByPretaxOperatingIncome + '%');
      results[6].push([]);
      // Net Earnings
      const netEarnings = parseFloat(incomeData[14][i]);
      results[7].push((netEarnings / 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      // Net Earnings / Total Revenue
      const netEarningsByRevenue = Math.round((netEarnings / revenue) * 10000) / 100;
      results[8].push(netEarningsByRevenue + '%');
      // EPS Diluted
      const epsDiluted = parseFloat(incomeData[18][i]);
      results[9].push(epsDiluted);
      // Net Income / Total Assets
      const netIncome = parseFloat(incomeData[14][i]);
      const totalAssets = parseFloat(balanceData[12][i]);
      const netIncomeByTotalAssets = Math.round((netIncome / totalAssets) * 10000) / 100;
      if (isNaN(netIncomeByTotalAssets)) {
        results[10].push(['N/A']);
      } else {
        results[10].push(netIncomeByTotalAssets + '%');
      }
      // Total Liabilities / (Shareholders Equity - Treasury Stock)
      const totalLiabilities = parseFloat(balanceData[22][i]);
      const shareholderEquity = parseFloat(balanceData[25][i]);
      results[11].push([]);
      // Retaining Earnings
      const retainedEarnings = parseFloat(balanceData[24][i]);
      if (isNaN(retainedEarnings)) {
        results[12].push(['N/A']);
      } else {
        results[12].push((retainedEarnings / 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }
      // Net Earnings / Shareholder Equity
      const netEarningsByShareholderEquity = Math.round((netEarnings / shareholderEquity) * 10000) / 100;
      if (isNaN(netEarningsByShareholderEquity)) {
        results[13].push(['N/A']);
      } else {
        results[13].push(netEarningsByShareholderEquity + '%');
      }
      // Capital Expenditures / Net Earnings
      const capitalExpenditures = parseFloat(cashData[4][i]);
      const capitalExpendituresByNetEarnings = Math.round((capitalExpenditures / netEarnings) * 10000) / 100;
      if (isNaN(capitalExpendituresByNetEarnings)) {
        results[14].push([]);
      } else {
        results[14].push(capitalExpendituresByNetEarnings + '%');
      }
      results[15].push([]);
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
      ['Gross Profit Margin', '(Revenue - COGS) / Revenue', '> 40% for past 10 years'],
      ['', 'SGA / Gross Profit', '< 80% is okayish; < 30% is great; consistent over time'],
      ['', 'R&D / Gross Profit', 'Depends; < 30% seems good'],
      ['', 'Depreciation / Gross Profit', '< 10%, but depends on industry'],
      ['', 'Interest Expenses / Operating Income', 'Depends on industry; < 15% is good'],
      ['', 'Income Tax / Pretax Operating Income', '~35%; anything else is a red flag'],
      ['Net Earnings', 'Net Earnings', 'Upward'],
      ['', 'Net Earnings / Total Revenue', '> 20%; < 20% but > 10% could be treasure'],
      ['', 'EPS Diluted', 'Consistent and Upward'],
      ['Return on assets', 'Net Income / Total Assets', 'Low'],
      ['', 'Total Liabilities / (Shareholders Equity - Treasury Stock)', '< 0.8'],
      ['', 'Retained Earnings', 'Growing'],
      ['Return on Shareholders Equity', 'Net Earnings / Shareholders Equity', 'High'],
      ['', 'Capital Expenditures / Net Earnings', '< 50%'],
      ['Net Stock Buyback', '-Stock Issued - Stock Repurchased', 'Lots is a good sign; none is not bad; stock issuance may or may not be bad'],
    ];
    tenk.addYearHeaders(incomeData, results);
    tenk.calcIncome(incomeData, balanceData, cashData, results);
    tenk.buildTable(ticker, results);
  },
  onKeyUpCalc: async function(event) {
    if (event.keyCode === 13) {
      tenk.calc(document.getElementById('ticker').value);
    }
  }
};