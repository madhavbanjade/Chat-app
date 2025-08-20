import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const MyProfile = () => {
  const { user, setUser, updateProfile } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [userName, setUserName] = useState(user?.userName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Sync local state with context user
  useEffect(() => {
    if (user) {
      setUserName(user.userName || "");
      setBio(user.bio || "");
      //use what have you write in model
      setFile(user.avatar || null);
    }
  }, [user]);

  // Cleanup blob URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (file instanceof File) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  // Handle image click -> open hidden file input
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("File Blob URL:", URL.createObjectURL(selectedFile));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    //FormData is a special JavaScript object used to send data (including files) in an HTTP request.
    //Typically used with multipart/form-data requests (for file uploads).
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("userName", userName);
    formData.append("bio", bio);

    // Update context immediately for UI
    setUser((prev) => ({
      ...prev,
      userName,
      bio,
      avatar:
        file instanceof File ? URL.createObjectURL(file) : file || prev.avatar,
    }));

    console.log("Profile Updated", { userName, bio, file });
    await updateProfile(formData);
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-4 space-y-2 bg-white rounded-2xl shadow-lg w-[350px] text-center"
      >
        {/* Profile Image */}
        <div className="flex flex-col items-center space-y-2">
          {/* this part  */}
          <img
            src={
              file // Is there a file value in state?
                ? file instanceof File //  Is the file a real File object (from <input type="file">)?
                  ? URL.createObjectURL(file) // If yes, create a temporary blob URL for preview
                  : file // If not, it’s already a URL string (from backend/localStorage)
                : "/default.webp" //  If no file, use a default placeholder image
            }
            alt="upload profile"
            onClick={handleImageClick}
            className="object-cover w-[100px] h-[100px] rounded-full border-2 border-purple-500 cursor-pointer hover:opacity-80 transition"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Inputs */}
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="p-3 rounded-xl border border-violet-500 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <textarea
            placeholder="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)} // ✅ fixed here
            className="p-3 rounded-xl border border-violet-500 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button className="bg-red-500 text-white px-5 py-2 rounded-xl hover:bg-red-600 transition w-full sm:w-auto">
          Save
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
