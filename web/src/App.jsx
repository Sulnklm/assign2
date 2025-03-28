import React, { useState, useEffect } from "react";
import axios from "axios";
import AllItems from "./components/AllItems";
import AddItemModal from "./components/AddItemModal";
import Button from "./components/Button";
import EditItemModal from "./components/EditItemModal";

function App() {
  const [cards, setCards] = useState([]); // State to store the list of travel cards
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage AddItemModal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State to manage EditItemModal visibility
  const [selectedCard, setSelectedCard] = useState(null); // State to store the selected card for editing

  // Function to fetch travel cards from the backend API
  const refreshCards = () => {
    axios
      .get("http://localhost:5001/api/travel-cards")
      .then((response) => {
        setCards(response.data); // Update the cards state with the fetched data
      })
      .catch((error) => {
        console.error("Error fetching travel cards:", error); // Log any errors that occur during the fetch
      });
  };

  // UseEffect hook to fetch cards when the component mounts
  useEffect(() => {
    refreshCards(); // Fetch the cards when the component is first rendered
  }, []); // Empty dependency array means this runs only once

  // Function to add a new card to the state
  const addNewCard = (newCard) => {
    setCards((prevCards) => [...prevCards, newCard]); // Append the new card to the current list of cards
  };

  // Function to delete a card from the state and the backend
  const handleDelete = (cardId) => {
    axios
      .delete(`http://localhost:5001/api/travel-cards/${cardId}`)
      .then(() => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== cardId)); // Remove the deleted card from the state
      })
      .catch((error) => {
        console.error("Error deleting card:", error); // Log any errors that occur during the deletion
      });
  };

  // Function to update an existing card in the state
  const updateCard = (updatedCard) => {
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card)) // Replace the old card with the updated card
    );
  };

  // Functions to open and close the add item modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Functions to open and close the edit item modal
  const openEditModal = (card) => {
    setSelectedCard(card); // Set the selected card to be edited
    setIsEditModalOpen(true); // Open the edit modal
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false); // Close the edit modal
    setSelectedCard(null); // Clear the selected card
  };

  // UseEffect hook to close the add modal if the edit modal is closed
  useEffect(() => {
    if (!isEditModalOpen && selectedCard === null) {
      closeModal(); // Close the add modal if the edit modal is not open and no card is selected
    }
  }, [cards]); // This effect runs whenever the cards state changes

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-between items-center">
        <h1>My Travel Card Collection</h1>
        <Button
          className="bg-[#F55848] hover:bg-[#EF4432]"
          text="Add Item +"
          onClick={openModal} // Open the add item modal when clicked
        />
      </div>
      {isModalOpen && (
        <AddItemModal
          closeModal={closeModal}
          addNewCard={addNewCard} // Pass functions to AddItemModal to add a new card
          refreshCards={refreshCards} // Pass refreshCards function to reload the cards after adding a new one
        />
      )}
      <AllItems
        cards={cards} // Pass the current list of cards to AllItems to display them
        handleDelete={handleDelete} // Pass the delete function to AllItems for handling card deletion
        onEdit={openEditModal} // Pass the openEditModal function to AllItems to edit a card
      />
      {isEditModalOpen && selectedCard && (
        <EditItemModal
          card={selectedCard} // Pass the selected card to EditItemModal for editing
          closeModal={closeEditModal} // Pass the closeEditModal function to close the modal
          updateCard={updateCard} // Pass the updateCard function to update the card after editing
        />
      )}
    </div>
  );
}

export default App;