import React from 'react'

const AboutPage = () => {
  return (
    // <div className='ml-4'>
    // <h2 className="text-2xl font-bold text-violet-500">About Emotion Stream</h2>
    // </div>
    <div className='ml-4'>
    <h2 className="text-2xl font-bold text-violet-500">
  About {' '}
  <span style={{ fontStyle: 'italic' }}>Emotion Stream</span>
</h2>
    <p style={{ marginTop: '1.5rem' }}>Real time live stream web application that aids in the efficient detection of negative emotions/anomalities in the elderly or nursing home patients built on the Hume AI model, providing synchronized alerts to nurses for expedited notification of emotional state for every patient</p>
</div>

  )
}

export default AboutPage