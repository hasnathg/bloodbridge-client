import React from 'react';

import { Droplet } from 'lucide-react';
import { motion } from "motion/react";

const LoadingSpinner = () => {
    return (
       <div className="flex justify-center items-center h-[50vh]">
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="text-red-600"
      >
        <Droplet size={48} />
      </motion.div>
    </div>
    );
};

export default LoadingSpinner;