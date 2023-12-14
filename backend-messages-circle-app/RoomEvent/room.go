package roomevent

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	models "github.com/socotree/backend-messages-circle-app/Models"
)

const (
	socketBufferSize  = 1024
	messageBufferSize = 256
)

// Room represents a single chat room
type Room struct {
	forward  chan []byte
	join     chan *Chatter
	leave    chan *Chatter
	chatters map[*Chatter]bool
	roomID   string
	eventID  string
}

var upgrader = &websocket.Upgrader{
	ReadBufferSize:  socketBufferSize,
	WriteBufferSize: socketBufferSize,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (r *Room) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	circlePath := strings.TrimPrefix(req.URL.Path, CircleEventRoomURL)
	ids := strings.Split(circlePath, "@")

	eventid := ids[0]
	circleid := ids[1]

	userids, ok := req.URL.Query()["userid"]
	if !ok || len(userids[0]) < 1 {
		log.Println("Url Param 'userid' is missing")
		return
	}

	// Query()["key"] will return an array of items, we only want the single item.
	userid := userids[0]

	if !userExistsOnRoom(userid, eventid, circleid, r.chatters) {
		socket, err := upgrader.Upgrade(w, req, nil)
		if err != nil {
			log.Fatal("Serving http failed ", err)
			return
		}

		chatter := &Chatter{
			socket:  socket,
			send:    make(chan []byte, messageBufferSize),
			room:    r,
			userid:  userid,
			eventid: eventid,
		}

		r.join <- chatter
		defer func() {
			r.leave <- chatter
		}()

		go chatter.write()
		chatter.read()

	} else {

		j, _ := json.Marshal(&models.Success{
			Success: false,
			Message: "User does not belong to the circle",
		})
		w.Write(j)

	}
}

// NewRoom creates a new chat room
func NewRoom(eventid string, circleid string) *Room {
	return &Room{
		forward:  make(chan []byte),
		join:     make(chan *Chatter),
		leave:    make(chan *Chatter),
		chatters: make(map[*Chatter]bool),
		eventID:  eventid,
		roomID:   circleid,
	}
}

// Run initializes a chat room
func (r *Room) Run() {
	log.Printf("running chat circle_event %v %v", r.eventID, r.roomID)
	for {
		select {
		case chatter := <-r.join:
			for c := range r.chatters {
				if c.userid == chatter.userid {
					delete(r.chatters, c)
				}
			}
			r.chatters[chatter] = true
			log.Printf("new chatter joined '%v' in circle_event '%v' Total '%v'", chatter.userid, r.roomID, len(r.chatters))
			sendAll(&MessageSocket{Chatters: len(r.chatters), Sender: chatter.userid, Message: "£$Socotree@#JOIN"}, r.chatters)
		case chatter := <-r.leave:
			log.Printf("chatter '%v' leaving circle_event '%v' Total '%v'", chatter.userid, r.roomID, len(r.chatters)-1)
			delete(r.chatters, chatter)
			close(chatter.send)
			sendAll(&MessageSocket{Chatters: len(r.chatters), Sender: chatter.userid, Message: "£$Socotree@#LEAVE"}, r.chatters)
		case msg := <-r.forward:
			data := FromJSON(msg)
			if data.Message == "£$Socotree@#VIDEO" {
				log.Printf("Chatter '%v' -> circle_event '%v'", data.Sender, r.roomID)
				log.Printf("Video message signal '%v'", data.Message)
				sendAll(&MessageSocket{Chatters: len(r.chatters), Sender: data.Sender, Message: "£$Socotree@#VIDEO"}, r.chatters)
			} else {
				data.Chatters = len(r.chatters)
				log.Printf("Chatter '%v' -> circle_event '%v'", data.Sender, r.roomID)
				log.Printf("Message '%v'", data.Message)
				sendAll(data, r.chatters)
			}
		}
	}
}

func sendAll(data *MessageSocket, chatters map[*Chatter]bool) {
	for chatter := range chatters {
		select {
		case chatter.send <- ToJSON(data):
		default:
			delete(chatters, chatter)
			close(chatter.send)
		}
	}
}

func userExistsOnRoom(userid string, eventid string, circleid string, chatters map[*Chatter]bool) bool {
	for chatter := range chatters {
		if chatter.userid == userid && chatter.eventid == eventid && chatter.circleid == circleid {
			return true
		}
	}
	return false
}

func createCircleEventRoom(eventid string, circleid string) {
	r := NewRoom(eventid, circleid)
	http.Handle(CircleEventRoomURL+eventid+"@"+circleid, r)
	go r.Run()
}
