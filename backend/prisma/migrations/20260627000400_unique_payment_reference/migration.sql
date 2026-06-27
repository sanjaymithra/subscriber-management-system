DELETE FROM "Payment" duplicate
USING "Payment" original
WHERE duplicate."id" > original."id"
  AND duplicate."subscriberId" = original."subscriberId"
  AND duplicate."transactionReference" = original."transactionReference"
  AND duplicate."transactionReference" IS NOT NULL;

CREATE UNIQUE INDEX "Payment_subscriberId_transactionReference_key"
ON "Payment"("subscriberId", "transactionReference");
