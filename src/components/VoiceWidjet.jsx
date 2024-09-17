// components/VoiceWidget.js
import React from 'react';

const VoiceWidget = () => {
  return (
    <iframe
      title="Hume Voice Widget"
      src="https://voice-widget.hume.ai"
      width="100%"
      height="600px"
      frameBorder="0"
      allow="microphone"
      allowFullScreen
    ></iframe>
  );
};

export default VoiceWidget;
