import { useState } from 'react'
import arcanaVerseLogo from './assets/arcanaVerse.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="#" target="_blank">
          <img src={arcanaVerseLogo} className="logo" alt="ArcanaVerse logo" />
        </a>
      </div>
      <h1>ArcanaVerse</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          👍 {count}
        </button>
        <p>
          Let&apos;s rock !
        </p>
      </div>
    </>
  )
}

export default App
