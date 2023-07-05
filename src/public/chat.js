const socket = io();
const $messageForm = $("#message-form");
const $messageBox = $("#message");
const $chat = $("#chat");
const $nickForm = $("#nickForm");
const $nickError = $("#nickError");
const $nickname = $("#nickname");
const $users = $("#usernames");

$nickForm.submit(async (e) => {
  e.preventDefault();
  socket.emit("new user", $nickname.val(), async (data) => {
    if(data){
      $('#nickWrap').hide()
      $('#contentWrap').show()
    }else{
      $nickError.html(`
        <div class="alert alert-danger">
        that username already exits
        </div>
      `)
    }
    $nickname.val('')
  });
});
$messageForm.submit(async (e) => {
  e.preventDefault();
  socket.emit("send message", $messageBox.val());
  $messageBox.val(" ");
});
socket.on("new message", (data) => {
  displayMessages(data)
});
socket.on('usernames', data =>{
  let html=''
  data.forEach((user)=>{
    html +=`<p><i class="fas fa-user"></i> ${user} </p>`
  })
  $users.html(html)
})
socket.on('load old msgs', async data =>{
  data.forEach((message)=>{
    displayMessages(message)
  })
})
const displayMessages=(data)=>{
  $chat.append(`<b><i class="fa-regular fa-user"></i> ${data.user}</b>`+`: ${data.message} <br/>`)
}