const express = require('express');
const router = express.Router();
const Product = require("../models/Product");
const multer = require('multer');

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.jpg' || ext !== '.png'){
            return cb(res.send('only jpg, png are allowed'), false)
        }
        cb(null, true)
    }
})

var upload = multer({storage: storage}).single("file")

router.post("/uploadImage", (req, res) => {
    upload(req, res, err => {
        if(err) return res.json({success: false, err})
        return res.json({success: true, image: res.req.file.path, fileName: res.req.file.filename})
    })
});

router.post("/uploadProduct", (req, res) => {
    const product = new Product(req.body)

    product.save((err) => {
        if(err) return res.json({success: false, err})
        return res.json({success: true})
    })
});

router.post("/getProducts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? req.body.limit : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    let term = req.body.searchTerm;

    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            if(key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
                console.log(findArgs)
            }
        }
    }

    if(term) {
        Product.find(findArgs)
        .find({ $text: {$search: term}})
        .populate('writer')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, products) => {
            if(err) return res.json({success: false, err})
            return res.json({success: true, products, postSize: products.length})
        })
    } else {
        Product.find(findArgs)
        .populate('writer')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, products) => {
            if(err) return res.json({success: false, err})
            return res.json({success: true, products, postSize: products.length})
        })
    }
});


router.get("/products_by_id?id=${productId}&type=single", (req, res) => {
    let type = req.query.type;
    let productIds = req.query.id;

    if(type === 'array'){

    }

    Product.find({'_id': {$in: productIds}})
    .populate('writer')
    .exec((err, product) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
        return res.send(product)
    })
});

module.exports = router;
