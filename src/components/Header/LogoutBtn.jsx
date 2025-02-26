import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/config'
import {logout} from "../../store/authSlice"
import { useHistory } from 'react-router-dom'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
      authService.logout().then().catch((error) => {
        dispatch(logout())
      })
      
    }
  return (
    <button onClick={logoutHandler} 
    className="btn btn-danger inline-block px-6 py-2 duration-200 hover:bg-blue-200">Logout</button>
  )
}

export default LogoutBtn