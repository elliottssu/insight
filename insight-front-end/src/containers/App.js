import React from 'react';
import './App.less';

export default function App({ children }) {
  return (
    <div className="App">
      <div>{children}</div>
    </div>
  );
}
