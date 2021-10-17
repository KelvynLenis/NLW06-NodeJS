import { Request, Response, NextFunction } from 'express';
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction){
    const admin = true;

    const authToken = request.headers.authorization;

    if(!authToken){
        return response.status(401).end();
    }

    const [, token] = authToken.split(" ");

    try{
        const { sub } = verify(token,"a12dba231b8a8276739813ca536ed0d3") as IPayload;
        
        request.user_id = sub;
        
        return next();
    }catch(err){
        return response.status(401).end();
    }
}