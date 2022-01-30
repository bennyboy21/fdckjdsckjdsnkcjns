const checker = document.getElementById("checker")

const observer = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting == false) {
        document.getElementById("button-Container").classList.add("open")
    } else {
        document.getElementById("button-Container").classList.remove("open")
    }
})
observer.observe(checker)

document.getElementById("profile-Image-Holder").addEventListener("click", function() {
    console.log("Profile Clicked")
}) 

var chats = 1;

document.getElementById("button-One").addEventListener("click", function() {
    if(chats == 0) {
        document.getElementById("group-Chat-Holder").style.display = "none"
        document.getElementById("chat-Icon").style.fill = "rgb(0, 132, 255)"
        document.getElementById("group-Icon").style.fill = "black"
        const chatsPage = document.getElementById("chats-Holder").style
        chatsPage.display = "flex"
        chatsPage.flexDirection = "column"
        const chatbox = document.getElementById("normal-Group-Chats")
        chatbox.scrollTo({ bottom: 0, behavior: 'auto' });
        const chatbox2 = document.getElementById("group-Chat-Holder")
        chatbox2.scrollTo({ bottom: 0, behavior: 'auto'});
        chats = 1;
    }
})

document.getElementById("button-Two").addEventListener("click", function() {
    if(chats == 1) {
        document.getElementById("chats-Holder").style.display = "none"
        document.getElementById("chat-Icon").style.fill = "black"
        document.getElementById("group-Icon").style.fill = "rgb(0, 132, 255)"
        const chatsPage = document.getElementById("group-Chat-Holder").style
        chatsPage.display = "grid"
        chatsPage.flexDirection = "column"
        chats = 0
    }
})


document.getElementById("send-Message-Textbox").addEventListener("keyup", function(){
    const sendTextbox = document.getElementById("send-Message-Textbox").value
    if(sendTextbox != "") {
        document.getElementById("send-Icon").style.fill = "rgb(0, 132, 255)"
    } else {
        document.getElementById("send-Icon").style.fill = "rgb(100, 100, 100)"
    }
})

var typing = 1;

document.getElementById("group-Chat-Holder").addEventListener("click", function() {
    console.log("Click")
    if(typing == 1) {
        document.getElementById("all-Send-Box-Container").style.border = "10px"        
        typing = 0
    }
})

document.getElementById("all-Send-Box-Container").addEventListener("click", function() {
    if(typing == 0) {
        document.getElementById("all-Send-Box-Container").style.border = "3px solid rgb(0, 132, 200)"        
        typing = 1
    }
})



var users = []
var chatProfileImgURLs = []


var email = "benjamin.burnell@student.tdsb.on.ca";
var name;
var ImageURL;
var chats = "nobody"
var previousName = ""
var previousName2 = ""

var checkUserSignIn = 0;

