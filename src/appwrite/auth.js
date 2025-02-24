import conf from "../conf/conf.js";
import {Client,Account,ID} from "appwrite";

export class AuthService {
    client = new Client();
    account ;
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }
    async createAccount({email, password,name}) {
        try{
            const userAcount = await this.account.create(ID.unique() ,email, password, name);
            if(userAcount){
                //call another method to create user profile
                return this.login({email, password});
                
            }
            else{
                return userAcount;
            }

        }catch(e){
            throw e;
        }
    }
    async login({email, password}) {
        try{
            //https://appwrite.io/docs/products/auth/email-password // see the methods from documetation
            return await this.account.createEmailSession(email,password);
        }catch(e){ 
            throw e;
        }
    }
    async getCurrentUser() {
        try{
            return await this.account.get();
        }catch(e){
            throw e;
        }
        return null;
    }
    async logout() {
        try{
            return await this.account.deleteSessions();
        }catch(e){
            throw e;
        }
    }

}

const authService = new AuthService();

export default authService;