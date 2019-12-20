var compound = {
  futureValue: function (principal, interest, years) {
    return principal * Math.pow(1 + interest, years);
  },
  calcCompound: function (principal, interest, years, additions) {
    if (additions === null) {
      additions = 0;
    }
    return compound.futureValue(principal, interest, years) + 
      additions * compound.geometricSeries(1 + interest, 1, years);
  },
  geometricSeries: function (k, m, n) {
    let result;
    if (k == 1.0) {
      result = n + 1;
    } else {
      result = (Math.pow(k, n + 1) - 1) / (k - 1);
    }
    if (m >= 1) {
      result -= compound.geometricSeries(k, 0, m - 1);
    }
    return result;
  },
  formatNumber: function (val, digits, minval, maxval) {
    var sval = "" + compound.value(val, digits, minval, maxval);
    var i;
    var iDecpt = sval.indexOf(".");
    if (iDecpt < 0) iDecpt = sval.length;
    if (digits != null && digits > 0) {
      if (iDecpt == sval.length)
        sval = sval + ".";
      var places = sval.length - sval.indexOf(".") - 1;
      for (i = 0; i < digits - places; i++)
        sval = sval + "0";
    }
    var firstNumchar = 0;
    if (sval.charAt(0) == "-") firstNumchar = 1;
    for (i = iDecpt - 3; i > firstNumchar; i -= 3)
      sval = sval.substring(0, i) + "," + sval.substring(i);

    return sval;
  },
  value: function (val, digits, minval, maxval) {
    val = compound.removeNonNumeric(val);
    if (val == "" || isNaN(val)) val = 0;
    val = parseFloat(val);
    if (digits != null) {
      var dec = Math.pow(10, digits);
      val = (Math.round(val * dec)) / dec;
    }
    if (minval != null && val < minval) val = minval;
    if (maxval != null && val > maxval) val = maxval;
    return parseFloat(val);
  },
  removeNonNumeric: function (s) {
    return s.replace(/[^\d.-]/g, '');
  },
  zeroBlanks: function (formname) {
    var i, ctrl;
    for (i = 0; i < formname.elements.length; i++) {
      ctrl = formname.elements[i];
      if (ctrl.type == "text") {
        if (compound.removeNonNumeric(ctrl.value) == "")
          ctrl.value = "0";
      }
    }
  },
  numberWithCommas: function(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  },
  calc: function () {
    compound.zeroBlanks(document.compoundForm);
    const principal = compound.value(document.compoundForm.principal.value);
    const additions = compound.value(document.compoundForm.additions.value);
    const interest = compound.value(document.compoundForm.interest.value) / 100;
    const years = compound.value(document.compoundForm.years.value);
    const frequency = 1;
    let value = compound.calcCompound(principal, interest / frequency, years * frequency, additions / frequency);
    value = Math.round((value) * 100) / 100;
    document.getElementById('result').innerHTML = '$' + numberWithCommas(value);
  }
};