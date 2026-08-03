-- Align migration history with the current Prisma schema. In particular,
-- self-registration must never inherit the legacy ADMIN database default.
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

CREATE INDEX "BlogPost_status_publishedAt_idx" ON "BlogPost"("status", "publishedAt");
CREATE INDEX "BlogPost_authorId_idx" ON "BlogPost"("authorId");
CREATE INDEX "BlogPost_featured_status_publishedAt_idx" ON "BlogPost"("featured", "status", "publishedAt");
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");
CREATE INDEX "ContactLead_createdAt_idx" ON "ContactLead"("createdAt");
CREATE INDEX "ContactLead_productId_idx" ON "ContactLead"("productId");
CREATE INDEX "ContactLead_source_idx" ON "ContactLead"("source");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_published_createdAt_idx" ON "Product"("published", "createdAt");
