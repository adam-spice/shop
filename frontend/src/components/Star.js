import React from 'react'

const Star = ({ value, starNumber, color }) => {
  return (
    <span className='star'>
      <i
        style={{ color }}
        className={
          value >= starNumber
            ? 'fas fa-star'
            : value >= starNumber - 0.5
            ? 'fas fa-star-half-alt'
            : 'far fa-star'
        }
      />
    </span>
  )
}

export default Star
