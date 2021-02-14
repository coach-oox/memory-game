const timer = document.querySelector(".timer");
const playButton = document.querySelector(".play");
const board = document.querySelector(".board");
const scoreBoard = document.querySelector(".score");
const rankBoard = document.querySelector("ol");

let STATE = false;
let time = 5;
const cards = [];
let score = 0;
let prevCard = 999;
let nextCard = 999;

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

    const obj = {
        name,
        score,
    };

    if (!records) {
        localStorage.setItem("records", JSON.stringify([obj]));
    } else {
        records.push(obj);
        localStorage.setItem("records", JSON.stringify(records));
    }
}

function gameOver() {
    const userName = prompt("Game Over! If you want to save the score, Enter your nickname.");

    if (!userName) {
        newRecord("Anonymous", score);
    } else {
        newRecord(userName, score);
    }

    location.reload();
}

function getScore(imageNumber, id) {
    const images = document.querySelectorAll("img");
    const id1 = cards.indexOf(imageNumber);
    const id2 = cards.indexOf(imageNumber, id1 + 1);

    images[id1].removeAttribute("onclick");
    images[id2].removeAttribute("onclick");
    images[id1].src = `/images/${imageNumber}.jpg`;
    images[id2].src = `/images/${imageNumber}.jpg`;

    console.log(images[id1], images[id2]);

    score += 10;
    scoreBoard.innerText = `Score : ${score}`;
}

function flipCard(event) {
    const target = event.target;
    const id = parseInt(event.target.id);

    if (STATE) {
        target.src = `/images/${cards[id]}.jpg`;

        if (prevCard === 999) {
            prevCard = cards[id];

            setTimeout(() => {
                target.src = `/images/card.jpg`;
            }, 300);
        } else if (nextCard === 999) {
            nextCard = cards[id];

            if (prevCard === nextCard) {
                getScore(prevCard, id);
            } else {
                setTimeout(() => {
                    target.src = `/images/card.jpg`;
                }, 300);
            }

            prevCard = 999;
            nextCard = 999;
        }
    }
}

function makeGrid() {
    const flag = [0, 2, 2, 2, 2, 2, 2];

    while (cards.length < 12) {
        let random = Math.floor(Math.random() * 6) + 1;

        if (flag[random] > 0) {
            flag[random]--;
            cards.push(random);
        }
    }
}

function gamePlay() {
    const timeout = time;

    makeGrid();

    let timerId = setInterval(() => {
        time--;
        timer.innerText = `Timer : ${time < 10 ? `0${time}` : `${time}`}`;
        STATE = true;
    }, 1000);

    setTimeout(() => {
        clearInterval(timerId);
        STATE = false;
        gameOver();
    }, timeout * 1000);
}

function setTimer(event) {
    const selected = event.target.outerText;

    if (selected === "5sec") time = 5;
    else if (selected === "10sec") time = 10;
    else time = 15;

    timer.innerText = `Timer : ${time < 10 ? `0${time}` : `${time}`}`;
}

function main() {
    const records = JSON.parse(localStorage.getItem("records"));
    if (records) displayRecords(records);
}

main();
playButton.addEventListener("click", gamePlay);
