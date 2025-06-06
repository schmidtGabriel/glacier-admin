// UploadVideo.js
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { storage } from "../firebase";

function UploadVideo({
  folder,
  onUploadComplete,
}: {
  folder: string;
  onUploadComplete: (
    fileName: string,
    fileUrl: string,
    fileDuration: number
  ) => void;
}) {
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `${folder}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const video = document.createElement("video");

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(pct);
      },
      (error) => {
        console.error("Upload error:", error);
      },
      () => {
        const name = uploadTask.snapshot.metadata.fullPath;

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoUrl(downloadURL);
          video.preload = "metadata";
          video.src = downloadURL;

          video.onloadedmetadata = () => {
            URL.revokeObjectURL(downloadURL); // Clean up

            onUploadComplete(name, downloadURL, video.duration);
          };
        });
      }
    );
  };

  return (
    <div>
      <label
        style={{
          display: "inline-block",
          padding: "5px 10px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Upload Video
        <input
          type="file"
          accept="video/mp4,video/quicktime"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </label>
      {progress > 0 && progress <= 100 && (
        <p>Upload progress: {progress.toFixed(0)}%</p>
      )}
      {videoUrl && <video height={400} src={String(videoUrl)} controls></video>}
    </div>
  );
}

export default UploadVideo;
