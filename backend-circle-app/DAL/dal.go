package dal

import (
	"fmt"
	"log"
	"os"

	models "github.com/socotree/backend-circle-app/Models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB
var err error

func init() {
	log.Println("INIT DAL")
	log.Println("Connecting to DB...")

	host := os.Getenv("POSTGRES_HOST")
	port := os.Getenv("POSTGRES_PORT")
	user := os.Getenv("POSTGRES_USER")
	dbName := os.Getenv("POSTGRES_DB")
	p := os.Getenv("POSTGRES_PASSWORD")
	conn := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable", host, port, user, dbName, p)
	db, err = gorm.Open(postgres.Open(conn), &gorm.Config{
		// Logger: logger.Default.LogMode(logger.Error),
	})
	if err != nil {
		log.Fatal("Failed to init db: ", err)
	} else {
		log.Println("DB connected")
	}
}

// InitialMigration Set Initial Migration
func InitialMigration() {
	log.Println("Start DB Creation")

	log.Println("Trying to delete EventQuestionAnswer...")
	if (db.Migrator().HasTable(&models.EventQuestionAnswer{})) {
		log.Println("Delete EventQuestionAnswer...")
		err = db.Migrator().DropTable(&models.EventQuestionAnswer{})
		if err != nil {
			log.Panicln(err)
		}
		log.Println("Deleted EventQuestionAnswer")
	}

	log.Println("Trying to delete BlockedUsers2...")
	if (db.Migrator().HasTable(&models.BlockedUsers2{})) {
		log.Println("Delete BlockedUsers2...")
		err = db.Migrator().DropTable(&models.BlockedUsers{})
		if err != nil {
			log.Panicln(err)
		}

		err = db.Migrator().RenameTable(&models.BlockedUsers2{}, &models.BlockedUsers{})
		if err != nil {
			log.Panicln(err)
		}
		log.Println("Deleted BlockedUsers2")
	}

	log.Println("Trying to delete Message2...")
	if (db.Migrator().HasTable(&models.Message2{})) {
		log.Println("Delete Message2...")
		err = db.Migrator().DropIndex(&models.Message{}, "idx_message2_user_id")
		if err != nil {
			log.Panicln(err)
		}

		err = db.Migrator().DropTable(&models.Message{})
		if err != nil {
			log.Panicln(err)
		}

		err = db.Migrator().RenameTable(&models.Message2{}, &models.Message{})
		if err != nil {
			log.Panicln(err)
		}
		log.Println("Deleted Message2")
	}

	// if (db.Migrator().HasTable(&models.UsersScoresMA{})) { // dont forget to deprecate
	// 	log.Println("delete UsersScoresMA table")
	// 	err := db.Migrator().DropTable(
	// 		&models.UsersScoresMA{},
	// 	)
	// 	if err != nil {
	// 		log.Panicln(err)
	// 	}
	// }

	// if (db.Migrator().HasTable(&models.Group{})) { // dont forget to deprecate
	// 	log.Println("delete all event tables")
	// 	err := db.Migrator().DropTable(
	// 		&models.Group{},
	// 		&models.EventTime{},
	// 		&models.EventSchedule{},
	// 		&models.Event{},
	// 	)
	// 	if err != nil {
	// 		log.Panicln(err)
	// 	}
	// 	log.Println("migrate only event table")

	// 	db.AutoMigrate(
	// 		&models.Event{},
	// 	)

	// 	event1 := &models.Event{
	// 		Name:             "Meet in the park",
	// 		SmallDescription: "Description of a relaxed event",
	// 		Description:      "Description of a relaxed event",
	// 		Location:         "Berlin",
	// 	}

	// 	log.Println("add 1 event table")
	// 	if err := AddEvent(event1); err != nil {
	// 		log.Println(err)
	// 		log.Panic("Unable to create event 1.")
	// 	}

	// 	log.Println("read event table")
	// 	events, err := ReadEvents()
	// 	if err != nil {
	// 		log.Panicln(err)
	// 	}
	// 	log.Println("update circles set event_id")
	// 	db.Exec("update circles set event_id=? where event_id is not null", events[0].ID.String())
	// }

	err = db.AutoMigrate(
		&models.UpdatedVersion{},
		&models.Event{},
		&models.EventRegister{},
		&models.EventTime{},
		&models.Interest{},
		&models.UserInterest{},
		&models.Profile{},
		&models.User{},
		&models.BlockedUsers{},
		&models.EventJoin{},
		&models.Message{},
		&models.Circle{},
		&models.Question{},
		&models.Answer{},
		&models.UserAnswer{},
		&models.EventQuestionAnswerMatches{},
		&models.EventQuestion{},
		&models.EventUserAnswer{},
	)
	if err != nil {
		log.Panicln(err)
	}

	// var bus2 []models.BlockedUsers2
	// if err := db.Find(&bus2).Error; err != nil {
	// 	if errors.Is(err, gorm.ErrRecordNotFound) {
	// 		err = errors.New("unable to find bu2")
	// 	}
	// }
	// if len(bus2) == 0 {
	// 	var bus []models.BlockedUsers
	// 	if err := db.Find(&bus).Error; err != nil {
	// 		if errors.Is(err, gorm.ErrRecordNotFound) {
	// 			err = errors.New("unable to find bus")
	// 		}
	// 	}
	// 	log.Println(len(bus))
	// 	for _, bu := range bus {
	// 		if db := db.Create(&models.BlockedUsers2{
	// 			UserBlockerID: bu.UserID,
	// 			UserBlockedID: bu.UserBlockedID,
	// 			Base: models.Base{
	// 				CreatedAt: bu.CreatedAt,
	// 			},
	// 		}); db.Error != nil {
	// 			log.Println(db.Error)
	// 		}
	// 	}
	// 	log.Println("Ciao bus")
	// }

	// var m2 []models.Message2
	// if err := db.Find(&m2).Error; err != nil {
	// 	if errors.Is(err, gorm.ErrRecordNotFound) {
	// 		err = errors.New("Unable to find m2")
	// 	}
	// }
	// if len(m2) == 0 {
	// 	var ms []models.Message
	// 	if err := db.Find(&ms).Error; err != nil {
	// 		if errors.Is(err, gorm.ErrRecordNotFound) {
	// 			err = errors.New("Unable to find m")
	// 		}
	// 	}
	// 	log.Println(len(ms))
	// 	for _, m := range ms {
	// 		r, _ := uuid.FromString(m.Room)
	// 		u, _ := uuid.FromString(m.UserID)
	// 		if db := db.Create(&models.Message2{
	// 			CircleID: r,
	// 			UserID:   u,
	// 			Message:  m.Message,
	// 			Base: models.Base{
	// 				CreatedAt: m.CreatedAt,
	// 			},
	// 		}); db.Error != nil {
	// 			log.Println(db.Error)
	// 		}
	// 	}
	// 	log.Println("Ciao m")
	// }

	log.Println("Finished DB Creation")
}
