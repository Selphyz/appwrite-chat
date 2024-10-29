import React, {useContext, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {account} from "../appWriteConfig.js";
import {ID} from "appwrite";

const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const getUserOnLoad = async () => {
        try{
            let accountDetails = await account.get();
            setUser(accountDetails)
        }catch(error){
            console.log(error)
        }
        setLoading(false)
    }

    const handleUserLogin = async (e, credentials) => {
        e.preventDefault()
        console.log('CREDS:', credentials)

        try{
            await account.createEmailPasswordSession(credentials.email, credentials.password)
            let accountDetails = await account.get();
            setUser(accountDetails)
            navigate('/')
        }catch(error){
            console.error(error)
        }
    }

    const handleLogout = async () => {
        await account.deleteSession('current');
        setUser(null)
    }

    const handleRegister = async (e, credentials) => {
        e.preventDefault()
        console.log('Handle Register triggered!', credentials)

        if(credentials.password !== credentials.password2){
            alert('Passwords did not match!')
            return
        }

        try{

            let response = await account.create(
                ID.unique(), credentials.email,
                credentials.password, credentials.name);
            console.log('User registered!', response)

            await account.createEmailPasswordSession(credentials.email, credentials.password)
            let accountDetails = await account.get();
            setUser(accountDetails)
            navigate('/')
        }catch(error){
            console.error(error)
        }
    }

    const contextData = {
        user,
        handleUserLogin,
        handleLogout,
        handleRegister
    }
    useEffect(() => {
        getUserOnLoad();
    }, []);
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>loading</p> : children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {return useContext(AuthContext)};