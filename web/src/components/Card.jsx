import React from "react";
import axios from "axios"; // axios import 추가

function Card({ card, onClick, onDelete }) {
  // ISO 날짜를 사용자 친화적인 형식으로 변환
  const formattedDate = new Date(card.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short", // Jan, Feb, Mar 형식
    day: "numeric",
  });

  const handleDelete = () => {
    // 삭제 요청을 보낸 후 부모 컴포넌트에 삭제를 알리기 위해 onDelete 호출
    axios
      .delete(`http://localhost:5001/api/travel-cards/${card.id}`)
      .then((response) => {
        console.log(response.data.message); // 성공 메시지 출력
        onDelete(card.id); // 삭제된 카드 ID를 부모 컴포넌트로 전달하여 UI에서 삭제
      })
      .catch((error) => {
        console.error("Error deleting card:", error); // 삭제 실패 시 에러 로그 출력
      });
  };

  return (
    <div className="rounded-3xl overflow-hidden" onClick={onClick} >
      {/* 카드 이미지 */}
      <img
        className="relative -z-20 w-full h-96 object-cover"
        src={`http://localhost:5001${card.image_url}`}
        alt={card.title}
      />
      <div className="p-5 pb-3 relative">
        {/* 이미지 배경 */}
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
