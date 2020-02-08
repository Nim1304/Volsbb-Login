var xhr = new XMLHttpRequest();

chrome.runtime.onStartup.addListener(function(){
    login();
});



const login = ()=>{
    chrome.storage.sync.get(null,(data)=>{
        var user=data.username;
        var pass=data.password;
        xhr.open("POST","http://phc.prontonetworks.com/cgi-bin/authlogin",true);
        xhr.setRequestHeader('content-Type','application/x-www-form-urlencoded')
        var post_params="userId="+user+"&password="+pass+"&serviceName=ProntoAuthentication&Submit22=Login"
        xhr.send(post_params);
        // console.log(xhr.responseText);
        xhr.onreadystatechange=function(){
            var response=xhr.responseText;
            var login_success=new RegExp("Congratulations !!!");
            var login_already=new RegExp("You are already logged in");
            var login_wrong=new RegExp("Sorry, please check your username and password and try again.");
            
            if(login_success.test(response)){
                console.log("Successfully logged in");
                chrome.runtime.sendMessage({login:"Successful"});
            }
            else if(login_already.test(response)){
                console.log("Already logged in");
                chrome.runtime.sendMessage({login:"Already logged in"});
            }
            else if(login_wrong.test(response)){
                console.log("Wrong Password");
                chrome.runtime.sendMessage({login:"Wrong credentials"});
            }
        }
    });
}

const logout=()=>{
    xhr.open('GET','http://phc.prontonetworks.com/cgi-bin/authlogout',true);
    // xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    
    xhr.send();
    xhr.onreadystatechange = ()=>{
        var logout_success=new RegExp("You have successfully logged out");
        var no_session=new RegExp("There is no active session to logout.");
        var response=xhr.responseText;
        if(logout_success.test(response)){
            chrome.runtime.sendMessage({logout:"success"});
            console.log('success');
            // alert("Logged out");
        }
        else if(no_session.test(response)){
            chrome.runtime.sendMessage({logout:"No Session Active"})
            console.log('No session active');
        }    
    }
}


chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    if(request.login=="Do it"){
        login();
    }
    if(request.logout=="Do it"){
        logout();
    }
});