
let slotImages = [];
let slotFiles = ["lemon.png", "melon.png", "bell.png", "horseshoe.png", "cherry.png", "bar.png", "diamond.png", "heart.png", "seven.png"];

// JACKPOT TESTING 
//let slotFiles = ["lemon.png","lemon.png","lemon.png","lemon.png","lemon.png","lemon.png","lemon.png","lemon.png","lemon.png"]
//*************//

let currentSlots = [];
let credits = 100;
let betAmount = 1;
let idleMessage = "-----------------";
let resultMessage = idleMessage;
let winMessage = "--JACKPOT--"
let loseMessage = "-TRY AGAIN-"
let spinEnabled = true;
let clickCount = 0;
let font;
let spinning = false;
let spinTime = 1500;
let spinStart = 0;
let previous = 0;

let rollSound, winSound, loseSound;
let reverb, distortion;
let rollLoop, jackpot;
let LFO;
let jackpotSequence;
let losePart;


function preload() {
  for (let name of slotFiles) {
    slotImages.push(loadImage("media/" + name));
  }
  font = loadFont("media/minecraft.ttf");
}

function setup() {
  createCanvas(800, 800);
  textSize(20);
  textFont(font);

  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(connectToSerial);

  beep = new Tone.Oscillator({
    frequency: 440,  
    type: "sine"
  
  });

  noiseEnv = new Tone.AmplitudeEnvelope({
    attack: 0.01,  
    decay: 0.2,    
    sustain: 0,    
    release: 0.2   
  }).toDestination();
  
  
  beep.connect(noiseEnv);
  
  beep.start();

  reverb = new Tone.Reverb({ decay: 2.5, wet: 0.4 }).toDestination();
  distortion = new Tone.Distortion(0.2).connect(reverb);

  let jackpotSound = new Tone.MonoSynth({
    oscillator: {type: "square"},
    filter: {type: "lowpass", frequency: 500},
    envelope: {attack: 0.05, decay: 0.2, sustain: 0.2, release: 0.3}
  }).connect(distortion);

  LFO = new Tone.LFO("8n", 200, 1200);
  LFO.connect(jackpotSound.filter.frequency);
  LFO.start();

  let lose = new Tone.DuoSynth({
    volume: -6,
    voice0: { oscillator: { type: "sawtooth"}},
    voice1: { oscillator: { type: "triangle"}},
    harmonicity: 1.5
  }).connect(reverb);

  jackpotSequence = new Tone.Sequence((time, note) => {
    jackpotSound.triggerAttackRelease(note, "8n", time);
  }, ["C5", "E5", "G5", "B5", "C6", "G5", "E5"], "8n");

  jackpotSequence.loop = false;

  losePart = new Tone.Part((time, value) => {
    lose.triggerAttackRelease(value.note, "16n", time);
  }, [
    { time: 0, note: "C5" },
    { time: "0:0.5", note: "C4" },
    { time: "0:1", note: "G3" }
  ]);
  
  losePart.loop = false;
  Tone.Transport.start();
}

function draw() {
  background('white');
  drawMachine();
  stroke('black');
  strokeWeight(4);

  //temp images for testing get rid of later//
  //image(slotImages[8], 125,187.5,125,125);
  //image(slotImages[2], 275,187.5,125,125);
  //image(slotImages[3], 425,187.5,125,125);
  //****************************************//

  for (let i = 0; i < currentSlots.length; i++) {
    image(currentSlots[i], 125 + i * 150, 187.5, 125, 125);
  }



  
  fill('white');
  text("CREDITS: " + credits, 130, 70);
  text("BET AMOUNT: " + betAmount, 130, 95);
  textSize(35);
  text(resultMessage, 295, 88);
  textSize(18);
  text("SPIN", 129, 395);
  text("BET", 282, 395);
  text("CASH OUT", 442, 395 )

  let str = port.readUntil("\n");
  if (str.trim() === "SPIN") {
    spin();
  }
 

  if(spinning) {
    let currentTime = millis();

    if(currentTime - previous >= 100) {
      previous = currentTime;
      currentSlots = [];
      noiseEnv.triggerAttackRelease(0.2);
      for(let i = 0; i < 3; i++) {
        currentSlots.push(random(slotImages))
      }
    }

    if(currentTime - spinStart >= 1500) {
      spinning = false;
      let outcome = [];
      
      for(let i = 0; i < 3; i++) {
        let slotInt = floor(random(slotImages.length))
        currentSlots[i] = slotImages[slotInt];
        outcome.push(slotFiles[slotInt]);
      }

      if (checkWin(outcome)) {
        resultMessage = winMessage;
        credits += betAmount * 10;
        jackpotSequence.stop();
        jackpotSequence.start("+0.1");
        port.write("GREEN\n")
        
      } else {
        resultMessage = loseMessage;
        losePart.stop();
        losePart.start("+0.1");
        port.write("RED\n")
      }
      spinEnabled = true;
    }
  }
}

