import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import react from "react";

import AppRoutes from "./routes/AppRoutes";
import BottomBar from "./component/BottomBar/BottomBar";
import MqttProvider from "./mqtt/mqttProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App-container">
      <ToastContainer position="top-right" autoClose={5000} />
      {/* <MqttNotification /> */}
      <MqttProvider />
      <div className="content">
        <AppRoutes />
      </div>
      <BottomBar />
    </div>
  );
}

export default App;
