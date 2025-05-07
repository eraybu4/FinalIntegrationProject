# Final Integration Project
Programming Digital Media Spring 2025 - Final Integration Project
Eli Rayburn - eraybu4@lsu.edu

**Objectives for this project:
  - Graphics Components using p5.js**
     - Slot Machine Interface using color and shape commands [rect(w,h,x,y), fill(r,g,b)]
     - Buttons for spinning, changing bet size and cashing out made using mouseListener
        functions, as well as dynamic text, changes based on results
     - Rotating sprites for slot icons: 3 columns; 9 different icons that rotate randomly through a
        String array if all 3 are a match, then it is a jackpot

  ![Screenshot 2025-05-07 172418](https://github.com/user-attachments/assets/070b8921-d708-4312-8ec4-7561517003d9)


 **- Audio Components using tone.js**
     - Multiple different sound synthesizers for rolling sound, jackpot sound, losing sound
     - Roll sound created by using an Oscillator with an Amplitude Envelope, activated each time a sprite
        is iterating while rolling to simulate a slot machien rolling sound
     - Jackpot sound created using a MonoSynth with reverb and distortion,  this was then passed through a sequence of 8 notes
     - Losing sound created using a DuoSynth with reverb, this was passed through a part with 3 notes
       
  **- Hardware components using Arduino**
     - One form of digital input; button to activate slot machine spin
     - Three forms of digital output; Buzzer which activates upon clicking the "cash out" button,
        to simulate a coin drop effect; 2 LED lights, one red and one green; red lights up on a loss,
        green lights up on a jackpot.

 **- Wiring Diagram for Arduino and Hardware Components:**
  
   ![Screenshot 2025-05-07 173321](https://github.com/user-attachments/assets/cc4682fb-7570-4ad5-834f-a7dffcc0811e)


 **- Youtube Video of Example Usage:**

   https://youtube.com/shorts/xWSUOmJkC0k?feature=share

 **- Future Development:**  
    - If I were given the opportunity to do this project again, I would develop a better graphical interface.
      instead of the slots just flashing between sprite images I would find a way to make it look like it was 
      actually rotating up and down, while still maintaining the random generation. I would also refine the sounds
      to make them more in line with what na actual slot machine sounds like. I would also add new interactive 
      features to the hardware components, an extra button for changing bet size, a pullable lever to simulate 
      pulling the lever on the slot machine, etc.
  
