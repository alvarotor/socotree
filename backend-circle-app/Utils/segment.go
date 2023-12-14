package utils

import (
	"log"
	"os"
	"time"

	analytics "github.com/segmentio/analytics-go"
	models "github.com/socotree/backend-circle-app/Models"
)

var client analytics.Client
var err error
var host string = " " + os.Getenv("HOST")

func init() {
	client, err = analytics.NewWithConfig(os.Getenv("SEGMENT"), analytics.Config{
		Interval:  15 * time.Second, // 10 * 60 * time.Second,
		BatchSize: 5,                // 500,
		Verbose:   false,
	})
	// defer client.Close()
	if err != nil {
		log.Println("error connecting to segment:", err)
		return
	}
}

//SegmentSystemStarts System Starts segment log
func SegmentSystemStarts() {
	if err := client.Enqueue(analytics.Track{
		Event:  "System Circles started" + host,
		UserId: "StartSystem",
	}); err != nil {
		log.Println("error segment starts:", err)
	}
}

//SegmentIdentifyCreate Segment identify user create
func SegmentIdentifyCreate(userid string) {
	if err := client.Enqueue(analytics.Identify{
		UserId: userid,
		Traits: analytics.NewTraits().
			Set("host", host),
	}); err != nil {
		log.Println("error segment identify create:", err)
	}
}

//SegmentIdentify Segment identify user
func SegmentIdentify(user *models.User) {
	if err := client.Enqueue(analytics.Identify{
		UserId: user.ID.String(),
		Traits: analytics.NewTraits().
			SetName(user.Profile.Name).
			SetEmail(user.Email).
			Set("Admin", user.Profile.Admin).
			Set("AgeDay", user.Profile.AgeDay).
			Set("AgeMonth", user.Profile.AgeMonth).
			Set("AgeYear", user.Profile.AgeYear).
			Set("Profession", user.Profile.Profession).
			Set("EmailsSwitch", user.Profile.EmailsSwitch).
			Set("NewsUpdate", user.Profile.NewsUpdate).
			Set("PushNotificationSwitch", user.Profile.PushNotificationSwitch).
			Set("Build", user.Profile.Build).
			Set("Platform", user.Profile.Platform).
			// Set("LastCircle", user.Profile.LastCircle).
			Set("Photo", user.Profile.Photo).
			Set("host", host),
	}); err != nil {
		log.Println("error segment identify:", err)
	}
}

//SegmentTrack Segment track event segment log
func SegmentTrack(event string, userid string) {
	if err := client.Enqueue(analytics.Track{
		Event:  event + host,
		UserId: userid,
	}); err != nil {
		log.Println("error segment track:", err)
	}
}

//SegmentTrackMessagesCircle Segment track event messages circle segment log
func SegmentTrackMessagesCircle(userid string, circleid string) {
	if err := client.Enqueue(analytics.Track{
		Event:  "Messages by circle id" + host,
		UserId: userid,
		Properties: analytics.NewProperties().
			Set("circleid", circleid),
	}); err != nil {
		log.Println("error segment track messages circle:", err)
	}
}

//SegmentPage Segment page segment log
func SegmentPage(name string, userid string, url string) {
	if err := client.Enqueue(analytics.Page{
		Name:   name + host,
		UserId: userid,
		Properties: analytics.NewProperties().
			SetURL(url),
	}); err != nil {
		log.Println("error segment page:", err)
	}
}

//SegmentGroup Segment group segment log
func SegmentGroup(circleid string, users map[string]interface{}) {
	if err := client.Enqueue(analytics.Group{
		UserId:  "admin",
		GroupId: circleid + host,
		Traits:  users,
	}); err != nil {
		log.Println("error segment group:", err)
	}
}

//SegmentTrackBlockingUser Segment track event user blocking users
func SegmentTrackBlockingUser(userid string, useridBlocked string) {
	if err := client.Enqueue(analytics.Track{
		Event:  "User blocking user" + host,
		UserId: userid,
		Properties: analytics.NewProperties().
			Set("useridBlocked", useridBlocked),
	}); err != nil {
		log.Println("error segment track user blocking user:", err)
	}
}

//SegmentTrackUnBlockingUser Segment track event user unblocking users
func SegmentTrackUnBlockingUser(userid string, useridBlocked string) {
	if err := client.Enqueue(analytics.Track{
		Event:  "User unblocking user" + host,
		UserId: userid,
		Properties: analytics.NewProperties().
			Set("useridUnBlocked", useridBlocked),
	}); err != nil {
		log.Println("error segment track user unblocking user:", err)
	}
}
