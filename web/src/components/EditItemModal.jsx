import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";

function EditItemModal({ card, closeModal, updateCard }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [rating, setRating] = useState(card.rating);
  const [date, setDate] = useState(card.date);
  const [categoryId, setCategoryId] = useState(card.category_id);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  // Fetch categories from the backend API
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    console.log('updateCard in EditItemModal:', updateCard); // 제대로 전달되었는지 확인
  }, [updateCard]);
  

  useEffect(() => {
    const formattedDate = card.date
      ? new Date(card.date).toISOString().split("T")[0]
      : ""; // Format date as yyyy-MM-dd
    setDate(formattedDate);
  }, [card]);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Get the selected file
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("rating", parseFloat(rating)); // Ensure rating is a number
    formData.append("date", date); // Date is already in yyyy-MM-dd format
    formData.append("category_id", categoryId);
  
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("image_url", card.image_url); // Preserve old image URL if no new image
    }
  
    // Send the PUT request
    axios
      .put(`http://localhost:5001/api/travel-cards/${card.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log('Response from server:', response.data);
        
        // Call updateCard with the updated card data
        updateCard(response.data);
  
        // Close the modal immediately after the update
        closeModal();
      })
      .catch((error) => {
        console.error("Error updating travel card:", error);
      });
  };
  

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h3 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          Edit Travel Card
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <textarea
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

          {/* Rating slider */}
          <div className="mb-4">
            <div className="flex justify-between">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <div className="text-center text-xl font-semibold text-gray-700">
              {rating}
            </div>
            </div>
            <input
              id="rating"
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full mb-5"
            />
            
          </div>

          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <select
            value={categoryId}
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
            text="Update Card"
            className="w-full mt-4 bg-[#F55848] hover:bg-[#EF4432]"
          />
        </form>
        <Button
          text="Close"
          onClick={closeModal}
          className="w-full mt-2 bg-[#282828] hover:bg-[#000000]"
        />
      </div>
    </div>
  );
}

export default EditItemModal;