setTimeout(function() {
    if(checkUserSignIn == 0) {
        window.location = "Welcome Page.html"
    }
}, 4000)


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    $("#name").text(profile.getName())
    $("#email").text(profile.getEmail())
    document.getElementById("image").setAttribute("src", profile.getImageUrl())
    checkUserSignIn = 1
    // $(".data").css("display", "block");
    // $(".g-signin2").css("display", "none");


    imgURL = profile.getImageUrl()
    myName = profile.getName()

    document.getElementById("profile-Img").setAttribute("src", profile.getImageUrl())
    document.getElementById("profile-Name").textContent = myName
    document.getElementById("profile-Email").textContent = profile.getEmail()

    console.log(profile)
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // style.display = "none"
    const allowedEmailDomain = 'student.tdsb.on.ca';

    email = profile.getEmail();
    name = profile.getName();
    ImageURL = profile.getImageUrl();

    var imgURL = ImageURL
    var previousName = ""

    var myName = name
    // myName = "Benjamin Burnell"

    var publicShowName = myName
    var contacts = []
    var checkLoad = false
    myName = myName.toLowerCase()

    firebase.database().ref("Users/" + name).set({
        "Name": name,
        "Email": email,
        "Profile": ImageURL
    })

    if(email == null) {
        window.location = "Welcome Page.html"
    }

    if (email.split('@')[1] === allowedEmailDomain) {   

        // Delete {
        var imgURL = "random gmail profile pic.jpg"
        
        var previousName = ""

        var myName = "Benjamin Burnell"

        var publicShowName = myName
        var contacts = []
        var checkLoad = false
        myName = myName.toLowerCase()
        // }
        
        // myName = prompt("Enter Your Name")
        // var publicShowName = myName
        firebase.database().ref("TDSB/Users/" + myName).set({
            "Name": publicShowName,
            "Email": email,
            "imgURL": imgURL,
            "usersChats":chats
        })
        
        firebase.database().ref("TDSB/Users/").once('value', function(snapshot) {
            snapshot.forEach(
                function(ChildShapshot) {
                    var name = ChildShapshot.val().Name
                    users.push(name.toLowerCase())
                }
            )
            console.log(users)
            if(users.length == 0) {
                firebase.database().ref("TDSB/Users/" + myName).set({
                    "Name": publicShowName,
                    "Email": email,
                    "imgURL": imgURL,
                    "usersChats":chats
                })
            } else {
                if(users.includes(myName)) {
                    var path = "TDSB/Users/" + myName
                    firebase.database().ref(path).once('value', function(snapshot) {
                        var chats = snapshot.val().usersChats
                        if(chats == "nobody") {
                            console.log("no chats")
                        } else {
                            firebase.database().ref("TDSB/Users/" + myName + "/usersChats/Contacts").on("child_added", function(snapshot) {
                                if(checkLoad == false) {
                                    var nameArr = snapshot.val()
                                    nameArr = nameArr.split(" ")
                                    var firstName = nameArr[0]
                                    var lastName = nameArr[1]
                                    firstName =  firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
                                    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
                                    console.log(firstName)
                                    var finalName = firstName + " " + lastName
                                    // console.log(snapshot.val())
                                    
                                    contacts.unshift(finalName)
                                    var seen = {};
                                    var out = [];
                                    var len = contacts.length;
                                    var j = 0;
                                    for(var i = 0; i < len; i++) {
                                        var item = contacts[i];
                                        if(seen[item] !== 1) {
                                            seen[item] = 1;
                                            out[j++] = item;
                                        }
                                    }
                                    contacts = out
                                    loadChatImages(snapshot.val())
                                } else {
                                    var nameArr = snapshot.val()
                                    nameArr = nameArr.split(" ")
                                    var firstName = nameArr[0]
                                    var lastName = nameArr[1]
                                    firstName =  firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
                                    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
                                    console.log(firstName)
                                    var finalName = firstName + " " + lastName
                                    // console.log(snapshot.val())
                                    contacts.unshift(finalName)

                                    var seen = {};
                                    var out = [];
                                    var len = contacts.length;
                                    var j = 0;
                                    for(var i = 0; i < len; i++) {
                                        var item = contacts[i];
                                        if(seen[item] !== 1) {
                                            seen[item] = 1;
                                            out[j++] = item;
                                        }
                                    }
                                    contacts = out
                                    console.log(contacts)

                                    loadChatImages(snapshot.val())
                                    setTimeout(function() {
                                        newChat()
                                    }, 300)
                                }
                            })
                            setTimeout(function() {
                                newChat()
                                checkLoad = true
                            }, 300)
                        }
                    })
                    var index = users.indexOf(myName);
                    if (index > -1) {
                        users.splice(index, 1);
                    }
                } else {
                    firebase.database().ref("TDSB/Users/" + myName).set({
                        "Name": publicShowName,
                        "Email": email,
                        "imgURL": imgURL,
                        "usersChats":chats
                    })
                    console.log(myName)
                }
            }
        })

        firebase.database().ref("TDSB/groupChatMessages/").on("child_added", function (snapshot) {
            var html2 = "";
            // give each message a unique ID
            // show delete button if message is sent by me
            if(previousName == "") {
                if(snapshot.val().Name == publicShowName) {
                    html2 += '<div class="sent-Message-Container">'
                    html2 +=    '<div class="sent-Message-Name">'+snapshot.val().Name+'</div>'
                    html2 +=        '<div class="sent-Content-Img-Holder">'
                    html2 +=            '<div class="sent-Message-Content">'+snapshot.val().Message+'</div>'
                    html2 +=            '<div class="sent-Img-Holder">'
                    html2 +=                '<img class="sent-Profile-Img" src="'+snapshot.val().profileIMGURL+'">'
                    html2 +=            '</div>'
                    html2 +=        '</div>'
                    html2 +=    '</div>'
                    html2 += '</div>'
                } 
                if(snapshot.val().Name != publicShowName) {
                    html2 += '<div class="rec-Message-Container">'
                    html2 +=    '<div class="rec-Message-Name">'+snapshot.val().Name+'</div>'
                    html2 +=        '<div class="rec-Content-Img-Holder">'
                    html2 +=            '<div class="rec-Message-Content">'+snapshot.val().Message+'</div>'
                    html2 +=            '<div class="rec-Img-Holder">'
                    html2 +=                '<img class="rec-Profile-Img" src="'+snapshot.val().profileIMGURL+'">'
                    html2 +=            '</div>'
                    html2 +=        '</div>'
                    html2 +=    '</div>'
                    html2 += '</div>'
                }
                previousName = snapshot.val().Name
            } else if(previousName != "") {
                if(snapshot.val().Name == publicShowName) {
                    if(previousName == publicShowName) {
                        html2 += '<div class="sent-Message-Container">'
                        html2 +=    '<div class="sent-Content-Img-Holder">'
                        html2 +=        '<div class="sent-Message-Content" id="sent-Message-Alr">'+snapshot.val().Message+'</div>'
                        html2 +=    '</div>'
                        html2 += '</div>'
                    } else {
                        html2 += '<div class="sent-Message-Container">'
                        html2 +=    '<div class="sent-Message-Name">'+snapshot.val().Name+'</div>'
                        html2 +=        '<div class="sent-Content-Img-Holder">'
                        html2 +=            '<div class="sent-Message-Content">'+snapshot.val().Message+'</div>'
                        html2 +=            '<div class="sent-Img-Holder">'
                        html2 +=                '<img class="sent-Profile-Img" src="'+snapshot.val().profileIMGURL+'">'
                        html2 +=            '</div>'
                        html2 +=        '</div>'
                        html2 +=    '</div>'
                        html2 += '</div>'
                    }
                } else {
                    if(previousName == snapshot.val().Name) {
                        html2 += '<div class="rec-Message-Container">'
                        html2 +=    '<div class="rec-Content-Img-Holder">'
                        html2 +=        '<div class="rec-Message-Content" id="sent-Message-Alr">'+snapshot.val().Message+'</div>'
                        html2 +=    '</div>'
                        html2 += '</div>'
                    } else {
                        html2 += '<div class="rec-Message-Container">'
                        html2 +=    '<div class="rec-Message-Name">'+snapshot.val().Name+'</div>'
                        html2 +=        '<div class="rec-Content-Img-Holder">'
                        html2 +=            '<div class="rec-Message-Content">'+snapshot.val().Message+'</div>'
                        html2 +=            '<div class="rec-Img-Holder">'
                        html2 +=                '<img class="rec-Profile-Img" src="'+snapshot.val().profileIMGURL+'">'
                        html2 +=            '</div>'
                        html2 +=        '</div>'
                        html2 +=    '</div>'
                        html2 += '</div>'
                    }
                }
                previousName = snapshot.val().Name
            }
            chatCount = 1;
            if(chatCount == 1) {
                document.getElementById("be-The-First-To-Text-It").style.display = "none"
            }
            chatMessageCount++;
            document.getElementById("messages").innerHTML += html2;
            const chatbox = document.getElementById("normal-Group-Chats")
            chatbox.scrollTo({ top: 9999999999999, behavior: 'auto' });
            const chatbox2 = document.getElementById("messages")
            chatbox2.scrollTo({ top: 9999999999999, behavior: 'auto' });
        });
    } else {
        window.location = "emailNotAccepted.html"
    }
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      window.location = "Welcome Page.html"
    });
}

