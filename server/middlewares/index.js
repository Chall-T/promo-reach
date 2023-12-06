import express from 'express';
import pkg from 'lodash';
const {get, merge} = pkg;
import { getCompaniesByUserId } from '../models/CompanyUsers.js';
import { getUserBySessionToken } from '../models/Session.js'


export const isAuthenticated = async(req, res, next) =>{
    try{
        const sessionToken = req.headers.authorization ? req.headers.authorization.split(" ")[1] : undefined || req.cookies['authToken'];
        if (!sessionToken){
            return res.status(401).json({message: "Missing SessionId!"}).end();
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser){
            return res.status(403).json({message: "Invalid SessionId!"}).end();
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
        const currentUserId = get(req, 'identity._id');
        const { companyId } = req.params;
        
        if (!currentUserId){
            return res.sendStatus(403);
        }
        const companies = await getCompaniesByUserId(currentUserId);

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