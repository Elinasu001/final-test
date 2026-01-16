import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './component/Home/Home.jsx';
import TestChatRooms from './component/TestChatRooms/TestChatRooms.jsx';

function App() {
  const navi = useNavigate();

  return (
      <>
        <nav>
          <h1>ProResponse</h1>
          <ul>
              <li onClick={() => navi("/TestChatRooms")}>Test Chat Rooms</li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/TestChatRooms" element={<TestChatRooms />} />
          <Route path="/chatRoom/:id" element={<ChatRoom/>}/>
        </Routes>
      </>
  )
}

export default App