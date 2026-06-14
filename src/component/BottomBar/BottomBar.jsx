import { Link } from "react-router-dom";
import "./BottomNav.css";
export default function BottomBar() {
  return (
    <div className="bottom-bar">
      <Link to="/">Dashboard</Link>
      {/* <Link to="/control">Control</Link> */}
      <Link to="/histori">Histori</Link>
    </div>
  );
}
