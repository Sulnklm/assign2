import React, { useState, useEffect } from "react";
import axios from "axios";
import AllItems from "./components/AllItems";
import AddItemModal from "./components/AddItemModal";
import Button from "./components/Button";
import EditItemModal from "./components/EditItemModal";

function App() {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

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
    refreshCards(); // Fetch cards when component mounts
  }, []);

  const addNewCard = (newCard) => {
    setCards((prevCards) => [...prevCards, newCard]);
  };

  const handleDelete = (cardId) => {
    axios
      .delete(`http://localhost:5001/api/travel-cards/${cardId}`)
      .then(() => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
      });
  };

  const updateCard = (updatedCard) => {
    setCards((prevCards) =>
      prevCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (card) => {
    setSelectedCard(card);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCard(null);
  };

  // useEffect로 상태 변경 후 모달 닫기 처리
  useEffect(() => {
    if (!isEditModalOpen && selectedCard === null) {
      closeModal(); // 모달 닫기
    }
  }, [cards]); // cards 상태 변경될 때마다 실행

  return (
    <div className="container mx-auto p-5">
      <div className="flex justify-between items-center">
      <h1>My Travel Card Collection</h1>
      <Button
        className="bg-[#F55848] hover:bg-[#EF4432]"
        text="Add Item +"
        onClick={openModal}
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
        onEdit={openEditModal}
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

export default App;
