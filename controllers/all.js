const User = require('../models/user');
const {logger} = require('../helpers/logger');
const bricklink = require('../helpers/bricklink');
const TIMEOUT_RESTART = 20*100;
const {increaseApiCallAmount,hasUserExceededAPiAmount} = require('../helpers/ApiHelper');

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
            if(await hasUserExceededAPiAmount(id)){
                res.send({meta:{
                    code:429,
                    message:'User has exceeded the API limit of bricklink'
                }});
                return;
            }
            increaseApiCallAmount(id);
            let s1 = await bricklink.ordersAll(user);
            if(s1===false){
                logger.warn(`ordersAll was not successful for user ${user.email}, retrying in 20sec...`);
                s1 = timeout(await bricklink.ordersAll,TIMEOUT_RESTART,user);
                if(s1===false){      
                    res.send({success: false});
                    return;
                }else{
                    res.send({success: true});
                    return;
                }
            }
            if(await hasUserExceededAPiAmount(id)){
                res.send({meta:{
                    code:429,
                    message:'User has exceeded the API limit of bricklink'
                }});
                return;
            }
            increaseApiCallAmount(id);
            let s2 = await bricklink.inventoryAll(user);
            if(s2===false){
                logger.warn(`inventoryAll was not successful for user ${user.email}, retrying in 20sec...`);
                s2 = timeout(await bricklink.inventoryAll,TIMEOUT_RESTART,user);
                if(s2===false){
                    res.send({success: false});
                    return;
                }else{
                    res.send({success: true});
                    return;
                }
            }
        }catch(err){
            res.send({success: false});
            return;
        }
        res.send({success: true});
        
    }
};