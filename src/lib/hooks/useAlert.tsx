import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { GrClose } from 'react-icons/gr';

type AlertType = 'success' | 'warning' | 'error';

export const useAlert = () => {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<AlertType>('success');

  const showAlert = (status: AlertType, message: string) => {
    setStatus(status);
    setMessage(message);
    setIsAlertVisible(true);
  };

  const AlertComponent = () => {
    if (!isAlertVisible) return <></>;

    // Set background color
    let bgColor: string;
    switch (status) {
      case 'success':
        bgColor = 'bg-green-100';
        break;
      case 'warning':
        bgColor = 'bg-yellow-100';
        break;
      case 'error':
        bgColor = 'bg-red-100';
        break;
    }

    return (
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`alert ${bgColor} fixed z-50 bottom-4 right-4 flex justify-between rounded-lg py-5 px-6 mb-3 text-base text-black inline-flex items-center min-w-[24rem] max-w-[30rem] alert-dismissible fade show`}
        role="alert"
      >
        <span>{message}</span>
        <GrClose
          className="w-6 h-6 ml-4 cursor-pointer"
          onClick={() => setIsAlertVisible(false)}
        />
      </motion.div>
    );
  };

  return { AlertComponent, showAlert };
};
