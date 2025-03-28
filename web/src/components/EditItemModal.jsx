import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button"; // Import the Button component for reusable buttons

function EditItemModal({ card, closeModal, updateCard }) {
  const [title, setTitle] = useState(card.title); // Initialize the state with the existing card's title
  const [description, setDescription] = useState(card.description); // Initialize the state with the existing card's description
  const [rating, setRating] = useState(card.rating); // Initialize the state with the existing card's rating
  const [date, setDate] = useState(card.date); // Initialize the state with the existing card's date
  const [categoryId, setCategoryId] = useState(card.category_id); // Initialize the state with the existing card's category ID
  const [categories, setCategories] = useState([]); // State to store categories fetched from the API
  const [image, setImage] = useState(null); // State to store the selected image file for upload

  // Fetch categories from the backend API when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/categories")
      .then((response) => {
        setCategories(response.data); // Store the fetched categories in state
      })
      .catch((error) => {
        console.error("Error fetching categories:", error); // Log any errors
      });
  }, []); // Empty dependency array ensures this only runs once when the component is mounted

  // Log the updateCard function whenever it changes
  useEffect(() => {
    console.log('updateCard in EditItemModal:', updateCard); 
  }, [updateCard]);

  // Format the date from the card to match the expected input format (yyyy-MM-dd)
  useEffect(() => {
    const formattedDate = card.date
      ? new Date(card.date).toISOString().split("T")[0]
      : ""; // Format date as yyyy-MM-dd
    setDate(formattedDate); // Update the date state with the formatted value
  }, [card]); // This effect runs every time the card data changes

  // Handle the file change when a user selects a file to upload
  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Set the selected file to the image state
  };

  // Handle form submission to update the travel card
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData();
    formData.append("title", title); // Append the title to FormData
    formData.append("description", description); // Append the description to FormData
    formData.append("rating", parseFloat(rating)); // Ensure rating is a number
    formData.append("date", date); // Append the formatted date
    formData.append("category_id", categoryId); // Append the category ID

    // If a new image is selected, append it to the FormData, otherwise use the old image URL
    if (image) {
      formData.append("image", image); // Append the new image if one is selected
    } else {
      formData.append("image_url", card.image_url); // Preserve the old image URL if no new image
    }

    // Send a PUT request to update the card on the server
    axios
      .put(`http://localhost:5001/api/travel-cards/${card.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data for file uploads
        },
      })
      .then((response) => {
        console.log('Response from server:', response.data); // Log the response from the server

        // Call the parent updateCard function with the updated card data
        updateCard(response.data);

        // Close the modal after successfully updating the card
        closeModal();
      })
      .catch((error) => {
        console.error("Error updating travel card:", error); // Log any errors during the PUT request
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
            value={title} // Bind title input to state
            onChange={(e) => setTitle(e.target.value)} // Update title state as the user types
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <textarea
            value={description} // Bind description textarea to state
            onChange={(e) => setDescription(e.target.value)} // Update description state as the user types
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={date} // Bind date input to state
            onChange={(e) => setDate(e.target.value)} // Update date state as the user selects a date
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
              value={rating} // Bind the slider to the rating state
              onChange={(e) => setRating(e.target.value)} // Update rating state as the user slides the input
              className="w-full mb-5"
            />
          </div>

          <input
            type="file"
            onChange={handleFileChange} // Call handleFileChange when a file is selected
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <select
            value={categoryId} // Bind category dropdown to state
            onChange={(e) => setCategoryId(e.target.value)} // Update category state as the user selects a category
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name} {/* Display each category in the dropdown */}
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
          onClick={closeModal} // Close the modal when clicked
          className="w-full mt-2 bg-[#282828] hover:bg-[#000000]"
        />
      </div>
    </div>
  );
}

export default EditItemModal;
