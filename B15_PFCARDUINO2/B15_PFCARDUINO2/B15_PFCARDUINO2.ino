#include <WiFi.h>                    // Bibliothèque pour la connexion WiFi
#include <WebSocketsClient.h>        // Bibliothèque pour la communication WebSocket
#include <ArduinoJson.h>             // Bibliothèque pour manipuler des objets JSON
#include <SPI.h>                     // Bibliothèque pour la communication SPI
#include <MFRC522v2.h>               // Bibliothèque pour le lecteur RFID MFRC522 (version 2)
#include <MFRC522DriverSPI.h>        // Pilote SPI pour MFRC522
#include <MFRC522DriverPinSimple.h>  // Pilote simple pour la broche SS du MFRC522

// Configuration du WiFi
const char* ssid = "IdoomFibre_ATeY9YUTd";      // Nom du réseau WiFi
const char* password = "hUsX2sbM";              // Mot de passe du réseau WiFi

// Configuration du lecteur RFID
MFRC522DriverPinSimple ss_pin(5);   // Broche SS (Slave Select) du lecteur RFID connectée à la broche D5
MFRC522DriverSPI driver{ss_pin};    // Pilote SPI basé sur cette broche
MFRC522 rfid{driver};               // Objet MFRC522 utilisant le pilote défini

// Configuration du WebSocket
WebSocketsClient webSocket;         
const char* ws_server = "192.168.100.8";  // Adresse IP du serveur WebSocket
const int ws_port = 8080;                 // Port du serveur WebSocket

// Configuration du buzzer
const int buzzerPin = 27;           // Broche à laquelle le buzzer est connecté

void setup() {
  Serial.begin(115200);             // Démarrer la communication série à 115200 bauds

  pinMode(buzzerPin, OUTPUT);       // Configurer la broche du buzzer en sortie
  digitalWrite(buzzerPin, LOW);     // Éteindre le buzzer par défaut

  SPI.begin();                      // Initialiser le bus SPI
  rfid.PCD_Init();                  // Initialiser le lecteur RFID

  // Connexion au WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("WiFi connected");

  // Connexion au serveur WebSocket
  webSocket.begin(ws_server, ws_port, "/");
  webSocket.onEvent([](WStype_t type, uint8_t* payload, size_t length) {
    // Quand le WebSocket est connecté
    if (type == WStype_CONNECTED) {
      Serial.println("WebSocket Connected");
      webSocket.sendTXT("{\"type\":\"esp\"}"); // Envoyer un message pour identifier l'ESP au serveur
    }
    // Lors de la réception d’un message texte
    else if (type == WStype_TEXT) {
      Serial.printf("Server: %s\n", payload);
      DynamicJsonDocument doc(128);
      deserializeJson(doc, payload);
    
      // Si le message reçu est une commande "beep"
      if(doc["type"] == "beep") {
        int duration = doc["duration"] | 1500;  // Durée du bip (valeur par défaut : 1500 ms)
        Serial.printf("Low quantity beep for %dms\n", duration);
        digitalWrite(buzzerPin, HIGH);
        delay(duration);                        // Faire sonner le buzzer
        digitalWrite(buzzerPin, LOW);
      }
    }
  });
  webSocket.setReconnectInterval(5000); // Reconnexion automatique toutes les 5 secondes si déconnecté
}

// Fonction pour lire l'UID d'une carte RFID et le formater en chaîne HEXA
String readUID() {
  String uid;
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uid += "0";  // Ajouter un zéro devant si inférieur à 0x10
    uid += String(rfid.uid.uidByte[i], HEX);     // Ajouter chaque octet en hexadécimal
  }
  rfid.PICC_HaltA();  // Arrêter la communication avec la carte
  uid.toUpperCase();  // Convertir en majuscules
  return uid;
}

void loop() {
  webSocket.loop();  // Garder le WebSocket actif

  // Vérifier si une nouvelle carte RFID est présente et peut être lue
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    String uid = readUID();                     // Lire l'UID de la carte
    Serial.print("Tag scanned: ");
    Serial.println(uid);

    // Créer un objet JSON avec l'UID lu
    DynamicJsonDocument doc(128);
    doc["uid"] = uid;
    String output;
    serializeJson(doc, output);
    webSocket.sendTXT(output);                  // Envoyer l'UID au serveur via WebSocket

    // Faire un bip court (100ms) pour confirmer la lecture
    digitalWrite(buzzerPin, HIGH);
    delay(100);
    digitalWrite(buzzerPin, LOW);

    delay(1000); // Délai anti-spam pour éviter plusieurs lectures successives
  }
}
