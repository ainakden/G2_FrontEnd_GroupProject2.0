$(document).ready(function(){
    //add to localStorage
    function addLSFile() {
      let nickname,username,password;
      nickname=document.getElementById("nickname").value;
      username=document.getElementById("username").value;   
      password=document.getElementById("password").value;
      var users = {nickname: nickname, username: username, password: password};
      let user_records=new Array();
      user_records=JSON.parse(localStorage.getItem("users"))?JSON.parse(localStorage.getItem("users")):[]
      if(user_records.some((v)=>{return v.nickname==nickname})){
          alert("duplicate data");
      }
      else{
          user_records.push({
          "nickname":nickname,
          "username":username,
          "password":password
          })
          localStorage.setItem("users",JSON.stringify(user_records));
      }
      alert("Your data was saved successfully");
    }
  
    // get reference to button
          var btn = document.getElementById("myBtn2");
          // add event listener for the button, for action "click"
          btn.addEventListener("click", addLSFile);


    //setup hasher
    function parseHash(newHash, oldHash){
        crossroads.parse(newHash);
    }
    hasher.initialized.add(parseHash); //parse initial hash
    hasher.changed.add(parseHash); //parse hash changes
    hasher.init(); //start listening for history change    
        
        
});