-- AddForeignKey
ALTER TABLE "public"."ContactLead" ADD CONSTRAINT "ContactLead_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
