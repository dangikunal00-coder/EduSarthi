import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Chatbot from "../components/Chatbot";
import robotImage from "../assets/robot.png";

export default function RobotAssistant() {
  const robotRef = useRef(null);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    if (!robotRef.current) return;

    const animation = gsap.to(robotRef.current, {
      y: -8,
      duration: 1.4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    return () => animation.kill();
  }, []);

  const handleClick = () => {
    if (robotRef.current) {
      gsap
        .timeline()
        .to(robotRef.current, { scale: 1.12, rotate: 4, duration: 0.16 })
        .to(robotRef.current, { scale: 1, rotate: 0, duration: 0.18 });
    }

    setOpenChat(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Open EduSarthi AI assistant"
        className="fixed bottom-5 right-5 z-[9999] flex h-20 w-20 items-center justify-center rounded-full border border-indigo-400/50 bg-[#1E293B] shadow-2xl shadow-indigo-900/40 transition hover:bg-[#334155] sm:h-24 sm:w-24"
      >
        <span ref={robotRef} className="block">
          <img
            src={robotImage}
            alt="EduSarthi AI assistant"
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />
        </span>
      </button>

      {openChat && <Chatbot onClose={() => setOpenChat(false)} />}
    </>
  );
}
