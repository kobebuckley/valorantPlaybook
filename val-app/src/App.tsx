import logo from "./logo.svg"
import { Counter } from "./features/counter/Counter"
import { AgentsList } from "./features/agents/AgentsList"
import { PostsList } from './features/posts/PostsList'

import "./App.css"
import React from "react"
import { AddPostForm } from "./features/posts/AddPostForm"


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Navbar /> */}
        <React.Fragment>
          <AgentsList />
          <AddPostForm />
          <PostsList />
        </React.Fragment>
      </header>
    </div>
  )
}

export default App
