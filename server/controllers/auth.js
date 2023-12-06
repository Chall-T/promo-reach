
import { createUser, getUserByEmail, getUserById } from "../models/User.js";
import { getRoleByName } from "../models/Role.js";
import { random, authentication, newSessionId } from "../helpers/index.js";
import * as dotenv from 'dotenv';
import merge from 'lodash';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { createSession, deleteSession } from "../models/Session.js";


export const register = async (req, res, next) => {
    try{
        const {email, password, name, lastName, terms} = req.body;

        if (!email || !password || !name){
            return res.status(400).json({message: "Missing data"}).end();
        }

        if (!terms) return res.status(400).json({message: "Accepting the terms is required!"})

        const existingUser = await getUserByEmail(email);
        if (existingUser){
            return res.status(400).json({message: "User exists", email: "Email address taken"}).end();
        }

        const salt = random();
        const user = await createUser({
            email,
            name,
            lastName,
            authentication:{
                salt,
                password: authentication(salt, password),
            },
            roles: [
                await getRoleByName('user')
            ]
        });
        next();
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
};


export const login = async(req, res) =>{
    try{
        const {email, password} = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
        const userAgent = req.get('User-Agent');
        if (!ip || !userAgent){
            return res.status(500).json({message: "Couldn't find ip or User-Agent"}).end();
        }

        if (!email || !password){
            return res.status(400).json({message: "Missing email or password"}).end();
        }
        var user = await getUserByEmail(email).select('+authentication.salt +authentication.password').populate('roles');
        
        if (!user){
            return res.status(400).json({message: "User does not exist"}).end();
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash){
            return res.sendStatus(403);
        }
        const sessionId = newSessionId()

        const session = await createSession({
            user,
            ipAddress: ip,
            userAgent,
            sessionId
        })
        const domain = process.env.DOMAIN || 'localhost';
        res.cookie('authToken', sessionId, { domain: domain, path: '/'});


        return res.status(200).json(user).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const logOut = async (req, res) => {
    let sessionToken = req.headers.authorization ? req.headers.authorization.split(" ")[1] : undefined || req.cookies['authToken'];
    await deleteSession(sessionToken)
    res.clearCookie("authToken");
    return res.sendStatus(200);
};