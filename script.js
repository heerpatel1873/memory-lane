// const { memo } = require("react");

function switchPage(pageId, button) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  document.getElementById(pageId).classList.add('active');

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  button.classList.add('active');
}

// On load: Check if user is remembered
window.onload = function () {
  const name = localStorage.getItem('userName');

  if (name) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('hovers').style.display = 'block';
    document.getElementById('homeHeading').innerHTML = `Welcome Home, <span style="color:#de4ac3">${name}</span> 🧠`;
    createMemoryGame();
  } else {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('hovers').style.display = 'none';
  }
};

// Login and start app
function startApp() {
  const name = document.getElementById('loginName').value.trim();
  if (!name) return;

  localStorage.setItem('userName', name);
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('hovers').style.display = 'block';
  document.getElementById('homeHeading').innerHTML = `Welcome Home, <span style="color:#de4ac3">${name}</span> 🧠`;

  createMemoryGame();
}

// Logout function
function resetUser() {
  localStorage.clear();
  location.reload();
}

// Create memory game
let gameInitialized = false;

function createMemoryGame() {
  if (gameInitialized) return;
  gameInitialized = true;

  const board = document.querySelector('.matching');
  const gameMessage = document.getElementById('gameMessage');
  const playAgainBtn = document.getElementById('playAgain');

  board.innerHTML = ''; // clear previous game cards
  gameMessage.innerHTML = '';
  playAgainBtn.style.display = 'none';

  const emojis = ['🌸', '🌸', '🍓', '🍓', '🦩', '🦩', '🎀', '🎀'];
  const shuffled = emojis.sort(() => 0.5 - Math.random());

  let flippedCards = [];
  let lockBoard = false;
  let matchedPairs = 0;

  shuffled.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.textContent = '';

    card.addEventListener('click', () => {
      if (lockBoard || card.classList.contains('flipped')) return;

      card.textContent = emoji;
      card.classList.add('flipped');
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        lockBoard = true;
        const [card1, card2] = flippedCards;

        if (card1.dataset.emoji === card2.dataset.emoji) {
          matchedPairs++;
          flippedCards = [];
          lockBoard = false;

          // Check if all pairs found (win condition)
          if (matchedPairs === emojis.length / 2) {
            gameMessage.innerHTML = `<h2 style="color:deeppink;">🎉 You Win! 🎉</h2>`;
            playAgainBtn.style.display = 'inline-block';
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#deaaff', '#ff9acf', '#a6ddf7', '#f6ccff']
            });
          }

        } else {
          // Not a match: flip back cards after delay
          setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
            flippedCards = [];
            lockBoard = false;
          }, 1000);
        }
      }
    });

    board.appendChild(card);
  });
}

function restartGame() {
  gameInitialized = false;
  createMemoryGame();
}

function showGame(gameId) {
  // Hide all game sections
  document.querySelectorAll('.game-section').forEach(section => {
    section.style.display = 'none';
  });

  // Show the selected game
  const selectedGame = document.getElementById(gameId);
  selectedGame.style.display = 'block';

  // If it's matching, build the game
  if (gameId === 'matchingGame') {
    createMemoryGame(); // Only builds it once, already handled by your gameInitialized check
  }

  if (gameId === 'sortingGame') {
    showHomeScreen();
    initSortingGameListeners();
  }
}

// word guess game
let AnimalsArr = [
  {
    question: "it had two wings and two legs",
    word: "bird",
  },
  {
    question: "a small animal related to lions",
    word: "cat",
  },
  {
    question: "kept for its eggs and meat",
    word: "chicken",
  },
  {
    question: "it has a long nose called a trunk",
    word: "elephant",
  },
  {
    question: "a mammal with a very long neck, long legs",
    word: "giraffe",
  },
];

let FoodsArr = [
  {
    question: "a food made by baking a dough of flour or meal",
    word: 'bread',
  },
  {
    question: "the first meal of the day",
    word: "breakfast",
  },
  {
    question: "a long orange root vegetable",
    word: "carrot",
  },
  {
    question: "the liquid from fruits that is used for drinking",
    word: "juice",
  },
  {
    question: "a candy or syrup made of cacao and sugar",
    word: "chocolate",
  },
];

