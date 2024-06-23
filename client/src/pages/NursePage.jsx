// src/pages/NursePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import profileImage from '../assets/dummy450x450.jpg';
import PatientModal from '../components/PatientModal';
import './styling/nurse.css';  // If you still need other styles, keep this import

const NursePage = ({ negativeDetected, patientID }) => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [enlargedBox, setEnlargedBox] = useState(null);

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
        setEnlargedBox(patient._id);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedPatient(null);
        setEnlargedBox(null);
    };

    return (
        <div className='ml-4'>
            <h2 className="text-4xl font-bold text-white mb-4 text-center mt-12">Welcome! Here are your patients:</h2>

            {negativeDetected ? (
                <div className="alert alert-info" role="alert">
                    Patient #{patientID} is experiencing negative emotions -- please provide assistance!
                </div>
            ) : (
                <p className='text-2xl text-center'>No negative emotions detected -- patients are stable. Click on patient cards for their history.</p>
            )}

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mr-4">
                {patients.map((patient) => (
                    <div
                        key={patient._id}
                        className={`flex items-center border p-4 rounded shadow cursor-pointer transform transition-transform duration-300 bg-white ${enlargedBox === patient._id ? 'scale-110 shadow-lg' : ''}`}
                        onClick={() => handleClick(patient)}
                    >
                        <img
                            src={profileImage}
                            alt="Patient"
                            className="w-24 h-24 rounded-lg mr-4"
                        />
                        <h3 className="text-xl font-semibold">{patient.name}</h3>
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

/*// src/pages/NursePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import profileImage from '../assets/dummy450x450.jpg';
import PatientModal from '../components/PatientModal';
import './styling/nurse.css'

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
*/