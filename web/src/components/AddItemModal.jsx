import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";

function AddItemModal({ closeModal, addNewCard, refreshCards }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0); // Initial rating value
  const [date, setDate] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null); // State to store the uploaded file

  // Fetch categories from the backend API
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/categories")
      .then((response) => {
        setCategories(response.data); // Check categories
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Get the selected file
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("rating", rating);
    formData.append("date", date);
    formData.append("category_id", category_id);
    formData.append("image", image); // Add the image file to FormData

    axios
      .post("http://localhost:5001/api/travel-cards", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Tell the server we're sending a file
        },
      })
      .then((response) => {
        console.log("Card added:", response.data); // Log the response
        addNewCard(response.data); // Add new card to parent component
        refreshCards(); // Call refreshCards to update the UI after adding a new card
        closeModal(); // Close the modal after adding
      })
      .catch((error) => {
        console.error("Error adding travel card:", error);
      });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-[500] mb-4 text-center">
          Add New Travel Card
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <select
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
          <Button
            type="submit"
            text="Add Card"
            className="w-full mt-4 bg-[#F55848] hover:bg-[#EF4432]"
          />
        </form>
        <Button
          onClick={closeModal}
          text="Close"
          className="w-full mt-2 bg-[#282828] hover:bg-[#000000]"
        />
      </div>
    </div>
  );
}

export default AddItemModal;
