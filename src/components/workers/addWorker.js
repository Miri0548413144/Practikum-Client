import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addWorker, editWorker } from '../../service/workerServer';
import { FormControl, Input, InputLabel, Button, IconButton, Stack, FormControlLabel, Checkbox, MenuItem, FormLabel, FormHelperText, Select, RadioGroup, Radio, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import moment from 'moment';
import { addRole } from '../../service/roleServer';

const schema = yup.object().shape({
    firstName: yup.string().required('This field is required'),
    lastName: yup.string().required('This field is required'),
    tz: yup.string().required('This field is required'),
    startDate: yup.string().required('This field is required'),
    birthDate: yup.string().required('This field is required'),
    myGender: yup.number().required('Please select a gender').oneOf([0, 1, 2], 'Please select a valid gender'),
    active: yup.boolean(),
    imageURL: yup.string().required('This field is required'),
    roles: yup.array().of(
        yup.object().shape({
            isManagement: yup.boolean(),
            enteringDate: yup.string(),
            roleId: yup.number(),
        })
    ),
});

export default function AddWorker() {
    const { state } = useLocation();
    const roles = useSelector(state => state.roles);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm({
        resolver: yupResolver(schema),
        defaultValues: state
    });
    


    const [gender, setGender] = useState(state?.myGender || '');
    
    useEffect(() => {
        if (state) {
            Object.keys(state).forEach(key => {
                if (key === "startDate" || key === "birthDate") {
                    setValue(key, moment(state[key]).format('YYYY-MM-DD'));
                } else if (key === "roles") {
                    state.roles.forEach((role, index) => {
                        setValue(`roles[${index}].enteringDate`, moment(role.enteringDate).format('YYYY-MM-DD'));
                        setValue(`roles[${index}].roleId`, role.roleId || '');
                        setValue(`roles[${index}].isManagement`, role.isManagement.toString());
                    });
                } else {
                    setValue(key, state[key]);
                }
            });
        }
    }, [state, setValue]);

    const onSubmit = (data) => {
        let valid = true;
        for (let i = 0; i < data.roles.length; i++) {
            if (new Date(data.roles[i].enteringDate) < new Date(data.startDate)) {
                valid = false;
                break;
            }
        }
        if (!valid) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Entering day is not valid!",
                showConfirmButton: false,
                timer: 1500
            })
            throw new Error("Entering day is not valid");
        }
        const roleIdSet = new Set();
        let hasDuplicates = false;

        data.roles.forEach(role => {
            if (roleIdSet.has(role.roleId)) {
                hasDuplicates = true;
            } else {
                roleIdSet.add(role.roleId);
            }
        });
        if (hasDuplicates) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "There are duplicates in the list of roles",
                showConfirmButton: false,
                timer: 1500
            })
            throw new Error("There are duplicates in the list of roles");
        }

        else {
            if (state) {
                data["id"] = state.id;
                data["active"] = true;
                dispatch(editWorker({ ...data }, navigate));
            }
            else {
                dispatch(addWorker({ ...data }, navigate));
            }
        }
    };

    const { fields: fieldsRoles, append: appendRoles, remove: removeRoles } = useFieldArray({ control, name: 'roles' });

    return (
        <div className="all background-img add">
            <div className='add-form'>
                <div className='form'>
            <form onSubmit={handleSubmit(onSubmit)} className='formm'>
                <h1>New Worker</h1>
                <Stack spacing={2}>
                    <FormControl variant="standard">
                        <InputLabel htmlFor="first-name">First Name</InputLabel>
                        <Input id="first-name" {...register('firstName')} />
                        <p>{errors.firstName?.message}</p>
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel htmlFor="last-name">Last Name</InputLabel>
                        <Input id="last-name" {...register('lastName')} />
                        <p>{errors.lastName?.message}</p>
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel htmlFor="tz">ID</InputLabel>
                        <Input id="tz" {...register('tz')} />
                        <p>{errors.tz?.message}</p>
                    </FormControl>
                    <FormControl variant="standard">
                        <p>Start Date</p>
                        <Input id="start-date" type="date" {...register('startDate')} />
                        <p>{errors.startDate?.message}</p>
                    </FormControl>
                    <FormControl variant="standard">
                        <p>Birth Date</p>
                        <Input id="birth-date" type="date" {...register('birthDate')} />
                        <p>{errors.birthDate?.message}</p>
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel htmlFor="image-url">Image URL</InputLabel>
                        <Input id="image-url" {...register('imageURL')} />
                        <p>{errors.imageURL?.message}</p>
                    </FormControl>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Gender</FormLabel>

                        <RadioGroup
                            aria-label="gender"
                            name="myGender"
                            defaultValue={state?.myGender || ""}
                            value={gender}
                            onChange={(e) => {
                                setGender(e.target.value);
                                setValue('myGender', e.target.value);
                            }}
                        >
                            <FormControlLabel value={1} control={<Radio />} label="Male" />
                            <FormControlLabel value={2} control={<Radio />} label="Female" />
                            <FormControlLabel value={3} control={<Radio />} label="Other" />
                        </RadioGroup>

                        <FormHelperText>{errors.myGender?.message}</FormHelperText>
                    </FormControl>
                    {fieldsRoles?.map((role, index) => (
                        <div key={index}>
                            <FormControl variant="standard">
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={watch(`roles.${index}.isManagement`)}
                                        onChange={(e) => setValue(`roles.${index}.isManagement`, e.target.checked)}
                                    />
                                    }
                                    label="Is Manager"
                                />
                                <p>{errors.roles?.[index]?.isManagement?.message}</p>
                            </FormControl>
                        
                                <br></br>
                            <FormControl variant="standard">
                                <p htmlFor={`entering-date-${index}`}>Entering Date</p>
                                <Input id={`entering-date-${index}`} type="date" {...register(`roles.${index}.enteringDate`)} />
                                <p>{errors.roles?.[index]?.enteringDate?.message}</p>
                            </FormControl>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 185 }}>
                                <InputLabel htmlFor={`role-id-${index}`}>Role</InputLabel>
                                <Select
                                    value={watch(`roles.${index}.roleId`) || state?.roles[index]?.roleId || ""}
                                    onChange={(e) => setValue(`roles.${index}.roleId`, e.target.value)}
                                    label="Role"
                                >
                                    <MenuItem value="">
                                        <em>Select Role</em>
                                    </MenuItem>
                                    {roles?.map((role) => (
                                        <MenuItem key={role.id} value={role.id}> {role?.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <IconButton onClick={() => removeRoles(index)}>
                                <DeleteForever />
                            </IconButton>
                        </div>
                    ))}
                </Stack>
                <Button className='btn' variant="contained" onClick={() => appendRoles({ isManagement: false, enteringDate: '', roleId: '' })}>Add Role</Button>
                <br />
                <Button className='btn' type="submit" variant="contained">Submit</Button>
            </form>
            </div>
            </div>
        </div>
    )}