function options() {
    alert("click")
}

function loadChatImages(name) {
    firebase.database().ref("TDSB/Users/" + name).on("value", function(snapshot) {
        chatProfileImgURLs.unshift(snapshot.val().imgURL)
    })
}

var userChatbox = 0

function add() {
    var html = ""
    html += '<div class="chat-Container">'
    html +=     '<div class="profile-Picture-Holder">'
    html +=         '<img class="dummy-Profile-Pic" src="Profile Img 2.png"/>'
    html +=     '</div>'
    html +=     '<div class="users-Name">Daivd Grater</div>'
    html +=     '<div class="options" onclick="options()">'
    html +=         '<svg class="options-Icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">'
    html +=             '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>'
    html +=         '</svg>'
    html +=     '</div>'
    html += '</div>' 

    userChatbox++;
    
    if(userChatbox > 0) {
        document.getElementById("start-Chatting-Container").style.display = "none"
    }

    document.getElementById("chats-Holder").innerHTML += html
}

function sendGroupChatMessage() {
    console.log("Message Sent");
    const groupChatTextBox = document.getElementById("send-Message-Textbox")
    console.log(groupChatTextBox.value)

    // if(previousName != "") {
    //     var html2 = ""
    //     html2 += '<div class="sent-Message-Container">'
    //     html2 +=    '<div class="sent-Content-Img-Holder">'
    //     html2 +=        '<div class="sent-Message-Content" id="sent-Message-Alr">'+groupChatTextBox.value+'</div>'
    //     html2 +=    '</div>'
    //     html2 += '</div>'
    //     document.getElementById("messages").innerHTML += html2
    // }
    // if(previousName == "") {
    //     previousName = "Lily Smith"
    //     var html2 = ""
    //     html2 += '<div class="sent-Message-Container">'
    //     html2 +=    '<div class="sent-Message-Name">'+currentName+'</div>'
    //     html2 +=        '<div class="sent-Content-Img-Holder">'
    //     html2 +=            '<div class="sent-Message-Content">'+groupChatTextBox.value+'</div>'
    //     html2 +=            '<div class="sent-Img-Holder">'
    //     html2 +=                '<img class="sent-Profile-Img" src="Profile Img.png">'
    //     html2 +=            '</div>'
    //     html2 +=        '</div>'
    //     html2 +=    '</div>'
    //     html2 += '</div>'
    //     document.getElementById("messages").innerHTML += html2
    // }

    if(groupChatTextBox.value != "") {
        firebase.database().ref("TDSB/groupChatMessages/").push().set({
            "Name": publicShowName,
            "Message": groupChatTextBox.value,
            "profileIMGURL":imgURL
        })
    }

    const chatbox = document.getElementById("normal-Group-Chats")
    chatbox.scrollTo({ top: 9999999999999, behavior: 'auto' });
    const chatbox2 = document.getElementById("messages")
    chatbox2.scrollTo({ top: 9999999999999, behavior: 'auto' });
    groupChatTextBox.value = ""
    return false
}

