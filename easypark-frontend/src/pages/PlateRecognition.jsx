import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const PlateRecognition = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPreviewURL(URL.createObjectURL(file));
    setResult(null);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setLoading(true);
      const res = await axiosInstance.post("parking/plate-recognition/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      toast.success(" Plate recognized!");
    } catch (err) {
      if (err.response?.data?.detail === "invalid_plate_image") {
        toast.error("The uploaded image doesn't contain a valid license plate.");
      } else {
        toast.error("Access denied. No active reservation found.");
      }
      setResult(null); // prevent "N/A" from showing
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#0b1e3d",
        minHeight: "100vh",
        paddingTop: "4rem",
        color: "white",
        textAlign: "center",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>License Plate Recognition</h1>
      <p style={{ marginBottom: "2rem" }}>
        Upload an image to detect your plate automatically
      </p>

      <div
        style={{
          backgroundColor: "white",
          color: "#0b1e3d",
          width: "90%",
          maxWidth: "500px",
          margin: "0 auto",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: "1rem" }}
        />
        {previewURL && (
          <img
            src={previewURL}
            alt="Preview"
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              objectFit: "cover",
            }}
          />
        )}
        <button
          onClick={handleUpload}
          style={{
            backgroundColor: "#ffc400",
            color: "#0b1e3d",
            padding: "0.75rem 1.6rem",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            transition: "background-color 0.3s",
          }}
        >
          {loading ? "Processing..." : "Upload & Recognize"}
        </button>

        {result && (
          <div style={{ marginTop: "1.8rem", fontSize: "1.1rem" }}>
            <span
              style={{
                display: "block",
                marginBottom: "0.8rem",
                color: result.access ? "#1e4620" : "#c62828",
                fontWeight: "600",
                fontSize: "1.2rem",
              }}
            >
              {result.plate_number}
            </span>

            <div
              style={{
                padding: "1rem",
                borderRadius: "0.75rem",
                backgroundColor: result.access ? "#e6f4ea" : "#fdecea",
                color: result.access ? "#1e4620" : "#611a15",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              {result.access ? (
                <>
                  <span role="img" aria-label="check">
                    
                  </span>{" "}
                  Access Granted
                  <div style={{ marginTop: "0.3rem", fontSize: "0.95rem" }}>
                    <strong>Zone:</strong> {result.zone} &nbsp;|&nbsp;
                    <strong>Spot:</strong> #{result.spot}
                  </div>
                </>
              ) : (
                <>
                  <span role="img" aria-label="cross">
                    ❌
                  </span>{" "}
                  Access Denied
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlateRecognition;
