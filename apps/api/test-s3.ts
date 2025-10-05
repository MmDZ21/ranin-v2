import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";

const client = new S3Client({
  region: "default",
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY ?? "",
    secretAccessKey: process.env.LIARA_SECRET_KEY ?? "",
  },
  forcePathStyle: true,
});

const filePath = path.join(__dirname, "sample.jpg");

async function uploadFile() {
  try {
    if (!fs.existsSync(filePath)) {
      console.error("❌ File does not exist:", filePath);
      return;
    }

    const fileStream = fs.createReadStream(filePath);

    const params = {
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: `products/${Date.now()}-sample.jpg`,
      Body: fileStream,
      ContentType: "image/jpeg",
    };

    const data = await client.send(new PutObjectCommand(params));
    console.log("✅ File uploaded successfully:", data);
  } catch (error: unknown) {
    if (error instanceof Error) console.error("❌ Upload failed:", error.message);
    else console.error("❌ Upload failed:", error);
  }
}

uploadFile();
