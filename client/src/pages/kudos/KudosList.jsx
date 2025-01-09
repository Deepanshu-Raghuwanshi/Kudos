import React from "react";
import style from "./KudoList.module.css";

const KudosList = ({ kudosData, handleLike }) => {
  if (!Array.isArray(kudosData)) {
    return null;
  }

  const formatBadge = (badge) => {
    return badge
      .split("_")
      .map((word, index) => {
        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word.toLowerCase();
      })
      .join(" ");
  };

  return (
    <main className={style.main_section}>
      {kudosData.map((kudo) => (
        <div key={kudo._id} className={style.kudo_card}>
          <p className={style.kudo_text}>
            {kudo?.givenBy?.name} awarded the {formatBadge(kudo.badge)} badge to{" "}
            {kudo?.givenTo?.name}
          </p>
          <p className={style.kudo_message}>
            Thanks for your help with the last project
          </p>
          <div className={style.like_section}>
            {kudo.like ? (
              <span
                onClick={() => handleLike(kudo._id)} // Pass kudo ID to the handler
                className={`${style.like_icon} ${style.liked}`}
              >
                ❤️
              </span>
            ) : (
              <span
                onClick={() => handleLike(kudo._id)}
                className={style.kudo_text}
                style={{ cursor: "pointer" }}
              >
                Like
              </span>
            )}
          </div>
        </div>
      ))}
    </main>
  );
};

export default KudosList;
