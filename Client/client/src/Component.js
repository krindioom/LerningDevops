import React, { useEffect } from 'react'

const Component = ({state}) => {

    useEffect(() => {
        console.log(state);
    }, [state])

  return (
    <div>Component</div>
  )
}

export default Component