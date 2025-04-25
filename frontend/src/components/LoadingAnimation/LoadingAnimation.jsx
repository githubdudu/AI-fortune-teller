import { motion } from 'framer-motion';
import './LoadingAnimation.css';

/* const rotatingContainer = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      duration: 2,
      ease: "linear"
    }
  }
}; */

const loadingText = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

function LoadingAnimation() {
  return (
    <div className="loading-wrapper">
      {/* another loading animation */}
      {/* <motion.div
        className="circle-container"
        variants={rotatingContainer}
        initial="initial"
        animate="animate"
      >
         <div className="dot" style={{ transform: "rotate(0deg) translateY(-20px)" }} />
        <div className="dot" style={{ transform: "rotate(45deg) translateY(-20px)" }} />
        <div className="dot" style={{ transform: "rotate(90deg) translateY(-20px)" }} />
        <div className="dot" style={{ transform: "rotate(135deg) translateY(-20px)" }} />
        <div className="dot" style={{ transform: "rotate(180deg) translateY(-20px)" }} />
      </motion.div> */}
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.p
        className="loading-text"
        variants={loadingText}
        initial="initial"
        animate="animate"
      >
        Shuffling your destiny...
      </motion.p>
    </div>
  );
}

export default LoadingAnimation;
