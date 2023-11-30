
import { createUser, getUserByEmail, getUserById } from "../models/User.js";
import { getRoleByName } from "../models/Role.js";
import { random, authentication } from "../helpers/index.js";
import { getRefreshToken, deleteRefreshToken, createRefreshToken } from "../models/RefreshToken.js";
import * as dotenv from 'dotenv';
import merge from 'lodash';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
    try{
        const {email, password, name} = req.body;

        if (!email || !password || !name){
            return res.status(400).json({message: "Missing data"}).end();
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser){
            return res.status(400).json({message: "User exists"}).end();
        }

        const salt = random();
        const user = await createUser({
            email,
            name,
            authentication:{
                salt,
                password: authentication(salt, password),
            },
            roles: [
                await getRoleByName('user')
            ]
        });
        return res.status(200).json(user).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
};


export const login = async(req, res) =>{
    try{
        const {email, password} = req.body;

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
        var token = jwt.sign(
            { id: user.id },
            process.env.SECRET,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 3600, // 1 hour
        });
        const refreshToken = jwt.sign(
            { id: user.id }, 
            process.env.SECRET, 
            { 
                expiresIn: 259200 // 3 days
        });
        await createRefreshToken(refreshToken);
        var authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }
        // const salt = random();
        // user.authentication.sessionToken = authentication(salt, user._id.toString())
        // await user.save();
        
        // const domain = process.env.DOMAIN || 'localhost';
        // res.cookie('NEO-AUTH', user.authentication.sessionToken, { domain: domain, path: '/'})
        
        //const companies = await getCompaniesByUserId(user.id)
        //user = Object.assign({}, user, {accessToken: token, authorities: authorities});
        // user.authorities = authorities
        // user.accessToken = token
        var userWithToken = JSON.parse(JSON.stringify(user));
        userWithToken.authorities = authorities;
        userWithToken.accessToken = token;
        userWithToken.refreshToken = refreshToken;

        console.log(userWithToken)
        return res.status(200).json(userWithToken).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const refreshToken = async (req, res) => {
    try{
        const {refreshToken} = req.body;

        if (!refreshToken){
            return res.status(400).json({message: "Refresh Token is required!"}).end();
        }
        const refreshTokenDB = await getRefreshToken(refreshToken);
        if (!refreshTokenDB){
            return res.status(400).json({message: "Refresh token is not in database!"}).end();
        }
        const { id, exp } = jwt.decode(refreshToken)
        const expirationDatetimeInSeconds = exp * 1000;

        if (Date.now() >= expirationDatetimeInSeconds){
            return res.status(400).json({message: "Refresh token was expired. Please make a new signin request"}).end();
        }

        const user = await getUserById(id)
        if (!user){
            return res.status(500).json({message: "User id not found!"}).end();
        }

        var newToken = jwt.sign(
            { id: user.id },
            process.env.SECRET,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 3600, // 1 hour
        });
        
        return res.status(200).json({
            accessToken: newToken,
            refreshToken: refreshToken
        }).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
};