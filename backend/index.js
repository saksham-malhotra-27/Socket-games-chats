import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import cors from 'cors'
import { log } from 'console';
const app = express();
app.use(cors());

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();
let activePlayer = {};

function checkTicTacToe(matrix) {
  for (let i = 0; i < 3; i++) {
      if (matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2] && matrix[i][0] !== '') {
          return { win: true, mark: matrix[i][0] };
      }
  }

  for (let i = 0; i < 3; i++) {
      if (matrix[0][i] === matrix[1][i] && matrix[1][i] === matrix[2][i] && matrix[0][i] !== '') {
          return { win: true, mark: matrix[0][i] };
      }
  }

  if ((matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2] && matrix[0][0] !== '') ||
      (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0] && matrix[0][2] !== '')) {
      return { win: true, mark: matrix[1][1] };
  }

  let isTie = true;
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (matrix[i][j] === '') {
              isTie = false;
              break;
          }
      }
      if (!isTie) break;
  }

  if (isTie) return 0;
  return 1;
}


io.on('connection', (socket)=>{
  console.log(socket.id);
  socket.emit('socketId', socket.id)

  socket.on('createRoom', () => {
    let roomNumber;
    do {
        roomNumber = generateRoomNumber();
    } while (rooms.has(roomNumber)); 

    rooms.set(roomNumber,
      {
        board:[['','',''],['','',''], ['','','']],
        players:[{symbol:'X', socketId:socket.id}],
        activePlayer: {socketId:socket.id}
      }
      );
    socket.join(roomNumber);
    let truthy = false;
    socket.emit('roomCreated', roomNumber, truthy);
   // console.log(roomNumber, rooms.get(roomNumber) , socket.id, 'created and joined');
  });

  function generateRoomNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }
 
socket.on('joinRoom', (roomNumber)=>{

    if(rooms.has(roomNumber) && rooms.get(roomNumber).players.length===1){
      rooms.get(roomNumber).players.push({symbol:'O', socketId:socket.id})
      socket.join(roomNumber)
      let r = true;
      //io.to(rooms.get(roomNumber).players[1].socketId).emit('you',rooms.get(roomNumber).players[1].socketId )
      io.to(roomNumber).emit('gamestart', r, roomNumber)
      
  //    console.log(roomNumber, rooms.get(roomNumber) ,socket.id, 'joined');
    }
    else {
    //        console.log('invalid room')
            socket.emit('invalidRoom');
    }
   })

 
 
 socket.on('move', (roomNumber,i,j)=>{
 // console.log(roomNumber);
   if(rooms.has(roomNumber)){
    let r = rooms.get(roomNumber); let mark;

    if(r.activePlayer.socketId === r.players[0].socketId){
       mark = r.players[0].symbol;
       r.activePlayer.socketId = r.players[1].socketId;
    }
    else{
      mark = r.players[1].symbol;
      r.activePlayer.socketId = r.players[0].socketId;
    }
    r.board[i][j] = mark;
    let result = checkTicTacToe(r.board); let msg;
    if(result===0){
        msg="tie"
    }
    else if (result === 1){
        msg=""
    }
    else{
      msg = `winner is ${result.mark}`;
    }
    io.to(roomNumber).emit('yourTurn', r.board, r.activePlayer.socketId, msg)
    /*console.log(mark, r.activePlayer===r.players[0].socketId, typeof r.activePlayer, typeof r.players[0].socketId)
    r.activePlayer.socketId = (r.activePlayer == r.players[0].socketId)? r.players[1].socketId: r.players[0].socketId;
    let ap = r.activePlayer.socketId;
    if(ap === r.players[0].socketId){
    ap = r.players[1].socketId
    }else{ap = r.players[0].socketId}
    r.activePlayer.socketId = ap;  */
    //console.log(r); 
   }
 })


})

server.listen(3000, ()=>{
    console.log('server running ');
})

