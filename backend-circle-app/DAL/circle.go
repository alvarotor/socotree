package dal

import (
	"errors"

	uuid "github.com/satori/go.uuid"
	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// AddUserToCircle Add a user to a circle
func AddUserToCircle(model *models.Circle) (err error) {
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadCircle Read a circle
func ReadCircle(circleID string) (model []models.Circle, err error) {
	if err := db.
		Preload("User.Profile").
		Preload("User.UserInterest.Interest").
		Preload("User.BlockedUsers").
		Preload("Event").
		Where("circle_id = ?", circleID).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find the circle")
		}
	}
	return
}

// ReadCircles Read all circles
func ReadCircles() (model []models.Circle, err error) {
	if err := db.Preload("User.Profile").Preload("Event").Order("created_at desc").Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find circles")
		}
	}
	return
}

// ReadCirclesNotNotified Read all circles not notified yet
func ReadCirclesNotNotified() (model []models.Circle, err error) {
	if err = db.Where("notified_pn = ? OR notified_email = ?", false, false).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find circles")
		}
	}
	return
}

// UpdateCircleNotified Update notified circle flag
func UpdateCircleNotified(id *string) (err error) {
	if db.Model(&models.Circle{}).Where("circle_id = ?", id).Update("notified", true); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadCirclesNoUsers Read all circles without Users
func ReadCirclesNoUsers() (model []models.Circle, err error) {
	if err := db.Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find circles")
		}
	}
	return
}

// DeleteCircle Delete a circle
func DeleteCircle(id *uuid.UUID) (err error) {
	if db := db.Where("circle_id = ?", id).Delete(&models.Message{}); db.Error != nil {
		return db.Error
	}
	if db := db.Where("circle_id = ?", id).Delete(&models.Circle{}); db.Error != nil {
		return db.Error
	}
	return nil
}

// DeleteUserInCircle Delete a user within a circle
func DeleteUserInCircle(circleID *uuid.UUID, userID *uuid.UUID) (err error) {
	if db := db.Where("circle_id = ? AND user_id = ?", circleID, userID).Delete(&models.Message{}); db.Error != nil {
		return db.Error
	}
	if db := db.Where("circle_id = ? AND user_id = ?", circleID, userID).Delete(&models.Circle{}); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadCirclesByUser Read all circles by user id
func ReadCirclesByUser(userID *uuid.UUID) (model []models.Circle, err error) {
	if err := db.Preload("User.Profile").Preload("User.BlockedUsers").Where("user_id = ?", userID).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find circles by user")
		}
	}
	return
}

// ReadCirclesByEvent Read all circles by event
func ReadCirclesByEvent(eventid string) (model []models.Circle, err error) {
	if err := db.Where("event_id = ?", eventid).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find circles by event")
		}
	}
	return
}
