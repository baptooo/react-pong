import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App
  width={window.innerWidth}
  height={window.innerHeight - 200}
/>, document.getElementById('root'));

registerServiceWorker();
