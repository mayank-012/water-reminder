
export const calculateDailyWaterIntake = (temp, humidity, weight,activityLevel,age,gender) => {
    let baseIntake = weight * 0.033;
  
    if (gender === 'male') {
      baseIntake *= 1.1; 
    } else {
      baseIntake *= 1.0;
    }
  
    switch (activityLevel) {
      case 'low':
        baseIntake *= 1.0;
        break;
      case 'moderate':
        baseIntake *= 1.2;
        break;
      case 'high':
        baseIntake *= 1.5;
        break;
      default:
        baseIntake *= 1.0;
        break;
    }
  
    if (age < 30) {
      baseIntake *= 1.0;
    } else if (age < 55) {
      baseIntake *= 0.95;
    } else {
      baseIntake *= 0.9;
    }
  
    if (temp > 30) {
      baseIntake *= 1.1;
    }
    if (humidity > 70) {
      baseIntake *= 1.05;
    }
  
    return parseFloat(baseIntake.toFixed(2));
  };
  