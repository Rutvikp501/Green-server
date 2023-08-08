const express = require('express');
const { ProductModel } = require('../Model/Product/Product.model');
const { cloudinary } = require('../utils/cloudinary');
const productRouter = express.Router()

productRouter.get('/',(req,res)=>{
    
    res.status(200).send(`You are in product`)
})

//////////////Add product/////////////////
productRouter.post('/',async(req,res)=>{
    const {title,image} = req.body
    try {
        const existingProduct = await ProductModel.findOne({ title });
        if (existingProduct) {
          res.status(400).json({ error: 'Product already exists' });
          return;
        }
        let uploadRes
            if(image){
                 uploadRes = await cloudinary.uploader.upload(image,{
                    folder:'Product_images'
                })
                if(!uploadRes){
                    res.status(500).send(`Image uploading went wrong`)
                }
            }
        const newProduct = new ProductModel({...req.body,image:uploadRes})
        const data = await newProduct.save()
        res.status(200).send(data)
        
    } catch (error) {
        res.status(500).send(`Error creating products: ${error.message}`)
    }
})

//////////////Update details/////////////////
productRouter.post('/edit',async(req,res)=>{
    //console.log(req.body);
    const ID = req.body.id
    try {
        let updated = await ProductModel.findByIdAndUpdate({_id:ID},req.body,{ new: true })
        res.status(201).json(updated)
    } catch (error) {
        res.status(500).send(`Error updating products: ${error.message}`) 
    }
})

//////////////Delete product/////////////////
productRouter.delete('/delete',async(req,res)=>{
    const ID = req.params.id
    try {
        await ProductModel.findByIdAndDelete({_id:ID})
        res.status(201).json('Deleted successfully')
    } catch (error) {
        res.status(500).send(`Error deleting products: ${error.message}`) 
    }
})
//////////////Active product/////////////////
productRouter.post('/Active',async(req,res)=>{
    const {id} = req.body
    try {
        let Productstatus = await ProductModel.find({_id:id})
        let newstatus = "";
      let status = "";
      let msg = "";
      if (Productstatus[0].status == 0) {
        
        newstatus = 1;
        status = "success";
        msg = "User Active successfully.";
      } else {
        newstatus = 0;
        status = "failed";
        msg = "User Delete successfully.";
      } 
       await ProductModel.findByIdAndUpdate(id, { status: newstatus });

    res.status(200).send({
        message: msg,
      });
    } catch (error) {
        res.status(500).send(`Error deleting products: ${error.message}`) 
    }
})

