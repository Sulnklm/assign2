import React, { useState, useEffect } from "react";
import axios from "axios";
import AllItems from "../components/AllItems"; 
import AddItemModal from "../components/AddItemModal"; 
import Button from "../components/Button"; 
import EditItemModal from "../components/EditItemModal"; 

function Home() {
  const [cards, setCards] = useState([]); // State for the travel card list
  const [isModalOpen, setIsModalOpen] = useState(false); // State for AddItemModal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for EditItemModal
  const [selectedCard, setSelectedCard] = useState(null); // State for selected card

  // Function to fetch travel card data from the backend
  const refreshCards = () => {
    axios
      .get("http://localhost:5001/api/travel-cards")
      .then((response) => {
        setCards(response.data); // Update the travel card list
      })
      .catch((error) => {
        console.error("Error fetching travel cards:", error); // Handle error
      });
  };

  // useEffect to fetch travel card list when the page loads
  useEffect(() => {
    refreshCards(); // Fetch card list when the page is initially rendered
  }, []); // Empty dependency array to run only once on mount

  // Function to add a new card
  const addNewCard = (newCard) => {
    setCards((prevCards) => [...prevCards, newCard]); // Add the new card to the existing list
  };

  // Function to delete a card
  const handleDelete = (cardId) => {
    axios
      .delete(`http://localhost:5001/api/travel-cards/${cardId}`)
      .then(() => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== cardId)); // Remove the deleted card from the list
      })
      .catch((error) => {
        console.error("Error deleting card:", error); // Handle error
      });
  };

  // Function to update a card
  const updateCard = (updatedCard) => {
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card)) // Update the modified card
    );
  };

  // Function to open AddItemModal
  const openModal = () => setIsModalOpen(true);
  // Function to close AddItemModal
  const closeModal = () => setIsModalOpen(false);

  // Function to open EditItemModal and select the card to edit
  const openEditModal = (card) => {
    setSelectedCard(card); // Select the card to edit
    setIsEditModalOpen(true); // Open EditItemModal
  };

  // Function to close EditItemModal
  const closeEditModal = () => {
    setIsEditModalOpen(false); // Close EditItemModal
    setSelectedCard(null); // Reset selected card
  };

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-between items-center">
        <h1>My Travel Card Collection</h1>
        <Button
          className="bg-[#F55848] hover:bg-[#EF4432]"
          text="Add Item +"
          onClick={openModal} // Open AddItemModal
        />
      </div>
      {isModalOpen && (
        <AddItemModal
          closeModal={closeModal}
          addNewCard={addNewCard}
          refreshCards={refreshCards}
        />
      )}
      <AllItems
        cards={cards}
        handleDelete={handleDelete}
        onEdit={openEditModal} // Pass function to open Edit modal
      />
      {isEditModalOpen && selectedCard && (
        <EditItemModal
          card={selectedCard}
          closeModal={closeEditModal}
          updateCard={updateCard}
        />
      )}
    </div>
  );
}

export default Home;
