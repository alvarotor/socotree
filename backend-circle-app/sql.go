package main

import (
	"log"
	"os"

	dal "github.com/socotree/backend-circle-app/DAL"
	models "github.com/socotree/backend-circle-app/Models"
	"golang.org/x/crypto/bcrypt"
)

// SQL Sql gives a mock data to start paying with
func SQL() {
	log.Println("Start DB Migration")

	events, err := dal.ReadEvents()
	if err == nil && len(events) == 0 {
		log.Println("Creating Event")

		event1 := &models.Event{
			Name:             "Meet for drinking and dancing",
			SmallDescription: "Description of a party event",
			Description:      "Description of a party event",
			Location:         "Berlin",
			EventTime: &models.EventTime{
				Year:   2020,
				Month:  12,
				Day:    20,
				Hour:   20,
				Minute: 00,
			},
		}

		event2 := &models.Event{
			Name:             "Meet in the park",
			SmallDescription: "Description of a relaxed event",
			Description:      "Description of a relaxed event",
			Location:         "Berlin",
			EventTime: &models.EventTime{
				Year:   2020,
				Month:  12,
				Day:    20,
				Hour:   20,
				Minute: 00,
			},
		}

		if err := dal.AddEvent(event1); err != nil {
			log.Println(err)
			log.Panic("Unable to create event 1.")
		}
		if err := dal.AddEvent(event2); err != nil {
			log.Panic("Unable to create event 2.")
		}
		// } else {
		// 	if events[0].EventTime == nil && len(events) == 1 {
		// 		events[0].EventTime = &models.EventTime{
		// 			EventID: events[0].ID,
		// 			Year:    2022,
		// 			Month:   1,
		// 			Day:     1,
		// 			Hour:    1,
		// 			Minute:  1,
		// 		}
		// 		err = dal.UpdateEvent(&events[0])
		// 		if err != nil {
		// 			log.Panic("Unable to update time events[0]")
		// 		}
		// 		log.Println("Updated time event events[0].")
		// 	}
	}

	_, err = dal.FindInterest("Drinks")
	if err != nil {
		log.Println("Creating Interests")
		interest := models.Interest{
			Name:          "Sports",
			AdminVerified: true,
			Weight:        1,
		}

		if err := dal.AddInterest(&interest); err != nil {
			log.Panic("Unable to create interest")
		}

		interest2 := models.Interest{
			Name:          "Drinks",
			AdminVerified: true,
			Weight:        1,
		}

		if err := dal.AddInterest(&interest2); err != nil {
			log.Panic("Unable to create interest")
		}
	}

	// adminEmail := "alvaro@mailinator.com"
	// uuidu, err := uuid.FromString("a58e92a2-6640-461d-b4f6-a912b06541cd")
	// if err != nil {
	// 	log.Panic("Unable to create uuid.")
	// }
	// me, err := dal.ReadUserByEmail(&adminEmail)
	// if err != nil {
	// 	log.Println("Unable to ReadUserByEmail mailinator")
	// } else {
	// 	log.Println("Trying to delete mailinator...")
	// 	if me.ID == uuidu {
	// 		err := dal.DeleteUser(&uuidu)
	// 		log.Println("Deleted mailinator...")
	// 		if err != nil {
	// 			log.Panic("Unable to DeleteUser")
	// 		}
	// 	}
	// }

	adminEmail := "alvaro@socotree.io"
	// uuidu, err = uuid.FromString("d24299f0-bc12-4854-a015-1d3b0cdde18b")
	// if err != nil {
	// 	log.Panic("Unable to create uuid.")
	// }
	_, err = dal.ReadUserByEmail(&adminEmail)
	// if err != nil {
	// 	log.Println("Unable to ReadUserByEmail socotree")
	// } else {
	// 	log.Println("Trying to delete socotree...")
	// 	if me.ID == uuidu {
	// 		err := dal.DeleteUser(&uuidu)
	// 		log.Println("Deleted socotree...")
	// 		if err != nil {
	// 			log.Panic("Unable to DeleteUser")
	// 		}
	// 	}
	// }

	if err != nil {
		log.Println("Creating User")
		pass := []byte("123456")
		hash, err := bcrypt.GenerateFromPassword(pass, bcrypt.DefaultCost)
		if err != nil {
			log.Panic("Unable to create user.")
		}

		user := &models.User{Email: adminEmail, Password: string(hash), EmailVerified: true}
		if err := dal.AddUser(user); err != nil {
			log.Panic("Unable to create user.")
		}

		profile := &models.Profile{Admin: true, AgeMonth: 11, AgeDay: 27, AgeYear: 1978, UserID: user.ID,
			AdminVerified: true, Login: "email", Name: "Alvaro Socotree", District: 1}
		if err := dal.AddProfile(profile); err != nil {
			log.Panic("Unable to create user profile.")
		}

		if os.Getenv("HOST") != "api.circles.berlin" {
			user2 := &models.User{Email: "alvaro@mailinator.com", Password: string(hash), EmailVerified: true}
			if err := dal.AddUser(user2); err != nil {
				log.Panic("Unable to create user2.")
			}
			profile2 := &models.Profile{UserID: user2.ID, AgeMonth: 11, AgeDay: 20, AgeYear: 1980,
				AdminVerified: true, Login: "email", Name: "Alvaro Mailinator", District: 1}
			if err := dal.AddProfile(profile2); err != nil {
				log.Panic("Unable to create user profile 2.")
			}
		}

		interest, err := dal.FindInterest("Drinks")
		if err != nil {
			log.Panic("Unable to find drinks")
		}
		userInterest := &models.UserInterest{
			InterestID: interest.ID,
			UserID:     user.ID,
		}
		if err := dal.AddUserInterests(userInterest); err != nil {
			log.Panic("Unable to create UserInterest")
		}
		interest, err = dal.FindInterest("Sports")
		if err != nil {
			log.Panic("Unable to find drinks")
		}
		userInterest = &models.UserInterest{
			InterestID: interest.ID,
			UserID:     user.ID,
		}
		if err := dal.AddUserInterests(userInterest); err != nil {
			log.Panic("Unable to create UserInterest")
		}
	}

	questions, err := dal.ReadQuestions()
	if err == nil {
		if len(questions) == 0 {
			log.Println("Creating Question")
			answer1 := models.Answer{Answer: "Yes"}
			answer2 := models.Answer{Answer: "No"}
			answer3 := models.Answer{Answer: "Sometimes"}
			question := &models.Question{
				Question: "Do you like meeting people via videocall? (created by the system)",
			}
			question.Answers = append(question.Answers, answer1)
			question.Answers = append(question.Answers, answer2)
			question.Answers = append(question.Answers, answer3)
			dal.AddQuestion(question)
			if err != nil {
				log.Panic("Unable to add question")
			}
		}
	}

	updated, _ := dal.ReadUpdateVersion()
	if updated.AndroidBuild == 0 {
		updated.AndroidBuild = 78
		updated.IOSBuild = 78
		updated.IOSBuildForced = 78
		updated.AndroidBuildForced = 78
		if err := dal.CreateUpdatedVersion(&updated); err != nil {
			log.Panic("Unable to create Updated Version seed")
		}
	}

	dal.CheckFields()

	log.Println("Finished DB Migration")
}
