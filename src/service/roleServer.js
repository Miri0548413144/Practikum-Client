import axios from "axios";
import Swal from "sweetalert2";
import { ADD_ROLE, GET_ROLES } from "../store/action";
export function getRoles() {
    return dispatch => {
        axios.get("https://localhost:7059/api/Role")
            .then(x => {
                dispatch({ type: GET_ROLES, payload: x.data })
            })
            .catch(err => console.log(err))
    }
}
export function addRole(data, navigate) {
    return dispatch => {
        axios.post("https://localhost:7059/api/Role", data)
            .then(x => {
                dispatch({ type: ADD_ROLE, payload: x.data })
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "The role added successfuli!😀",
                    showConfirmButton: false,
                    timer: 1500
                });

                navigate('/addWorker');
            })
            .catch(err =>
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "The added failed, please try againe",
                    showConfirmButton: false,
                    timer: 1500
                })
            )
    }
}