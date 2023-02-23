function switchTab(element, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("myChat_tabcontent");
    btn = document.getElementById(element);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("myChat_tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    btn.className += " active";

}
function switchAuthForm(elementid) {
    console.log(elementid);
    let element = document.getElementById(elementid);
    if (elementid == "myChat-login") {
        element.style.display = "block";
        document.getElementById("myChat-signup").style.display = "none";  
    } else {
        element.style.display = "block";
        document.getElementById("myChat-login").style.display = "none";    
    }
}

const login = (email,pass) => {
    fetch("https://pm.masproducto.com/api/1.1/wf/login", {
        method: "POST",
        headers: {
          "Authorization": "Bearer d4308b8e54b7757b8507b932931e7a60",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: pass
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data) {
          if(data.statusCode == 400){
            alert(data.message);
          } else {
            console.log(data.response.user_id);
            chrome.storage.local.set({ userId: data.response.user_id, userEmail: email }).then(() => {
                console.log("Value is set to " + data.response.user_id);
                document.getElementById("myChat-login").style.display = "none";
                document.getElementById("myChat-account").style.display = "block";
              });
          }
          document.getElementById("mychat_login_submit").disabled = false;
        }
      }).catch((error) => {
        console.error("Error:", error);
    });
}

const signup = (email,pass,repass) => {
    fetch("https://pm.masproducto.com/api/1.1/wf/signup", {
        method: "POST",
        headers: {
          "Authorization": "Bearer d4308b8e54b7757b8507b932931e7a60",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: pass,
          repassword: repass
        })
      })
      .then(response => response.json())
      .then(data => {
          if(data.statusCode == 400){
            alert("Error: "+data.message);
          } else {
            console.log(data);
            chrome.storage.local.set({ userId: data.response.user_id, userEmail: email }).then(() => {
                console.log("Value is set to " + data.response.user_id);
                document.getElementById("myChat-signup").style.display = "none";
                document.getElementById("myChat-account").style.display = "block";
                document.getElementById("mychat-account-email").innerHTML = `Cuenta: ${email}`;
              });

              
              fetch("https://mychat-poc.herokuapp.com/createCSV", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"userid":data.response.user_id}),
            })
                .then((response) => response.json())
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            
          }

          document.getElementById("mychat_signup_submit").disabled = false;

      }).catch((error) => {
        console.error("Error:", error);
    });

}

const logout = () => {
    chrome.storage.local.remove(["userId", "userEmail"]).then((result) => {
        console.log("Value removed");
        console.log(result);
      });
      document.getElementById("myChat-signup").style.display = "block";
      document.getElementById("myChat-account").style.display = "none";
}

