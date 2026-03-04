// src/pages/Dashboard/Profile.jsx
import { useState, useContext, useEffect } from "react";
import { Camera, Save, User as UserIcon, Mail, Calendar } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { UserContext } from "../../context";
import axiosInstance from "../../utils/axiosInstance";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
      setImagePreview(user.profileImageURL || null);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      let updatedImageURL = user?.profileImageURL;

      // Update profile image if selected
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append("profileImage", selectedImage);

        console.log("Uploading profile image...");
        const imageRes = await axiosInstance.post(
          "/auth/upload-image",
          imageFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        console.log("Image upload response:", imageRes.data);
        updatedImageURL = imageRes.data.profileImageURL;
      }

      // Update user context with new data
      setUser((prev) => ({
        ...prev,
        fullName: formData.fullName,
        profileImageURL: updatedImageURL,
      }));

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setSelectedImage(null);

      // Update preview with the server URL
      if (updatedImageURL) {
        // Construct full URL if it's a relative path
        const fullImageURL = updatedImageURL.startsWith("http")
          ? updatedImageURL
          : `https://expense-tracker-s9zd.onrender.com${updatedImageURL}`;
        setImagePreview(fullImageURL);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600"></div>

            <div className="px-8 pb-8">
              {/* Profile Image */}
              <div className="relative -mt-16 mb-6">
                <div className="relative inline-block">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                      {formData.fullName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}

                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-100 transition"
                  >
                    <Camera className="w-5 h-5 text-gray-700" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Message */}
              {message.text && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserIcon className="inline w-4 h-4 mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Member Since</p>
                      <p className="font-medium text-gray-900">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Account Status</p>
                      <p className="font-medium text-green-600">Active</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
