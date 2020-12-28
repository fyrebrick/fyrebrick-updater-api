const {Inventory} = require('fyrebrick-helper').models;
const bricklinkPlus = require('bricklink-plus');
const {increaseApiCallAmount,hasUserExceededAPiAmount} = require('fyrebrick-helper').helpers.apiHelper;
const {User} = require('fyrebrick-helper').models;
module.exports = {
    new_or_used:async (req,res,next)=>{
        if(await hasUserExceededAPiAmount(req.body._id)){
            res.send({meta:{
                code:429,
                message:'User has exceeded the API limit of bricklink'
            }});
            return;
        }
        await Inventory.updateOne({inventory_id:req.body.inventory_id,CONSUMER_KEY:req.body.CONSUMER_KEY},{new_or_used:req.body.new_or_used});
        res.send(await updateInventory(req.body._id,req.body.inventory_id,{new_or_used:req.body.new_or_used}));
    },
    remarks: async(req,res,next)=>{
        if(await hasUserExceededAPiAmount(req.body._id)){
            res.send({meta:{
                code:429,
                message:'User has exceeded the API limit of bricklink'
            }});
            return;
        }
        await Inventory.updateOne({inventory_id:req.body.inventory_id,CONSUMER_KEY:req.body.CONSUMER_KEY},{remarks:req.body.remarks});
        res.send(await updateInventory(req.body._id,req.body.inventory_id,{remarks:req.body.remarks}));
    },
    quantity:async (req,res,next)=>{
        if(await hasUserExceededAPiAmount(req.body._id)){
            res.send({meta:{
                code:429,
                message:'User has exceeded the API limit of bricklink'
            }});
            return;
        }
        await Inventory.updateOne({inventory_id:req.body.inventory_id,CONSUMER_KEY:req.body.CONSUMER_KEY},{quantity:req.body.quantity});
        res.send(await updateInventory(req.body._id,req.body.inventory_id,{quantity:req.body.quantity}));
    }
}

const updateInventory = async (_id,inventory_id,body) =>{
    const user = await User.findOne({_id:_id});
    increaseApiCallAmount(_id);
     return await bricklinkPlus.api.inventory.updateInventory(inventory_id,body,{
        CONSUMER_KEY:user.CONSUMER_KEY,
        CONSUMER_SECRET:user.CONSUMER_SECRET,
        TOKEN_VALUE:user.TOKEN_VALUE,
        TOKEN_SECRET:user.TOKEN_SECRET
    });
};