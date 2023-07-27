const express = require('express');
const { CategoryModel } = require('../Model/Category/Category.model');
const { cloudinary } = require('../utils/cloudinary');
const categoryRouter = express.Router()

categoryRouter.get('/',(req,res)=>{
    res.status(200).send(`You are in category`)
})

//////////////Add category/////////////////
categoryRouter.post('/',async(req,res)=>{
    const {title,image} = req.body
    try {
        const existingCategory = await CategoryModel.findOne({ title });
        if (existingCategory) {
          res.status(400).json({ error: 'Category already exists' });
          return;
        }
        let uploadRes
            if(image){
                 uploadRes = await cloudinary.uploader.upload(image,{
                    folder:'Category_images'
                })
                if(!uploadRes){
                    res.status(500).send(`Image uploading went wrong`)
                }
            }
        const newCategory = new CategoryModel({title,image:uploadRes})
        const data = await newCategory.save()
        res.status(200).send(data)
        
    } catch (error) {
        res.status(500).send(`Error creating category: ${error.message}`)
    }
})

//////////////Get all category/////////////////
categoryRouter.get('/find',async(req,res)=>{  
    try {
        const cart = await CategoryModel.find({})
                    res.status(201).json(cart)
    } catch (error) {
        res.status(500).send(`Error getting category data: ${error.message}`)
    }
})
//////////////Update details/////////////////
categoryRouter.patch('/edit/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        let updated = await CategoryModel.findByIdAndUpdate({_id:ID},req.body,{ new: true })
        res.status(201).json(updated)
    } catch (error) {
        res.status(500).send(`Error updating products: ${error.message}`) 
    }
})

//////////////Delete product/////////////////
categoryRouter.delete('/delete/:id',async(req,res)=>{
    const ID = req.params.id
    try {
        await CategoryModel.findByIdAndDelete({_id:ID})
        res.status(201).json('Deleted successfully')
    } catch (error) {
        res.status(500).send(`Error deleting products: ${error.message}`) 
    }
})
//////////////Active product/////////////////
categoryRouter.patch('/active/:id',async(req,res)=>{  
    const { id } = request.body;
    try {
        let categorystatus = await CategoryModel.find({ _id: id });

        let newstatus = "";
        let status = "";
        let msg = "";
        if (categorystatus[0]["status"] == 0) {
          newstatus = 1;
          status = "success";
          msg = "category Active successfully.";
        } else {
          newstatus = 0;
          status = "failed";
          msg = "category Delete successfully.";
        }
  
        await CategoryModel.findByIdAndUpdate(id, { status: newstatus });
  
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


module.exports={
    categoryRouter
}