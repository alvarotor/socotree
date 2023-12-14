package main

import (
	"log"
	"time"

	core "github.com/socotree/backend-ticker-circles-app/Core"
	"github.com/socotree/backend-ticker-circles-app/health"

	"github.com/socotree/backend-ticker-circles-app/grpc"
)

func main() {
	go func() {
		health.HtmlRun()
	}()

	eventFinder := time.NewTicker(1 * time.Second)
	// secondTicker := time.NewTicker(1 * time.Second)

	for {
		select {
		case t := <-eventFinder.C:
			if t.Second() == 0 {
				go check(t)
			}
			// case t := <-secondTicker.C:
			// 	log.Println(t.Year(), int(t.Month()), t.Day(), "@", t.Hour(), t.Minute(), t.Second())
		}
	}
}

func check(t time.Time) {
	events, err := grpc.ConnectReadEvents()
	if err != nil {
		log.Println("cant read events", err)
	}

	for _, event := range events {
		// printDate(event.Eventid, t)
		t15 := plus15min(t)
		eventTime := time.Date(int(event.Year), time.Month(event.Month), int(event.Day), int(event.Hour), int(event.Minute), 0, 0, time.UTC)
		printDate(event.Eventid, eventTime)

		if areEqual(t15, eventTime) {
			log.Println("Going to remind " + event.Eventid)
			core.Remind(event)
		}

		if areEqual(t, eventTime) {
			log.Println("Going to match " + event.Eventid)
			core.Match(event.Eventid, event.GetName())
		}
	}
}

func areEqual(date1, date2 time.Time) bool {
	return date1.Year() == date2.Year() &&
		date1.Month() == date2.Month() &&
		date1.Day() == date2.Day() &&
		date1.Hour() == date2.Hour() &&
		date1.Minute() == date2.Minute()
}

func plus15min(date time.Time) time.Time {
	return time.Date(date.Year(), date.Month(), date.Day(), date.Hour(), date.Minute(), 0, 0, time.UTC).
		Add(time.Duration(15) * time.Minute)
}

func printDate(eventid string, t time.Time) {
	log.Println(eventid, t.Year(), int(t.Month()), t.Day(), t.Hour(), t.Minute(), t.Second())
}
