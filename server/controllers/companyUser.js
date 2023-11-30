import express from 'express';
import {get, merge} from 'lodash';
import {User, getUserById} from '../models/User.js';
import { createCompanyUser, getCompanyAllUsersByCompanyId, getCompaniesByUserId, deleteCompanyUserById } from '../models/CompanyUsers.js';
import { getCompanyById } from '../models/Company.js';


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
        getUserById: await getUserById(invitedUserId),
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
