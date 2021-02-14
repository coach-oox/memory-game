const board = document.querySelector(".board");
const play = document.querySelector(".play");
const timerBoard = document.querySelector(".timer");
const scoreBoard = document.querySelector(".score");
const rankBoard = document.querySelector("ol");

const DEFAULT_CARD = "./images/card.jpg";
let RUNNING = false;
let score = 0;
let timerId;
let runningTime = 5000;
let selectedCards = [];
const cards = [
    "./images/1.jpg",
    "./images/1.jpg",
    "./images/2.jpg",
    "./images/2.jpg",
    "./images/3.jpg",
    "./images/3.jpg",
    "./images/4.jpg",
    "./images/4.jpg",
    "./images/5.jpg",
    "./images/5.jpg",
    "./images/6.jpg",
    "./images/6.jpg",
];

function displayRecords(records) {
    const field = "score";

    records.sort((a, b) => {
        return b[field] - a[field];
    });

    records.forEach((record) => {
        const li = document.createElement("li");
        li.append(`${record.name} : ${record.score}`);
        rankBoard.appendChild(li);
    });
}

function newRecord(name, score) {
    const records = JSON.parse(localStorage.getItem("records"));

    const user = {
        name,
        score,
    };

    if (!records) {
        localStorage.setItem("records", JSON.stringify([user]));
    } else {
        records.push(user);
        localStorage.setItem("records", JSON.stringify(records));
    }
}

function getScore() {
    const imgs = document.querySelectorAll("img");
    const id1 = JSON.parse(selectedCards[0]);
    const id2 = JSON.parse(selectedCards[1]);

    imgs[id1].removeEventListener("click", flipCard);
    imgs[id2].removeEventListener("click", flipCard);

    score += 10;
    scoreBoard.innerText = `Score : ${score}`;
}

function checkMatch() {
    const imgs = document.querySelectorAll("img");

    if (imgs[selectedCards[0]].getAttribute("src") === imgs[selectedCards[1]].getAttribute("src")) {
        getScore();
    } else {
        imgs[selectedCards[0]].setAttribute("src", DEFAULT_CARD);
        imgs[selectedCards[1]].setAttribute("src", DEFAULT_CARD);
    }

    selectedCards = [];
}

function flipCard() {
    let id = this.getAttribute("id");

    if (RUNNING) {
        selectedCards.push(id);
        this.setAttribute("src", cards[id]);

        if (selectedCards.length === 2) {
            setTimeout(checkMatch, 200);
        }
    }
}

function setBoard() {
    cards.sort(() => {
        return Math.random() - 0.5;
    });

    for (let i = 0; i < cards.length; i++) {
        const img = document.createElement("img");
        img.setAttribute("src", DEFAULT_CARD);
        img.setAttribute("id", i);
        img.addEventListener("click", flipCard);
        board.appendChild(img);
    }
}

function gameOver() {
    clearInterval(timerId);

    const userName = prompt("Game Over! If you want to save the score, Enter your nickname.");

    if (!userName) {
        newRecord("Anonymous", score);
    } else {
        newRecord(userName, score);
    }

    location.reload();
}

function countDown() {
    RUNNING = true;
    runningTime--;
    timerBoard.innerText = `Timer : ${runningTime < 10 ? `0${runningTime}` : `${runningTime}`}`;
}

function gameStart() {
    const timeout = runningTime;
    timerId = setInterval(countDown, 1000);
    setTimeout(gameOver, timeout * 1000);
}

function setRunningTime(event) {
    const selected = event.target.innerText;

    if (selected === "5sec") runningTime = 5;
    else if (selected === "10sec") runningTime = 10;
    else runningTime = 15;

    timerBoard.innerText = `Timer : ${runningTime < 10 ? `0${runningTime}` : `${runningTime}`}`;
}

function setTimer() {
    const timer = document.querySelectorAll(".set-time");

    timer.forEach((time) => {
        time.addEventListener("click", setRunningTime);
    });
}

function main() {
    const records = JSON.parse(localStorage.getItem("records"));
    if (records) displayRecords(records);

    setTimer();
    setBoard();
}

main();
play.addEventListener("click", gameStart);
