package grpc

import (
	"context"
	"log"

	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
	pb "github.com/socotree/backend-notifications-circles-app/grpc"

	"google.golang.org/grpc"
)

const (
	port = "811"
)

// connectNotificationsServer Connect to the notifications server
func connectNotificationsServer() *grpc.ClientConn {
	log.Printf("Trying to connect to the Notifications GRPC server from users system...")
	// Set up a connection to the server.
	conn, err := grpc.Dial("app_notifications:"+port, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		log.Fatalf("Failed to connect to grpc notification server: %v", err)
		return nil
	}
	return conn
}

// connectNotificationsEmails Connect to the notifications server for emails
func connectNotificationsEmails() (*grpc.ClientConn, pb.ServicesEmailsClient) {
	conn := connectNotificationsServer()

	c := pb.NewServicesEmailsClient(conn)

	return conn, c
}

// connectNotificationsPNs Connect to the notifications server for PNS
func connectNotificationsPNs() (*grpc.ClientConn, pb.ServicesPushNotificationsClient) {
	conn := connectNotificationsServer()

	c := pb.NewServicesPushNotificationsClient(conn)

	return conn, c
}

// ConnectNotificationsInterests Connect to the notifications server and send interest to admins
func ConnectNotificationsInterests(interests string) {
	conn, c := connectNotificationsEmails()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	r, err := c.EmailInterestsAdmin(ctx, &pb.EmailInterest{Name: interests})
	if err != nil {
		log.Printf("mailInterestsAdmin NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("Communications - Email NOT sent - New Interest", "admin")
	} else {
		log.Printf("EmailInterestsAdmin Sent: %v", r.GetSuccess())
		utils.SegmentTrack("Communications - Email sent - New Interest", "admin")
	}
}

// ConnectNotificationsVerifyUserEmail Connect to the notifications server and send user verify email
func ConnectNotificationsVerifyUserEmail(email string, code int32, userid string) {
	conn, c := connectNotificationsEmails()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	r, err := c.EmailVerifyUserEmail(ctx, &pb.Email{Email: email, Code: code})
	if err != nil {
		log.Printf("EmailVerifyUserEmail NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("Communications - Email NOT sent - Verify User Email", userid)
	} else {
		log.Printf("EmailVerifyUserEmail Sent: %v", r.GetSuccess())
		utils.SegmentTrack("Communications - Email sent - Verify User Email", userid)
	}
}

// ConnectNotificationsForgottenPassword Connect to the notifications server and send forgotten password to users
func ConnectNotificationsForgottenPassword(email string, name string, code int32, userid string) {
	conn, c := connectNotificationsEmails()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	r, err := c.EmailForgottenPassword(ctx, &pb.Email{Name: name, Email: email, Code: code})
	if err != nil {
		log.Printf("EmailForgottenPassword NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("Communications - Email NOT sent - Email Forgotten Password", userid)
	} else {
		log.Printf("EmailForgottenPassword Sent: %v", r.GetSuccess())
		utils.SegmentTrack("Communications - Email sent - Email Forgotten Password", userid)
	}
}

// ConnectNotificationsUserNewCircleEmail Connect to the notifications server and send to user new circle email
func ConnectNotificationsUserNewCircleEmail(email string, name string, userid string) bool {
	conn, c := connectNotificationsEmails()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	r, err := c.EmailUserNewCircle(ctx, &pb.Email{Name: name, Email: email})
	if err != nil {
		log.Printf("EmailUserNewCircle NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("Communications - Email NOT sent - User New Circle", userid)
		return false
	}

	log.Printf("EmailUserNewCircle Sent: %v", r.GetSuccess())
	utils.SegmentTrack("Communications - Email sent - User New Circle", userid)
	return true
}

// ConnectNotificationsUserNewCirclePN Connect to the notifications server and send to user new circle PN
func ConnectNotificationsUserNewCirclePN(eventID string, token string, userid string, eventName string) bool {
	conn, c := connectNotificationsPNs()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	message := &pb.PNMessageNewCircle{
		Eventname: eventName,
		Eventid:   eventID,
		Typepn:    "newcircle",
		Tokens:    []string{token},
	}

	r, err := c.PNUserNewCircle(ctx, message)
	if err != nil {
		log.Printf("PNUserNewCircle NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("Communications - PN NOT sent - User New Circle", userid)
		return false
	}

	log.Printf("PNUserNewCircle Sent: %v", r.GetSuccess())
	utils.SegmentTrack("Communications - PN sent - User New Circle", userid)
	return true
}

// ConnectNotificationsUserVerifiedEmail Connect to the notifications server and send to user new circle email
func ConnectNotificationsUserVerifiedEmail(email string, name string, userid string) {
	conn, c := connectNotificationsEmails()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	r, err := c.EmailUserVerified(ctx, &pb.Email{Name: name, Email: email})
	if err != nil {
		log.Printf("EmailUserVerified NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("Communications - Email NOT sent - User Verified", userid)
	} else {
		log.Printf("EmailUserVerified Sent: %v", r.GetSuccess())
		utils.SegmentTrack("Communications - Email sent - User Verified", userid)
	}
}

// ConnectNotificationsUserVerifiedPN Connect to the notifications server and send to user admin verification PN
func ConnectNotificationsUserVerifiedPN(token string, userid string) {
	conn, c := connectNotificationsPNs()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	message := &pb.PNMessageChat{
		Tokens: []string{token},
	}

	r, err := c.PNUserVerified(ctx, message)
	if err != nil {
		log.Printf("PNUserVerified NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("Communications - PN NOT sent - User Verified", userid)
	} else {
		log.Printf("PNUserVerified Sent: %v", r.GetSuccess())
		utils.SegmentTrack("Communications - PN sent - User Verified", userid)
	}
}

// ConnectNotificationsReportProfileEmail Connect to the notifications server and send a report profile email
func ConnectNotificationsReportProfileEmail(
	NameReporter string, IDReporter string, NameReported string, IDReported string) bool {
	conn, c := connectNotificationsEmails()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	msg := &pb.MessageReportProfile{
		NameReporter: NameReporter,
		IDReporter:   IDReporter,
		NameReported: NameReported,
		IDReported:   IDReported,
	}

	r, err := c.EmailReportProfile(ctx, msg)
	if err != nil {
		log.Printf("EmailReportProfile NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("Communications - Email NOT sent - Report Profile", IDReporter)
		return false
	}
	log.Printf("EmailReportProfile Sent: %v", r.GetSuccess())
	utils.SegmentTrack("Communications - Email sent - Report Profile", IDReporter)
	return true
}

// ConnectNotificationsChats Connect to the notifications server and send messages to chatters
func ConnectNotificationsChats(title string, message string, userid string, circleid string, tokens []string) {
	conn, c := connectNotificationsPNs()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	messageChat := &pb.PNMessageChat{
		Typepn:   "newchatmessage",
		Title:    title,
		Body:     message,
		Tokens:   tokens,
		Userid:   userid,
		Circleid: circleid,
	}

	r, err := c.PNChatMessage(ctx, messageChat)
	if err != nil {
		log.Printf("PNChatMessage NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("PNChatMessage - NOT sent", userid)
	} else {
		log.Printf("PNChatMessage Sent: %v", r.GetSuccess())
		utils.SegmentTrack("PNChatMessage - sent", userid)
	}
}

// ConnectNotificationsUserRejectedPN Connect to the notifications server and send to user rejected PN
func ConnectNotificationsUserRejectedPN(token string, profile models.Profile) {
	conn, c := connectNotificationsPNs()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	var text string
	if profile.AdminRejectedName {
		text = "Please change your name to a name that identifies you"
		sendPNUserRejected(c, text, token, ctx)
	}
	if profile.AdminRejectedDOB {
		text = "Please add your date of birth to set you with people with your age"
		sendPNUserRejected(c, text, token, ctx)
	}
	if profile.AdminRejectedDistrict {
		text = "Please set your district to match you with people in your area"
		sendPNUserRejected(c, text, token, ctx)
	}
	if profile.AdminRejectedInterests {
		text = "The more interest you add and more specific, the better to find you great matches, please add more"
		sendPNUserRejected(c, text, token, ctx)
	}
	if profile.AdminRejectedPhoto {
		text = "Your photo is not showing a clear view of your face"
		sendPNUserRejected(c, text, token, ctx)
	}
	if profile.AdminRejectedQuestions {
		text = "Please reply to the questions so we can know what you need and give you great matches"
		sendPNUserRejected(c, text, token, ctx)
	}
}

func sendPNUserRejected(c pb.ServicesPushNotificationsClient, text string, token string, ctx context.Context) {
	message := &pb.PNMessageUserRejected{
		Text:  text,
		Token: token,
	}

	r, err := c.PNUserRejected(ctx, message)
	if err != nil {
		log.Printf("PNUserRejected NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("Communications - PN NOT sent - User Rejected", token)
	} else {
		log.Printf("PNUserRejected Sent: %v", r.GetSuccess())
		utils.SegmentTrack("Communications - PN sent - User Rejected", token)
	}
}

// ConnectNotificationsUserNoRejectedPN Connect to the notifications server and send to user no rejected PN
func ConnectNotificationsUserNoRejectedPN(token string) {
	conn, c := connectNotificationsPNs()
	defer conn.Close()

	// ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// defer cancel()

	ctx := context.Background()

	message := &pb.PNMessageUserRejected{
		Text:  "Welcome to Circles, your profile is accepted now.",
		Token: token,
	}

	r, err := c.PNUserRejected(ctx, message)
	if err != nil {
		log.Printf("PNUserRejected NOT Sent: %v, %v", r.GetSuccess(), err)
		utils.SegmentTrack("Communications - PN NOT sent - User Rejected", token)
	} else {
		log.Printf("PNUserRejected Sent: %v", r.GetSuccess())
		utils.SegmentTrack("Communications - PN sent - User Rejected", token)
	}
}
