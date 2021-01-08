const {increaseApiCallAmount,hasUserExceededAPiAmount} = require('fyrebrick-helper').helpers.apiHelper;
const {User} = require('fyrebrick-helper').models;
const {bricklink} = require("fyrebrick-helper").helpers;
const {logger} = require('fyrebrick-helper').helpers;
const superagent = require('superagent');
const TIMEOUT_RESTART = 20*100;

module.exports = async (req,res,next)=>{
    res.setHeader('content-type', 'application/json');
    
    console.log('jup');
    const status = await doAll(req);
    res.send({success: true});
};

const doAll = (req) => {
    let s1,s2 = false;
    return new Promise(async (resolve,reject)=>{
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
                await bricklink.order.all(user);
                if(await hasUserExceededAPiAmount(id)){
                    res.send({meta:{
                        code:429,
                        message:'User has exceeded the API limit of bricklink'
                    }});
                    return;
                }
                increaseApiCallAmount(id);
                await bricklink.inventory.all(user);
            }catch(err){
                reject(err);
                return;
            }
            resolve(user);
        }
    })
}