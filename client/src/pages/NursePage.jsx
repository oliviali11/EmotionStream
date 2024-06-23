// src/pages/NursePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import profileImage from '../assets/dummy450x450.jpg';
import PatientModal from '../components/PatientModal';

const NursePage = ({ negativeDetected, patientID }) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            const token = sessionStorage.getItem('accessToken');
            try {
                const response = await axios.get('http://localhost:8000/patients', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    const handleClick = (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedPatient(null);
    };

    return (
        <div className='ml-4'>
            <h2 className="text-2xl font-bold text-violet-500 mb-4">Welcome! Here are your patients:</h2>

            {negativeDetected ? (
                <div className="alert alert-info" role="alert">
                    Patient #{patientID} is experiencing negative emotions -- please provide assistance!
                </div>
            ) : (
                <p>No negative emotions detected -- patient is stable.</p>
            )}

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map((patient) => (
                    <div
                        key={patient._id}
                        className="flex items-center border p-4 rounded shadow cursor-pointer"
                        onClick={() => handleClick(patient)}
                    >
                        <img
                            src={profileImage}
                            alt="Patient"
                            className="w-24 h-24 rounded-full mr-4"
                        />
                        <h3 className="text-lg font-semibold">{patient.name}</h3>
                    </div>
                ))}
            </div>

            {showModal && selectedPatient && (
                <PatientModal patient={selectedPatient} handleClose={handleClose} />
            )}
        </div>
    );
};

export default NursePage;
