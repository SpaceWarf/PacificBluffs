export function currencyFormat(num: number, decimals = false) {
  return '$' + num.toFixed(decimals ? 2 : 0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}