document.getElementById("search-Holder").addEventListener("click", function() {
    const chatsPage = document.getElementById("search-Page-Holder").style
    chatsPage.display = "grid"
    chatsPage.flexDirection = "column"
    var navbar = document.getElementById("button-Container");
    navbar.style.display = "none"
    console.log("Search")
})

document.getElementById("close-Icon").addEventListener("click", function() {
    const chatsPage = document.getElementById("search-Page-Holder").style
    chatsPage.display = "none"
    chatsPage.flexDirection = "column"
    if(window.innerWidth < 750) {
        var navbar = document.getElementById("button-Container");
        navbar.style.display = "flex"
    } else {

    }
})

var chatMessageCount = 0;

var profileClick = 0;

document.getElementById("profile-Image-Holder").addEventListener("click", function() {
    if(profileClick == 0) {
        document.getElementById("profile-Page").style.display = "flex"
        profileClick = 1
    } else {

    }
})

document.getElementById("hole-Background").addEventListener("click", function() {
    if(profileClick == 1) {
        document.getElementById("profile-Page").style.display = "none"
        profileClick = 0
    } else {

    }
})

function getChats() {
    if(chats.length == 0) {
        document.getElementById("start-Chatting-Container").style.display = "flex"
    } else {
        document.getElementById("start-Chatting-Container").style.display = "none"
    }
}

function createNewChat(usersName, wantedChatName) {

}

var priChats = 0

