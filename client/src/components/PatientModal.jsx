import React from 'react';

const PatientModal = ({ patient, handleClose }) => {
    console.log(patient.status);

    // Determine the background color based on the patient's status
    const backgroundColor = patient.status ? 'bg-red-500' : 'bg-white';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`p-6 rounded shadow-lg relative ${backgroundColor}`} style={{ width: '36rem', height: '36rem' }}>
                <button className="absolute top-2 right-2 text-xl" onClick={handleClose}>
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{patient.name}</h2>
                <p><strong>Birth Date:</strong> {patient.birthdate}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Room Number:</strong> {patient.room}</p>
                <br />
                <p><strong>Past Incidents:</strong></p>
                <ul className="list-disc ml-8">
                    {patient.attacks.slice(0).reverse().slice(0, 14).map((attack, index) => (
                        <li key={index}>{attack}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PatientModal;
