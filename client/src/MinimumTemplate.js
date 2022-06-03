// 1. Create App.js

const App = () => {
  return <div>Blog App</div>;
};

export default App;

// 2. Create index.js

import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// 3. > npm start,
//    The server will start at locahost:3000
