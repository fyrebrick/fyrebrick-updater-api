const User = require('../models/user');
const {logger} = require('../helpers/logger');
const bricklink = require('../helpers/bricklink');
/**
 * in the body should be an ID or id, or _id with the database user id
 */
module.exports = async (req,res,next)=>{
    id = req.body._id || req.body.ID || req.body.id;
    const user = await User.findOne({_id:id,setUpComplete:true},(err)=>{
        if(err){
            logger.error(`Finding user by id ${id} gave an error ${err}`);
        }
    });
    if(!user){
        logger.error(`No user was found by id ${id}`);
    }else{
        req.setHeader('content-type', 'application/json');
        try{
            await bricklink.ordersAll(user,"?direction=in&status=pending,updated,processing,ready,paid,packed");
        }catch(err){
            req.send({success: false});
            return;
        }
        req.send({success: true});
        
    }
};