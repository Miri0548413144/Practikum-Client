import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import * as Actions from '../store/action'
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import { useEffect } from "react"
import {  getWorkers } from "../service/workerServer"
import { getRoles } from "../service/roleServer"
export default function Sidebar () {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getWorkers())
        dispatch(getRoles())
    }, [])
    return <nav class="sidebar">
          <div className="my-img"></div>
    <ul class="sidebar-list">
        <li class="sidebar-item">
            <Link to="/homePage">Home</Link>
        </li>
        <li class="sidebar-item">
            <Link to="/workersTable">Workers Table</Link>
        </li>
        <li class="sidebar-item">
            <Link to="/addWorker">Add Worker</Link>
        </li>
        <li class="sidebar-item">
            <Link to="/addRole">Add Role</Link>
        </li>
    </ul>
</nav>

}