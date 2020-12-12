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
            let s = await bricklink.ordersAll(user);
            if(s===false){
                logger.warn(`ordersAll was not successful for user ${user.email}, retrying in 20sec...`);
                s = timeout(await bricklink.ordersAll,TIMEOUT_RESTART,user);
                if(s===false){
                    res.send({success:false});
                    return;
                }else{
                    res.send({success:true});
                    return;
                }
            }else{
                res.send({success:true});
                return;
            }
        }catch(err){
            res.send({success: false});
            return;
        }
    }
};