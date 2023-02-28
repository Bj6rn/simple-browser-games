const goat_img = "url('goat.svg')";
const car_img = "url('car.svg')";
const instructions = document.querySelector("#game-instruction");
let stats_switched = {cars:0, goats:0};
let stats_stayed = {cars:0, goats:0};
let doors = [];
let doors_opened = [];
let gamestate = 0; //gamestate 0: select your door, gamestate 1: stay or switch, gamestate 2: all doors open
let user_choice;

start_game();

function update_stats() {
    document.querySelector("#switched-cars").innerHTML = stats_switched.cars;
    document.querySelector("#switched-goats").innerHTML = stats_switched.goats;
    let switched_win_percentage = Math.round(stats_switched.cars / (stats_switched.cars + stats_switched.goats) * 100);
    if (switched_win_percentage >= 0){
        document.querySelector("#switched-winrate").innerHTML = `${switched_win_percentage} %`;
    }

    document.querySelector("#stayed-cars").innerHTML = stats_stayed.cars;
    document.querySelector("#stayed-goats").innerHTML = stats_stayed.goats;
    let stayed_win_percentage = Math.round(stats_stayed.cars / (stats_stayed.cars + stats_stayed.goats) * 100);
    if (stayed_win_percentage >= 0) {
        document.querySelector("#stayed-winrate").innerHTML = `${stayed_win_percentage} %`;
    }
}

function get_random_int(max) {
    return Math.floor(Math.random() * max);
}

function start_game() {
    //put the price behind the doors
    const car_door = get_random_int(3);
    if (car_door == 0) {
        doors = ["car", "goat", "goat"];
    } else if (car_door == 1) {
        doors = ["goat", "car", "goat"];
    } else {
        doors = ["goat", "goat", "car"];
    }

    instructions.innerHTML = "Choose one of the three doors.";
}

function reset_game() {
    //close all doors & reset background
    document.querySelectorAll(".door > .left, .door > .right").forEach(element => {
        element.style.animation = "close-door 0.5s linear forwards";
    });
    document.querySelectorAll(".door").forEach(element => {
        element.style.backgroundImage = "none";
    });

    //reset variables
    doors = [];
    doors_opened = [];
    gamestate = 0;
    user_choice = undefined;

    //start a new game
    start_game();
}

function clicked_door(door_index) {
    const selected_element = document.querySelector(`#door-${door_index+1}`);
    switch (gamestate) {
        case 0: //first door choice
            user_choice = door_index;
            selected_element.classList.add("user-choice");
            if (doors[user_choice] == "car") {
                let goats = [];
                let temp = JSON.parse(JSON.stringify(doors)); //copy the doors data to a temporary array
                goats[0] = temp.indexOf("goat"); //save original index from the first goat
                temp.splice(goats[0], 1, "removed");
                goats[1] = temp.indexOf("goat"); //save original index from the second goat
                let hint = goats[get_random_int(goats.length)]; //get a random choice between the two goats
                open_door(hint);
            } else {
                let temp = JSON.parse(JSON.stringify(doors));
                temp.splice(user_choice, 1, "user_choice"); //replace the chosen goat in the temporary array
                let hint = temp.indexOf("goat"); //get the index of the left over goat
                open_door(hint);
            }
            gamestate = 1;
            instructions.innerHTML = "Do you want to stay with your door?";
            break;
        case 1: //stay or switch decision
            if (doors_opened.includes(door_index)) {
                //dont do anything, if door is already open
                return
            }
            
            document.querySelector(".user-choice").classList.remove("user-choice");
            selected_element.classList.add("user-choice");

            if (door_index == user_choice) {
                //stayed
                if (doors[door_index] == "car") {
                    stats_stayed.cars += 1;
                    instructions.innerHTML = "Congrats you won the car! &#128170;";
                } else {
                    stats_stayed.goats += 1;
                    instructions.innerHTML = "Oops. Now you got a personal goat. &#128521;";
                }
            } else {
                //switched
                if (doors[door_index] == "car") {
                    stats_switched.cars += 1;
                    instructions.innerHTML = "Congrats you won the car! &#128170;";
                } else {
                    stats_switched.goats += 1;
                    instructions.innerHTML = "Oops. Now you got a personal goat. &#128521;";
                }
            }  

            open_door(door_index); //open the selected door
            for (let i = 0; i < 3; i++) {   //open the left over door
                if (!doors_opened.includes(i)) {
                    open_door(i);
                    break;
                }
            }
            update_stats();
            gamestate = 2;
            break;
        case 2: //game already ended, restart intended
            document.querySelector(".user-choice").classList.remove("user-choice");
            reset_game();
            break;
    }
}

function open_door(door_index) {
    const element = document.querySelector(`#door-${door_index+1} > .door`)
    //put price behind the given door and open it
    switch (doors[door_index]) {
        case "car":
            element.style.backgroundSize = "contain";
            element.style.backgroundImage = car_img;
            break;
        case "goat":
            element.style.backgroundSize = "60%";
            element.style.backgroundImage = goat_img;
            break;
    }

    document.querySelector(`#door-${door_index+1} > .door > .left`).style.animation = "open-door 1s linear forwards";
    document.querySelector(`#door-${door_index+1} > .door > .right`).style.animation = "open-door 1s linear forwards";

    doors_opened.push(door_index);
}

document.querySelector("#door-1").addEventListener("click", event => {
    clicked_door(0);
})

document.querySelector("#door-2").addEventListener("click", event => {
    clicked_door(1);
})

document.querySelector("#door-3").addEventListener("click", event => {
    clicked_door(2);
})