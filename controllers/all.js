const User = require('../models/user');
const {logger} = require('../helpers/logger');
const bricklink = require('../helpers/bricklink');

module.exports = async (req,res,next)=>{
    res.setHeader('content-type', 'application/json');
    id = req.body._id;
    const user = await User.findOne({_id:id,setUpComplete:true},(err)=>{
        if(err){
            logger.error(`Finding user by id ${id} gave an error ${err}`);
        }
    });
    if(!user){
        logger.error(`No user was found by id ${id}`);
        res.send({success:false});
    }else{
        try{
            const shouldBeTwo = 0;
            await bricklink.ordersAll(user);
            await bricklink.inventoryAll(user);
        }catch(err){
            res.send({success: false});
            return;
        }
        res.send({success: true});
        
    }
};