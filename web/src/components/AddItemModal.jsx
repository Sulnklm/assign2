import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button"; // Import the Button component for reusable buttons

function AddItemModal({ closeModal, addNewCard, refreshCards }) {
  const [title, setTitle] = useState(""); // State to store the title input
  const [description, setDescription] = useState(""); // State to store the description input
  const [rating, setRating] = useState(0); // State to store the rating (default is 0)
  const [date, setDate] = useState(""); // State to store the date input
  const [category_id, setCategoryId] = useState(""); // State to store the selected category ID
  const [categories, setCategories] = useState([]); // State to store available categories for the dropdown
  const [image, setImage] = useState(null); // State to store the selected image file

  // Fetch categories from the backend API to populate the dropdown
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/categories")
      .then((response) => {
        setCategories(response.data); // Store the fetched categories in state
      })
      .catch((error) => {
        console.error("Error fetching categories:", error); // Handle any errors from the API request
      });
  }, []); // Empty dependency array ensures this runs once when the component is mounted

  // Handle the file change when a user selects a file to upload
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Store the selected file in state
  };

  // Handle form submission to create a new travel card
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData();
    formData.append("title", title); // Append the title to FormData
    formData.append("description", description); // Append the description to FormData
    formData.append("rating", rating); // Append the rating to FormData
    formData.append("date", date); // Append the date to FormData
    formData.append("category_id", category_id); // Append the selected category ID to FormData
    formData.append("image", image); // Append the image file to FormData

    // Send a POST request to the server with the form data
    axios
      .post("http://localhost:5001/api/travel-cards", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Tell the server we're sending a file
        },
      })
      .then((response) => {
        console.log("Card added:", response.data); // Log the response from the server
        addNewCard(response.data); // Call the parent function to add the new card
        refreshCards(); // Refresh the list of cards in the parent component
        closeModal(); // Close the modal after successfully adding the card
      })
      .catch((error) => {
        console.error("Error adding travel card:", error); // Handle any errors from the POST request
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
            onChange={(e) => setTitle(e.target.value)} // Update the title state as the user types
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Update the description state as the user types
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)} // Update the date state as the user selects a date
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />

          {/* Rating slider */}
          <div className="mb-4">
            <div className="flex justify-between">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="text-center text-xl font-semibold text-gray-700">
                {rating} {/* Display the current rating value */}
              </div>
            </div>
            <input
              id="rating"
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)} // Update the rating state as the user slides the range input
              className="w-full mb-5"
            />
          </div>

          <input
            type="file"
            onChange={handleFileChange} // Call handleFileChange when a file is selected
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <select
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)} // Update the category state as the user selects a category
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name} {/* Display categories in the dropdown */}
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
          onClick={closeModal} // Close the modal when clicked
          text="Close"
          className="w-full mt-2 bg-[#282828] hover:bg-[#000000]"
        />
      </div>
    </div>
  );
}

export default AddItemModal;
