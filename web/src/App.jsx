import React, { useState, useEffect } from "react";
import axios from "axios";
import AllItems from "./components/AllItems";
import AddItemModal from "./components/AddItemModal";
import Button from "./components/Button";

function App() {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch travel cards when the component mounts
  const refreshCards = () => {
    axios
      .get("http://localhost:5001/api/travel-cards")
      .then((response) => {
        setCards(response.data); // Update state with fetched cards
      })
      .catch((error) => {
        console.error("Error fetching travel cards:", error);
      });
  };

  useEffect(() => {
    refreshCards(); // Fetch cards once when the component mounts
  }, []);

  // Add a new card to the state
  const addNewCard = (newCard) => {
    setCards((prevCards) => [...prevCards, newCard]); // Add new card to the list
  };

  // Handle card deletion
  const handleDelete = (cardId) => {
    axios
      .delete(`http://localhost:5001/api/travel-cards/${cardId}`)
      .then(() => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== cardId)); // Update state after deleting
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
      });
  };

  // Modal open/close
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-between items-center mb-5">
      <h1>My Travel Card</h1>
      <Button
        className="bg-[#F55848] hover:bg-[#EF4432] translate-y-3"
        text="Add Item +"
        onClick={openModal}
      />
      </div>
      {isModalOpen && (
        <AddItemModal
          closeModal={closeModal}
          addNewCard={addNewCard}
          refreshCards={refreshCards} // Pass refreshCards as a prop
        />
      )}
      <AllItems cards={cards} handleDelete={handleDelete} />
    </div>
  );
}

export default App;
