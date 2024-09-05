import React, { useState } from 'react';
import { EmbeddedVoice } from '@humeai/voice-embed-react';

const HumeEmbed = () => {
  const apiKey = 'mH1MZ9OYtc86RwAKmIz2KavdkgTT82WAMTrC3HG8AkMMYGQN' || '';
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsEmbedOpen(true)}>Open Widget</button>
      <EmbeddedVoice
        auth={{ type: 'apiKey', value: apiKey }}
        onMessage={(msg) => console.log('Message received: ', msg)}
        onClose={() => setIsEmbedOpen(false)}
        isEmbedOpen={isEmbedOpen}
      />
    </div>
  );
};

export default HumeEmbed;
