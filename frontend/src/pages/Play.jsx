import React, { useEffect, useMemo, useRef, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/theme.jsx';
import io from 'socket.io-client';



function Play() {
  const {theme, changeThemeLight, changeThemeDark} = useTheme();
  const location = useLocation();
  const isFirstRender = useRef(true);
  const referenceForModal = useRef();
  const referenceForOverlay = useRef()
  const [room , setRoom] = useState(false);
  const [socket,setSocket] = useState(null);
  const [matrix, setMatrix] = useState([['','',''], ['','',''],['','','']])
  const [activePlayer, setActivePlayer] = useState(false);
  const [truthy, setTruthy] = useState(false)
  const [roomNumber, setRoomNumber] = useState(0);
  let me;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const roomNumber = parseInt(e.target.roomNumber.value); 
    
    if (socket) {
      socket.emit('joinRoom', roomNumber);
    }
    const modal = document.getElementById('modal')
    modal.classList.remove('flex-col')
    modal.classList.add('hidden')
    const overlay = document.getElementById('overlay')
    overlay.classList.add('hidden')
    const body = document.body;
    body.style.overflow = 'auto'
    document.getElementById('tichead').style.zIndex = 10
    setRoom(true)
  };
   

  const handleMove = (event) => {
 
    if(truthy && activePlayer){
    try{
      const clickedElement = event.target;
    const parentElement = clickedElement.parentNode;
    const grandParentElement = parentElement.parentNode;
    const indexOfClicked = Array.from(parentElement.children).indexOf(clickedElement);
    const indexOfParent = Array.from(grandParentElement.children).indexOf(parentElement)
   // console.log(event.target, indexOfClicked, indexOfParent);
    //console.log(socket, roomNumber)
    if(socket){
    socket.emit('move',roomNumber, indexOfParent, indexOfClicked);
    }
    setActivePlayer(!activePlayer);
  } catch(err){ console.log(err);}
}

  };

  
  // socket here
  useEffect(() => {
    let sock =  io('http://localhost:3000')

    sock.on('connect', () => {
      console.log('Connected to server');
    });


    sock.on('connect_error', (error) => {
      console.error('Failed to connect to server:', error);
    });

    sock.on('socketId', (socketId) => {
     // console.log('Socket ID received from server:', socketId, typeof socketId);
      me = socketId
     // console.log(me);
    })
    
    sock.on('roomCreated', (roomNumber,r)=>{
   //   console.log('hi');
      setRoomNumber(roomNumber)
      setTruthy(r);
      
    })


    sock.on('gamestart', (r, roomN)=>{
     // console.log(r);
      setTruthy(r)
      
     // console.log(roomN, typeof roomN);
      setRoomNumber(roomN)
    })

    sock.on('yourTurn', ( board , ap, msg)=>{
      //console.log('board:', board, typeof board);
      
      setMatrix(board)
    if(msg===""){   
    //  console.log("me is :",me);
    //  console.log("ap is : ", ap);
      //console.log(ap, typeof ap, me, typeof me);
      if(ap!==me){
    //    console.log('played before');
      }
      else{
        setActivePlayer(true)
      }
    }
    else{
      setTruthy(false)
      setRoom(false)
      setTimeout(() => {
        alert(msg)
      }, 1000);
    }
      
    })
     
    sock.on('invalidRoom',()=>{
      alert('invalid room please refresh !')
    })

    setSocket(sock)

    return () => {
      sock.disconnect(); // Clean up socket connection when component unmounts
    };
  }, []);
  
  useEffect(()=>{
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const {hash} = location ;
   // console.log(hash);
    if(hash){
      const element = document.getElementById(hash.substring(1))
      if(element){
           element.scrollIntoView({behavior:'smooth'})
      }
      else{
           window.scrollTo({top:0, behavior:'smooth'})
      }
    }
  },[location])

  

  return (
    <Layout>
    <div className='flex-col flex items-center w-full gap-10 pb-32'>
     <div id='tic' className='min-h-screen w-full flex flex-col items-center gap-20 '>
        <div className='flex w-full justify-center'>
          <h1 id='tichead' className='relative z-10 text-3xl'>
            Tic Tac Toe 
          </h1>
          <div className='absolute w-full text-3xl bg-gradient-to-r from-blue-500 to-red-500 p-4 rounded-lg blur-lg' >
          </div>
        </div>
        <div id='modal' ref={referenceForModal} aria-hidden='true' className={`h-56 w-56 p-3 rounded-md  hidden justify-center items-center border-white  text-white z-10 bg-black `} >
          <div className='flex-row justify-between p-3 flex'>
          <label>Enter room no:</label>
          <button id='closeModal'
          onClick={()=>{
            const modal = document.getElementById('modal')
            modal.classList.remove('flex-col')
            modal.classList.add('hidden')
            const overlay = document.getElementById('overlay')
            overlay.classList.add('hidden')
            const body = document.body;
            body.style.overflow = 'auto'
            document.getElementById('tichead').style.zIndex = 10
        
          }}>
            X
          </button>
          </div>
          <form onSubmit={handleFormSubmit}>
           <label htmlFor="roomNumber">Enter room no:</label>
           <input style={{ color: 'red' }} type="text" id="roomNumber" name="roomNumber" />
           <button type="submit">Submit</button>
          </form>

        </div>
        <div ref={referenceForOverlay} id='overlay'  className='absolute hidden h-screen  w-screen blur-xl'>
        </div>
       {!room?<div className='flex flex-row gap-10'>
        <button className='bg-red-500 hover:bg-green-500 p-2 rounded-full' 
        onClick={(e)=>{
            const modal = document.getElementById('modal')
            modal.classList.remove('hidden')
            modal.classList.add('flex-col')
            const overlay = document.getElementById('overlay')
            overlay.classList.remove('hidden')
            const body = document.body;
            overlay.style.backgroundColor='white',
            overlay.style.opacity=0.5
            body.style.overflow = 'hidden'
            document.getElementById('tichead').style.zIndex = 0
            
        }}>
        Join Room 
        </button>
        <button className='bg-blue-500 hover:bg-green-500 p-2 rounded-full'
        onClick={ async (e)=>{
          if(socket)
          socket.emit('createRoom');         
          setRoom(true);
          setActivePlayer(true);
        }}>
        Create Room
        </button>
       </div>:<></>}
       {( room && roomNumber && !truthy)?
       <div>
        Tell your friend to join {roomNumber}
       </div>
       :
       <>
       </>}
       {room && truthy &&
  <div className='flex flex-col sm:h-96 sm:w-96 h-56 w-full bg-gradient-to-r from-blue-400 to-red-400 rounded-xl'>
    {matrix.map((row, rowIndex) => (
      <div key={rowIndex} className='h-full w-full flex flex-row'>
        {row.map((cell, cellIndex) => (
          <button  
          onClick={handleMove} 
          key={cellIndex}  className={`h-full w-1/3 ${rowIndex !== 2 ? 'border-b-4' : ''} ${cellIndex !== 2 ? 'border-r-4' : ''} ${cell === '' ? 'text-black' : 'text-blue-500'} flex items-center justify-center border-0`}>
            {cell || '.'}
          </button>
        ))}
      </div>
    ))}
  </div>
}

      </div>
     {/*<div id='ludo' className='min-h-screen w-fit flex flex-col items-center'>
     <div className='flex w-full justify-center'>
          <h1 className='relative z-10'>
            Ludo
          </h1>
          <div className='absolute w-full text-3xl bg-gradient-to-r from-blue-500 to-red-500 p-4 rounded-lg blur-lg' >
          </div>
        </div>
       <div className='w-fit'>
         sasa
       </div>
  </div>*/}
    </div>
   
    </Layout>
  )
}

export default Play