let SportsArr = [
  {
    question: "a sport where two people hit each other and try to win",
    word: "boxing",
  },
  {
    question: "a game in which a club is used to hit a small ball into a hole",
    word: "golf",
  },
  {
    question: "a sport played on ice with two teams",
    word: "hockey",
  },
  {
    question: "a game played on a court with two teams trying to throw a ball into the hoop",
    word: "basketball",
  },
  {
    question: "an activity where you catch fish",
    word: "fishing",
  },
];

let selectedOption = "Animals",
questionCount = 0;
ideaCount = true;

const gameCards = document.querySelector(".gameCards"),
  allCards = document.querySelectorAll(".gameCards .cards"),
  playground = document.querySelector(".playground"),
  startGame = document.querySelector(".startGame"),
  questionHint = document.querySelector(".questionHint"),
  resetSelection = document.querySelector(".resetSelection"),
  selectedWords = document.querySelector(".selectedWords"),
  shuffledWords = document.querySelector(".shuffledWords");

  allCards.forEach(card=>{
    card.addEventListener("click", (e)=>{

      allCards.forEach(el=>{
        el.classList.remove("active");
      });
      e.target.classList.add("active");
      selectedOption = e.target.getAttribute("data-options");
    })
  });

startGame.addEventListener("click",()=>{
  if(startGame.innerText=="Start Game"){
    gameCards.style.display="none";
    playground.style.display="block";
    startGame.innerText="Back to Home";
    resetSelection.style.display="inline";
    resetSelection.setAttribute("disabled",true);
    startToGuessTheWord()
  }
  else{
    gameCards.style.display="flex";
    playground.style.display="none";
    startGame.innerText="Start Game";
    resetSelection.style.display="none";
    questionCount=0;
    ideaCount=true;
  }
});

let selectedArr = [];
  randomWords = [];
function startToGuessTheWord(){
  selectedWords.innerHTML="";
  shuffledWords.innerHTML="";
  ideaCount=true;

  if(selectedOption=="Animals"){
    selectedArr = AnimalsArr;
  }
  else if (selectedOption=="Foods"){
    selectedArr = FoodsArr;
  }
  else{
    selectedArr = SportsArr;
  }

  questionHint.innerHTML=selectedArr[questionCount].question + " " + `<i class="fa-solid fa-lightbulb" onclick="checkFirstWordIdea(this)"></i>`;
  randomWords = selectedArr[questionCount].word.split("");

  if(randomWords!=null){
    let checkRandom = randomWords;
    shuffle(randomWords);

    if(checkRandom==randomWords){
      shuffle(randomWords);
    }

    randomWords.forEach(char=>{
      let div1 =document.createElement("div");
      div1.classList.add("box");
      selectedWords.append(div1);

      let div2 =document.createElement("div");
      div2.classList.add("box");
      div2.innerHTML=char;
      div2.addEventListener("click",(e)=>{
        chooseWordToGuess(e.target.innerText)
        e.target.innerText="";
        e.target.style.background = "lightgray";
      })
      shuffledWords.append(div2);
    })
  }
}

function chooseWordToGuess(char){
  const boxes = document.querySelectorAll(".selectedWords .box");
  let isWordPlaced = true,
  totalWords=0;
  correctWords="";

  boxes.forEach((box)=>{
    if(isWordPlaced && box.innerText==""){
      box.innerText=char;
      isWordPlaced=false;
    }

    if(box.innerText!=""){
      correctWords+=box.innerText.toLowerCase();
      totalWords++;
    }
  });

  if(totalWords==randomWords.length){
  checkSelectedWord(correctWords);
  }
}

function checkSelectedWord(correctAnswer){
  const boxes = document.querySelectorAll(".selectedWords .box");

  if(selectedArr[questionCount].word == correctAnswer){
    boxes.forEach(box=>{
      box.classList.add("match");
    });
    setTimeout(function(){
      questionCount++;
      if(questionCount<5){
        startToGuessTheWord();
      }
      else{
        alert("Word Game Completed! Back to Home");
      }
    },2000);
  }
  else{
    boxes.forEach(box=>{
      box.classList.add("shake");
    });
    resetSelection.removeAttribute("disabled");
  }
}

