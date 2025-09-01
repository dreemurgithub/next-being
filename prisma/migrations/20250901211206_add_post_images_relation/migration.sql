-- AlterTable
ALTER TABLE "public"."ImageBlob" ADD COLUMN     "postId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."ImageBlob" ADD CONSTRAINT "ImageBlob_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
