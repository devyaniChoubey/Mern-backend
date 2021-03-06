const Product = require('../models/product');
const slugify = require('slugify');
const Category = require('../models/category')

exports.createProduct = (req, res) => {
    const { name, price, description, category, createdBy, quantity } = req.body;
    let productPictures = [];

    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename }
        })
    }
    const product = new Product({
        name: name,
        slug: slugify(name),
        price,
        description,
        productPictures,
        category,
        createdBy: req.user._id,
        quantity
    })

    product.save(((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
            res.status(201).json({ product })
        }
    }))
    // res.status(200).json({file: req.files,body :req.body})
}

exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params;
    console.log(slug)
    Category.findOne({ slug: slug })
        .select('_id type name')
        .exec((error, category) => {
            if (error) {
                return res.status(400).json({ error });
            }
            if (category) {
                Product.find({ category: category._id })
                    .exec((error, products) => {
                        if (error) {
                            return res.status(400).json({ error });
                        }
                        console.log(category._id)


                        if (category.type) {
                            if (products.length > 0) {
                                res.status(200).json({
                                    products,
                                    priceRange: {
                                        under5k: 5000,
                                        under10k: 10000,
                                        under15k: 15000,
                                        under20k: 20000,
                                        under30k: 30000

                                    },
                                    productsByPrice: {
                                        under5k: products.filter(product => product.price <= 5000),
                                        under10k: products.filter(product => product.price > 5000 && product.price <= 10000),
                                        under15k: products.filter(product => product.price > 10000 && product.price <= 15000),
                                        under20k: products.filter(product => product.price > 15000 && product.price <= 20000),
                                        under30k: products.filter(product => product.price > 20000 && product.price <= 30000),
                                    },
                                    categoryName: category.name
                                })
                            }
                        } else {
                            return res.status(200).json({ products: products, categoryName: category.name });
                        }



                    })
            }
            //res.status(200).json({ category })
        })

}
exports.getProductDetailsById = (req, res) => {
    const { productId } = req.params;
    if (productId) {
        Product.findOne({ _id: productId })
            .exec((error, product) => {
                if (error) {
                    return res.status(400).json({ error });
                }
                if (product) {

                    return res.status(200).json({ product });
                }
            })
    } else {

        return res.status(400).json({ error: 'Params required' });

    }
}

exports.getAllProducts = (req, res) => {
    Product.aggregate([{ $sample: { size: 7 } }])
        .exec((error, products) => {
            if (error) return res.status(400).json({ error })
            if (products) {
                res.status(200).json({ products });
            }
        })
}

exports.getProductsByCategory = (req, res) => {
    const { categoryId } = req.params;
    if (categoryId) {
        Product.find({ category: categoryId })
            .exec((error, products) => {
                if (error) {
                    return res.status(400).json({ error });
                }
                if (products) {
                    return res.status(200).json({ products });
                }
            })

    } else {
        return res.status(400).json({ error: 'Params required' });
    }
}

exports.deleteProductById = (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
        Product.deleteOne({ _id: productId }).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
                res.status(202).json({ result });
            }
        })
    } else {
        res.status(400).json({ error: "Params required" });
    }
}


exports.getProducts = async (req, res) => {
    const products = await Product.find({})
        .select("_id name price quantity slug description productPictures category")
        .populate({ path: "category", select: "_id name" })
        .exec();

    res.status(200).json({ products })
}

exports.addReviews = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        const review = {
            name: req.body.name,
            rating: Number(req.body.rating),
            comment: req.body.comment,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((a, c) => c.rating + a, 0) /
            product.reviews.length;
        const updatedProduct = await product.save();
        res.status(201).send({
            data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
            message: 'Review saved successfully.',
        });
    } else {
        res.status(404).send({ message: 'Product Not Found' });
    }
}

