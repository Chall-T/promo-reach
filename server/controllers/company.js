import express from 'express';
import pkg from 'lodash';
const {get, merge} = pkg;
import { deleteCompanyById, getCompanyById, getCompanies, companyCreate } from '../models/Company.js'
import { addUserToCompanyNoInvite } from './companyUser.js';
import {User, getUserById, getAllJoinedCompaniesByUserId} from '../models/User.js';
import { addCompanyToUser } from '../models/User.js';


export const getCompanyInfo = async(req, res) =>{
    try{
        const id = get(req, 'identity._id');
        const company = await getCompanyById(id);

        return res.status(200).json(company);
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}
export const getAllJoinedCompanies = async(req, res) => {
    try{
        const id = get(req, 'identity._id');

        const companies = await getAllJoinedCompaniesByUserId(id);
        return res.status(200).json(companies);
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
        const id = get(req, 'identity._id');

        // const existingCompany = await getCompanyByName(name);
        // if (existingCompany){
        //     return res.status(400).json({message: "Company name is already taken"}).end();
        // }
        console.log(name)
        if (!name) return res.status(400);
        const company = await companyCreate({
            name,
            owner: id
        });
        await addCompanyToUser(company._id, id);

        merge(req, {company: company});

        return addUserToCompanyNoInvite(req, res);
        //return res.status(200).json(company).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}