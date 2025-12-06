-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "features" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "hashedRefreshToken" TEXT;
