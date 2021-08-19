const { disconnect } = require('mongoose');
const connectToDB = require('./connect');
const productModel = require('./models/product');

connectToDB();

async function seeding() {
  await productModel.create({
    title: 'DESERT CORN', type: 'Табачная смесь', brand: 'SmokeAngels', price: 700,
  });
  await productModel.create({
    title: 'SINNER FRUIT', type: 'Табачная смесь', brand: 'SmokeAngels', price: 700,
  });
  await productModel.create({
    title: 'DIVINE PEACH', type: 'Табачная смесь', brand: 'SmokeAngels', price: 700,
  });
  await productModel.create({
    title: 'ACID BERRY', type: 'Табачная смесь', brand: 'SmokeAngels', price: 700,
  });
  await disconnect();
}

seeding();
