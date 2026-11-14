//login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

//chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
  "steelblue",     
  "mediumslateblue", 
  "teal",          
  "peru",          
  "rosybrown",     
  "sandybrown",    
  "coral",         
  "mediumvioletred" 
];
const user = {id: "", name: "", color: ""}

let websocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div");

    div.classList.add("message_self")
    div.innerHTML = content;

    return div;
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div");

    div.classList.add("message_other");

    div.innerHTML = `<span class="message_sender" style="color: ${senderColor};">${sender}</span>${content}`;

    return div;
}

const getRandonColor = () => {
    const index = Math.floor(Math.random() * colors.length);    //gera um indice aleatorio
    return colors[index];
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({data}) => {
    const {userId, userName, userColor, content} = JSON.parse(data);

    const element = userId == user.id?  //verifico se a mensagem é a minha, se for eu coloco ela com a função que cria a propria mensagem, senão eu pego a função que cria a mensagem do outro
    createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor)
    
    chatMessages.appendChild(element);

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandonColor()

    login.style.display = "none";
    chat.style.display = "flex"

    websocket = new WebSocket("wss://chat-em-tempo-real-kwco.onrender.com")
    websocket.onmessage = processMessage;
}

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message));
    chatInput.value = "";

    scrollScreen()
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)