function mousePressed() {
  // Spin Button
  if (mouseX > 100 && mouseX < 200 && mouseY > 350 && mouseY < 400 && spinEnabled == true) {
    spin();
    Tone.start();
  }

  // Bet Button
  if (mouseX > 250 && mouseX < 350 && mouseY > 350 && mouseY < 400) {
    clickCount++;
    if (clickCount === 1) {
      betAmount = 5; }
    else if (clickCount === 2) {
      betAmount = 10; }
    else if (clickCount === 3) {
      betAmount = 1;
      clickCount = 0;
    }
  }

    //Cash Out Button
    if (mouseX > 425 && mouseX < 550 && mouseY > 350 && mouseY < 400) {
      //while(credits > 0) {
        credits = 0;
       
        port.write("BUZZER\n");}
        resultMessage = "*CASH OUT*";
      //}
    //}
}

function spin() {
  if (credits < betAmount) {
    resultMessage = "NO CREDITS";
    return;
  }

  
  
  credits -= betAmount;
  spinEnabled = false;
  resultMessage = idleMessage;
  spinStart = millis();
  spinning = true;
  previous = millis();
}

function checkWin(outcome) {
  return outcome[0] === outcome[1] && outcome[1] === outcome[2];
}

function connectToSerial() {
  port.open('Arduino', 9600);
}

function drawMachine() {
  noStroke();
  //Outline
  fill(0, 0, 0);
  rect(0, 750-75, 25, 75);rect(550, 750-725, 25, 25);rect(25, 750-25, 600, 25);
  rect(25, 750-125, 25, 50);rect(575, 750-700, 25, 375);rect(625, 750-75, 25, 75);
  rect(50, 750-175, 25, 50);rect(600, 750-325, 50, 25);rect(600, 750-125, 25, 50);
  rect(25, 750-200, 25, 25);rect(650, 750-450, 25, 200);rect(575, 750-175, 25, 50);
  rect(50, 750-225, 25, 25);rect(650, 750-550, 25, 25);rect(100, 750-750, 450, 25);
  rect(25, 750-325, 25, 100);rect(625, 750-525, 25, 75);rect(600, 750-200, 25, 25);
  rect(50, 750-425, 25, 100);rect(675, 750-525, 25, 75);rect(75, 750-725, 25, 25);
  rect(75, 750-575, 25, 150);rect(600, 750-250, 50, 25);
  rect(50, 750-700, 25, 125);rect(575, 750-225, 25, 25);
  fill(157, 182, 238);
  rect(25,750-75,600,50);rect(75,750-400,500,50);
  rect(50,750-325,550,100);rect(100,750-700,475,300);
  rect(625,750-300,25,50);rect(75,750-700,25,125);
  rect(100,750-725,450,25);
  fill(129, 159, 211);
  rect(50,750-125,550,50);
  rect(75,750-175,500,50);
  fill(95, 126, 170);
  rect(50,750-200,550,25);
  rect(75,750-350,500,25);
  fill(76, 106, 142);
  rect(75,750-225,500,25);
  rect(600,750-300,25,50);
  fill(142,166,212);
  rect(75,750-425,500,25);
  rect(100,750-475,475,50);
  fill(239,242,251);
  rect(100,750-725,25,25);rect(375,750-300,25,25);
  rect(75,750-700,25,50);rect(275,750-275,125,25);
  rect(125,750-575,125,150);rect(200,750-275,25,25);
  rect(275,750-575,125,150);rect(150,750-275,25,25);
  rect(425,750-575,125,150);rect(100,750-275,25,25);
  fill(255,226,86);
  rect(125,750-700,400,25);
  fill(255,243,169);
  rect(125,750-675,400,25);
  fill(142,166,212);
  rect(100,750-250,25,25);rect(275,750-250,125,25);
  rect(150,750-250,25,25);rect(200,750-250,25,25);
  fill(76,79,87);
  rect(425,750-275,125,25);
  fill(91,92,110);
  rect(425,750-300,125,25);
  fill(151,164,183);
  rect(100,750-50,450,25);
  fill(121,134,153);
  rect(125,750-75,400,25);
  fill(117,129,151);
  rect(425,750-375,125,25);
  rect(425,750-400,25,25);
  rect(525,750-400,25,25);
  fill(194,16,16);
  rect(325,750-375,25,25);
  rect(250,750-375,25,25);
  rect(275,750-400,50,25);
  fill(84,165,37);
  rect(100,750-375,25,25);
  rect(175,750-375,25,25);
  rect(125,750-400,50,25);
  fill(102,193,54);
  rect(125,750-375,50,25);
  fill(239,37,37);
  rect(275,750-375,50,25);
  fill(224,225,229);
  rect(275,750-475,125,50);
  rect(125,750-475,125,50);
  rect(425,750-475,125,50);
  fill(210,39,39);
  rect(650,750-525,25,75);
  fill(142,166,212);
  rect(550,750-625,25,25);
  rect(75,750-625,25,25);
  rect(100,750-600,450,25);
  fill(95,126,170);
  rect(550,750-650,25,25);
  rect(75,750-650,25,25);
  rect(100,750-625,450,25);
}