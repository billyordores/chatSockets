import React, {useEffect, useState} from 'react';
import socket from '../config/Socket';
import "../style/home.css";
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CardUser from '../components/cardUser';
import SendIcon from '@mui/icons-material/Send';

const Home =()=>{

    const[username, setUserName] = useState("");
    const[register, setRegister] = useState(false);
    const[email, setEmail] = useState("");
    const[messageToSend, setMessageToSend] = useState("")
    const[users, setUsers] =useState([]);
    const[messages, setMessages] = useState([]);
    const[addressee, setAddressee] = useState("Todos");
    const[errorLogin, setErroLogin] = useState("")
    useEffect(() => {
        axios.get("http://localhost:3000/users").then((response) => {
            setUsers(response.data);
        });
        
        const receiveMessage = (message) => {
            setMessages([...messages,  <div className='message-recibe'>({message.username})  {message.msg}</div>]);
        };
        const receiveMessagePublic = (message) => {
            setMessages([...messages,  <div className='message-recibe'>({message.username})  {message.msg}</div> ]);
        };
        socket.on("message-private", receiveMessage )
        socket.on("message-public", receiveMessagePublic)
        return () => {
            socket.off("message-private", receiveMessage);
            socket.off("message-public", receiveMessagePublic);
        };
    }, [users, messages]);
    
    
    const enter = () =>{
        if(email === "" || username === ""){
            setErroLogin("Porfavor rellene el campo de email o usuario")
            setInterval(()=>{
                setErroLogin("");
            }, 4000)
        }else{
            socket.emit("conectado", {
                username: username,
                email: email
            });
            socket.on("conectado", (msg)=>{
                localStorage.setItem("username", msg.username)
                localStorage.setItem("idSocket", msg.idSocket)
            })
            setRegister(true);
        }
        
    }
    const exit = () =>{
        socket.emit("desconectado", email)
        setRegister(false)
        
    }
    const sendMail =()=>{
        if(addressee.toLowerCase() === "todos"){
            setMessages([...messages, <div className='message-emit'> {messageToSend} (yo)</div>])
            socket.emit("message-public", {msg: messageToSend, username:username})
            setMessageToSend("");
        }else{
            console.log(addressee);
            setMessages([...messages,<div className='message-emit'> {messageToSend} (yo)</div>])
            socket.emit("message-private", {msg: messageToSend, username:username, email:email, addressee:addressee})
            setMessageToSend("");
        }        
    }
    
    return(
        <div>
            {register?
                <div>
                    <div className='nameUser-container'>
                        <AccountCircleIcon className='icon-user'/>
                        <h3 className='txt-username'>{username.toUpperCase()}</h3>
                        <ExitToAppIcon onClick={exit} className='icon-toExit'/>
                    </div>
                    <div className='body-chat'>
                        <div className='container-contacts'>
                            <button className='button-all' onClick={()=>setAddressee("Todos")}>Todos</button>
                            
                            {users? users.filter(x => x.email !== email).map((element)=>{

                                return(
                                    <CardUser key={element.idSocket} element={element} addressee={setAddressee}/>
                                )
                            }): "cargando datos..."}
                            
                        </div>
                        <div className='container-body-chat'>
                            <div className='container-msg'>
                                <h3>Send to: {addressee}</h3>
                                {messages.length!==0? 
                                    messages.map((element)=>{
                                        return(
                                            <div className='messages-container-text'>                                               
                                                {element}
                                            </div>
                                        )
                                    })
                                : "No hay mensajes"}
                            </div>
                            <div className='container-inputSend'>
                                <input value={messageToSend} onChange={(e)=> setMessageToSend(e.target.value)}></input><SendIcon className='icon-toSend' type='submit' onClick={sendMail}/>                            
                            </div> 
                        </div>
                    </div>
                    
                </div>
            :
                <div className='background-login'>
                    <form>
                        <h1>Login or Register</h1>
                        <div className='container-name'>
                            <h3>Nombre</h3>
                            <input type="text" placeholder='Usurio'  onChange={(e)=> setUserName(e.target.value)}></input>
                        </div>
                        <div className='container-email'>
                            <h3>Email</h3>
                            <input type="email" placeholder='Email' onChange={(e)=> setEmail(e.target.value)}></input>
                        </div>
                        <div className='error-txt'>{errorLogin}</div>      
                        <button type='submit' className='button-enter-login' onClick={enter}>Go...</button>
                    </form>
                    
                </div>             
            }
            
        </div>
    
    
    )
}
export default Home