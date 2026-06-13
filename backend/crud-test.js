import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const newLog = await prisma.monitoring_logs.create({
  data: {
    temperature: 43.5,
    humidity: 52,
    status: "Overheat",
  },
});

console.log(newLog);
