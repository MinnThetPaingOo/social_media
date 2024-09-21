import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import pp from "../../assets/images/pp.jpg";

const CreatePost = ({ createNewPost }) => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]); // Handle multiple files
  const imgRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("text", text);

    files.forEach((file) => {
      formData.append("files", file, file.name); // Append each file
    });

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Post created successfully");
      setText("");
      setFiles([]);
      const newPost = res.data;
      createNewPost(newPost);
      console.log(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  const handleImgChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
    setFiles(selectedFiles); // Update state with selected files
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    imgRef.current.value = null; // Clear the file input value
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={pp || "/avatars/boy1.png"} alt="Profile" />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {files.length > 0 && (
          <div className="relative w-72 mx-auto">
            {files.map((file, index) => (
              <div key={index} className="relative w-full mx-auto">
                <IoCloseSharp
                  className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                  onClick={() => handleRemoveFile(index)}
                />
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-full mx-auto h-72 object-contain rounded"
                    alt={`Uploaded ${index}`}
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full mx-auto h-72 object-contain rounded"
                    controls
                    alt={`Uploaded video ${index}`}
                  />
                ) : null}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            name="files"
            accept="image/*,video/*"
            multiple
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button
            type="submit"
            className="btn btn-primary rounded-full btn-sm text-white px-4"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
