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
        const { company_id } = req.params;
        if (company_id==='undefined' || !company_id){
            return res.status(400).json({message: "Missing company id param!"});
        }
        if (!currentUserId){
            return res.sendStatus(500);
        }
        const companies = await getCompaniesByUserId(currentUserId);
        for (let i = 0; i < companies.length; i++) {
            if (company_id == companies[i].company){
                return next();
            }
        }
        return res.status(403).json({message: "Is not in company!"});
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}