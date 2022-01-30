function onSignIn(googleUser) {
    const firebaseConfig = {
        apiKey: "AIzaSyCecv_m29Y4RmQCL6tFmwXBo-bAeUunFUk",
        authDomain: "text-it-now.firebaseapp.com",
        projectId: "text-it-now",
        storageBucket: "text-it-now.appspot.com",
        messagingSenderId: "290899362773",
        appId: "1:290899362773:web:54a1b0bfd3781020ebb35c",
        measurementId: "G-XYGGN37B22"
    };

    firebase.initializeApp(firebaseConfig);
    
    var profile = googleUser.getBasicProfile();
    document.getElementById("profile-Img").setAttribute("src", profile.getImageUrl())
    checkUserSignIn = 1

    imgURL = profile.getImageUrl()
    myName = profile.getName()

    const allowedEmailDomain = 'student.tdsb.on.ca';

    email = profile.getEmail();
    var myName = profile.getName();
    ImageURL = profile.getImageUrl();

    myName = myName.toLowerCase()

    if (email.split('@')[1] === allowedEmailDomain) {   
        // Delete {
        // var imgURL = "random gmail profile pic.jpg"
        
        // var previousName = ""

        // var myName = "Benjamin Burnell"

        // var publicShowName = myName
        // var contacts = []
        // var checkLoad = false
        // myName = myName.toLowerCase()
        // }
        
        // myName = prompt("Enter Your Name")
        // var publicShowName = myName
        myName = myName.toLowerCase()
        const agreedButton = document.getElementById("accept-Button")
        agreedButton.addEventListener("click", function() {
            if(agreedButton.classList == "optional") {
                firebase.database().ref("TDSB/Users/").once('value', function(snapshot) {
                    snapshot.forEach(
                        function(ChildShapshot) {
                            var name = ChildShapshot.val().Name
                            users.push(name.toLowerCase())
                        }
                    )
                    if(users.includes(myName)) {
        
                    } else {
                        firebase.database().ref("TDSB/Users/" + myName).set({
                            "Name": publicShowName,
                            "Email": email,
                            "imgURL": imgURL,
                            "usersChats":chats,
                            "agree": "Agreed",
                        })
                    }
                })
                setTimeout(function() {
                    console.log("agreed")
                    document.getElementById("error").style.display = "none"
                }, 100)
            } else {
                window.location = ""
                document.getElementById("error").style.display = "flex"
            }
        })
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