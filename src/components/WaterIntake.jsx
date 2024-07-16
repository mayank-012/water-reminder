
import React, { useState } from 'react';
import '../css/WaterIntake.css'; 

const WaterIntake = ({ setWaterIntake, resetTimer }) => {
  const [inputValue, setInputValue] = useState('');

  const addWater = () => {
    const addedAmount = parseInt(inputValue);

    if (addedAmount > 0) {
      setWaterIntake(prevIntake => prevIntake + addedAmount);
      resetTimer();
    }
    setInputValue('');
  };

  return (
    <div className="water-intake">
      <h2>Water Intake</h2>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="ml"
      />
      <button onClick={addWater}>Add Water</button>
    </div>
  );
};

export default WaterIntake;
