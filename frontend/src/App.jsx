import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      alert("Please select an image file");
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const {
        data: { uploadUrl, key },
      } = await axios.post("http://localhost:7777/get-upload-url", {
        filename: selectedFile.name,
      });

      await axios.put(uploadUrl, selectedFile, {
        headers: { "Content-Type": "image/jpeg" },
      });

      const {
        data: { downloadUrl }} = await axios.post("http://localhost:7777/get-download-url", {
        key,
      });
      // console.log(downloadUrl)
      setUploadedImage({ url: downloadUrl, name: selectedFile.name });
      setSelectedFile(null);
      document.getElementById("fileInput").value = "";
    } catch (error) {
      alert("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>S3 Image Upload </h1>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ marginBottom: "10px", width: "100%" }}
      />
      <button
        onClick={uploadImage}
        disabled={!selectedFile || uploading}
        style={{
          padding: "10px 20px",
          width: "100%",
          
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {uploadedImage && (
        
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img
            src={uploadedImage.url}
            alt={uploadedImage.name}
            style={{
              width: "100%",
              maxWidth: "300px",
              height: "auto",
              
              borderRadius: "8px",
            }}
          />
          <p style={{ marginTop: "10px", fontSize: "14px"}}>
            {uploadedImage.name}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
