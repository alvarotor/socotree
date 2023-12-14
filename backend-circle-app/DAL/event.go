package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// AddEvent Add a new event
func AddEvent(model *models.Event) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// UpdateEvent Update an event
func UpdateEvent(model *models.Event) (err error) {
	if db := db.Save(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadEventWithTime Read an event with only time
func ReadEventWithTime(id *uuid.UUID) (model models.Event, err error) {
	if err = db.
		Where("id = ?", id).
		Preload("EventTime").
		First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find event")
		}
	}
	return
}

// ReadEvent Read an event
func ReadEvent(id *uuid.UUID) (model models.Event, err error) {
	if err = db.
		Where("id = ?", id).
		Preload("EventRegister.User.Profile").
		Preload("EventJoin.User.Profile").
		Preload("EventQuestion.Question.Answers").
		Preload("EventTime").
		First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find event")
		}
	}
	return
}

// ReadEventNoTime Read an event without time
func ReadEventNoTime(id *uuid.UUID) (model models.Event, err error) {
	if err = db.
		Where("id = ?", id).
		First(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find event")
		}
	}
	return
}

// ReadEvents Read all events with time
func ReadEvents() (model []models.Event, err error) {
	if err := db.
		Preload("EventTime").
		Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find event")
		}
	}
	return
}

// ReadEventsNoTime Read an event without time or anything
func ReadEventsNoTime() (model []models.Event, err error) {
	if err := db.Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find event")
		}
	}
	return
}

// DeleteEvent Delete a event
func DeleteEvent(id *uuid.UUID) (err error) {
	if db := db.Where("event_id = ?", id).Delete(&models.EventQuestion{}); db.Error != nil {
		return db.Error
	}
	if db := db.Where("event_id = ?", id).Delete(&models.EventRegister{}); db.Error != nil {
		return db.Error
	}
	if db := db.Where("event_id = ?", id).Delete(&models.EventJoin{}); db.Error != nil {
		return db.Error
	}
	if db := db.Where("event_id = ?", id).Delete(&models.EventTime{}); db.Error != nil {
		return db.Error
	}
	if db := db.Where("id = ?", id).Delete(&models.Event{}); db.Error != nil {
		return db.Error
	}
	return nil
}
