const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  image: String,
  amount: Number,
  //Implement inventory count later
});

const Product = mongoose.model("Product", productSchema); //the creates the collection but we call it model?
//I don't know why we have to type Fruit for it to be transitioned to fruits?
module.exports = Product;
//had to match the in quotes name above, even though Mongo will change it which feels insane
