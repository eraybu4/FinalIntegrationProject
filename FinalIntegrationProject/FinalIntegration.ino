const int BUTTON_PIN = 2;
const int RED_PIN = 12;
const int GREEN_PIN = 13;
const int BUZZER_PIN = 8;

bool lastButtonState = HIGH;
bool currentState = HIGH;


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  currentState = digitalRead(BUTTON_PIN);

  if(lastButtonState == HIGH && currentState == LOW) {
    Serial.println("SPIN");
  }
  lastButtonState = currentState;

  if (Serial.available() > 0) {
    String command = Serial.readStringUntil("\n");
    command.trim();
    if(command == "BUZZER") {
      digitalWrite(BUZZER_PIN, HIGH);
      delay(100);
      digitalWrite(BUZZER_PIN, LOW);
    } else if (command ==  "RED") {
        digitalWrite(RED_PIN, HIGH);
        delay(300);
        digitalWrite(RED_PIN, LOW);
    } else if (command ==  "GREEN") {
        digitalWrite(GREEN_PIN, HIGH);
        delay(300);
        digitalWrite(GREEN_PIN, LOW);
    }
  }
}
