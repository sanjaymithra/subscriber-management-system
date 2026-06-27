CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "previousExpiryDate" TIMESTAMP(3) NOT NULL,
    "newExpiryDate" TIMESTAMP(3) NOT NULL,
    "transactionReference" TEXT,
    "remarks" TEXT,
    "recordedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Payment_subscriberId_idx" ON "Payment"("subscriberId");
CREATE INDEX "Payment_recordedBy_idx" ON "Payment"("recordedBy");
CREATE INDEX "Payment_paymentMethod_idx" ON "Payment"("paymentMethod");
CREATE INDEX "Payment_paymentStatus_idx" ON "Payment"("paymentStatus");
CREATE INDEX "Payment_paymentDate_idx" ON "Payment"("paymentDate");
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
