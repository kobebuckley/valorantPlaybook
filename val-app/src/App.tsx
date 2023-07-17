import logo from "./logo.svg"
import { Counter } from "./features/counter/Counter"
import { AgentsList } from "./features/agents/AgentsList"
import { PostsList } from './features/posts/PostsList'

import "./App.css"
import React from "react"


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <Counter /> */}
        <AgentsList />
        <PostsList />
      </header>
    </div>
  )
}

export default App
