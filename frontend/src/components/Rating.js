import React from 'react'
import Star from './Star'
import PropTypes from 'prop-types'

const Rating = ({ value, text, color }) => {
  return (
    <div className='rating'>
      <Star value={value} starNumber={1} color={color} />
      <Star value={value} starNumber={2} color={color} />
      <Star value={value} starNumber={3} color={color} />
      <Star value={value} starNumber={4} color={color} />
      <Star value={value} starNumber={5} color={color} />

      <span>{text && text}</span>
    </div>
  )
}

Rating.defaultProps = {
  color: '#FF9900',
}

Rating.prototypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string,
}

export default Rating
