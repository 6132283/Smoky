#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <SoftwareSerial.h>

SoftwareSerial NodeMcu(D2,D3);
int lpg = 0;
int co = 0;
int smoke = 0; 
const char* ssid = "D'Amico BB";
const char* password = "Fiorentina2";
const char* host = "smoky2.000webhostapp.com";


void setup()
{
  WiFi.begin(ssid,password);
  Serial.begin(115200);
  NodeMcu.begin(9600);
  while(WiFi.status()!=WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  delay(30000);
}

void loop()
{
  SendingToDB();
}

void SendingToDB()
{ 
  while(NodeMcu.read() != '\n'){
    NodeMcu.parseInt();
  }
  lpg=NodeMcu.parseInt();
  co=NodeMcu.parseInt();
  smoke=NodeMcu.parseInt();
  WiFiClient client;
  if(!client.connect(host, 80)) {
    Serial.println("connection with server failed");
    return;
  }
  client.print("GET /insert_ale.php?co2=");
  client.print(co);
  client.print("&smoke=");
  client.print(smoke);
  client.print("&gas=");
  client.print(lpg);
  client.print(" HTTP/1.1");
  client.println();
  client.println("Host: smoky2.000webhostapp.com");
  client.println();
  client.println("Connection: close");
  client.println();
  client.println();
  Serial.println("data sent successfully");
  delay(2000);
}
