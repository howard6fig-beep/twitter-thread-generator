import { useState, useEffect } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [tweets, setTweets] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlocked') === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const generateThread = () => {
    if (!text.trim()) return;
    
    // Split text into sentences/words to pack them intelligently
    const words = text.split(/\s+/);
    let currentTweet = "";
    let generatedTweets = [];
    
    words.forEach(word => {
      // Leave room for "1/N " prefix (about 6 chars)
      if ((currentTweet + " " + word).length <= 274) {
        currentTweet += (currentTweet ? " " : "") + word;
      } else {
        generatedTweets.push(currentTweet);
        currentTweet = word;
      }
    });
    if (currentTweet) generatedTweets.push(currentTweet);
    
    // Add numbering
    const finalTweets = generatedTweets.map((tweet, i) => `${i + 1}/${generatedTweets.length} ${tweet}`);
    setTweets(finalTweets);
  };

  const copyTweet = (tweet, index) => {
    navigator.clipboard.writeText(tweet);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Twitter Thread Generator</h1>
      <p style={{ color: '#666', textAlign: 'center' }}>Paste your text below and instantly split it into perfectly sized tweets.</p>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your blog post, notes, or long thoughts here..."
        style={{ width: '100%', height: '200px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '20px', boxSizing: 'border-box' }}
      />
      
      <button 
        onClick={generateThread} 
        style={{ marginTop: '10px', padding: '12px 20px', background: '#1DA1F2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
      >
        Generate Thread
      </button>

      {tweets.length > 0 && (
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Map through tweets and show them */}
          {tweets.map((tweet, i) => {
            // If it's tweet 4 or higher, and NOT unlocked, blur it.
            const isLocked = i >= 3 && !isUnlocked;
            
            return (
              <div key={i} style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ margin: 0, color: '#333', lineHeight: '1.5', filter: isLocked ? 'blur(5px)' : 'none', paddingRight: '10px' }}>
                    {tweet}
                  </p>
                  {!isLocked && (
                    <button 
                      onClick={() => copyTweet(tweet, i)}
                      style={{ padding: '5px 10px', background: copiedIndex === i ? '#28a745' : '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', flexShrink: 0 }}
                    >
                      {copiedIndex === i ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                
                {/* Paywall overlay for tweet 4 */}
                {i === 3 && !isUnlocked && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '25px', border: '2px solid #1DA1F2', borderRadius: '10px', textAlign: 'center', width: '300px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '16px' }}>Unlock Full Thread</p>
                    <p style={{ fontSize: '14px', marginBottom: '20px', color: '#666' }}>Get the rest of your tweets and copy them instantly.</p>
                    <a href="STRIPE_PAYMENT_LINK_HERE" style={{ background: '#635bff', color: 'white', padding: '12px 25px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold', display: 'inline-block' }}>
                      Unlock for $3
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
