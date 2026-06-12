import mqtt from "mqtt";

const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

export default client;
