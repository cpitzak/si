var options = {

  calc: function() {
    compound.zeroBlanks(document.putForm);
    const putSold = compound.value(document.putForm.putSold.value);
    const strike = compound.value(document.putForm.strike.value);
    const daysExpire = compound.value(document.putForm.expiration.value);
    const daysInYear = compound.value(document.putForm.days.value);
    const stockPrice = compound.value(document.putForm.stockPrice.value);
    const annualizedReturn = putSold / strike / daysExpire * daysInYear;
    const diff = 1 - (stockPrice / strike);
    const result = "Annualized Return: <strong>" + (annualizedReturn * 100).toFixed(2) + '%</strong>' +
    '<br/>% diff from stock price: <strong>' + (diff * 100).toFixed(2) + '</strong>%';
    document.getElementById('result').innerHTML = result;
  }

};