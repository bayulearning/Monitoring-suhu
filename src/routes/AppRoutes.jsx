import { Routes, Route } from "react-router-dom";
import Dashboard from "../page/Dashboard";
import Control from "../page/Control";
import Histori from "../page/Histori";
import BottomBar from "../component/BottomBar/BottomBar";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/control" element={<Control />} />
      <Route path="/histori" element={<Histori />} />
    </Routes>
  );
}
