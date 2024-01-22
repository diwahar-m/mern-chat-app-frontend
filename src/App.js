import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';


function App() {
  return (
    <div className="App">
      <Router >
        <Switch>
          <Route path='/' exact component={HomePage} />
          <Route path='/chats' component={ChatPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
