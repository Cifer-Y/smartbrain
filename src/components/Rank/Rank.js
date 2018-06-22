import React from 'react'

const Rank = ({currentUser}) => {
  console.log(currentUser)
  return (
    <div>
      <div className="white f3">
        {`Hello ${currentUser.name}, your detected image count is...`}
      </div>
      <div className="white f1">
        {currentUser.entries}
      </div>
    </div>
  )
}

export default Rank;
