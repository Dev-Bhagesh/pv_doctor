import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LineChart from './components/Linechart'
import { Line } from 'react-chartjs-2'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div >
    <LineChart/>
    </div>
    </>
  )
}

export default App
