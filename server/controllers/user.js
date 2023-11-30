import express from 'express';

import { deleteUserById, getUserById, getUsers, userAcceptCompanyInvite, userSendCompanyInvite } from '../database/users';
import {get, merge} from 'lodash';
import { getCompaniesByUserId, getCompanyById } from '../models/Company';
import { addUserToCompany, deleteUserFromCompany } from './companyUser';


export const updateUser = async(req, res) =>{
    try{
        const { id } = req.params;
        const { username } = req.body;

        if (!username) {
            return res.sendStatus(400);
        }
        const user = await getUserById(id);
        user.username = username;
        await user.save()
        return res.status(200).json(user).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400)
    }
}

export const CompanyAcceptInvite = async(req, res) =>{
    try{
        const { company_id } = req.params;
        const id = req.userId

        if (!company_id) {
            return res.sendStatus(400);
        }
        const user = await getUserById(id);
        if (user.companies.includes(company_id)){
            return res.sendStatus(400);
        }
        for (var i = 0; i <= user.companies_invites.length; i++){
            if (user.companies_invites[i] == company_id ){
                user.companies.push(company_id);
                const company_invite_index = user.companies_invites.indexOf(id);
                user.companies_invites.splice(company_invite_index, 1);
                var user_updated = true;
                break;
            }
        }

        if (!user_updated) {
            return res.sendStatus(400);
        }

        await user.save()
        await addUserToCompany(req, res)
    }catch (error){
        console.log(error);
        return res.sendStatus(500)
    }
}

export const CompanyCreateInvite = async(req, res) =>{
    try{
        const { invitedUserId } = req.params;
        const { company_id } = req.body;

        const id = req.userId

        if (!company_id) {
            return res.sendStatus(400);
        }
        const invitedUser = await getUserById(invitedUserId);
        const user = await getUserById(id);
        const company = await getCompanyById(company_id);
        for (var i=0; i <= user.companies.length; i++){
            if (user.companies[i] == company.id){
                // check roles
            }
        }
        if (invitedUser.companies.includes(company_id)){
            return res.status(400).json({ message: "User already is in the company!" });
        }
        if (invitedUser.companies_invites.includes(company_id)){
            return res.status(200).json({ message: "User was already invited!" });
        }
        invitedUser.companies_invites.push(company_id)

        await invitedUser.save()
        return res.status(200).json(invitedUser).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const LeaveCompany = async(req, res) =>{
    try{
        const { company_id } = req.params;

        const id = req.userId

        if (!company_id) {
            return res.sendStatus(400);
        }
        const user = await getUserById(id);
        if (!user.companies.includes(company_id)){
            return res.sendStatus(400);
        }
        const company_index = user.companies.indexOf(company_id);
        user.companies.splice(company_index, 1);
        await user.save()
        await deleteUserFromCompany(req, res)
    }catch (error){
        console.log(error);
        return res.sendStatus(400)
    }
}
function remove_invites_from_user(user, company_id){
    if (user.companies_invites.includes(company_id)){
        const company_index = user.companies_invites.indexOf(company_id);
        user.companies_invites.splice(company_index, 1);
        remove_invites_from_user(user, company_id)
    }else{
        return true;
    }
}
export const RejectCompanyInvite = async(req, res) =>{
    try{
        const { company_id } = req.params;
        const id = req.userId

        if (!company_id) {
            return res.sendStatus(400);
        }
        const user = await getUserById(id);
        if (user.companies_invites.includes(company_id)){
            remove_invites_from_user(user, company_id)
        }else{
            return res.sendStatus(400);
        }
        
        await user.save()
        return res.status(200).json(user).end();
    }catch (error){
        console.log(error);
        return res.sendStatus(400)
    }
}