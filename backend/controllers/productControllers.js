import HttpError from "../models/httpError.js";
import Product from "../models/productModel.js";

//! Get all products
const getAllProducts = async (req, res, next) => {
  try {
    //# Search Box functionality
    const keyword = req.query.keyword
      ? [
          {
            name: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
          {
            brand: {
              $regex: req.query.keyword,
              $options: "i",
            },
          },
        ]
      : [];

    //# Pagination
    const productsPerPage = process.env.ITEMS_PER_PAGE;
    const pageNumber = Number(req.query.pageNumber) || 1;

    const count = await Product.countDocuments({ $or: keyword }); // Number of products stored in database
    const pagesNeeded = Math.ceil(count / productsPerPage); // Total pages needed

    // Limit products for each page and skip already shown products for next page
    const products = await Product.find({ $or: keyword })
      .limit(productsPerPage)
      .skip(productsPerPage * (pageNumber - 1));

    if (products.length === 0) {
      return next(new HttpError("No products available at the moment!", 404));
    }

    res.json({ products, pageNumber, pagesNeeded });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Get single product by Id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.product_id);
    if (!product) {
      return next(new HttpError("Product not found!", 404));
    }

    res.json(product);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Delete product by Id (Admin)
const deleteProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.product_id);
    if (!product) {
      return next(new HttpError("Product not found!", 404));
    }

    await product.remove();
    res.json({ message: "Product removed" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Create Product (admin)
const createProduct = async (req, res, next) => {
  try {
    const product = new Product({
      name: "Sample name",
      price: 0,
      user: req.user._id,
      image: "/images/sample.jpg",
      brand: "Sample brand",
      category: "Sample category",
      countInStock: 0,
      numReviews: 0,
      description: "Sample description",
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Update Product (admin)
const updateProduct = async (req, res, next) => {
  try {
    const { name, price, image, brand, category, countInStock, description } =
      req.body;

    const product = await Product.findById(req.params.product_id);
    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    product.name = name;
    product.price = price;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.description = description;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Create product review
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.product_id);
    if (!product) {
      return next(new HttpError("Product not found", 404));
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return next(new HttpError("Product already reviewed", 400));
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

//! Get top rated products
const getTopRatedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

export {
  getAllProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
  getTopRatedProducts,
};
