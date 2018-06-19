import React from 'react';
import './FaceDetectBox.css'

const FaceDetectBox = ({imgUrl, boxes}) => {
  if(imgUrl.length > 0) {
    const faceBoxes = boxes.map((box, i) => {
      const style = {
        top: box.topRow,
        right: box.rightCol,
        bottom: box.bottomRow,
        left: box.leftCol
      }
      return (
        <div key={i} className="bounding-box" style={style}></div>
      )
    })
    return (
      <div className='center ma'>
        <div className="absolute mt2">
          <img id='inputImg' src={imgUrl} width='500px' height='auto' alt="face-detected"/>
          {faceBoxes}
        </div>
      </div>
    )
  } else {
    return <div></div>
  }
}

export default FaceDetectBox;
