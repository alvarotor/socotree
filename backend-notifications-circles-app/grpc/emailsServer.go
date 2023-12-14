package grpc

import (
	"context"
	"log"
	"strings"

	notifications "github.com/socotree/backend-notifications-circles-app/Notifications"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

//ServerEmails gRPC Email Server
type ServerEmails struct {
	UnimplementedServicesEmailsServer
}

//EmailForgottenPassword Send Emails to people with forgotten password
func (s *ServerEmails) EmailForgottenPassword(ctx context.Context, user *Email) (*Response, error) {
	log.Printf("GRPC Notifications - Received email name: %s", user.GetName())
	err := checkUser(user)
	if err != nil {
		log.Printf("GRPC Notifications - checkUser: %v", err)
		return &Response{Success: false}, err
	}
	err = checkUserCode(user)
	if err != nil {
		log.Printf("GRPC Notifications - checkUserCode: %v", err)
		return &Response{Success: false}, err
	}
	err = notifications.MailForgotPasswordUser(user.GetEmail(), user.GetName(), user.GetCode())
	if err != nil {
		log.Printf("GRPC Notifications - MailForgotPasswordUser: %v", err)
		return &Response{Success: false}, err
	}
	return &Response{Success: true}, nil
}

//EmailVerifyUserEmail Pass user data to very email
func (s *ServerEmails) EmailVerifyUserEmail(ctx context.Context, user *Email) (*Response, error) {
	log.Printf("GRPC Notifications - Received user email to verify: %s", user.GetEmail())
	user.Name = "fake name for verify email does not need name"
	err := checkUser(user)
	if err != nil {
		log.Printf("GRPC Notifications - checkUser: %v", err)
		return &Response{Success: false}, err
	}
	err = checkUserCode(user)
	if err != nil {
		log.Printf("GRPC Notifications - checkUserCode: %v", err)
		return &Response{Success: false}, err
	}
	err = notifications.MailVerifyUserEmail(user.GetEmail(), user.GetCode())
	if err != nil {
		log.Printf("GRPC Notifications - MailVerifyUserEmail: %v", err)
		return &Response{Success: false}, err
	}
	return &Response{Success: true}, nil
}

//EmailInterestsAdmin Pass the new interest to the methog to send an email to admins
func (s *ServerEmails) EmailInterestsAdmin(ctx context.Context, interest *EmailInterest) (*Response, error) {
	log.Printf("GRPC Notifications - Received interest name for admin: %s", interest.GetName())
	err := notifications.MailNewUserInterest(interest.GetName())
	if err != nil {
		log.Printf("GRPC Notifications - MailNewUserInterest: %v", err)
		return &Response{Success: false}, err
	}
	log.Printf("GRPC Notifications - Sent email interest for admin: %s", interest.GetName())
	return &Response{Success: true}, nil
}

func checkUser(user *Email) error {
	if len(user.GetName()) == 0 {
		return status.Errorf(codes.InvalidArgument,
			"Length of `Name` must be more than 0 characters")
	}
	if !strings.Contains(user.GetEmail(), "@") || !strings.Contains(user.GetEmail(), ".") {
		return status.Errorf(codes.InvalidArgument,
			"`Email` must contain '@' and '.' characters")
	}
	return nil
}

func checkUserCode(user *Email) error {
	if user.GetCode() < 1000 || user.GetCode() > 9999 {
		return status.Errorf(codes.InvalidArgument,
			"`Code` must be more than 1000 and less than 9999")
	}
	return nil
}

//EmailUserNewCircle Send email with a user new circle
func (s *ServerEmails) EmailUserNewCircle(ctx context.Context, user *Email) (*Response, error) {
	log.Printf("GRPC Notifications - Received user name for new circle: %s", user.GetName())
	err := checkUser(user)
	if err != nil {
		log.Printf("GRPC Notifications - checkUser: %v", err)
		return &Response{Success: false}, err
	}
	err = notifications.MailNewCircleSend(user.GetEmail(), user.GetName())
	if err != nil {
		log.Printf("GRPC Notifications - MailNewCircleSend: %v", err)
		return &Response{Success: false}, err
	}
	return &Response{Success: true}, nil
}

//EmailUserVerified Send email with a user verified info
func (s *ServerEmails) EmailUserVerified(ctx context.Context, user *Email) (*Response, error) {
	log.Printf("GRPC Notifications - Received user name for user verified: %s", user.GetName())
	err := checkUser(user)
	if err != nil {
		log.Printf("GRPC Notifications - checkUser: %v", err)
		return &Response{Success: false}, err
	}
	err = notifications.MailUserVerified(user.GetEmail(), user.GetName())
	if err != nil {
		log.Printf("GRPC Notifications - MailUserVerified: %v", err)
		return &Response{Success: false}, err
	}
	return &Response{Success: true}, nil
}

//EmailReportProfile Send email with a user verified info
func (s *ServerEmails) EmailReportProfile(ctx context.Context, msg *MessageReportProfile) (*Response, error) {
	log.Printf("GRPC Notifications - Received user name for report profile: %s", msg.GetNameReported())
	err := notifications.MailReportProfileSend(
		msg.GetNameReporter(), msg.GetIDReporter(), msg.GetNameReported(), msg.GetIDReported())
	if err != nil {
		log.Printf("GRPC Notifications - MailReportProfileSend: %v", err)
		return &Response{Success: false}, err
	}
	return &Response{Success: true}, nil
}

//EmailReportProfile Send email with a user verified info
func (s *ServerEmails) EmailAdmin(ctx context.Context, msg *EmailAdminRequest) (*Response, error) {
	log.Printf("GRPC Notifications - EmailAdmin: %s - %s", msg.GetSubject(), msg.GetText())
	err := notifications.MailAdminSend(msg.GetSubject(), msg.GetText())
	if err != nil {
		log.Printf("GRPC Notifications - MailAdminSend: %v", err)
		return &Response{Success: false}, err
	}
	return &Response{Success: true}, nil
}
