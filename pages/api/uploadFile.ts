// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  signatureVersion: "v4",
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let { name, type } = req.body;

    const fileParams = {
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
      Key: name,
      Expires: 3000,
      ContentType: type,
    };

    const url = await s3.getSignedUrlPromise("putObject", fileParams);
    // const url = await s3.createPresignedPost(fileParams);

    res.status(200).json({ url });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

// set limit to file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};
