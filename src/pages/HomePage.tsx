import React from 'react';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Radlett Lodge</h1>
      <p>This is the homepage. More great content coming soon!</p>
    </div>
  );
};

export default HomePage;
import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Radlett Lodge</h1>
      <p className="text-lg">
        We are a friendly and vibrant Masonic Lodge in the Province of Hertfordshire, meeting on Saturdays. 
        Whether you're curious about Freemasonry or looking for a lodge to join, you'll find a warm welcome here.
      </p>
    </div>
  );
};

export default HomePage;
