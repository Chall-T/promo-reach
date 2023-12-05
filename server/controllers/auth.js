
import { createUser, getUserByEmail, getUserById } from "../models/User.js";
import { getRoleByName } from "../models/Role.js";
import { random, authentication } from "../helpers/index.js";
import { getRefreshToken, deleteRefreshToken, createRefreshToken } from "../models/RefreshToken.js";
import * as dotenv from 'dotenv';
import merge from 'lodash';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';


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
                expiresIn: 5, // 1 hour
        });
        const refreshToken = jwt.sign(
            { id: user.id }, 
            process.env.SECRET, 
            { 
                expiresIn: 604800 // 7 days
            }
        );

        const serializedAccessToken = serialize('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });
        const serializedRefreshToken = serialize('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });
        
        res.cookie('accessToken', token);
        res.cookie('refreshToken', refreshToken);

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
        return res.status(200).json(userWithToken).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const refreshToken = async (req, res) => {
    try{
        const {refreshToken} = req.body || req.cookies['refreshToken'];

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
        const serializedAccessToken = serialize('accessToken', newToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });
        res.setHeader('Set-Cookie', serializedAccessToken);
        return res.status(200).json({
            accessToken: newToken,
            refreshToken: refreshToken
        }).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
};

export const logOut = async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
};