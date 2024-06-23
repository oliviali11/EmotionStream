import React, { useEffect, useState } from 'react';
import axios from 'axios';
import profileImage from '../assets/dummy450x450.jpg';
import PatientModal from '../components/PatientModal';

const NursePage = ({ negativeDetected, patientID }) => {
    const [patients, setPatients] = useState([]);
    //const [alertPatients, setAlertPatients] = useState([]);
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

        const fetchAlertPatients = async () => {
            const token = sessionStorage.getItem('accessToken');
            try {
                const response = await axios.get('http://localhost:8000/patients/alerts', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAlertPatients(response.data);
            } catch (error) {
                console.error('Error fetching alert patients:', error);
            }
        };

        fetchPatients();
        //fetchAlertPatients();
    }, []);

    const handleClick = (patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedPatient(null);
    };

    // Filter patients with alerts
    const alertPatients = patients.filter(patient => patient.status);
    // Filter patients without alerts
    const nonAlertPatients = patients.filter(patient => !patient.status);

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

          {alertPatients.length > 0 && (
              <div>
                  <h3 className="text-xl font-semibold text-red-500 mb-4">Patients with Alerts:</h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {alertPatients.map((patient) => (
                          <div
                              key={patient._id}  // Ensure the key is unique
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
              </div>
          )}

          {nonAlertPatients.length > 0 && (
              <div>
                  <h3 className="text-xl font-semibold text-green-500 mb-4">Patients without Alerts:</h3>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {nonAlertPatients.map((patient) => (
                          <div
                              key={patient._id}  // Ensure the key is unique
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
              </div>
          )}

          {showModal && selectedPatient && (
              <PatientModal patient={selectedPatient} handleClose={handleClose} />
          )}
      </div>
  );
};

export default NursePage;
