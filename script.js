

function showPage(pageId) {
    // hide all pages
    var pages = document.querySelectorAll(".page");
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove("show");
    }

    // show the page that was clicked
    document.getElementById(pageId).classList.add("show");

    // highlight the matching button in the menu
    var buttons = document.querySelectorAll(".nav-btn");
    for (var j = 0; j < buttons.length; j++) {
        if (buttons[j].getAttribute("data-page") === pageId) {
            buttons[j].classList.add("active");
        } else {
            buttons[j].classList.remove("active");
        }
    }

    // start from the top of the page
    window.scrollTo(0, 0);
}


/* ---------- 2. Learn page (lessons) ---------- */

function showLesson(number) {
    var lessons = document.querySelectorAll(".lesson");
    var tabs = document.querySelectorAll(".tab");

    for (var i = 0; i < lessons.length; i++) {
        if (i === number) {
            lessons[i].classList.add("show");
            tabs[i].classList.add("active");
        } else {
            lessons[i].classList.remove("show");
            tabs[i].classList.remove("active");
        }
    }
}


/* ---------- 3. Password checker ---------- */

function checkPassword() {
    var password = document.getElementById("pw").value;
    var fill = document.getElementById("fill");
    var strengthText = document.getElementById("strength");

    // check each rule (true or false)
    var hasLength = password.length >= 8;
    var hasUpper = /[A-Z]/.test(password);
    var hasNumber = /[0-9]/.test(password);
    var hasSymbol = /[^A-Za-z0-9]/.test(password);

    // tick or untick each rule in the list
    setRule("rule-length", hasLength);
    setRule("rule-upper", hasUpper);
    setRule("rule-number", hasNumber);
    setRule("rule-symbol", hasSymbol);

    // nothing typed yet
    if (password.length === 0) {
        fill.style.width = "0";
        strengthText.textContent = "Strength: -";
        return;
    }

    // give one point for every rule that is true
    var score = 0;
    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;

    // a long password gets a bonus point
    if (password.length >= 12) score++;

    // show the result
    if (score <= 2) {
        fill.style.width = "30%";
        fill.style.background = "#b91c1c";
        strengthText.textContent = "Strength: Weak";
    } else if (score <= 4) {
        fill.style.width = "65%";
        fill.style.background = "#d97706";
        strengthText.textContent = "Strength: Medium";
    } else {
        fill.style.width = "100%";
        fill.style.background = "#15803d";
        strengthText.textContent = "Strength: Strong";
    }
}

// helper: marks one rule in the list as done or not done
function setRule(id, passed) {
    var item = document.getElementById(id);
    if (passed) {
        item.classList.add("done");
    } else {
        item.classList.remove("done");
    }
}


/* ---------- 4. Quiz ---------- */

var questions = [
    {
        question: "A text says your parcel is held and asks you to pay Rs 12 through a link. What should you do?",
        options: [
            "Pay quickly, it is only Rs 12",
            "Ignore the link and check the courier's official app",
            "Reply STOP to the number"
        ],
        answer: 1,
        explain: "Small amounts are bait. The payment page steals your card or UPI details."
    },
    {
        question: "Which password is the strongest?",
        options: [
            "Rahul@2005",
            "P@ssw0rd!",
            "maple-tractor-violin-seven"
        ],
        answer: 2,
        explain: "Length matters most. Hackers already guess passwords like the first two."
    },
    {
        question: "A 'bank officer' calls and asks for your OTP. What should you do?",
        options: [
            "Share it, they are protecting you",
            "Hang up and call the bank's official number",
            "Share only the first 3 digits"
        ],
        answer: 1,
        explain: "Banks never ask for your OTP, not even part of it."
    },
    {
        question: "What does two-step verification do?",
        options: [
            "Makes your password longer",
            "Asks for a second proof even if your password leaks",
            "Hides your email address"
        ],
        answer: 1,
        explain: "A stolen password alone is not enough to log in."
    },
    {
        question: "What is the safest way to check email at a railway station?",
        options: [
            "Use the free Wi-Fi",
            "Use your own mobile data",
            "Join a network with a name similar to the official one"
        ],
        answer: 1,
        explain: "Public and fake Wi-Fi networks can be watched. Mobile data is safer."
    }
];

var current = 0;   // which question we are on
var score = 0;     // how many answers are correct

function showQuestion() {
    var box = document.getElementById("quiz-box");

    // quiz finished
    if (current >= questions.length) {
        var message = "Good start. Read the Learn page and try again.";
        if (score >= 4) {
            message = "Great awareness. Keep it up!";
        }

        box.innerHTML =
            "<h3>You scored " + score + " out of " + questions.length + "</h3>" +
            "<p>" + message + "</p>" +
            "<button class='btn' onclick='restartQuiz()'>Try Again</button>";
        return;
    }

    var q = questions[current];

    // build the question and its options
    var html = "<p class='small'>Question " + (current + 1) + " of " + questions.length + "</p>";
    html += "<p class='question'>" + q.question + "</p>";

    for (var i = 0; i < q.options.length; i++) {
        html += "<button class='option' onclick='checkAnswer(" + i + ")'>" + q.options[i] + "</button>";
    }

    html += "<p class='explain' id='explain'></p>";
    box.innerHTML = html;
}

function checkAnswer(choice) {
    var q = questions[current];
    var options = document.querySelectorAll(".option");

    // lock all the buttons after one answer
    for (var i = 0; i < options.length; i++) {
        options[i].disabled = true;
    }

    // mark right and wrong
    if (choice === q.answer) {
        score++;
        options[choice].classList.add("correct");
    } else {
        options[choice].classList.add("wrong");
        options[q.answer].classList.add("correct");
    }

    // show the explanation and a Next button
    document.getElementById("explain").textContent = q.explain;

    var buttonText = "Next Question";
    if (current === questions.length - 1) {
        buttonText = "See Score";
    }

    var next = document.createElement("button");
    next.className = "btn";
    next.textContent = buttonText;
    next.onclick = function () {
        current++;
        showQuestion();
    };
    document.getElementById("quiz-box").appendChild(next);
}

function restartQuiz() {
    current = 0;
    score = 0;
    showQuestion();
}


/* ---------- 5. Report form ---------- */

function submitReport() {
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var details = document.getElementById("details").value.trim();
    var msg = document.getElementById("msg");

    // check that every field is filled
    if (name === "" || email === "" || details === "") {
        msg.style.color = "#b91c1c";
        msg.textContent = "Please fill in all the fields.";
        return;
    }

    // simple email check
    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
        msg.style.color = "#b91c1c";
        msg.textContent = "Please enter a valid email address.";
        return;
    }

    // success message and clear the form
    msg.style.color = "#15803d";
    msg.textContent = "Thank you, " + name + ". Your report has been recorded.";

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("details").value = "";
}


/* ---------- Start ---------- */

// show the first quiz question when the page loads
showQuestion();
