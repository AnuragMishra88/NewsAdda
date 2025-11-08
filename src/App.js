// import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react'
import NavBar from './components/NavBar';
import News from './components/News';
import LoadingBar from "react-top-loading-bar";

import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";

export default class App extends Component {
  state={
    progress:0
  }
  
  setProgress=(progress)=>{
    this.setState({progress:progress})
  }
    
  render() {
    return (
      <div>
        <Router>
          <LoadingBar
        color="#f11946"
        progress={this.state.progress}
        onLoaderFinished={() => this.setProgress(0)}
      />
        <NavBar/>
        
         <Routes>
          <Route path="/" element={<News setProgress={this.setProgress} key="home" pageSize={10} country="us" category="general" />} />
          <Route path="/Home" element={<News setProgress={this.setProgress} key="home" pageSize={10} country="us" category="general" />} />
    <Route path="/link" element={<News setProgress={this.setProgress} key="link" pageSize={10} country="us" category="general" />} />
    <Route path="/technology" element={<News setProgress={this.setProgress} key="technology" pageSize={10} country="us" category="technology" />} />
    <Route path="/business" element={<News setProgress={this.setProgress} key="business" pageSize={10} country="us" category="business" />} />
    <Route path="/entertainment" element={<News setProgress={this.setProgress} key="entertainment" pageSize={10} country="us" category="entertainment" />} />
    <Route path="/general" element={<News setProgress={this.setProgress} key="general" pageSize={10} country="us" category="general" />} />
    <Route path="/health" element={<News setProgress={this.setProgress} key="health" pageSize={10} country="us" category="health" />} />
    <Route path="/science" element={<News setProgress={this.setProgress} key="science" pageSize={10} country="us" category="science" />} />
    <Route path="/sports" element={<News setProgress={this.setProgress} key="sports" pageSize={10} country="us" category="sports" />} />
</Routes>

        </Router>
      </div>
    )
  }
}

// router karte waqt npm install react-router-dom
// import copy krenge router.com
// <Router> se enclose krenge div ko</Router>
// <Routes> use hoga instead of switch</Routes>
// a changes to Link and href changes to "to"


