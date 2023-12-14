package graphql

import (
	"github.com/graphql-go/graphql"
	muts "github.com/socotree/backend-circle-app/GraphQL/Mutations"
)

// mutations system
func mutations() *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "event_mutations",
			Fields: graphql.Fields{
				// Event
				"createEvent":         muts.CreateEvent(),
				"deleteEvent":         muts.DeleteEvent(),
				"updateEvent":         muts.UpdateEvent(),
				"createEventQuestion": muts.CreateEventQuestion(),
				"deleteEventQuestion": muts.DeleteEventQuestion(),
				// User
				"createUser":                     muts.CreateUser(),
				"updateUser":                     muts.UpdateUser(),
				"updatePassword":                 muts.UpdatePassword(),
				"deleteUser":                     muts.DeleteUser(),
				"updateUserAdminByAdmin":         muts.UpdateUserAdminByAdmin(),
				"updateUserAdminVerifiedByAdmin": muts.UpdateUserAdminVerifiedByAdmin(),
				"updateUserAdminRejectedByAdmin": muts.UpdateUserAdminRejectedByAdmin(),
				"updateInterestAdminVerified":    muts.UpdateInterestAdminVerified(),
				"blockProfile":                   muts.BlockProfile(),
				"unblockProfile":                 muts.UnblockProfile(),
				"verifyUserEmail":                muts.VerifyUserEmail(),
				"resendVerifyUserEmail":          muts.ReSendVerifyUserEmail(),
				"forgotPassword":                 muts.ForgotPassword(),
				"resetPassword":                  muts.ResetPassword(),
				// EventJoin
				"setUserEventJoin":        muts.SetUserToEventJoined(),
				"setUserEventJoinByAdmin": muts.SetUserToEventJoinedByAdmin(),
				// EventRegister
				"setUserEventRegister": muts.SetUserToEventRegister(),
				// // Migration
				// "migrateTables": muts.MigrateTables(),
				// Circle
				"createCircle":              muts.CreateCircle(),
				"deleteUserInCircle":        muts.DeleteUserInCircle(),
				"deleteUserInCircleByAdmin": muts.DeleteUserInCircleByAdmin(),
				"deleteCircleByAdmin":       muts.DeleteCircleByAdmin(),
				// Question
				"createQuestion":          muts.CreateQuestion(),
				"createQuestionsAnswer":   muts.CreateQuestionsAnswer(),
				"deleteQuestionsAnswer":   muts.DeleteQuestionsAnswer(),
				"deleteQuestion":          muts.DeleteQuestion(),
				"updateQuestionsAnswer":   muts.UpdateQuestionsAnswer(),
				"updateQuestion":          muts.UpdateQuestion(),
				"createUserAnswers":       muts.CreateUserAnswers(),
				"createEventAnswersMatch": muts.CreateEventAnswersMatch(),
				"deleteEventAnswersMatch": muts.DeleteEventAnswersMatch(),
				"deleteUserAnswers":       muts.DeleteUserAnswers(),
				// "deleteUserAnswer":        muts.DeleteUserAnswer(),
				// Interest
				"createInterest":      muts.CreateInterest(),
				"deleteInterest":      muts.DeleteInterest(),
				"updateInterest":      muts.UpdateInterest(),
				"createUserInterests": muts.CreateUserInterests(),
				"deleteUserInterests": muts.DeleteUserInterests(),
				// Report Profile
				"reportprofile": muts.ReportProfile(),
				// Messages
				"message": muts.CreateMessage(),
				// System
				"updatedVersion": muts.UpdatedVersion(),
				"notifyCircles":  muts.NotifyCircles(),
			},
		},
	)
}
