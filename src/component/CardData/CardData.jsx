import "./CardData.css";
import { useState } from "react";
export default function CardData() {
  const [open, setOpen] = useState(null);

  const dataItem = [
    {
      day: "Kamis",
      date: "11-06-2026",
      records: [
        {
          time: "19.00",
          temp: "37°C",
          humidity: "55%",
          status: "Warning",
        },
        {
          time: "19.10",
          temp: "40°C",
          humidity: "55%",
          status: "Overheat",
        },
      ],
    },
    {
      day: "Jumat",
      date: "12-06-2026",
      records: [
        {
          time: "19.20",
          temp: "41°C",
          humidity: "55%",
          status: "Overheat",
        },
      ],
    },
  ];

  // const storeData = [{
  //   suhu:
  // }];

  const handleClick = () => {
    setOpen(!open);
  };
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