productRouter.patch('/active/:id',async(req,res)=>{  
    const { id } = request.body;
    try {
        let productstatus = await ProductModel.find({ _id: id });

        let newstatus = "";
        let status = "";
        let msg = "";
        if (productstatus[0]["status"] == 0) {
          newstatus = 1;
          status = "success";
          msg = "product Active successfully.";
        } else {
          newstatus = 0;
          status = "failed";
          msg = "product Delete successfully.";
        }
  
        await ProductModel.findByIdAndUpdate(id, { status: newstatus });
  
        // const result = await SubmenuModel.findByIdAndDelete(id)
        response.send({
          status: status,
          statuscode: 200,
          message: msg,
        });

    } catch (error) {
        res.status(500).send(`Error getting category data: ${error.message}`)
    }
})
//////////////Get popular products/////////////////
productRouter.get('/popular',async(req,res)=>{
    try {
        const product = await ProductModel.aggregate([{$sample:{size:4}},{$match:{status: "1"}}])
        
        res.status(201).json(product)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})
//////////////Get all products/////////////////

productRouter.get('/Admin_find',async(req,res)=>{
    var query={}
    try {
        if(req.query.title){
            const regex = new RegExp(req.query.title, 'i');
            query.title = regex
        }
        if(req.query.category){
            req.query.category.indexOf('Vegitable') != -1?req.query.category[req.query.category.indexOf('Vegitable')] = '64bd4fd982a0cf91f0098c4a':null
            req.query.category.indexOf('Fruits') != -1?req.query.category[req.query.category.indexOf('Fruits')] = '64bd502f82a0cf91f0098c4e':null
            req.query.category.indexOf('Spices_Herbs') != -1?req.query.category[req.query.category.indexOf('Spices_Herbs')] = '64bd504882a0cf91f0098c52':null
            req.query.category.indexOf('Green_Leaves') != -1?req.query.category[req.query.category.indexOf('Green_Leaves')] = '64bd505f82a0cf91f0098c56':null
            req.query.category.indexOf('Dairy_Products') != -1?req.query.category[req.query.category.indexOf('Dairy_Products')] = '64bd507e82a0cf91f0098c5a':null
            req.query.category.indexOf('Egg_Meats') != -1?req.query.category[req.query.category.indexOf('Egg_Meats')] = '64bd509382a0cf91f0098c5e':null
            query.category={$in:req.query.category}
        }
        if(req.query.price){
            const price = req.query.price
            query['$and'] = price.map((item)=>{
                let [min,max] = item.split('-')
                return min && max
        ? { price: { $gte: min, $lte: max } }
        : { price: { $gte: min } };
            })
        }
            const product = await ProductModel.find(query)
            if(!product){
                return res.status(404).send({message: "No products found"})
            }
            res.status(201).json(product)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})

productRouter.get('/find',async(req,res)=>{
    var query={}
    query.status="1"
    try {
        if(req.query.title){
            const regex = new RegExp(req.query.title, 'i');
            query.title = regex
        }
        if(req.query.category){
            req.query.category.indexOf('Vegitable') != -1?req.query.category[req.query.category.indexOf('Vegitable')] = '64bd4fd982a0cf91f0098c4a':null
            req.query.category.indexOf('Fruits') != -1?req.query.category[req.query.category.indexOf('Fruits')] = '64bd502f82a0cf91f0098c4e':null
            req.query.category.indexOf('Spices_Herbs') != -1?req.query.category[req.query.category.indexOf('Spices_Herbs')] = '64bd504882a0cf91f0098c52':null
            req.query.category.indexOf('Green_Leaves') != -1?req.query.category[req.query.category.indexOf('Green_Leaves')] = '64bd505f82a0cf91f0098c56':null
            req.query.category.indexOf('Dairy_Products') != -1?req.query.category[req.query.category.indexOf('Dairy_Products')] = '64bd507e82a0cf91f0098c5a':null
            req.query.category.indexOf('Egg_Meats') != -1?req.query.category[req.query.category.indexOf('Egg_Meats')] = '64bd509382a0cf91f0098c5e':null
            query.category={$in:req.query.category}
        }
        if(req.query.price){
            const price = req.query.price
            query['$and'] = price.map((item)=>{
                let [min,max] = item.split('-')
                return min && max
        ? { price: { $gte: min, $lte: max } }
        : { price: { $gte: min } };
            })
        }
            const product = await ProductModel.find(query)
            if(!product){
                return res.status(404).send({message: "No products found"})
            }
            res.status(201).json(product)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})

//////////////Get single products/////////////////
productRouter.get('/find/:id',async(req,res)=>{
    
    try {
        const product = await ProductModel.findById(req.params.id).populate('category')
                    res.status(201).json(product)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})

//////////////Get product by Category/////////////////
productRouter.get('/findbycat/:id',async(req,res)=>{
    try {
        const products = await ProductModel.find({category:req.params.id})
        res.status(201).json(products)
    } catch (error) {
        res.status(500).send(`Error getting products data: ${error.message}`)
    }
})


module.exports={
    productRouter
}

// {
//     "title":"Puma T-shirt",
//     "des":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quae, rem aperiam ut laboriosam assumenda recusandae",
//     "img":"https://m.media-amazon.com/images/I/71sC3wxkRrL._UY550_.jpg",
//     "category":["tshirt","man"],
//     "size":"M",
//     "color":"red",
//     "price":542
//   }