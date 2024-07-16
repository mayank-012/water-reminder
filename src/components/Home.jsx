import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'; 

const Home = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="container">
      <div className="subcontainer">
        <div className="left">
          <h1 className="typography-h1">Welcome to PaniPal</h1>
          <h2 className="typography-h2">Your Friendly Hydration Companion</h2>

          <div className="box">
            <p className="typography-body1">
              Just like zebras in Africa have to risk their lives to drink water from rivers, navigating crocodile-infested waters, 
              staying hydrated shouldn't be a dangerous journey for you. With PaniPal, all you need to do is sign up and start drinking 
              regularly to ensure you stay hydrated and healthy.
            </p>
            <p className="typography-body1">
              Enjoy personalized water intake reminders, weather-based recommendations, and progress tracking. Earn badges and rewards 
              for achieving your hydration goals!
            </p>
          </div>
          <div className="box">
            <p className="typography-body1">
              Ready to start your hydration journey with ease? 
              Sign up or log in now and let PaniPal take care of your hydration needs.
            </p>
          </div>
          <div className="box">
            <button className="button button-primary" onClick={handleLoginRedirect}>
              Login
            </button>
            <button className="button button-secondary" onClick={handleSignUpRedirect}>
              Sign Up
            </button>
          </div>
        </div>
        <div className="right">
          <div className="image-container">
            <img src="/assets/zebra.jpeg" alt="Zebra holding a glass of water" className="zebra-image" />
          </div>
        </div>
      </div>
      
      <div className="footer">
        <p>© 2024 PaniPal. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;
