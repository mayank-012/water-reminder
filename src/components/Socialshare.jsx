import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import "../css/Socialshare.css"
const SocialShare = ({ waterIntake, dailyGoal }) => {
  const message = `I met my water intake goal of ${dailyGoal.toFixed(2)} liters today! How about you? #StayHydrated`;

  return (
    <div className="social-share">
      <h2>Share Your Progress</h2>
      <FacebookShareButton url={window.location.href} quote={message}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={window.location.href} title={message}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <WhatsappShareButton url={window.location.href} title={message}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </div>
  );
};

export default SocialShare;
