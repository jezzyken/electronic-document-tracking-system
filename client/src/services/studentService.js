import api from "./api";

export default {
  createStudent(profileData) {
    const formData = new FormData();

    if (profileData.image && profileData.image.startsWith("data:image")) {
      const imageData = profileData.image.split(";base64,")[1];
      const blob = this.dataURLtoBlob(imageData);
      if (blob) formData.append("image", blob, "profile.jpg");
    }

    Object.keys(profileData).forEach((key) => {
      if (key !== "image") {
        if (typeof profileData[key] === "object") {
          formData.append(key, JSON.stringify(profileData[key]));
        } else {
          formData.append(key, profileData[key]);
        }
      }
    });

    return api.post("/student", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateStudent(id, profileData) {
    const formData = new FormData();

    if (profileData.image && profileData.image.startsWith("data:image")) {
      const imageData = profileData.image.split(";base64,")[1];
      const blob = this.dataURLtoBlob(imageData);
      if (blob) formData.append("image", blob, "profile.jpg");
    }

    Object.keys(profileData).forEach((key) => {
      if (key !== "image") {
        if (typeof profileData[key] === "object") {
          formData.append(key, JSON.stringify(profileData[key]));
        } else {
          formData.append(key, profileData[key]);
        }
      }
    });

    return api.patch(`/student/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAllStudents(id) {
    return api.get(`/student`);
  },

  getStudent(id) {
    return api.get(`/student/${id}`);
  },

  dataURLtoBlob(dataURL) {
    if (!dataURL || typeof dataURL !== "string") return null;

    try {
      const byteString = atob(dataURL);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      return new Blob([arrayBuffer], { type: "image/jpeg" });
    } catch (error) {
      console.error("Error converting data URL to blob:", error);
      return null;
    }
  },
};
