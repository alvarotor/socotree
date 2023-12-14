package models

// TokenDecoded is the model for the decodification of the token authentication string
type TokenDecoded struct {
	ID    string
	Email string
	Admin bool
}
