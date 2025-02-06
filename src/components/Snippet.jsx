import React from 'react';

const Snippet = ({ snippet, userInput, errors }) => {
  // Highlight mismatches in the snippet
  const renderSnippet = () => {
    return snippet.split('').map((char, index) => {
      const isError = errors.some((error) => error.position === index);
      return (
        <span key={index} style={{ color: isError ? 'red' : 'black' }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="snippet">
      <pre>{renderSnippet()}</pre>
    </div>
  );
};

export default Snippet;