const goat_img = "url('goat.png')";
const car_img = "url('car.png')";
const instructions = document.querySelector("#game-instruction");
let stats_switched = {cars:0, goats:0};
let stats_stayed = {cars:0, goats:0};
let doors = [];
let doors_opened = [];
let gamestate = 0; //gamestate 0: select your door, gamestate 1: stay or switch, gamestate 2: all doors open
let user_choice;

reset_game();

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

function reset_game() {
    console.clear();
    //close all doors & reset background
    document.querySelectorAll(".door").forEach(element => {
        element.style.backgroundImage = "none";
    });


    //reset variables
    doors = [];
    doors_opened = [];
    gamestate = 0;
    user_choice = undefined;

    instructions.innerHTML = "Choose one of the three doors.";

    //choose new winning door
    const car_door = get_random_int(3);
    if (car_door == 0) {
        doors = ["car", "goat", "goat"];
    } else if (car_door == 1) {
        doors = ["goat", "car", "goat"];
    } else {
        doors = ["goat", "goat", "car"];
    }
}

function clicked_door(door_index) {
    const selected_element = document.querySelector(`#door-${door_index+1}`);
    switch (gamestate) {
        case 0: //first door choice
            user_choice = door_index;
            selected_element.classList.add("user-choice");
            //show_hint()
            if (doors[user_choice] == "car") {
                let goats = [];
                let temp = JSON.parse(JSON.stringify(doors));
                goats[0] = temp.indexOf("goat");
                temp.splice(goats[0], 1, "removed");
                goats[1] = temp.indexOf("goat");
                let hint = goats[get_random_int(goats.length)];
                open_door(hint);
            } else {
                let temp = JSON.parse(JSON.stringify(doors));
                temp.splice(user_choice, 1, "user_choice");
                let hint = temp.indexOf("goat");
                open_door(hint);
            }
            gamestate = 1;
            instructions.innerHTML = "Do you want to stay with your door?";
            break;
        case 1: //stay or switch decision
            if (doors_opened.includes(door_index)) {
                //dont do anything, if do is already open
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

            open_door(door_index);
            for (let i = 0; i < 3; i++) {
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

    switch (doors[door_index]) {
        case "car":
            element.style.backgroundImage = car_img;
            break;
        case "goat":
            element.style.backgroundImage = goat_img;
            break;
    }

    doors_opened.push(door_index);
}

document.querySelector("#door-1").addEventListener("click", event => {
    console.log("door-1 clicked");
    clicked_door(0);
})

document.querySelector("#door-2").addEventListener("click", event => {
    console.log("door-2 clicked");
    clicked_door(1);
})

document.querySelector("#door-3").addEventListener("click", event => {
    console.log("door-3 clicked");
    clicked_door(2);
})