resetSelection.addEventListener("click", (e)=>{
  startToGuessTheWord();
  resetSelection.setAttribute("disabled", true);
})

const shuffle = (array)=>{
  for (let i = array.length-1; i > 0; i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]] = [array[j],array[i]];
  }
  return array;
}

function checkFirstWordIdea(bulb){
  if(ideaCount){
    const boxes1 = document.querySelectorAll(".selectedWords .box");
    const boxes2 = document.querySelectorAll(".shuffledWords .box");

    let nextWord = 0;

    boxes1.forEach(box=>{
      if(box.innerText!=""){
        nextWord++;
      }
    });

    let findIdea = selectedArr[questionCount].word.split("")[nextWord];

    for(let box of boxes2){
      if(box.innerText.toLowerCase()==findIdea){
        box.click();
        bulb.style.color = "green";
        break;
      }
      else{
      bulb.style.color = "red";
      resetSelection.removeAttribute("disabled");
      }
    }
    ideaCount=false;
  }
}



// sorting game code below
const audio = new Audio("dreamy.mp3");
const bubbleSound = new Audio("bubble.mp3");
const doneSlotSound = new Audio("doneSlot.mp3");
const levelComplete = new Audio("levelComplete.mp3");
audio.play();
audio.loop = true;
let lockedTubes = new Set();

// Different ball sets for different levels
const levels = {
  1: {
    // Easy - 3 colors
    ballImages: {
      red: "img1.png",
      blue: "img2.png",
      green: "img3.png",
    },
    tubeCount: 5,
    ballsPerTube: 4,
  },
  2: {
    // Medium - 4 colors
    ballImages: {
      red: "img1.png",
      blue: "img2.png",
      green: "img3.png",
      orange: "img4.png",
    },
    tubeCount: 6,
    ballsPerTube: 4,
  },
  3: {
    // Hard - 6 colors
    ballImages: {
      red: "img1.png",
      blue: "img2.png",
      green: "img3.png",
      orange: "img4.png",
      yellow: "img5.png",
      purple: "img6.png",
    },
    tubeCount: 8,
    ballsPerTube: 4,
  },
};

let tubes = [];
let ballId = 0;
let currentLevel = null;

function sort_shuffle(array) {
  let current = array.length;
  while (current !== 0) {
    let random = Math.floor(Math.random() * current--);
    [array[current], array[random]] = [array[random], array[current]];
  }
  return array;
}

function initGame(level) {
  lockedTubes.clear();
  currentLevel = level;
  ballId = 0;

  const { ballImages, tubeCount, ballsPerTube } = levels[level];
  const allBalls = [];

  Object.keys(ballImages).forEach((color) => {
    for (let i = 0; i < ballsPerTube; i++) {
      allBalls.push({ color, id: ballId++ });
    }
  });

  sort_shuffle(allBalls);

  tubes = [];
  for (let i = 0; i < tubeCount; i++) {
    tubes[i] = [];
  }

  let fillIndex = 0;
  const colorKeys = Object.keys(ballImages);
  for (let i = 0; i < colorKeys.length; i++) {
    for (let j = 0; j < ballsPerTube; j++) {
      tubes[fillIndex % (tubeCount - 2)].push(allBalls.pop());
      fillIndex++;
    }
  }

  render();
}

function render() {
  const container = document.getElementById("game-container");
  container.innerHTML = "";

  tubes.forEach((tube, index) => {
    const tubeDiv = document.createElement("div");
    tubeDiv.classList.add("tube");
    tubeDiv.dataset.index = index;
    const isFull = tube.length === levels[currentLevel].ballsPerTube;
    const isSameColor = tube.every((ball) => ball.color === tube[0]?.color);

    if (isFull && isSameColor) {
      tubeDiv.classList.add("locked");

      if (!lockedTubes.has(index)) {
        doneSlotSound.currentTime = 0; // dubara start se bajao
        doneSlotSound.play(); // ✅ sound play
        lockedTubes.add(index); // yaad rakho ki ye tube complete ho gayi
      }
    }

    tubeDiv.addEventListener("dragover", (e) => e.preventDefault());
    tubeDiv.addEventListener("drop", handleDrop);

    tube.forEach((ball) => {
      const ballDiv = document.createElement("div");
      ballDiv.classList.add("ball");
      ballDiv.style.backgroundImage = `url(${
        levels[currentLevel].ballImages[ball.color]
      })`;

      ballDiv.setAttribute("draggable", "true");
      ballDiv.dataset.id = ball.id;
      ballDiv.dataset.color = ball.color;
      ballDiv.dataset.tube = index;
      ballDiv.addEventListener("dragstart", handleDragStart);
      tubeDiv.appendChild(ballDiv);
    });

    container.appendChild(tubeDiv);
  });
}

