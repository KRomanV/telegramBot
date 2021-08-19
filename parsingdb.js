const productModel = require('./db/models/product');
const connectToDB = require('./db/connect');

connectToDB();

async function parsingBase(brand) {
  const currentBrand = await productModel.find({ brand: `${brand}` });
  const filteredProducts = currentBrand.map((product) => `${product.title}-${product.price}₽`);
  return filteredProducts.join('\n');
  // console.log(filteredProducts);
}
// parsingBase('Darkside');
module.exports = parsingBase;