document.getElementById("search-Text-Box").addEventListener("keyup", function () {
    for(var i2 = 0; i2 < 1; i2++) {
        var textBoxString = document.getElementById("search-Text-Box").value;
  
        var finalName = textBoxString.toLowerCase();
        // console.log(names[0])
        document.getElementById("no-User-Found-Holder").style.display = "none";
      
        if (textBoxString != "") {
      
          myNames = users.filter((users) => users.includes(finalName));
      
          var html = "";
      
          // Output new array
          if (myNames.length != 0) {
            for (var i = 0; i < myNames.length; i++) {
                var currentMyName = myNames[i]
                var currentShownName = myNames[i].charAt(0).toUpperCase() + myNames[i].slice(1);
                document.getElementById("possible-Searches-Holder").innerHTML = " ";
        
                firebase.database().ref("TDSB/Users/" + currentMyName).on("value", function (snapshot) {
                    html += "<div class='search-Profile-Holder'>"
                    html +=     '<div class="search-Profile-Image-Holder">'
                    html +=         '<img src="' + snapshot.val().imgURL + '" class="search-Profile-Img">'
                    html +=     '</div>'
                    html +=     '<div class="search-Profile-Name">' + snapshot.val().Name + '</div>'
                    html +=     '<button class="chat-Button" onclick="openChat(myNames, '+i+');">';
                    html +=         "Chat";
                    html +=     "</button>";
                    html += "</div>"
                });

                document.getElementById("no-User-Found-Holder").style.display = "none";
                }
            } else {
                document.getElementById("possible-Searches-Holder").innerHTML = " ";
                document.getElementById("no-User-Found-Holder").style.display = "flex";
            }
            document.getElementById("possible-Searches-Holder").innerHTML += html;
        } else {
          document.getElementById("possible-Searches-Holder").innerHTML = " ";
        }
    }
});

var currentChatOpen = ""  
var chatCount = 0;

function openChat(Name, index) {
    firebase.database().ref("TDSB/Users/" + Name[index]).on("value", function (snapshot) {
        document.getElementById("pri-Chat-Name").textContent = snapshot.val().Name;
        currentChatOpen = snapshot.val().Name
        document.getElementById("pri-Chat-Img").setAttribute("src", snapshot.val().imgURL);
        document.getElementById("pri-Chat-Container").style.display = "flex";
    });
    
    setTimeout(function() {
        previousName2 = ""
        var currentChatOpenLowerCase = currentChatOpen.toLowerCase()
        document.getElementById("pri-Message-Container").innerHTML = " ";
        firebase.database().ref("TDSB/" + myName + " Chats/" + myName + " + " + currentChatOpenLowerCase).on("child_added", function(snapshot){
            var html2 = "";
            if(previousName2 == "") {
                if(snapshot.val().Name == myName) {
                    html2 += '<div class="sent-Content-Img-Holder"><div class="sent-Message-Content">'+snapshot.val().message+'</div><div class="sent-Img-Holder"><img class="sent-Profile-Img" src="'+snapshot.val().imgURL+'"></div></div>';
                    priChats = 1
                } 
                if(snapshot.val().Name != myName) {
                    html2 += '<div class="rec-Content-Img-Holder"><div class="rec-Message-Content">'+snapshot.val().message+'</div><div class="rec-Img-Holder"><img class="rec-Profile-Img" src="'+snapshot.val().imgURL+'"></div></div>'
                    console.log("Name change")
                    priChats = 1
                }
                previousName2 = snapshot.val().Name
            } else if(previousName2 != "") {
                if(snapshot.val().Name == myName) {
                    if(previousName2 == myName) {
                        html2 += '<div class="sent-Message-Container"><div class="sent-Content-Img-Holder"><div class="sent-Message-Content" id="sent-Message-Alr">'+snapshot.val().message+'</div></div></div>'
                        priChats = 1
                    } else {
                        html2 += '<div class="sent-Content-Img-Holder"><div class="sent-Message-Content">'+snapshot.val().message+'</div><div class="sent-Img-Holder"><img class="sent-Profile-Img" src="'+snapshot.val().imgURL+'"></div></div>'
                        priChats = 1
                    }
                } else {
                    if(previousName2 == snapshot.val().Name) {
                        html2 += '<div class="rec-Message-Container"><div class="rec-Content-Img-Holder"><div class="rec-Message-Content" id="sent-Message-Alr">'+snapshot.val().message+'</div></div></div>'
                        priChats = 1
                    } else {
                        html2 += '<div class="rec-Content-Img-Holder"><div class="rec-Message-Content">'+snapshot.val().message+'</div><div class="rec-Img-Holder"><img class="rec-Profile-Img" src="'+snapshot.val().imgURL+'"></div></div>'
                        priChats = 1
                    }
                }
                previousName2 = snapshot.val().Name
            }
            chatMessageCount++;
            document.getElementById("pri-Message-Container").innerHTML += html2;
            const chatbox5 = document.getElementById("pri-Message-Container")
            chatbox5.scrollTo({ top: 9999999999999, behavior: 'auto' });
        })
        if(priChats == 0) {
            // html2 = '<section id="send-A-Pri-Message"><svg id="chatbox-Icon-3" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 4h16v12H5.17L4 17.17V4m0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h8v2H6v-2zm0-3h12v2H6V9zm0-3h12v2H6V6z"/></svg><svg id="alarm-Icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37zm4.837-6.19l4.607 3.845-1.28 1.535-4.61-3.843zm-10.674 0l1.282 1.536L3.337 7.19l-1.28-1.536zM12 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/></svg><svg  id="phone-Icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg><p id="send-A-Pri-Message">Start a chat with'+ snapshot.val().Name +'</p></section>'
            // document.getElementById("pri-Message-Container").innerHTML = html2;
        } else {
            
        }
    }, 10)
}

