package main

import (
	chat "github.com/socotree/backend-messages-circle-app/Chat"
	roomEvent "github.com/socotree/backend-messages-circle-app/RoomEvent"
)

func main() {

	go func() {
		chat.Run()
	}()

	roomEvent.Run()
}
