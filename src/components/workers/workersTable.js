import React, { useEffect, useState } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, Typography, IconButton } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, AddCircle as AddCircleIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteWorker, getWorker } from '../../service/workerServer';
import ExcelJS from 'exceljs';

export default function WorkersTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [showAddWorkerForm, setShowAddWorkerForm] = useState(false);
    const workers = useSelector(state => state.workers);
    const roles = useSelector(state => state.roles);
    const handleRowClick = (index) => {
        setExpandedRow(index === expandedRow ? null : index);
    };
    const handleDeleteWorker = (id) => {
        dispatch(deleteWorker(id, navigate));
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Workers');

        worksheet.addRow(['First Name', 'Last Name', 'TZ', 'Start Date', 'Roles']);

        workers.forEach(worker => {
            const roles1 = worker.roles.map(rolep => {
                const role = roles.find(role => role.id === rolep.roleId);
                return role ? role.name : 'Unknown Role';
            }).join(', ');

            worksheet.addRow([worker.firstName, worker.lastName, worker.tz, worker.startDate, roles1]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workers.xlsx';
        a.click();
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredWorkers = workers.filter(worker =>
        worker.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        worker.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
        worker.tz.toLowerCase().includes(searchText.toLowerCase()) ||
        worker.startDate.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="all background-img tab">
        <div className='all '>
            <div className='toflex'>
                <h1 className='col'>Worker's Table</h1>
                <textarea className='text'
                    placeholder="Search"
                    variant="outlined"
                    value={searchText}
                    onChange={handleSearchChange}
                /></div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Workers table">
                    <TableHead >
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>TZ</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <IconButton component={Link} to="/addWorker" size="small">
                                    <AddCircleIcon />
                                </IconButton>
                                {showAddWorkerForm}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredWorkers.map((worker, index) => (
                            <React.Fragment key={worker.id}>
                                <TableRow onClick={() => handleRowClick(index)}>
                                    <TableCell>{worker.firstName}</TableCell>
                                    <TableCell>{worker.lastName}</TableCell>
                                    <TableCell>{worker.tz}</TableCell>
                                    <TableCell>{worker.startDate}</TableCell>
                                    <TableCell>
                                        <IconButton size="small">
                                            {expandedRow === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => handleDeleteWorker(worker.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => { navigate("/editWorker", { state: worker }) }}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                        <Collapse in={expandedRow === index}>
                                            <div className='toflex'>
                                                <div>
                                                    <Typography variant="body2" gutterBottom>
                                                        <p> First Name: {worker.firstName}</p>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom>
                                                        <p>Last Name: {worker.lastName}</p>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom>
                                                        <p> TZ: {worker.tz}</p>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom>
                                                        <p> Birth Date: {worker.birthDate}</p>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom>
                                                        <p>Start Date: {worker.startDate}</p>
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom>
                                                        <p> My Gender: {worker.gender}</p>
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="body2" gutterBottom>
                                                        <p>Roles:</p>
                                                    </Typography>
                                                    <ul>
                                                        {worker.roles.map((rolep, index) => {
                                                            const role = roles.find(role => role.id === rolep.roleId);
                                                            return <li key={index}>{role ? role.name : 'Unknown Role'}</li>;
                                                        })}
                                                    </ul></div>
                                                <Typography variant="body2" gutterBottom>
                                                    <img src={worker.imageURL} alt={`Image of ${worker.firstName} ${worker.lastName}`} style={{ width: '50%', height: 'auto' }} />
                                                </Typography>
                                            </div>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br></br>
            <button className='btn' onClick={exportToExcel}>Export to Excel</button>
        </div></div>
    );
}
