package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// AddEventRegister Join a user to a new Event
func AddEventRegister(model *models.EventRegister) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadEventRegistered Read Event Register
func ReadEventRegistered(eventID *uuid.UUID, userID *uuid.UUID) (model []models.EventRegister, err error) {
	if err = db.Where("event_id = ? AND user_id = ?", eventID.String(), userID.String()).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find Event Register")
		}
	}
	return
}

// ReadEventsRegisteredByUser Read Event Register by User
func ReadEventsRegisteredByUser(userID string) (model []models.EventRegister, err error) {
	if err = db.Where("user_id = ?", userID).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find Event Register")
		}
	}
	return
}

// ReadAllEventRegisterUsers Read all Event Registered Users
func ReadAllEventRegisterUsers(eventID string) (model []models.EventRegister, err error) {
	if err = db.Where("event_id = ?", eventID).Preload("User.Profile").Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find Event Register")
		}
	}
	return
}

// DeleteUserInEventRegister Delete a user within a Event Registered
func DeleteUserInEventRegister(eventID *uuid.UUID, userID *uuid.UUID) (err error) {
	if db := db.Where("event_id = ? AND user_id = ?", eventID.String(), userID.String()).Delete(&models.EventRegister{}); db.Error != nil {
		return db.Error
	}
	return nil
}