function handleDragStart(e) {
  const tubeIndex = e.target.dataset.tube;
  const ballId = e.target.dataset.id;
  const tube = tubes[tubeIndex];
  const topBall = tube[tube.length - 1];

  // Only top ball can be dragged
  if (topBall.id != ballId) {
    e.preventDefault();
    return;
  }
  // ✅ Play bubble sound
  bubbleSound.currentTime = 0; // reset to start
  bubbleSound.play();
  e.dataTransfer.setData(
    "text/plain",
    JSON.stringify({ id: ballId, from: tubeIndex })
  );
}

function handleDrop(e) {
  const toIndex = e.currentTarget.dataset.index;
  const data = JSON.parse(e.dataTransfer.getData("text/plain"));
  const fromIndex = data.from;

  if (fromIndex === toIndex) return;

  const fromTube = tubes[fromIndex];
  const toTube = tubes[toIndex];

  if (
    fromTube.length === 0 ||
    toTube.length >= levels[currentLevel].ballsPerTube
  )
    return;

  const movingBall = fromTube[fromTube.length - 1];
  const topTo = toTube[toTube.length - 1];

  const tubeDiv = document.querySelector(`.tube[data-index="${toIndex}"]`);
  const canDrop = !tubeDiv.classList.contains("locked");

  if (canDrop) {
    toTube.push(fromTube.pop());
    // ✅ Play bubble sound again on drop
    bubbleSound.currentTime = 0;
    bubbleSound.play();
    render();
    checkCompletion();
  }
}

function checkCompletion() {
  let allComplete = true;
  for (let tube of tubes) {
    if (tube.length === 0) continue;
    if (
      tube.length !== levels[currentLevel].ballsPerTube ||
      !tube.every((b) => b.color === tube[0].color)
    ) {
      allComplete = false;
    }
  }

  if (allComplete) {
    setTimeout(() => {
      audio.pause();
      levelComplete.play();
      alert("🎉 Level " + currentLevel + " completed! You win!");
      audio.play();

      showHomeScreen();
    }, 200);
  }
}

// Show home screen and hide game container
function showHomeScreen() {
  document.getElementById("home-screen").style.display = "flex";
  document.getElementById("game-container").style.display = "none";
}

// Show game and hide home screen
function showGameScreen(level) {
  document.getElementById("home-screen").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  initGame(level);
}

// Add event listeners to level buttons
document.querySelectorAll(".level-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const level = button.dataset.level;
    showGameScreen(level);
  });
});

function initSortingGameListeners() {
  document.querySelectorAll(".level-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const level = button.dataset.level;
      showGameScreen(level);
    });
  });
}

// pic gallery code BELOW

// // Store memories
// let memories = JSON.parse(localStorage.getItem("memories")) || [];
// let currentIndex = 0;
// let slideshowInterval;

// function saveMemories() {
//   localStorage.setItem("memories", JSON.stringify(memories));
// }

// function addMemory() {
//   const photoInput = document.getElementById("photoUpload");
//   const captionInput = document.getElementById("captionInput");

//   const photo = photoInput.files[0];
//   const caption = captionInput.value.trim();
//   if (!photo || !caption) return;

//   const reader = new FileReader();
//   reader.onload = function (e) {
//     const newMemory = { img: e.target.result, caption: caption };
//     memories.push(newMemory);
//     saveMemories();
//     displayMemories();

//     // Clear inputs
//     photoInput.value = "";
//     captionInput.value = "";
//   };
//   reader.readAsDataURL(photo);
// }

// // Attach function to button
// document.getElementById("addMemoryBtn").addEventListener("click", addMemory);

