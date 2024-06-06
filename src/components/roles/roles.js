import axios from "axios"
import { useForm } from "react-hook-form"
import { useEffect, useState } from 'react';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useDispatch, useSelector } from "react-redux";
import { FormControl, Input, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addRole } from "../../service/roleServer";
import Swal from "sweetalert2";
const schema = yup
    .object({
        name: yup.string().required("שדה חובה")
    })
    .required()


export default function Roles() {
    const roles = useSelector(state => state.roles)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors }, control
    } = useForm({
        resolver: yupResolver(schema),
    })
    const roleSet = new Set();
    roles.forEach(role => {
        if (!roleSet.has(role.name))
            roleSet.add(role.name);
    });
    const onSubmit = (data) => {
        console.log("data", roleSet)
        if (roleSet.has(data.name)) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "The role are exist",
                showConfirmButton: false,
                timer: 1500
            })
            throw new Error("The role are exist");
        }
        dispatch(addRole(data, navigate))
    }

    return <>
        <div className="all background-img add">
            <div className='add-form'>
                <div className='form role'>
                    <div className="formm ro">
                        <h1>Add Role</h1>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, maxWidth: 185 }}>
                                <InputLabel id="demo-simple-input-standard-label"> add role </InputLabel>
                                <Input {...register("name")} />
                                <p>{errors.name?.message}</p>
                            </FormControl>
                            <br />
                            <input className='btn' type="submit" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
}