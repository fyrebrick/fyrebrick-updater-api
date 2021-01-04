const {increaseApiCallAmount,hasUserExceededAPiAmount} = require('fyrebrick-helper').helpers.apiHelper;
const {User} = require('fyrebrick-helper').models;
const {bricklink} = require("fyrebrick-helper").helpers;
const {logger} = require('fyrebrick-helper').helpers;

module.exports = async (req,res,next)=>{
    id = req.body._id;
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
            if(await hasUserExceededAPiAmount(id)){
                res.send({meta:{
                    code:429,
                    message:'User has exceeded the API limit of bricklink'
                }});
                return;
            }
            increaseApiCallAmount(id);
            await bricklink.order.all(user).then(async(s)=>{
                if(s===false){
                    logger.warn(`ordersAll was not successful for user ${user.email}, retrying in 20sec...`);
                let s = timeout(await bricklink.order.all,TIMEOUT_RESTART,user);
                if(s===false){
                    res.send({success:false});
                    return;
                }else{
                    res.send({success:true});
                    return;
                }
                }else{
                    res.send({success: true});
                    return;
                }
            });
        }catch(err){
            res.send({success: false});
            return;
        }
    }
};