// // Display existing memories on load
// function displayMemories() {
//   const thumbnails = document.getElementById("thumbnails");
//   thumbnails.innerHTML = "";

//   memories.forEach((memory, index) => {
//     const img = document.createElement("img");
//     img.src = memory.img;
//     img.alt = memory.caption;
//     img.classList.add("thumbnail");

//     img.addEventListener("click", () => {
//       document.getElementById("bigPhoto").src = memory.img;
//       document.getElementById("bigCaption").textContent = memory.caption;
//     });

//     thumbnails.appendChild(img);
//   });

//   // Show last added as featured
//   if (memories.length > 0) {
//     const last = memories[memories.length - 1];
//     document.getElementById("bigPhoto").src = last.img;
//     document.getElementById("bigCaption").textContent = last.caption;
//   }
// }

// function displayThumbnails() {
//   const container = document.getElementById("thumbnails");
//   if (!container) return;
//   container.innerHTML = "";
//   memories.forEach((m,i) => {
//     const thumb = document.createElement("img");
//     thumb.src = m.img;
//     thumb.style.width = "60px";
//     thumb.style.margin = "5px";
//     thumb.style.cursor = "pointer";
//     thumb.onclick = () => showMemory(i);
//     container.appendChild(thumb);
//   });
// }

// function showMemory(index) {
//   const bigPhoto = document.getElementById("bigPhoto");
//   const bigCaption = document.getElementById("bigCaption");

//   if (!bigPhoto || !bigCaption) return;

//   currentIndex = index;
//   bigPhoto.src = memories[index].img;
//   bigCaption.innerText = memories[index].caption;
// }

// function startSlideshow() {
//   if (slideshowInterval) clearInterval(slideshowInterval);
//   slideshowInterval = setInterval(() => {
//     if (memories.length > 0) {
//       currentIndex = (currentIndex + 1) % memories.length;
//       showMemory(currentIndex);
//     }
//   }, 5000);
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const addBtn = document.getElementById("addMemoryBtn");
//   if (addBtn) addBtn.addEventListener("click", addMemory);

//   if (memories.length > 0) {
//     displayThumbnails();
//     showMemory(0);
//     startSlideshow();
//   }
// });

// Store memories safely
let memories = [];
try {
  memories = JSON.parse(localStorage.getItem("memories")) || [];
} catch {
  memories = [];
}

function saveMemories() {
  try {
    localStorage.setItem("memories", JSON.stringify(memories));
  } catch (e) {
    console.error("Failed to save memories:", e);
  }
}

function addMemory() {
  const photoInput = document.getElementById("photoUpload");
  const captionInput = document.getElementById("captionInput");
  const photo = photoInput.files[0];
  const caption = captionInput.value || "";

  if (!photo) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    memories.push({ img: e.target.result, caption: caption });
    saveMemories();
    displayGallery();
    photoInput.value = "";
    captionInput.value = "";
  };
  reader.readAsDataURL(photo);
}

function displayGallery() {
  const container = document.getElementById("gallery");
  container.innerHTML = "";
  memories.forEach((m, i) => {
    const wrapper = document.createElement("div");
    wrapper.style.textAlign = "center";
    wrapper.style.margin = "10px";

    const img = document.createElement("img");
    img.src = m.img;
    img.style.maxWidth = "200px";
    img.style.height = "auto";
    img.style.borderRadius = "8px";
    img.style.display = "block";
    img.style.margin = "0 auto";

    const cap = document.createElement("p");
    cap.innerText = m.caption;
    cap.style.fontSize = "14px";
    cap.style.color = "#333";

    wrapper.appendChild(img);
    wrapper.appendChild(cap);
    container.appendChild(wrapper);
  });
}

function resetMemories() {
  if (confirm("Are you sure you want to delete all memories?")) {
    memories = [];
    saveMemories();
    displayGallery();
  }
}

// Initialize gallery on page load
document.addEventListener("DOMContentLoaded", () => {
  displayGallery();

  const addBtn = document.getElementById("addMemoryBtn");
  if (addBtn) addBtn.addEventListener("click", addMemory);

  const resetBtn = document.getElementById("resetMemoryBtn");
  if (resetBtn) resetBtn.addEventListener("click", resetMemories);
});

