const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

const refreshButton = document.querySelector("#refresh")
const themeToggle = document.querySelector("#toggle-theme"); // Dark Mode Button
// Add leading zero to numbers 9 or below (purely for aesthetics):


// Run a standard minute/second/hundredths timer:
  let minutes = 0;
  let seconds = 0;
  let hundredths = 0;
  let interval = null;
  let timerRunning = false;

  function runTimer() {
    hundredths++; // starts timer increasing the smallest first

    if (hundredths >= 99) {
      hundredths = 0; // show on timer that its 0
      seconds++;      // increases second
    }

    if (seconds >= 60) {
      seconds = 0;    // show on timer that its 0
      minutes++;      // increases minute
    }

    let formattedTime = 
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}:` +
        `${String(hundredths).padStart(2, '0')}`;

    theTimer.innerHTML = formattedTime;
  }


// Match the text entered with the provided text on the page:

  const paragraphs = [                           // Random paragraphs to generate
    "The quick brown fox jumps over the lazy dog. It's a simple sentence that uses every letter of the alphabet.",
    "Typing tests are a great way to improve your speed and accuracy. Practice consistently for best results.",
    "Every day is a new opportunity to learn something new. Keep pushing yourself forward, even on tough days.",
    "JavaScript is a versatile language used for both front-end and back-end web development.",
    "Focus on accuracy before speed. Fast typing will come naturally as your muscle memory improves.",
    "Reading books expands your vocabulary and improves your concentration. It's a rewarding habit.",
    "Never let fear stop you from trying. Every expert was once a beginner who didn't give up.",
    "Time management is key to productivity. Break tasks into chunks and eliminate distractions.",
    "A beautiful user interface can greatly enhance the user experience. Always design with empathy.",
    "Consistent effort beats talent when talent doesn’t put in the work. Keep practicing daily."
  ];

  function getRandomParagraph() {
    const index = Math.floor(Math.random() * paragraphs.length);
    return paragraphs[index];
  }

  const paragraph = getRandomParagraph();
  document.querySelector("#origin-text p").textContent = paragraph; // Puts a pre-generated paragraph in the origin-text



// Start the timer:
  function startTimer(){
    if (!timerRunning) {                         // Makes sure the timer isn't running
    interval = setInterval(runTimer, 10);
    timerRunning = true;
    }  
  }


// Ends the timer;
  function checkMatch() {
    const textEntered = testArea.value;
    const originText = document.querySelector("#origin-text p").textContent;

    const currentIndex = textEntered.length - 1;   // Checks character
    const currentChar = textEntered.charAt(currentIndex);
    const expectedChar = originText.charAt(currentIndex);

    if (textEntered === originText) {
      clearInterval(interval);
      timerRunning = false;
      testWrapper.style.borderColor = "lime";      // When the test is over the box is lime green compared to dark green
      testArea.disabled = true;
      
      const wordsTyped = originText.trim().split(/\s+/).length;
      const timeInMinutes = (minutes * 60 + seconds + hundredths / 100) / 60;
      const wpm = Math.round(wordsTyped / timeInMinutes);
      document.querySelector("#wpm").textContent = `WPM: ${wpm}`;
      
    } else if (currentChar && currentChar !== expectedChar) {
      testWrapper.style.borderColor = "red";       // Current character wrong changes border to green
    } else {
      testWrapper.style.borderColor = "darkgreen"; // Current character right changes border to green
    }
  }


// Updates wpm based on current progress
    function updateWPM() {                         // Updates Realtime WPM
      const textEntered = testArea.value;
      const originText = document.querySelector("#origin-text p").textContent;

      const wordsTyped = textEntered.trim().split(/\s+/).length;
      const totalSeconds = minutes * 60 + seconds + hundredths / 100;
      const timeInMinutes = totalSeconds / 60;

      let wpm = 0;
      if (timeInMinutes > 0) {
        wpm = Math.round(wordsTyped / timeInMinutes);
      }

      document.querySelector("#wpm").textContent = `WPM: ${wpm}`;
    }



// Reset everything:
  function resetEverything() {
    const newParagraph = getRandomParagraph();
    document.querySelector("#origin-text p").textContent = newParagraph;
    clearInterval(interval);
    minutes = 0
    seconds = 0
    hundredths = 0
    timerRunning = false;
    theTimer.innerHTML = "00:00:00";
    testArea.value = "";
    testWrapper.style.borderColor = "grey";
    testArea.disabled = false;                             // Makes the box typeable again from when it wasn't after clicking it from a successful test
    document.querySelector("#wpm").textContent = "WPM: 0"; // Reset WPM
  }

// Reset Everything but the paragraph
  function resetTimer() { 
    clearInterval(interval);
    minutes = 0
    seconds = 0
    hundredths = 0
    timerRunning = false;
    theTimer.innerHTML = "00:00:00";
    testArea.value = "";
    testWrapper.style.borderColor = "grey";
    testArea.disabled = false;                             // Makes the box typeable again from when it wasn't after clicking it from a successful test
    document.querySelector("#wpm").textContent = "WPM: 0"; // Reset WPM
  }


// Event listeners for keyboard input and the reset button:

  refreshButton.addEventListener("click", resetEverything);  // Resets Everything
  resetButton.addEventListener("click", resetTimer);         // Reset Button doesn't reset paragraph
  // testArea.addEventListener("keydown", startTimer);          // Runs Timer on Keypress (originally my basic function for keypress to start timer)
  testArea.addEventListener("keydown", () => { startTimer();  checkMatch(); updateWPM(); });

  window.addEventListener("DOMContentLoaded", () => {        // Stores night mode
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("night-mode");
    }
  });

  themeToggle.addEventListener("click", () => {              // Changes based on whether dark or light mode
  const isDark = document.body.classList.toggle("night-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
