import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/config'
import {logout} from "../../store/authSlice"
import { useHistory } from 'react-router-dom'

function LogoutBtn() {
    const dispatch = useDispatch()
  return (
    <div>LogoutBtn</div>
  )
}

export default LogoutBtn