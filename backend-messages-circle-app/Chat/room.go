package chat

import (
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	models "github.com/socotree/backend-circle-app/Models"
	"github.com/socotree/backend-messages-circle-app/grpc"
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
}

var upgrader = &websocket.Upgrader{
	ReadBufferSize:  socketBufferSize,
	WriteBufferSize: socketBufferSize,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (r *Room) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	userids, ok := req.URL.Query()["userid"]

	if !ok || len(userids[0]) < 1 {
		log.Println("Url Param 'userid' is missing")
		return
	}

	// Query()["key"] will return an array of items, we only want the single item.
	userid := userids[0]

	if !userExistsOnRoom(userid, r.chatters) {
		socket, err := upgrader.Upgrade(w, req, nil)
		if err != nil {
			log.Fatal("Serving http failed ", err)
			return
		}

		chatter := &Chatter{
			socket: socket,
			send:   make(chan []byte, messageBufferSize),
			room:   r,
			userid: userid,
		}
		r.join <- chatter
		defer func() {
			r.leave <- chatter
		}()
		go chatter.write()
		chatter.read()
		// } else {
		// log.Printf("user %v already in circle %v, kicking user out, still %v", userid, r.roomID, len(r.chatters))
		// r.forward <- []byte("{sender: 'userMe._id',message: 'm.text'}")
		// r.leave <- chatter
		// delete(r.chatters, chatter)
		// close(chatter.send)
	}
}

// NewRoom creates a new chat room
func NewRoom(roomID string) *Room {
	return &Room{
		forward:  make(chan []byte),
		join:     make(chan *Chatter),
		leave:    make(chan *Chatter),
		chatters: make(map[*Chatter]bool),
		roomID:   roomID,
	}
}

