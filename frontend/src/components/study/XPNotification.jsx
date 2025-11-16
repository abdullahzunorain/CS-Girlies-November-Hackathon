import React, { useEffect, useState } from "react";
import "./XPNotification.css";

const XPNotification = ({ xp, show }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    }
  }, [show]);

  if (!visible) return null;

  return <div className="xp-notification">+{xp} XP ⭐</div>;
};

export default XPNotification;
