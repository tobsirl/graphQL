import country, { message } from './myModule';
import add, { subtract } from './math';

console.log(message);

console.log(country);

console.log(`Add: ${add(5, 5)} Subtract: ${subtract(10, 5)}`);
