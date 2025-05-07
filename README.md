# Final Integration Project
Programming Digital Media Spring 2025 - Final Integration Project
Eli Rayburn - eraybu4@lsu.edu

Objectives for this project:
  - Graphics Components using p5.js
     - Slot Machine Interface using color and shape commands [rect(w,h,x,y), fill(r,g,b)]
     - Buttons made using mouseListener functions, as well as dynamic text, changes based on results
     - Rotating sprites for slot icons: 3 columns; 9 different icons that rotate randomly through a
       String array if all 3 are a match, then it is a jackpot

  - Audio Components using tone.js
     - Multiple different sound synthesizers for rolling sound, jackpot sound, losing sound
     - Roll sound created by using an Oscillator with an Amplitude Envelope, activated each time a sprite
       is iterating while rolling to simulate a slot machien rolling sound
     - Jackpot sound created using a MonoSynth with reverb and distortion,  this was then passed through a sequence of 8 notes
     - Losing sound created using a DuoSynth with reverb, this was passed through a part with 3 notes
       
  - Hardware components using Arduino
     - One form of digital input; button to activate slot machine spin
     - Three forms of digital output; Buzzer which activates upon clicking the "cash out" button,
       to simulate a coin drop effect; 2 LED lights, one red and one green; red lights up on a loss,
       green lights up on a jackpot.
       
![Screenshot 2025-05-07 171920](https://github.com/user-attachments/assets/5363cecf-bc56-42af-809b-7e3fa46dab31)
