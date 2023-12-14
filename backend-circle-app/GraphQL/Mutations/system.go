package muts

import (
	"errors"
	"log"
	"os"
	"sync"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//UpdatedVersion Updated Version
func UpdatedVersion() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Updated Version",
		Args: graphql.FieldConfigArgument{
			"androidbuild": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"iosbuild": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"androidbuildforced": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"iosbuildforced": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return false, errors.New("must be admin")
			}
			utils.SegmentPage("UpdatedVersion", "admin", "updatedVersion")

			var AndroidBuild int
			if val, ok := p.Args["androidbuild"]; ok {
				AndroidBuild = val.(int)
			}

			var IOSBuild int
			if val, ok := p.Args["iosbuild"]; ok {
				IOSBuild = val.(int)
			}

			var AndroidBuildForced int
			if val, ok := p.Args["androidbuildforced"]; ok {
				AndroidBuildForced = val.(int)
			}

			var IOSBuildForced int
			if val, ok := p.Args["iosbuildforced"]; ok {
				IOSBuildForced = val.(int)
			}

			updated := models.UpdatedVersion{
				AndroidBuild:       AndroidBuild,
				IOSBuild:           IOSBuild,
				AndroidBuildForced: AndroidBuildForced,
				IOSBuildForced:     IOSBuildForced,
			}
			if err := dal.CreateUpdatedVersion(&updated); err != nil {
				return false, errors.New("unable to update Updated Version")
			}

			return true, nil
		},
	}
}

//NotifyCircles Notify Circles
func NotifyCircles() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Notify Circles",
		Args: graphql.FieldConfigArgument{
			"eventid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return false, errors.New("must be admin")
			}
			utils.SegmentPage("NotifyCircles", "admin", "notifyCircles")

			var eventid string
			if val, ok := p.Args["eventid"]; ok {
				eventid = val.(string)
			}

			ueventid, err := uuid.FromString(eventid)
			if err != nil {
				return false, err
			}

			event, err := dal.ReadEvent(&ueventid)
			if err != nil {
				return false, err
			}
			if !event.Notify {
				// if the matchign flags are set to false, we wont notify and pretend we did
				utils.SegmentTrack("Matching flag is off for notify and we wont send notifications", "admin")
				log.Println("Matching flag is off for notify and we wont send notifications")
				return true, nil
			}

			log.Println("starting to notify event id ", eventid)

			var circlesEmails []models.Circle
			var circlesEmailsLen int
			if os.Getenv("HOST") == "api.circles.berlin" {
				circlesEmails, err = dal.NonNotifiedEmailCircles(eventid)
				if err != nil {
					return false, err
				}
				circlesEmailsLen = len(circlesEmails)
			} else {
				utils.SegmentTrack("os.Getenv('HOST') flag is apidev for notify and we wont send email notifications", "admin")
				log.Println("os.Getenv('HOST') flag is apidev for notify and we wont send email notifications")
			}
			log.Println("circlesEmailsLen", circlesEmailsLen)

			circlesPNs, err := dal.NonNotifiedPNCircles(eventid)
			if err != nil {
				return false, err
			}
			circlesPNsLen := len(circlesPNs)
			log.Println("circlesPNsLen", circlesPNsLen)

			sendEmailChn := make(chan models.User, circlesEmailsLen)
			sendPNChn := make(chan models.User, circlesPNsLen)
			var wg sync.WaitGroup

			go NotifyEmail(sendEmailChn, &wg)
			go NotifyPN(sendPNChn, &wg)

			log.Println("starting notify FORs")

			for _, circleEmail := range circlesEmails {

				user, err := dal.ReadUserWithProfile(&circleEmail.UserID)
				if err != nil {
					return false, err
				}
				user.Password = circleEmail.CircleID.String()

				wg.Add(1)
				sendEmailChn <- user

				log.Println("Notifying with email", user.Profile.Name)
			}

			for _, circlePN := range circlesPNs {

				user, err := dal.ReadUserWithProfile(&circlePN.UserID)
				if err != nil {
					return false, err
				}
				user.Password = event.ID.String()
				user.Email = event.Name

				wg.Add(1)
				sendPNChn <- user

				log.Println("Notifying with pn", user.Profile.Name)
			}

			wg.Wait()
			close(sendEmailChn)
			close(sendPNChn)
			log.Println("Circles notified")

			return true, nil
		},
	}
}
