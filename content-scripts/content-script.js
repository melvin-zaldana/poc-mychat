const setmyChatForms = (ParentElement) => {
    const form = document.createElement('form');
    form.id = 'mychat_form';
    form.innerHTML = `<input id="addTextTitleInput" type="text" name="title" placeholder="Title">
    <input id="addTextContentInput" type="text" name="text" placeholder="Text">
    <input type="submit" value="Save">`; 
    ParentElement.appendChild(form);
}

const setTabs = (ParentElement) =>{
    const container = document.createElement('div');
    container.id = "myChat_tabs_container";
    const btn1 = document.createElement('button');
    btn1.innerHTML = "Chat";
    btn1.className ="myChat_tablinks";
    btn1.id = "mychat_btn1";
    container.appendChild(btn1);

    const btn2 = document.createElement('button');
    btn2.innerHTML = "Contenido";
    btn2.className ="myChat_tablinks";
    btn2.id = "mychat_btn2";
    container.appendChild(btn2);

    const btn3 = document.createElement('button');
    btn3.innerHTML = "Mi cuenta";
    btn3.className ="myChat_tablinks";
    btn3.id = "mychat_btn3";
    container.appendChild(btn3);

    ParentElement.appendChild(container);
};

const setTabsContent = (ParentElement) => {
    const container = document.createElement('div');
    container.id = "myChat_tab_one";
    container.className = "myChat_tabcontent";
    container.innerHTML = `<div id="myChat_conversation_container"></div>
    <form id="mychat_makeQuestion_form">
    <textarea id="mychat_question_textarea" placeholder="Escriba su pregunta"></textarea>
    <input type="submit" value="Preguntar" id="mychat_question_submit">
</form>`;
    ParentElement.appendChild(container);

};
const setTabsContent2 = (ParentElement) => {
    const container = document.createElement('div');
    container.id = "myChat_tab_two";
    container.className = "myChat_tabcontent";
    container.innerHTML = `<button id="mychat_addData-website">+ web</button>
    <form id="mychat_addData_form">
    <textarea id="mychat_new_data_textarea" placeholder="Texto"></textarea>
    <input type="submit" id="mychat_addData_submit" value="Agregar">
</form>`; //<button id="mychat_addData-website">+ web</button>
    ParentElement.appendChild(container);

};
const setTabsContent3 = (ParentElement) => {
    const container = document.createElement('div');
    container.id = "myChat_tab_three";
    container.className = "myChat_tabcontent";
    container.innerHTML = `<div id="myChat-login">
    <form id="mychat_login_form">
    <input type="email" id="mychat_login_email" placeholder="Email">
    <input type="password" id="mychat_login_pass" placeholder="Constraseña">
    <input type="submit" id="mychat_login_submit" value="Iniciar sesión">
    </form>
    <a id="mychat-show-signup">Crear nueva cuenta</a>
    </div>
    <div id="myChat-signup">
    <form id="mychat_signup_form">
    <input type="email" placeholder="Email" id="mychat_signup_email">
    <input type="password" placeholder="Constraseña" id="mychat_signup_pass">
    <input type="password" placeholder="Repetir Constraseña" id="mychat_signup_repass">
    <input type="submit" value="Crear cuenta" id="mychat_signup_submit">
    </form>
    <a id="mychat-show-login">Entrar a mi cuenta</a>
    </div>
    <div id="myChat-account">
    <p id="mychat-account-email"></p>
    <a id="mychat-logout">Cerrar sesión</a>
    </div>`;
    ParentElement.appendChild(container);

};

const setCloseBtn = (ParentElement) => {
    //Boton de cerrar
    const closeRenderer = document.createElement('button');
    closeRenderer.id = 'myChat_close_sheet';
    closeRenderer.addEventListener("click", function () {
        document.getElementById('mychat_popup_div').style.display = "none";
    });
    closeRenderer.innerHTML = `<svg fill="#07288C" viewBox="0 0 24 24" width="24px" height="24px" class="post-icon"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>`;
    ParentElement.appendChild(closeRenderer);
};

let myChatPopupDiv = document.createElement('div');
myChatPopupDiv.id = 'mychat_popup_div';
document.body.appendChild(myChatPopupDiv);
setCloseBtn(myChatPopupDiv);
setTabs(myChatPopupDiv);
setTabsContent(myChatPopupDiv);
setTabsContent2(myChatPopupDiv);
setTabsContent3(myChatPopupDiv);

chrome.storage.local.get(["userId", "userEmail"]).then((result) => {
    if(result.userId && result.userEmail){
        document.getElementById("mychat_btn1").className += " active";
        document.getElementById("myChat_tab_one").style.display = "block";
        document.getElementById("myChat-account").style.display = "block";
        document.getElementById("mychat-account-email").innerHTML = `Cuenta: ${result.userEmail}`;
        
    } else {
        console.log("Value currently is NOT ");
        document.getElementById("mychat_btn3").className += " active";
        document.getElementById("myChat_tab_three").style.display = "block";
        document.getElementById("myChat-signup").style.display = "block";
        document.getElementById("mychat_btn1").disabled = true;
        document.getElementById("mychat_btn2").disabled = true;
        
    }
});


chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, content } = obj;
    if (type === "NEW_DATA") {
        myChatPopupDiv.style.display = "block";
        if(content){
            document.getElementById("mychat_new_data_textarea").value = content;
            document.getElementById("mychat_btn2").click();
        }
    } else if(type === "ANSWER_QUESTION"){
        myChatPopupDiv.style.display = "block";
        if(content){
            document.getElementById("mychat_question_textarea").value = content;
            document.getElementById("mychat_btn1").click();
            document.getElementById("mychat_makeQuestion_form").requestSubmit();
        }
    } else {
        console.log(obj);
    }
});