// Run initializes a chat room
func (r *Room) Run(circle bool) {
	place := ""
	if circle {
		place = "circle"
	} else {
		place = "room"
	}
	log.Printf("running chat group %v %v", place, r.roomID)
	for {
		select {
		case chatter := <-r.join:
			log.Printf("new chatter called '%v' in %v '%v' Total '%v'", chatter.userid, place, r.roomID, len(r.chatters)+1)
			r.chatters[chatter] = true
			room, err := uuid.FromString(r.roomID)
			if err != nil {
				log.Fatal(err)
			} else {
				messages, err := dal.ReadMessages(&room)
				if err != nil {
					log.Fatal(err)
				} else {
					sendAll(&MessageSocket{Chatters: len(r.chatters), Sender: chatter.userid, Messages: messages}, r.chatters)
				}
			}
		case chatter := <-r.leave:
			log.Printf("chatter '%v' leaving %v '%v' Total '%v'", chatter.userid, place, r.roomID, len(r.chatters)-1)
			delete(r.chatters, chatter)
			close(chatter.send)
			sendAll(&MessageSocket{Chatters: len(r.chatters), Sender: chatter.userid}, r.chatters)
		case msg := <-r.forward:
			data := FromJSON(msg)
			data.Chatters = len(r.chatters)
			log.Printf("Chatter '%v' -> %v '%v'", data.Sender, place, r.roomID)
			log.Printf("Message '%v'", data.Message)
			circleid, err := uuid.FromString(r.roomID)
			if err != nil {
				log.Fatal(err)
			}
			userid, err := uuid.FromString(r.roomID)
			if err != nil {
				log.Fatal(err)
			}
			err = dal.AddMessage(&models.Message2{CircleID: circleid, UserID: userid, Message: data.Message})
			if err != nil {
				log.Fatal(err)
			} else {
				sendAll(data, r.chatters)
				// if circle {
				sendAllFcmCircle(data, r.roomID)
				// } else {
				// 	sendAllFcmGroup(data, r.roomID)
				// }
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

// func sendAllFcmGroup(data *MessageSocket, roomID string) {
// 	uuID, err := uuid.FromString(data.Sender)
// 	if err != nil {
// 		log.Println(err)
// 		return
// 	}

// 	modelSender, err := dal.ReadUserWithProfile(&uuID)
// 	if err != nil {
// 		log.Println(err)
// 		return
// 	}

// 	uuID, err = uuid.FromString(roomID)
// 	if err != nil {
// 		log.Println(err)
// 		return
// 	}

// 	event, err := dal.ReadEvent(&uuID)
// 	if err != nil {
// 		log.Println(err)
// 		return
// 	}

// 	groupChatters, err := dal.ReadGroup(&uuID)
// 	if err != nil {
// 		log.Println(err)
// 		return
// 	}

// 	for _, chatter := range groupChatters {
// 		model, err := dal.ReadUserWithProfile(&chatter.UserID)
// 		if err != nil {
// 			log.Println(err)
// 		}

// 		if len(model.Profile.FcmToken) == 0 {
// 			log.Println(chatter.UserID.String() + " has no fcmToken")
// 		} else if chatter.UserID != modelSender.ID && model.Profile.PushNotificationSwitch && model.Profile.Logged {
// 			// Create the message to be sent.
// 			log.Println("Sender " + modelSender.ID.String() + " with name " + modelSender.Profile.Name)
// 			log.Println("Sending a fcm tocken to: " + model.Profile.FcmToken + " with name " + model.Profile.Name + " and userid " + model.ID.String())

// 			title := "Circles event: " + event.Name
// 			message := modelSender.Profile.Name + ": " + data.Message
// 			go grpc.ConnectNotificationsChats(title, message, modelSender.ID.String(), "", []string{model.Profile.FcmToken})

// 		} else {
// 			if chatter.UserID == modelSender.ID {
// 				log.Println("Push Notification Not Sent (Same user)")
// 			}
// 			log.Println("Push Notification Not Sent (Logged) (PushNotificationSwitch):", model.Profile.Logged, model.Profile.PushNotificationSwitch)
// 		}
// 	}
// }

func sendAllFcmCircle(data *MessageSocket, circleID string) {
	uuID, err := uuid.FromString(data.Sender)
	if err != nil {
		log.Println(err)
		return
	}

	modelSender, err := dal.ReadUserWithProfile(&uuID)
	if err != nil {
		log.Println(err)
		return
	}

	groupChatters, err := dal.ReadCircle(circleID)
	if err != nil {
		log.Println(err)
		return
	}

	for _, chatter := range groupChatters {
		modelChatter, err := dal.ReadUserWithBlockedUsersProfile(&chatter.UserID)
		if err != nil {
			log.Println(err)
		}

		if len(modelChatter.Profile.FcmToken) == 0 {
			log.Println(chatter.UserID.String() + " has no fcmToken")
		} else if chatter.UserID != modelSender.ID && modelChatter.Profile.PushNotificationSwitch && modelChatter.Profile.Logged {

			foundBlocked := false
			for _, blocked := range modelChatter.BlockedUsers {
				if blocked.UserBlockedID == modelSender.ID {
					foundBlocked = true
					break // not send if its a blocked user.
				}
			}

			if foundBlocked {
				log.Println("Push Notification Not Sent (User blocked)")
				break
			}

			// Create the message to be sent.
			log.Println("Sending fcm tocken to server: " + modelChatter.Profile.FcmToken)
			log.Println("Sender " + modelSender.Profile.Name + " -> " + modelChatter.Profile.Name)
			log.Println("Sender " + modelSender.ID.String() + " -> " + modelChatter.ID.String())

			title := "Circles:"

			if strings.HasPrefix(data.Message, "GPS@") {
				data.Message = "Has shared the location."
			}
			message := modelSender.Profile.Name + ": " + data.Message
			go grpc.ConnectNotificationsChats(title, message, modelSender.ID.String(), circleID, []string{modelChatter.Profile.FcmToken})

		} else {
			if chatter.UserID == modelSender.ID {
				log.Println("Push Notification Not Sent (Same user)")
			} else {
				log.Println("Push Notification Not Sent (Logged) (PushNotificationSwitch):", modelChatter.Profile.Logged, modelChatter.Profile.PushNotificationSwitch)
			}
		}
	}
}

func userExistsOnRoom(userid string, chatters map[*Chatter]bool) bool {
	for chatter := range chatters {
		if chatter.userid == userid {
			return true
		}
	}
	return false
}

func createGroupChat(name string) {
	r := NewRoom(name)
	http.Handle("/v1/chat/"+name, r)
	go r.Run(false)
}

func createCircleChat(name string) {
	r := NewRoom(name)
	http.Handle("/v1/circle/"+name, r)
	go r.Run(true)
}
