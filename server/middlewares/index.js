import express from 'express';
import {get, merge} from 'lodash';
import { getCompaniesByUserId } from '../models/CompanyUsers';


export const isAuthenticated = async(req, res, next) =>{
    try{
        let sessionToken = req.cookies['NEO-AUTH'] || req.headers.authorization.split(" ")[1];
        if (!sessionToken){
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser){
            return res.sendStatus(403);
        }
        merge(req, {identity: existingUser});

        return next();
    }catch (error){
        console.log(error);
        return res.sendStatus(500);
    }
}

export const isInCompany = async(req, res, next) =>{
    try{
        let token = req.headers["x-access-token"];
        const { companyId } = req.params;
        
        const { id, exp } = jwt.decode(token);
        const companies = await getCompaniesByUserId(id);

        for (let i = 0; i < companies.length; i++) {
            if (companyId == companies[i]._id){
                return next();
            }
        }
        return res.sendStatus(401);
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}