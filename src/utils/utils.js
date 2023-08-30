function formatNumber(num) {
  num = Number(num);

  return num.toLocaleString(undefined, {
    style: 'currency',
    currency: 'AUD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
  });
}

export { formatNumber };
