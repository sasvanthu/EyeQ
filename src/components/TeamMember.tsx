import React from "react";
import { motion } from "framer-motion";

interface TeamMemberProps {
  name: string | React.ReactNode;
  role: string;
  imageUrl: string;
  linkedinUrl: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  role,
  imageUrl,
  linkedinUrl,
}) => {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          type: "spring", 
          stiffness: 100, 
          damping: 12,
          delay: 0.1
        } 
      }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -15,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <motion.a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative overflow-hidden rounded-full w-48 h-48 mb-4 group"
        whileHover={{ 
          scale: 1.1,
          y: -10,
          transition: { type: "spring", stiffness: 300 }
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          transition: { 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2
          } 
        }}
      >
        <motion.img
          src={imageUrl}
          alt={`${name} - ${role}`}
          className="w-full h-full object-cover"
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.3 }
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"
          whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
        </motion.div>
      </motion.a>
      <div className="text-xl font-bold">
        {name}
      </div>
      <motion.p
        className="text-gray-500"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {role}
      </motion.p>
    </motion.div>
  );
};

export default TeamMember;