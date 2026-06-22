import { motion } from "framer-motion";

const MotionH1 = motion.h1;
const MotionDiv = motion.div;
const MotionP = motion.p;

const SplitTextHero = () => {
  return (
    <div className="w-full mt-24 sm:mt-28 md:mt-40 px-4 py-12 sm:py-16 flex flex-col items-center justify-center text-center">

      {/* 🔥 Main Split Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12">

        {/* LEFT TEXT */}
        <MotionH1
          initial={{ x: -180, opacity: 0, scale: 0.9, filter: "blur(6px)" }}
          whileInView={{ x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 50, damping: 18, mass: 1.2 }}
          viewport={{ once: false, amount: 0.3 }}
          className="
            text-2xl sm:text-3xl md:text-5xl lg:text-6xl 
            font-bold text-white leading-tight tracking-wide
          "
        >
          Revolutionize <br className="hidden md:block" /> The Way You
        </MotionH1>

        {/* CENTER LINE */}
        <MotionDiv
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          viewport={{ once: false, amount: 0.3 }}
          className="
            hidden md:block
            w-[3px] h-20 md:h-28 
            bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 
            origin-top rounded-full shadow-lg
          "
        />

        {/* RIGHT TEXT */}
        <MotionH1
          initial={{ x: 180, opacity: 0, scale: 0.9, filter: "blur(6px)" }}
          whileInView={{ x: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 50, damping: 18, mass: 1.2 }}
          viewport={{ once: false, amount: 0.3 }}
          className="
            text-2xl sm:text-3xl md:text-5xl lg:text-6xl 
            font-bold leading-tight tracking-wide 
            bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 
            text-transparent bg-clip-text
          "
        >
          Learn <br className="hidden md:block" /> Online
        </MotionH1>

      </div>

      {/* 🔥 Bottom Text */}
      <MotionP
        initial={{ opacity: 0, y: 50, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.4, duration: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        className="
          mt-6 sm:mt-8 
          max-w-xs sm:max-w-lg md:max-w-2xl 
          text-gray-400 
          text-xs sm:text-sm md:text-lg 
          leading-relaxed
        "
      >
        Unlock your potential with cutting-edge courses designed to transform
        your future. Learn smarter, faster, and better with EduSarthi.
      </MotionP>

    </div>
  );
};

export default SplitTextHero;
