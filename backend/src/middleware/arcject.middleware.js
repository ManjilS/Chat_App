import aj from "../lib/arcject.js";
import { isSpoofedBot } from "@arcjet/inspect";
import { ENV } from "../lib/env.js";

export const arcjectProtection = async(req, res, next) => {
    if (ENV.NODE_ENV !== "production") {
        return next();
    }
    try{
        const decision = await aj.protect(req)
        if (decision.isDenied) {
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message:"Too many requests, please try again later"});
            
            
            }else if ( decision.reason.isBot()) {
                 return res.status(403).json({message:"Forbidden, bot detected"});
            }else{
                return res.status(403).json({message:"Forbidden, request denied"});
            }
        }
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({error:"Spoofed bot detected" , message:"Malicious bot detected"});
        }
        next();
    } catch(err) {
        console.log("Arcject Protection error :",err); 
        next();

    }
}  