document.getElementById("pri-Send-Message-Textbox").addEventListener("keyup", function(){
    const sendTextbox = document.getElementById("pri-Send-Message-Textbox").value
    if(sendTextbox != "") {
        document.getElementById("pri-Send-Icon").style.fill = "rgb(0, 132, 255)"
    } else {
        document.getElementById("pri-Send-Icon").style.fill = "rgb(100, 100, 100)"
    }
})

document.getElementById("close-Pri-Chat-Icon").addEventListener("click", function(){
    document.getElementById("pri-Chat-Container").style.display = "none";
    const sendTextbox = document.getElementById("pri-Send-Message-Textbox")
    sendTextbox.value = ""
    priChats = 0
})

function sendPrivateMessage() {
    const messageContent = document.getElementById("pri-Send-Message-Textbox")
    var message = messageContent.value
    var lowerCaseContacts = []
    for(var i20=0;i20<contacts.length;i20++) {
        var currentIndexedName = contacts[i20].toLowerCase()
        lowerCaseContacts.push(currentIndexedName)
    }
    var currentChatOpenLowerCase = currentChatOpen.toLowerCase()
    firebase.database().ref("TDSB/" + myName + " Chats/" + myName + " + " + currentChatOpenLowerCase).push().set({
        "Name": myName,
        "imgURL": imgURL,
        "message": message
    })

    firebase.database().ref("TDSB/" + currentChatOpenLowerCase + " Chats/" + currentChatOpenLowerCase + " + " + myName).push().set({
        "Name": myName,
        "imgURL": imgURL,
        "message": message
    })

    if(contacts.includes(currentChatOpen)) {
        console.log(contacts)
    } else {
        currentChatOpenLowerCase = currentChatOpenLowerCase.toLowerCase()
        contacts.unshift(currentChatOpen)
        lowerCaseContacts.push(currentChatOpenLowerCase)
        // console.log(lowerCaseContacts)
        // console.log(currentChatOpenLowerCase)
        // console.log(contacts)
        firebase.database().ref("TDSB/Users/" + myName + "/usersChats/").set({
            "Contacts":lowerCaseContacts
        })
    }

    var otherChaterChats = []

    firebase.database().ref("TDSB/Users/" + currentChatOpenLowerCase + "/usersChats").on("value", function(snapshot) {
        if(snapshot.val() != "nobody") {
            firebase.database().ref("TDSB/Users/" + currentChatOpenLowerCase + "/usersChats/").once('value', function(snapshot2) {
                snapshot2.forEach(
                    function(ChildShapshot) {
                        var name = ChildShapshot.val()
                        name = name
                        otherChaterChats.push(name)
                    }
                )
                console.log("Other Chaters Chats:")
                console.log(otherChaterChats)
                console.log(myName)
                
                for(var i3=0;i3<otherChaterChats.length;i3++) {
                    if(otherChaterChats[i3] == myName) {
                        console.log("No your first time chatting")
                        otherChaterChats[0].splice(myName, 1);
                        console.log(otherChaterChats)
                    }
                }

                // if(otherChaterChats.indexOf(myName) > -1) {
                //     console.log("not your first time chatting")
                // } else {
                //     console.log("first time chatting")
                // }

                // firebase.database().ref("TDSB/Users/" + currentChatOpenLowerCase + "/usersChats/").set({

                // })
            })
        } else {
            var arrayOfNoContacts = [myName]
            firebase.database().ref("TDSB/Users/" + currentChatOpenLowerCase + "/usersChats/").set({
                "Contacts": arrayOfNoContacts
            })
        }
    })


    messageContent.value = ""
    return false
}

