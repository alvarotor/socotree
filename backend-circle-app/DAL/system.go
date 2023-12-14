package dal

import (
	"errors"
	"log"

	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/gorm"
)

// CreateUpdatedVersion Create the actual versions
func CreateUpdatedVersion(model *models.UpdatedVersion) (err error) {
	db.Exec("DELETE FROM updated_versions")
	if db := db.Create(&model); db.Error != nil {
		return db.Error
	}
	return nil
}

// ReadUpdateVersion Read Update Version
func ReadUpdateVersion() (model models.UpdatedVersion, err error) {
	if err = db.Take(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("unable to find updated version")
		}
	}
	return
}

// NonNotifiedEmailCircles Get Non Notified by Email Circles and event
func NonNotifiedEmailCircles(eventid string) (model []models.Circle, err error) {
	if err = db.Where("(notified_email = ? OR notified_email is NULL) AND event_id = ?", false, eventid).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("circles by email and event not found")
		}
	}
	return
}

// NonNotifiedPNCircles Get Non Notified by PN Circles and event
func NonNotifiedPNCircles(eventid string) (model []models.Circle, err error) {
	if err = db.Where("(notified_pn = ? OR notified_pn is NULL) AND event_id = ?", false, eventid).Find(&model).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			err = errors.New("circles by pn and event not found")
		}
	}
	return
}

// NotifiedEmailCircleUpdate Make a Circle Notified by email
func NotifiedEmailCircleUpdate(circleid string, userid string) (err error) {
	if db := db.Model(&models.Circle{}).Where("circle_id = ? AND user_id = ?", circleid, userid).Update("notified_email", true); db.Error != nil {
		return db.Error
	}
	return nil
}

// NotifiedPNCircleUpdate Make a Circle Notified by pn
func NotifiedPNCircleUpdate(circleid string, userid string) (err error) {
	if db := db.Model(&models.Circle{}).Where("circle_id = ? AND user_id = ?", circleid, userid).Update("notified_pn", true); db.Error != nil {
		return db.Error
	}
	return nil
}

// CheckFields Check Fields
func CheckFields() {
	if db.Migrator().HasColumn(&models.Profile{}, "tester") {
		err = db.Migrator().DropColumn(&models.Profile{}, "tester")
		if err != nil {
			log.Println(err)
		} else {
			log.Println("tester field deleted")
		}
	} else {
		log.Println("tester field not found")
	}
	if db.Migrator().HasColumn(&models.Profile{}, "admin_rejected") {
		err = db.Migrator().DropColumn(&models.Profile{}, "admin_rejected")
		if err != nil {
			log.Println(err)
		} else {
			log.Println("admin_rejected field deleted")
		}
	} else {
		log.Println("admin_rejected field not found")
	}
	if db.Migrator().HasColumn(&models.Event{}, "test") {
		err = db.Migrator().DropColumn(&models.Event{}, "test")
		if err != nil {
			log.Println(err)
		} else {
			log.Println("test field deleted")
		}
	} else {
		log.Println("test field not found")
	}
	if db.Migrator().HasColumn(&models.EventQuestion{}, "question") {
		err = db.Migrator().DropColumn(&models.EventQuestion{}, "question")
		if err != nil {
			log.Println(err)
		} else {
			log.Println("question field deleted")
		}
	} else {
		log.Println("question field not found")
	}
	if db.Migrator().HasColumn(&models.Question{}, "uuid") {
		err = db.Migrator().DropColumn(&models.Question{}, "uuid")
		if err != nil {
			log.Println(err)
		} else {
			log.Println("uuid Question field deleted")
		}
	} else {
		log.Println("uuid Question field not found")
	}
	if db.Migrator().HasColumn(&models.Answer{}, "uuid") {
		err = db.Migrator().DropColumn(&models.Answer{}, "uuid")
		if err != nil {
			log.Println(err)
		} else {
			log.Println("uuid Answer field deleted")
		}
	} else {
		log.Println("uuid Answer field not found")
	}
	if db.Migrator().HasColumn(&models.Profile{}, "gender") {
		err = db.Migrator().DropColumn(&models.Profile{}, "gender")
		if err != nil {
			log.Println(err)
		} else {
			log.Println("uuid gender field deleted")
		}
	} else {
		log.Println("uuid gender field not found")
	}
	// if db.Migrator().HasColumn(&models.User{}, "last_circle") {
	// 	db.Migrator().DropColumn(&models.User{}, "last_circle")
	// 	log.Println("last_circle field deleted")
	// } else {
	// 	log.Println("last_circle field not found")
	// }
	// if db.Migrator().HasColumn(&models.User{}, "password_forgot") {
	// 	db.Migrator().DropColumn(&models.User{}, "password_forgot")
	// 	log.Println("password_forgot field deleted")
	// } else {
	// 	log.Println("password_forgot field not found")
	// }

	// if db.Migrator().HasColumn(&models.Profile{}, "last_circle") {
	// 	db.Migrator().DropColumn(&models.Profile{}, "last_circle")
	// 	log.Println("last_circle profile field deleted")
	// } else {
	// 	log.Println("last_circle profile field not found")
	// }

	// sql := `DELETE FROM profiles a USING (
	// 	SELECT MIN(ctid) as ctid, user_id
	// 	FROM profiles
	// 	GROUP BY user_id HAVING COUNT(*) > 1
	// 	) b
	// 	WHERE a.user_id = b.user_id
	// 	AND a.ctid <> b.ctid`

	// row := db.Raw(sql).Row()
	// log.Println("deleted duplicated profiles", row)
	// // row.Scan(&name, &age, &email)

	// uuidQ, err := uuid.FromString("3f378024-4360-4d7f-847d-7c0052fb91ab")
	// if err != nil {
	// 	log.Println("Unable to uuid question")
	// }
	// question, err := ReadQuestion(&uuidQ)
	// if err != nil {
	// 	log.Println("Unable to read question 3f378024-4360-4d7f-847d-7c0052fb91ab")
	// } else if question.ID.String() == "3f378024-4360-4d7f-847d-7c0052fb91ab" {
	// 	events, err := ReadEvents()
	// 	if err == nil && len(events) == 0 {

	// 		sql := "INSERT INTO event_questions (ID, created_at, updated_at, question, event_id, global) VALUES " +
	// 			"('3f378024-4360-4d7f-847d-7c0052fb91ab'," + time.Now().String() + "," + time.Now().String() + "," +
	// 			"'" + question.Question + "'," + events[0].ID.String() + ", true)"
	// 		log.Println(sql)
	// 		row := db.Raw(sql).Row()
	// 		log.Println("INSERT INTO event_questions", row)

	// 		sql = "DELETE FROM event_questions"
	// 		log.Println(sql)
	// 		row = db.Raw(sql).Row()
	// 		log.Println("DELETE FROM event_questions", row)
	// 	}
	// }
}
