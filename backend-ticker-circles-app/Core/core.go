package core

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
	"unicode"

	pb "github.com/socotree/backend-circle-app/grpc"
	models "github.com/socotree/backend-ticker-circles-app/Models"
	"github.com/socotree/backend-ticker-circles-app/grpc"
)

func Remind(event *pb.ResponseEvent) {
	log.Println("REMINDER!!!")

	title := "REMINDER: Your event is starting soon!"
	message := "Join now " + event.Name + " to take part in the event."
	userid := ""
	circleid := event.Eventid
	var tokens []string

	users, err := grpc.ConnectReadEventRegisteredUsers(event.Eventid)
	if err != nil {
		log.Println("cant read events", err)
	}
	for x, user := range users {
		log.Println(x, user.Fcmtoken)
		tokens = append(tokens, user.Fcmtoken)
	}

	go grpc.ConnectNotificationsPNs(title, message, userid, circleid, tokens)
}

func Match(eventid string, eventName string) {
	url := "http://matching_algo:5000/ematch?eventid="
	res, err := http.Post(url+eventid, "application/json", nil)
	if err != nil {
		log.Fatalln(err)
	}
	defer res.Body.Close()

	var cResp models.MatchResponse
	if err := json.NewDecoder(res.Body).Decode(&cResp); err != nil {
		log.Printf("ooopsss! an error occurred, please try again. %s\n", err)
	}

	log.Println("cResp.Success", cResp.Success)
	log.Println("cResp.TotalUsers", cResp.TotalUsers)
	log.Println("cResp.Circles", cResp.Circles)
	if cResp.Success && cResp.Circles > 0 && cResp.TotalUsers > 0 {
		log.Println("Match done. Going to notify " + eventid)
		notify(eventid, cResp, eventName)
	} else {
		log.Println("Match NOT done. Going to notify admins " + eventid)
		notifyAdmin(eventid, false, cResp, eventName)
	}
}

func notify(eventid string, cResp models.MatchResponse, eventName string) {
	jsonData := map[string]string{
		"query": `
			mutation {
				notifyCircles(eventid: "` + eventid + `")
			}
		`,
	}
	jsonValue, _ := json.Marshal(jsonData)
	log.Println("NewRequest")
	res, err := http.NewRequest("POST", "http://app:3001/v1/graphql/", bytes.NewBuffer(jsonValue))
	if err != nil {
		log.Printf("The graphql request failed with error %s\n", err)
	}
	res.Header.Set("Authentication", os.Getenv("AUTH"))
	client := &http.Client{Timeout: time.Second * 20}
	log.Println("client.Do")
	response, err := client.Do(res)
	if err != nil {
		log.Printf("The HTTP request failed with error %s\n", err)
	}
	defer response.Body.Close()
	data, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Printf("The ReadAll failed with error %s\n", err)
	}
	log.Println("spaceStringsRemover")
	str := spaceStringsRemover(string(data))
	log.Println(str)
	log.Println(strings.Replace(str, "\"", "", -1))
	if strings.Replace(str, "\"", "", -1) != "{data:{notifyCircles:true}}" {
		log.Println("notifyAdmin")
		notifyAdmin(eventid, true, cResp, eventName)
	} else {
		log.Println("notifyAdminGood")
		notifyAdminGood(eventid, cResp, eventName)
	}
}

func notifyAdmin(eventid string, notif bool, cResp models.MatchResponse, eventName string) {
	subject := "Automatic MA PROBLEM"
	text := "Please check MA system as it came out with problems with event id " + eventid
	text += " and name " + eventName
	if notif {
		text += " notifying users"
	}
	if cResp.Success {
		text += ". Success: TRUE. TotalUsers:" + strconv.Itoa(cResp.TotalUsers) + ". Circles:" + strconv.Itoa(cResp.Circles)
	} else {
		text += ". Success: FALSE. Message:" + cResp.Message + "."
	}
	go grpc.ConnectNotificationsEmailAdmin(subject, text)
}

func notifyAdminGood(eventid string, cResp models.MatchResponse, eventName string) {
	subject := "Automatic MA SUCCEED"
	text := "Matching worked correctly with event id " + eventid
	text += " and name " + eventName
	text += ". Success:" + strconv.FormatBool(cResp.Success) + ". TotalUsers:" + strconv.Itoa(cResp.TotalUsers) + ". Circles:" + strconv.Itoa(cResp.Circles)
	go grpc.ConnectNotificationsEmailAdmin(subject, text)
}

func spaceStringsRemover(str string) string {
	var b strings.Builder
	b.Grow(len(str))
	for _, ch := range str {
		if !unicode.IsSpace(ch) {
			b.WriteRune(ch)
		}
	}
	return b.String()
}
