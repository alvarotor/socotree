package roomevent

import (
	"encoding/json"
	"log"
)

// MessageSocket represents a chat message
type MessageSocket struct {
	Message  string `json:"message"`
	Sender   string `json:"sender"`
	Chatters int    `json:"chatters"`
}

// FromJSON created a new Message struct from given JSON
func FromJSON(jsonInput []byte) (message *MessageSocket) {
	json.Unmarshal(jsonInput, &message)
	return
}

// ToJSON created a new byte message from given message struct
func ToJSON(msg *MessageSocket) (message []byte) {
	message, err := json.Marshal(msg)
	if err != nil {
		log.Fatal("Converting to JSON failed ", err)
	}
	return
}
