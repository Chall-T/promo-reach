import express from 'express';
import pkg from 'lodash';
const {get, merge} = pkg;
import { deleteCompanyById, getCompanyById, getCompanies, companyCreate, getCompanyByName } from '../models/Company.js'
import {User, getUserById} from '../models/User.js';


export const getCompanyInfo = async(req, res) =>{
    try{
        const { id } = req.params;
        const company = await getCompanyById(id);

        return res.status(200).json(company);
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllCompanies = async(req, res) =>{
    try{
        const companies = await getCompanies();

        return res.status(200).json(companies);
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteCompany = async(req, res) =>{
    try{
        const { id } = req.params;

        const deletedCompany = await deleteCompanyById(id);

        return res.json(deletedCompany)
    }catch (error){
        console.log(error);
        return res.sendStatus(400)
    }
}

export const updateCompany = async(req, res) =>{
    try{
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.sendStatus(400);
        }
        const company = await getCompanyById(id);
        company.name = name;
        await company.save()
        return res.status(200).json(company).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400)
    }
}

export const createCompany =async (req, res) =>{
    try{
        const {name} = req.body;
        let token = req.headers["x-access-token"];
        const { id, exp } = jwt.decode(token)
        if (!id){
            return res.sendStatus(400);
        }
        const existingCompany = await getCompanyByName(name);
        if (existingCompany){
            return res.status(400).json({message: "Company name is already taken"}).end();
        }
        const user = await getUserById(id)
        const company = await companyCreate({
            name,
            owner: user
        });
        return res.status(200).json(company).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}