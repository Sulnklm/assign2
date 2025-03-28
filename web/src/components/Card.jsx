import React from "react";
import Button from "./Button"; // Import Button component

function Card({ card, onClick, onEdit, onDelete }) {
  const formattedDate = new Date(card.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="relative rounded-3xl overflow-hidden cursor-pointer"
      onClick={() => onClick(card)} 
    >
      {/* Edit Button */}
      <Button
        text="Edit"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(card);
        }}
        className="absolute top-3 right-3 bg-black/30 backdrop-blur-md border border-white/30 hover:bg-gray-700 text-white py-2 px-4 rounded"
      />

      <img
        className="relative -z-20 w-full h-96 object-cover"
        src={`http://localhost:5001${card.image_url}`}
        alt={card.title}
      />
      <div className="p-5 pb-3 relative">
        <img
          className="absolute right-0 left-0 -top-3 xl:top-1 -z-10 blur-lg h-fit w-full scale-125 brightness-50"
          src={`http://localhost:5001${card.image_url}`}
          alt={card.title}
        />
        <div className="-translate-y-5">
          <h3 className="text-white">{card.title}</h3>
          <p className="text-white">{card.description}</p>
          <div className="flex gap-3 py-3">
            <div className="bg-white/20 backdrop-blur-lg w-fit px-3 py-1.5 rounded-full">
              <p className="font-[450] text-white">★ {card.rating} </p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg w-fit px-3 py-1.5 rounded-full">
              <p className="text-white">{card.category_name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
