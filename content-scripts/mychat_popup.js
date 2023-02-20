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

const addData = (title, text) => {
    console.log("title: "+title);
    const data = {
        "title": title,
        "content": text,
        "token": 123,
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
                document.getElementById("myChat_Title_AddData").value = '';
                document.getElementById("mychat_addData_submit").disabled = false;
            }, 1500);

        })
        .catch((error) => {
            console.error("Error:", error);
        });
};

const makeQuestion = (question) => {
    const data = {
        "question": question
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
            console.log(data);
            //print the aswer
            //showAnswer(inputElement, data.value);
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

}

document.getElementById("mychat_btn1").addEventListener("click", () => { switchTab("mychat_btn1", "myChat_tab_one") });
document.getElementById("mychat_btn2").addEventListener("click", () => { switchTab("mychat_btn2", "myChat_tab_two") });
document.getElementById("mychat_btn3").addEventListener("click", () => { switchTab("mychat_btn3", "myChat_tab_three") });
contentInput = document.getElementById("mychat_new_data_textarea");
questionInput = document.getElementById("mychat_question_textarea");

//Add New Content
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