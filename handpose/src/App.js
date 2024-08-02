// 1. Install dependencies: npm install @tensorflow/tfjs @tensorflow-models/handpose react-webcam
// 2. Import dependencies: import * as tf from '@tensorflow/tfjs'; import * as handpose from '@tensorflow-models/handpose'; import React, {useRef} from 'react'; import Webcam from 'react-webcam';
// 3. Setup webcam and canvas
// 4. Define references
// 5. Load handpose
// 6. Detect function
// 7. Drawing utilities from tensorflow
// 8. Draw functions

//localhost:3000
//node index.js or npm run start to start and ctl + c to stop

import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import React, {useRef} from 'react';
import Webcam from 'react-webcam';
import {drawHand} from './utilities';
// import logo from './logo.svg';
import './App.css';

function App() {

  const webcamRef = useRef(null); //Initialising/defining webcamRef reference variable
  const canvasRef = useRef(null); //Initialising/defining canvasRef reference variable

  //Load handpose model
  const runHandPose = async () =>{ //async to wait for the handpose model to load
    const net = await handpose.load();
    console.log('Handpose model loaded.');
    //Loop and detect hands
    setInterval(()=>{
      detect(net)
    }, 100)
  };

  //Function to detect hands within screen frame
  const detect = async(net) =>{ //Pass neural network(here passed as variable net) to be able to make hand detection
    // Check data(video feed) is available
    if(
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    )
    {
      // Get video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video height and width
      webcamRef.current.video.height = videoHeight;
      webcamRef.current.video.width = videoWidth;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections
      const hand = await net.estimateHands(video); //Get information about hands
      console.log(hand);

      // Draw mesh {connected points of all the joints on hand}
      // Import drawing function from utilities.js
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
    
  };

  runHandPose();//Call above loaded Handpose model

  return (
    <div className="App">
      <header className="App-header">
        
        <Webcam ref = {webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }}
          />

          <canvas ref = {canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }}
          />

      </header>
    </div>
  );
}

export default App;
