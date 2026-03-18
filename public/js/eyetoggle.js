const passwordInput = document.getElementById("password")
const cpasswordInput = document.getElementById("cpassword")

const eyeBtn = document.getElementById("eyeimg")
const ceyeBtn = document.getElementById("ceyeimg")

let turn = "password"
let cturn = "password"
eyeBtn.addEventListener("click",(el)=>{
  if(turn === "password"){
    eyeBtn.src = "/public/icons/show.svg"
    passwordInput.type = "text"
    turn = "text"
  }else{
    eyeBtn.src = "/public/icons/hide.svg"
    passwordInput.type = "password"
    turn = "password"
  }
})
////confirm password
ceyeBtn.addEventListener("click",(el)=>{
  if(cturn === "password"){
    ceyeBtn.src = "/public/icons/show.svg"
    cpasswordInput.type = "text"
    cturn = "text"
  }else{
    ceyeBtn.src = "/public/icons/hide.svg"
    cpasswordInput.type = "password"
    cturn = "password"
  }
})