CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "newspaperType" TEXT NOT NULL,
    "subscriptionPlan" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "deliveryBoy" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "subscriptionStatus" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Subscriber_subscriberId_key" ON "Subscriber"("subscriberId");
CREATE INDEX "Subscriber_fullName_idx" ON "Subscriber"("fullName");
CREATE INDEX "Subscriber_phone_idx" ON "Subscriber"("phone");
CREATE INDEX "Subscriber_email_idx" ON "Subscriber"("email");
CREATE INDEX "Subscriber_subscriptionStatus_idx" ON "Subscriber"("subscriptionStatus");
CREATE INDEX "Subscriber_newspaperType_idx" ON "Subscriber"("newspaperType");
CREATE INDEX "Subscriber_subscriptionPlan_idx" ON "Subscriber"("subscriptionPlan");
CREATE INDEX "Subscriber_expiryDate_idx" ON "Subscriber"("expiryDate");
CREATE INDEX "Subscriber_createdAt_idx" ON "Subscriber"("createdAt");
