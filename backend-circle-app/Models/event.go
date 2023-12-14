package models

// Event is the model for the event table
type Event struct {
	Base
	Name             string `gorm:"not null;"`
	Location         string
	SmallDescription string
	Description      string
	Picture          string
	EventTime        *EventTime
	EventQuestion    []EventQuestion
	EventRegister    []EventRegister
	EventJoin        []EventJoin
	UUID             string `gorm:"-"` // ignore this field
	Created          string `gorm:"-"` // ignore this field
	Updated          string `gorm:"-"` // ignore this field
	ReCircle         bool
	CircleSize       int
	Age              bool
	PreMatch         bool
	Lang             bool
	Notify           bool
	Type             int // 0 chat 1 videoconference
	AddRestUsers     bool
	QuestionsWeight  float32
	Link             string
}
