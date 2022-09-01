import React, { useState } from 'react';
import ProgressBar from 'react-dennis-progressbar';

const Stepper = ({ step, width }) => {
  const [stepNumber, setStepNumber] = useState(() => step);

  return (
    <div style={{ width }}>
      <ProgressBar
        bulletColor={{
          active: 'red',
        }}
        lineColor={{
          active: 'red',
        }}
        stepNumber={stepNumber}
        steps={[1, 1, 1, 1, 1, 1, 1]}
        bullets={true}
      />
    </div>
  );
};

export default Stepper;
