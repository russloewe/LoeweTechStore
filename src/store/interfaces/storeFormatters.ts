export function toCurrency(x: number){
    // x in pennies v
    return Number(x/100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
 