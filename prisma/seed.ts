import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.account.createMany({
    data: [
      {
        name: "자산",
        side: "DEBIT",
      },
      {
        name: "비용",
        side: "DEBIT",
      },
      {
        name: "부채",
        side: "CREDIT",
      },
      {
        name: "자본",
        side: "CREDIT",
      },
      {
        name: "수익",
        side: "CREDIT",
      },
      {
        name: "계좌잔액",
        side: "DEBIT",
        parentAccountName: "자산",
      },
      {
        name: "신한계좌잔액",
        side: "DEBIT",
        parentAccountName: "계좌잔액",
      },
      {
        name: "국민계좌잔액",
        side: "DEBIT",
        parentAccountName: "계좌잔액",
      },
      {
        name: "월급",
        side: "CREDIT",
        parentAccountName: "수익",
      },
      {
        name: "카드부채",
        side: "CREDIT",
        parentAccountName: "부채",
      },
      {
        name: "신한카드부채",
        side: "CREDIT",
        parentAccountName: "카드부채",
      },
      {
        name: "국민카드부채",
        side: "CREDIT",
        parentAccountName: "카드부채",
      },
      {
        name: "연애비",
        side: "DEBIT",
        parentAccountName: "비용",
      },
      {
        name: "교육비",
        side: "DEBIT",
        parentAccountName: "비용",
      },
      {
        name: "품위유지비",
        side: "DEBIT",
        parentAccountName: "비용",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
