document.addEventListener('DOMContentLoaded', function () {
    // Get the button and audio elements
    const clickButton = document.getElementById('clickButton');
    const clickSound = document.getElementById('clickSound');
    const hoverSound = document.getElementById('hoverSound');
  
    // Add click event
    clickButton.addEventListener('click', function () {
        // Play click sound
        playSound(clickSound);
    });
  
    // Add hover event
    clickButton.addEventListener('mouseover', function () {
        // Play hover sound
        playSound(hoverSound);
    });
  
    // Function to play sound
    function playSound(soundElement) {
        soundElement.currentTime = 0; // Rewind sound to the beginning
        soundElement.play();
  
        // Add event listener for the 'ended' event
        soundElement.addEventListener('ended', function () {
            // Code to be executed after the sound has finished playing
            console.log("Sound has ended, do something here");
            // Add your desired actions or function calls here
        });
    }
  });
  