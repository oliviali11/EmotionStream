import React from 'react'
import profileImage from '../assets/dummy450x450.jpg'

const NursePage = ({ negativeDetected, patientID }) => {
  const handleClick = () => {
    // Handle click event here, e.g., navigate to a different page
    window.location.href = '/patient-stream';
  };
  return (
    <>
    <h1>Patients</h1>
    {negativeDetected ? (
        <div className="alert alert-info" role="alert">
          Patient #{patientID} is experiencing negative emotions -- please provide assistance!
          {/* <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>{prediction}</li>
            ))}
          </ul> */}
        </div>
      ) : (
        <p>No negative emotions detected -- patient is stable. </p>
      )}
       <img
      src={profileImage}
      alt="Description of your image"
      onClick={handleClick}
      style={{ width: "300px",
        height: "300px"
       }} // Optional: Change cursor to pointer on hover
    />
    </>
  )
}

export default NursePage