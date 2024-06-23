import React from 'react'

const NursePage = ({ negativeDetected }) => {
  return (
    <>
    <h1>Patients</h1>
    {negativeDetected ? (
        <div className="alert alert-info" role="alert">
          Predictions received!
          {/* <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>{prediction}</li>
            ))}
          </ul> */}
        </div>
      ) : (
        <p>No predictions received yet.</p>
      )}
    </>
  )
}

export default NursePage