const addData = (title, text) => {
    let user_id;
    chrome.storage.local.get(["userId"]).then((result) => {
        console.log("Value currently is " + result.userId);
        user_id = result.userId;
      });

    const data = {
        "title": title,
        "content": text,
        "token": 123,
        "userid": user_id
    };


    fetch("https://mychat-poc.herokuapp.com/addData", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.getElementById("mychat_addData_submit").value = 'Datos agregados';
            setTimeout(() => {
                document.getElementById("mychat_addData_submit").value = 'Agregar';
                document.getElementById("mychat_new_data_textarea").value = '';
                document.getElementById("mychat_addData_submit").disabled = false;
            }, 1500);

        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

const makeQuestion = (question) => {
    let user_id;
    chrome.storage.local.get(["userId"]).then((result) => {
        console.log("Value currently is " + result.userId);
        user_id = result.userId;
      });
    const data = {
        "question": question,
        "userid": user_id
    };
    fetch("https://mychat-poc.herokuapp.com/Mychat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            addText(data.value,'myChat');
            setTimeout(() => {
                document.getElementById("mychat_question_submit").value = 'Preguntar';
                document.getElementById("mychat_question_textarea").value = '';
                document.getElementById("mychat_question_submit").disabled = false;
            }, 1500);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

const addText = (message,sender) => {
    const container = document.getElementById("myChat_conversation_container");
    const paragraph = document.createElement('p');
    if(sender === 'Tu'){
        paragraph.className = 'mychat_user_message';
    } else {
        paragraph.className = 'mychat_bot_message'; 
    }
    paragraph.innerHTML = `<b>${sender}: </b>${message}`;
    container.appendChild(paragraph);
    updateScroll(container,paragraph.offsetHeight)

}

function updateScroll(element,height) {
    let currentTop = element.scrollTop
    element.scrollTop = currentTop + height;
}

//===============================
//WIP
const addDataWebsite = () => {
    let url = window.location.href;
    let is_supported = false;
    let root;
    const collection = {
        "notion.so":{
            elemento:"notion-page-content",
            tipo:"class"
        },
        "jira":{
            elemento:"description-val",
            tipo:"id"
        },
        "docs.google": {
            elemento:"kix-appview-editor",
            tipo:"class"
        }
    };

    for (const site in collection) {
        if (url.includes(site)) {
            console.log(`${site} is present with the component ${collection[site].elemento}`);
            root = (collection[site].tipo == "id") ? document.getElementById(collection[site].elemento) : document.getElementsByClassName(collection[site].elemento)[0];
            is_supported = true;
            break;
        }
    }
    if(!is_supported){
        alert("Lo sentimos por el momento no podemos agregar el contenido de este sitio");
        root = document.body;
    }

    textNodesUnder(root);

}

//WIP
const rejectScriptTextFilter = {
    acceptNode: function (node) {
        let match = /\r|\n/.exec(node.wholeText);
        if (node.parentNode.nodeName !== 'SCRIPT' && match == null) {
            console.log(node.wholeText);
            return NodeFilter.FILTER_ACCEPT;
        } else {
            return NodeFilter.FILTER_REJECT
        }
    }
};

//WIP
function textNodesUnder(root) {
    var n, a = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, rejectScriptTextFilter
        , false);
    //console.log(w);
    while (n = w.nextNode()) a.push(n);
    //console.log(a);
    return a;
}
//===============================

document.getElementById("mychat_btn1").addEventListener("click", () => { switchTab("mychat_btn1", "myChat_tab_one") });
document.getElementById("mychat_btn2").addEventListener("click", () => { switchTab("mychat_btn2", "myChat_tab_two") });
document.getElementById("mychat_btn3").addEventListener("click", () => { switchTab("mychat_btn3", "myChat_tab_three") });
document.getElementById("mychat-show-login").addEventListener("click", () => { switchAuthForm("myChat-login") });
document.getElementById("mychat-show-signup").addEventListener("click", () => { switchAuthForm("myChat-signup") });
document.getElementById("mychat-logout").addEventListener("click", () => { logout() });
contentInput = document.getElementById("mychat_new_data_textarea");
questionInput = document.getElementById("mychat_question_textarea");
//document.getElementById("myChat_addData-website").addEventListener("click", () => { addDataWebsite() });



//++++++++++++Add New Content
document.getElementById("mychat_addData_form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (contentInput.value) {
        // make api request to add content
        let fiveLetters = contentInput.value.substring(0, 5);
        let randomNumber = Math.floor(Math.random() * Math.pow(10, 10));
        addData(fiveLetters + randomNumber, contentInput.value);
        document.getElementById("mychat_addData_submit").value = 'Agregando...';
        document.getElementById("mychat_addData_submit").disabled = true;


    } else {
        // input empty
        alert("Completa los inputs");
    }
});

//+++++++++++Make a Question
document.getElementById("mychat_makeQuestion_form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (questionInput.value) {
        // make api request to add content
        addText(questionInput.value,'Tu');
        makeQuestion(questionInput.value);
        document.getElementById("mychat_question_submit").value = 'Preguntando...';
        document.getElementById("mychat_question_submit").disabled = true;


    } else {
        // input empty
        alert("Escribe una pregunta");
    }
});

//+++++++++++Login
document.getElementById("mychat_login_form").addEventListener("submit", (e) => {
    e.preventDefault();
    let email = document.getElementById("mychat_login_email");
    let pass = document.getElementById("mychat_login_pass");

    if (email.value && pass.value) {
        // make api request to add content
        login(email.value,pass.value);
        document.getElementById("mychat_login_submit").disabled = true;


    } else {
        // input empty
        alert("Ingresa tu correo y contraseña");
    }
});

//+++++++++++Signup
document.getElementById("mychat_signup_form").addEventListener("submit", (e) => {
    e.preventDefault();
    let email = document.getElementById("mychat_signup_email");
    let pass = document.getElementById("mychat_signup_pass");
    let repass = document.getElementById("mychat_signup_repass");

    if (email.value && pass.value && repass.value) {
        // make api request to add content
        signup(email.value,pass.value,repass.value);
        document.getElementById("mychat_signup_submit").disabled = true;


    } else {
        // input empty
        alert("Ingresa tu correo y contraseña");
    }
});