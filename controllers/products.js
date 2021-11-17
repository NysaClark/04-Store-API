const Product = require("../models/product");

const getAllProductsStatic = (req, res) => {
  // throw new Error("Testing Async Errors")
  return res.json({ method: req.method, products: "getAllProductsStatic" });
};

const getAllProducts = async (req, res) => {
  let queryObject = {};

  const { featured, company, name, filters, sort, fields} = req.query;

  if(featured) {
    queryObject.featured = featured;
  }

  if(company) {
    queryObject.company = company;
  }

  if(name) {
    queryObject.name = {$regex: name, $options: 'i'}
  }

  if(filters) {
    const operatorMap = {
      ">": "$gt",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
      ">=": "$gte"
    }
    const re = /\b(<|>|<=|>=|=)\b/g

    const newFilters = filters.replace(re, (match) => `-${operatorMap[match]}-`)

    const options = ["price", "rating"]
    newFilters.split(',').forEach((item) => {
      // price=$gte-100
      const [field, operator, value] = item.split('-')
      //field = price
      //operator = $gte
      //value = 100
      if(options.includes(field)) {
        queryObject[field] = { [operator]: +value };
      }
    })
  }

  // console.log(queryObject)
  let results = Product.find(queryObject);

  if( sort ) {
    const sortList = sort.split(',').join(' ')
    results = results.sort(sortList)
  }else{
    results = results.sort('-featured -rating price')
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    results = results.select(fieldsList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  
  results = results.limit(limit).skip(skip)

  const products = await results

  return res.json({
    success: true,
    results: products,
    nbHits: products.length,
  });
};

module.exports = { getAllProducts, getAllProductsStatic };
