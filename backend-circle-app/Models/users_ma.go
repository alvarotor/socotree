package models

import uuid "github.com/satori/go.uuid"

// UsersScoresMA is the model for the user scores on the Matching Algorithm
type UsersScoresMA struct { //deprecate asap
	Base
	UserID1 uuid.UUID
	UserID2 uuid.UUID
	Score   float32
	Matched bool
}
