import "./CardData.css";
import { useState, useEffect } from "react";
import { API_URL } from "../../config/api";

export default function CardData() {
  const [open, setOpen] = useState(null);
  const [dataItem, setDataItem] = useState([]);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    fetch(`${API_URL}/api/logs/grouped`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("DATA DARI API");
        // console.log(data);

        setDataItem(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      {dataItem.map((item, index) => (
        <div className="container-data" key={index}>
          <div
            className="card-data"
            onClick={() => setOpen(open === index ? null : index)}
          >
            <h1>{item.day}</h1>
            <h1>{item.date}</h1>
          </div>

          {open === index && (
            <div className="data-list">
              {item.records.map((record, i) => (
                <div className="data-item" key={i}>
                  <div>
                    <strong>Time:</strong>
                    <p>{record.time}</p>
                  </div>

                  <div>
                    <strong>Temp:</strong>
                    <p>{record.temp}</p>
                  </div>

                  <div>
                    <strong>Humidity:</strong>
                    <p>{record.humidity}</p>
                  </div>

                  <div>
                    <strong>Status:</strong>
                    <p>{record.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
