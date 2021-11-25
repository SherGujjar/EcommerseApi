const Product = require('../models/product');
const {StatusCodes} = require('http-status-codes') 
const CustomError = require('../errors/index') 
const path = require('path');



const createProducts =async (req,res)=>{
    req.body.user = req.user.userId;
    
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product});

}

const getAllProduct =async (req,res)=>{
    const product = await Product.find();
    res.status(StatusCodes.OK).json({product})
}
const getSingleProduct =async (req,res)=>{
    const {id} = req.params;
  //  console.log(id)
    const product = await Product.findOne({_id:id}).populate('reviews'); // here we used vituals
    if(!product){
        throw new CustomError.NotFoundError(`No product with this id ${id}`);
    }
    res.status(StatusCodes.OK).json({product});
}
const updateProduct =async (req,res)=>{
    const {id} = req.params;
  //  console.log(id)
    const product = await Product.findOneAndUpdate({_id:id},req.body,{ new: true, runValidators: true });
    if(!product){
        throw new CustomError.NotFoundError(`No product with this id ${id}`);
    }
    res.status(StatusCodes.OK).json({product})
}
const deleteProduct =async (req,res)=>{
    const {id} = req.params;
    const product = await Product.findOne({_id:id});
    if(!product){
        throw new CustomError.NotFoundError(`No product with this id ${id}`);
    }
    await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
}



const uploadImage =async (req,res)=>{
    
    if(!req.files){
        throw new CustomError.BadRequestError('No file uploaded');
    }
    const productImage = req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('Please uplaod image');
    }
    const maxsize = 1024*1024;
    if(productImage.size>maxsize){
        throw new CustomError.BadRequestError('Please upload image of less than 1 MB');
    }
    const imagePath = path.join(__dirname,'../public/uploads/'+ `${productImage.name}`);

    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });

}

module.exports = {
    createProducts,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}