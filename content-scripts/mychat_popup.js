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

function CopyToClipboard(element) {
    navigator.clipboard
    .writeText(element.textContent)
    .then(() => {
        //alert("Copied the text: "+ element.textContent);
    })
    .catch(() => {
      alert("Error: No se pudo copiar");
    });
    
}

const readLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], function (result) {
        if (result[key] === undefined) {
          reject();
        } else {
            console.log("Value currently is " + result.userId);
            resolve(result[key]);
        }
      });
    });
  };

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
                document.getElementById("mychat-account-email").innerHTML = `Cuenta: ${email}`;
                document.getElementById("mychat_btn1").disabled = false;
                document.getElementById("mychat_btn2").disabled = false;
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
                document.getElementById("mychat_btn1").disabled = false;
                document.getElementById("mychat_btn2").disabled = false;
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
      document.getElementById("mychat_btn1").disabled = true;
      document.getElementById("mychat_btn2").disabled = true;
}

async function addData(title, text) {
    let user_id = await readLocalStorage("userId");
    console.log("user_id " + user_id);
    const data = {
        "title": title,
        "content": text,
        "token": 123,
        "userid": user_id
    };


    fetch("https://mychat-poc.herokuapp.com/addDataPine", {
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

async function makeQuestion(question){
    let user_id = await readLocalStorage("userId");
    const data = {
        "question": question,
        "userid": user_id
    };
    //console.log(data);
    fetch("https://mychat-poc.herokuapp.com/MychatPine", {
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
    const container_text = document.createElement('div');
    const paragraph = document.createElement('p');
    paragraph.innerHTML = `<b>${sender}: </b>${message}`;
    container_text.appendChild(paragraph);
    
    if(sender === 'Tu'){
        paragraph.className = 'mychat_user_message';
    } else {
        paragraph.className = 'mychat_bot_message'; 
        const copy_btn = document.createElement('button');
        copy_btn.addEventListener("click", () => { CopyToClipboard(paragraph) });
        const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('width','24px');
        svg.setAttribute('height','24px');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d","M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4 6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z"); //Set path's data
        svg.appendChild(path);
        copy_btn.appendChild(svg);
        container_text.appendChild(copy_btn);
    }

    container.appendChild(container_text);
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
        }
/*         "docs.google": { // No soportado porque contenido esta dentro de un canva, se debe hacer vía API
            elemento:"kix-appview-editor",
            tipo:"class"
        } */
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
        //alert("Lo sentimos por el momento no podemos agregar el contenido de este sitio de manera automatica. Agrega contenido seleccionando el texto y dando clic derecho");
        root = document.body;
    } 
    let content = textNodesUnder(root);
    content.forEach(element => {
        let fiveLetters = contentInput.value.substring(0, 5);
        let randomNumber = Math.floor(Math.random() * Math.pow(10, 10));
        addData(fiveLetters + randomNumber, element);
    });
    alert("Se agrego el contenido de este sitio web");
}

//WIP
const rejectScriptTextFilter = {
    acceptNode: function (node) {
        let match = /\r|\n/.exec(node.wholeText);
        let is_myChat_element = node.parentNode.id.includes('mychat');
        if (node.parentNode.nodeName !== 'SCRIPT' && match == null && !is_myChat_element) { //&& match == null && whitespace.length>0
            //console.log(node.wholeText);
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
    let window = 30;  // number of sentences to combine
    let content_data = [];
    //console.log(w);
    while (n = w.nextNode()){ a.push(n);};
    //console.log(a);
     for (let index = 0; index < (a.length+30); index+=30) {
        console.log("index: "+index+" window: "+window);
        let content = a.slice(index,window).map( function(element){
            return element.wholeText
        }).join(" ");
        if(content){content_data.push(content);}
        window += 30;
    } 
    //console.log(a.length);
    console.log(content_data);
    return content_data;
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
document.getElementById("mychat_addData-website").addEventListener("click", () => { addDataWebsite() });



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