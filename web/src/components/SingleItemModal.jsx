import React from 'react';
import Button from './Button';

function SingleItemModal({ card, closeModal, onDelete }) {
  const formattedDate = new Date(card.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDelete = () => {
    onDelete(card.id);  // Trigger the delete function
    closeModal();  // Close the modal after deleting the card
  };


  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md space-y-4">
        <h3 className="text-3xl font-semibold text-center text-gray-800 mb-4">{card.title}</h3>
        <img 
          src={`http://localhost:5001${card.image_url}`} 
          alt={card.title} 
          className="w-full h-64 object-cover rounded-lg mt-4"
        />
        <p>{card.description}</p>
        <div className="space-y-3 mt-4">
          <p><strong className="text-gray-700">Rating:</strong> <span className="text-yellow-600 font-[450]">★ {card.rating}</span></p>
          <p><strong className="text-gray-700">Category:</strong> {card.category_name}</p>
          <p><strong className="text-gray-700">Date: </strong>{formattedDate}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col mt-6">
          {/* Delete Button */}
          <Button
            text="Delete"
            onClick={handleDelete}  // Trigger delete and close the modal
            className="w-full mt-2 bg-[#F55848] hover:bg-[#EF4432] text-white py-2.5 rounded-lg transition duration-200 ease-in-out"
          />
          {/* Close Button */}
          <Button
            text="Close"
            onClick={closeModal}
            className="w-full mt-2 bg-[#282828] hover:bg-[#000000] text-white py-2.5 rounded-lg transition duration-200 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
}

export default SingleItemModal;
