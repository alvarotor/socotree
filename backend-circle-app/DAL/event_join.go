package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// AddEventJoin Join a user to a new Event
func AddEventJoin(model *models.EventJoin) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadEventJoined Read Event Joined
func ReadEventJoined(eventID *uuid.UUID, userID *uuid.UUID) (model []models.EventJoin, err error) {
	if err = db.Where("event_id = ? AND user_id = ?", eventID.String(), userID.String()).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("Unable to find Event Join")
		}
	}
	return
}

// ReadAllEventJoined Read all Event Joined
func ReadAllEventJoined(eventID *uuid.UUID) (model []models.EventJoin, err error) {
	if err = db.Where("event_id = ?", eventID.String()).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("Unable to find Event Join")
		}
	}
	return
}

// DeleteUserInEventJoined Delete a user within a Event Joined
func DeleteUserInEventJoined(eventID *uuid.UUID, userID *uuid.UUID) (err error) {
	if db := db.Where("event_id = ? AND user_id = ?", eventID.String(), userID.String()).Delete(&models.EventJoin{}); db.Error != nil {
		return db.Error
	}
	return nil
}
