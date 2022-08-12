import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [file, setFile] = useState<File>();
  const [uploadingStatus, setUploadingStatus] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>("");
  const selectFile = async (e: any) => {
    setFile(e.target.files[0]);
  };

  const uploadFiles = async () => {
    if (file) {
      console.log("starting upload");
      setUploadingStatus(true);
      let { data } = await axios.post("/api/uploadFile", {
        name: file.name,
        type: file.type,
      });
      console.log("file uploaded");
      console.log(data);
      const url = data.url;
      console.log("display url:", url);

      await axios.put(url, file, {
        headers: {
          "Content-type": file.type,
          "Access-Control-Allow-Origin": "*",
        },
      });
      console.log(
        "liveURL:",
        `https://${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.amazonaws.com/${file.name}`
      );

      setUploadedFileUrl(
        "https://" +
          process.env.NEXT_PUBLIC_BUCKET_NAME +
          ".s3.amazonaws.com/" +
          file.name
      );
    }
  };
  console.log("uploadedFile: ", uploadedFileUrl);
  useEffect(() => {
    uploadFiles().catch(console.error);
  }, [file]);
  return (
    <div className="w-screen h-screen flex items-center justify-center ">
      <Head>
        <title>NextJS-S3-Uplaod-Template</title>
        <meta name="description" content="Template for uploading to S3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {uploadedFileUrl && (
          <div>
            <img className="w-[300px] h-[300px]" src={uploadedFileUrl} alt="" />
          </div>
        )}
        <div className="p-2" />
        <p> Select File to Upload</p>
        <div className="p-1" />
        <input type="file" accept="image/*" onChange={(e) => selectFile(e)} />
      </main>
    </div>
  );
};

export default Home;
