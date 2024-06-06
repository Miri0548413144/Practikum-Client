import logo from './logo.svg';
import './App.css';
import {getWorkers } from './service/workerServer';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import WorkersTable from './components/workers/workersTable';
import HomePage from './components/homePage';
import AddWorker from './components/workers/addWorker';
import { getRoles } from './service/roleServer';
import Roles from './components/roles/roles';
import Sidebar from './components/sidebar ';
function App() {
  const dispatch = useDispatch()
  return (
    <div >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/workersTable" element={<WorkersTable />} />
        <Route path="/addWorker" element={<AddWorker/>} />
        <Route path="/editWorker" element={<AddWorker/>} />
        <Route path="/addRole" element={<Roles/>} /> 
      </Routes>
      <Sidebar/>
    </div>
  );
}

export default App;
