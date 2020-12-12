const User = require('../models/user');
const {logger} = require('../helpers/logger');
const bricklink = require('../helpers/bricklink');

module.exports = async (req,res,next)=>{
    id = req.body._id ;
    res.setHeader('content-type', 'application/json');
    const user = await User.findOne({_id:id,setUpComplete:true},(err)=>{
        if(err){
            logger.error(`Finding user by id ${id} gave an error ${err}`);
        }
    });
    if(!user){
        logger.error(`No user was found by id ${id}`);
        res.send({success: false});
    }else{
        try{
            await bricklink.ordersAll(user,"",()=>{
                res.send({success: true});
            });
        }catch(err){
            res.send({success: false});
            return;
        }
    }
};