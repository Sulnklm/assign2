import React, { useState, useEffect } from "react";
import Card from "./Card";
import SingleItemModal from "./SingleItemModal";
import EditItemModal from "./EditItemModal";
function AllItems({ cards, handleDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filteredCards, setFilteredCards] = useState(cards);
  const [filterCategory, setFilterCategory] = useState("");  
  const [filterRating, setFilterRating] = useState(""); 

  // Filter the card list based on the selected filters
  useEffect(() => {
    let filtered = [...cards];  // Create a copy of the original card list

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter((card) => card.category_name === filterCategory);
    }

    // Apply rating filter
    if (filterRating) {
      filtered = filtered.filter((card) => card.rating >= filterRating);
    }

    setFilteredCards(filtered);  // Update the state with the filtered cards
  }, [cards, filterCategory, filterRating]);

  // Open modal and set the selected card
  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null); // Reset selected card when closing the modal
  };

  // Open Edit modal
  const openEditModal = (card) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  // Close the Edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCard(null); // Reset selected card when closing the modal
  };

  return (
    <div className="container mx-auto">
      {/* Filters */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex gap-4">
          {/* Category filter */}
          <select
            onChange={(e) => setFilterCategory(e.target.value)}
            value={filterCategory}
            className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Tourist Spot">Tourist Spot</option>
          </select>

          {/* Rating filter */}
          <select
            onChange={(e) => setFilterRating(e.target.value)}
            value={filterRating}
            className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Rating</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>

      {/* Render the filtered cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCards.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No cards available</div>
        ) : (
          filteredCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onDelete={() => handleDelete(card.id)}
              onClick={() => openModal(card)} // Open modal when a card is clicked
              onEdit={() => openEditModal(card)} // Open edit modal when edit button is clicked
            />
          ))
        )}
      </div>

      {/* Render the SingleItemModal when a card is selected */}
      {isModalOpen && (
        <SingleItemModal
          card={selectedCard}
          closeModal={closeModal}
          onDelete={handleDelete} // Pass handleDelete to SingleItemModal
        />
      )}

      {/* Render the Edit modal */}
      {isEditModalOpen && (
        <EditItemModal
          card={selectedCard}
          closeModal={closeEditModal}
          refreshCards={() => {}}
        />
      )}
    </div>
  );
}

export default AllItems;