function newChat() {
    document.getElementById("chats-Profiles").innerHTML = ""
    const allChatsHolder = document.getElementById("chats-Profiles")
    var html15 = ""
    for(var i15=0;i15<contacts.length;i15++) {
        html15 += '<div class="chat-Container" onclick="otherOpenChat(contacts['+ i15 +'])">'
        html15 +=   '<div class="profile-Picture-Holder">'
        html15 +=       '<img class="dummy-Profile-Pic" src="'+ chatProfileImgURLs[i15] +'"/>'
        html15 +=   '</div>'
        html15 +=   '<div class="users-Name">'+ contacts[i15] +'</div>'
        html15 +=   '<div class="options" onclick="options('+ contacts[i15] +')">'
        html15 +=       '<svg class="options-Icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">'
        html15 +=           '<path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>'
        html15 +=       '</svg>'
        html15 +=   '</div>'
        html15 += '</div>'
    }
    allChatsHolder.innerHTML = html15
    console.log(contacts)
}

function otherOpenChat(name) {
    name = name.toLowerCase()
    firebase.database().ref("TDSB/Users/" + name).on("value", function (snapshot) {
        document.getElementById("pri-Chat-Name").textContent = snapshot.val().Name;
        currentChatOpen = snapshot.val().Name
        document.getElementById("pri-Chat-Img").setAttribute("src", snapshot.val().imgURL);
        document.getElementById("pri-Chat-Container").style.display = "flex";
    });
    
    setTimeout(function() {
        previousName3 = ""
        var currentChatOpenLowerCase = currentChatOpen.toLowerCase()
        document.getElementById("pri-Message-Container").innerHTML = " ";
        firebase.database().ref("TDSB/" + myName + " Chats/" + myName + " + " + currentChatOpenLowerCase).on("child_added", function(snapshot){
            var html3 = "";
            if(previousName3 == "") {
                if(snapshot.val().Name == myName) {
                    html3 += '<div class="sent-Content-Img-Holder"><div class="sent-Message-Content">'+snapshot.val().message+'</div><div class="sent-Img-Holder"><img class="sent-Profile-Img" src="'+snapshot.val().imgURL+'"></div></div>';
                } 
                if(snapshot.val().Name != myName) {
                    html3 += '<div class="rec-Content-Img-Holder"><div class="rec-Message-Content">'+snapshot.val().message+'</div><div class="rec-Img-Holder"><img class="rec-Profile-Img" src="'+snapshot.val().imgURL+'"></div></div>'
                    console.log("Name change")
                }
                previousName3 = snapshot.val().Name
            } else if(previousName3 != "") {
                if(snapshot.val().Name == myName) {
                    if(previousName3 == myName) {
                        html3 += '<div class="sent-Message-Container"><div class="sent-Content-Img-Holder"><div class="sent-Message-Content" id="sent-Message-Alr">'+snapshot.val().message+'</div></div></div>'
                    } else {
                        html3 += '<div class="sent-Content-Img-Holder"><div class="sent-Message-Content">'+snapshot.val().message+'</div><div class="sent-Img-Holder"><img class="sent-Profile-Img" src="'+snapshot.val().imgURL+'"></div></div>'
                    }
                } else {
                    if(previousName3 == snapshot.val().Name) {
                        html3 += '<div class="rec-Message-Container"><div class="rec-Content-Img-Holder"><div class="rec-Message-Content" id="sent-Message-Alr">'+snapshot.val().message+'</div></div></div>'
                    } else {
                        html3 += '<div class="rec-Content-Img-Holder"><div class="rec-Message-Content">'+snapshot.val().message+'</div><div class="rec-Img-Holder"><img class="rec-Profile-Img" src="'+snapshot.val().imgURL+'"></div></div>'
                    }
                }
                previousName3 = snapshot.val().Name
            }
            chatMessageCount++;
            document.getElementById("pri-Message-Container").innerHTML += html3;
            const chatbox6 = document.getElementById("pri-Message-Container")
            chatbox6.scrollTo({ top: 9999999999999, behavior: 'auto' });
        })
    }, 10)
}