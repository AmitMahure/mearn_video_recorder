
// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [loginInProgress, setLoginInProgress] = useState(false);
//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [token, setToken] = useState('');
//   const [recording, setRecording] = useState(false);
//   let mediaRecorder;


//   const handleLogin = async () => {
//     if (loginInProgress) {
//       return;
//     }

//     setLoginInProgress(true);

//     try {
//       const response = await axios.post('http://localhost:5000/login', {
//         email: email,
//         password: 'your-password', // Replace with actual password input
//       });

//       const { token } = response.data;
//       setToken(token);
//     } catch (error) {
//       console.error('Login failed:', error.message);
//     } finally {
//       setLoginInProgress(false);
//     }
//   }

//   const handleStartRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: { width: 1280, height: 720 },
//       });

//       mediaRecorder = new MediaRecorder(stream);
//       const chunks = [];

//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) {
//           chunks.push(e.data);
//         }
//       };

//       mediaRecorder.onstop = async () => {
//         const recordedBlob = new Blob(chunks, { type: 'video/webm' });

//         const formData = new FormData();
//         formData.append('video', recordedBlob, 'recorded-video.webm');

//         try {
//           await axios.post('/api/record/upload', formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//               Authorization: `Bearer ${token}`,
//             },
//           });

//           // Handle further actions after recording is uploaded
//         } catch (error) {
//           console.error('Error uploading recording:', error.message);
//         }
//       };

//       mediaRecorder.start();
//       setRecording(true);
//     } catch (error) {
//       console.error('Error starting recording:', error.message);
//     }
//   };

//   const handleStopRecording = async () => {
//     try {
//       mediaRecorder.stop();
//       setRecording(false);
//     } catch (error) {
//       console.error('Error stopping recording:', error.message);
//     }
//   };

//   return (
//     // <div className="App">
//     //   {!token ? (
//     //     <div>
//     //       <input
//     //         type="email"
//     //         placeholder="Email"
//     //         value={email}
//     //         onChange={(e) => setEmail(e.target.value)}
//     //       />
//     //       <input
//     //         type="text"
//     //         placeholder="Name"
//     //         value={name}
//     //         onChange={(e) => setName(e.target.value)}
//     //       />
//     //       <button onClick={handleLogin}>Login</button>
//     //     </div>
//     //   ) : (
//     //     <div>
//     //       <button onClick={recording ? handleStopRecording : handleStartRecording}>
//     //         {recording ? 'Stop Recording' : 'Start Recording'}
//     //       </button>
//     //     </div>
//     //   )}
//     // </div>
//     <div className="App">
//   {!token ? (
//     <div className="form-container">
//       <input
//         className="input-field"
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         className="input-field"
//         type="text"
//         placeholder="Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <button className="button" onClick={handleLogin}>Login</button>
//     </div>
//   ) : (
//     <div>
//       <button className="button" onClick={recording ? handleStopRecording : handleStartRecording}>
//         {recording ? 'Stop Recording' : 'Start Recording'}
//       </button>
//     </div>
//   )}
// </div>

//   );
// }

// export default App;



import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [recording, setRecording] = useState(false);
  let mediaRecorder;
  let recordedChunks = [];

  const handleLogin = async () => {
    if (loginInProgress) {
      return;
    }

    setLoginInProgress(true);

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email: email,
        password: 'your-password', // Replace with actual password input
      });

      const { token } = response.data;
      setToken(token);
    } catch (error) {
      console.error('Login failed:', error.message);
    } finally {
      setLoginInProgress(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 },
      });

      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });

        const formData = new FormData();
        formData.append('video', recordedBlob, 'recorded-video.webm');

        try {
          await axios.post('/api/record/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });

          // Handle further actions after recording is uploaded

        } catch (error) {
          console.error('Error uploading recording:', error.message);
        }

        recordedChunks = [];
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error.message);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div className="App">
      {!token ? (
        <div className="form-container">
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="button" onClick={handleLogin}>
            Login
          </button>
        </div>
      ) : (
        <div>
          <button className="button" onClick={recording ? handleStopRecording : handleStartRecording}>
            {recording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
