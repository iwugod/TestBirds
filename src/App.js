import React, { Component } from 'react';
import logo from './logo.svg';
import './styles/css/App.css';
//import './styles/css/font.css';
import font from '../node_modules/roboto-fontface/css/roboto/sass/roboto-fontface.scss'

//imports
// import AddTeam from './AddTeam';
import AddTeamMate from './AddTeamMate';

class App extends Component {
  render() {
    return (
      <div className="App">
      
        <div className="row">
            <AddTeamMate/>
        </div>
       
      </div>
    );
  }
}

export default App;
