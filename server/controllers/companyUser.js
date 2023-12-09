import express from 'express';
import pkg from 'lodash';
const {get, merge} = pkg;
import {User, getUserById} from '../models/User.js';
import { createCompanyUser, getCompanyAllUsersByCompanyId, getCompaniesByUserId, deleteCompanyUserById } from '../models/CompanyUsers.js';
import { getCompanyById } from '../models/Company.js';
import { getRoleByName } from "../models/Role.js";

export const getCompanyUsersById = async(req, res) =>{
    const { id } = req.params;
    if (!id){
        return res.sendStatus(400)
    }
    const users = await getCompanyAllUsersByCompanyId(id);
    return res.status(200).json(users).end();
}
export const addUserToCompany = async(req, res) =>{

    const { invitedUserId } = req.params;
    const { company_id } = req.params;
    const id = req.userId
    const companyUser = await createCompanyUser({
        user: await getUserById(invitedUserId),
        company: await getCompanyById(company_id),
        roles: [{
            Role:  await getRoleByName('user'),
            updated_by: await getUserById(id)
        }],
        added_by: await getUserById(id)
    });
    await companyUser.save()
    return res.status(200).json(companyUser).end();
}
export const addUserToCompanyNoInvite = async(req, res) =>{
    try{
        const company_id = get(req, 'company._id');
        const id = get(req, 'identity._id');

        if (!company_id) {
            return res.sendStatus(400);
        }
        const companyUser = await createCompanyUser({
            user: id,
            company: company_id,
            roles: [{
                Role:  await getRoleByName('superadmin'),
                updated_by: id
            }],
            added_by: id
        });
        console.log(companyUser)
        return res.status(200).json(get(req, 'company')).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(500)
    }
}
export const deleteUserFromCompany = async(req, res) =>{
    const { company_id } = req.params;
    const id = req.userId
    
    const companyUser = await getCompaniesByUserId(id);
    for (var i = 0; i < companyUser.length; i++) {
        if (company_id[i].company == company_id){
            await deleteCompanyUserById(company_id)
            return res.sendStatus(200);
        }
    }
    return res.sendStatus(400);
}
