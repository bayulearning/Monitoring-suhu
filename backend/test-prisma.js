import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const logs = await prisma.monitoring_logs.findMany();

  console.log(logs);
}

const latest = await prisma.monitoring_logs.findFirst({
  orderBy: {
    created_at: "desc",
  },
});

console.log(latest);

const overheat = await prisma.monitoring_logs.findMany({
  where: {
    status: "Overheat",
  },
});

console.log(overheat);

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
