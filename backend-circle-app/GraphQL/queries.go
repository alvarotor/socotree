package graphql

import (
	"github.com/graphql-go/graphql"
	qs "github.com/socotree/backend-circle-app/GraphQL/Queries"
)

// queries system
func queries() *graphql.Object {
	return graphql.NewObject(
		graphql.ObjectConfig{
			Name: "event_queries",
			Fields: graphql.Fields{
				// Event
				"events":         qs.GetEventsQuery(),
				"event":          qs.GetEventByIDQuery(),
				"eventQuestions": qs.GetQuestionsByEventIDQuery(),
				// User
				"usersByAdmin": qs.GetAllUsersQuery(),
				"user":         qs.GetUserQuery(),
				"userByAdmin":  qs.GetUserByAdminQuery(),
				"existUser":    qs.ExistUserQuery(),
				// Login
				"login": qs.LoginQuery(),
				// Event
				"getUserRegisteredEvents": qs.GetUserRegisteredEventsQuery(),
				// EventJoin
				"eventJoinUsersByAdmin": qs.GetEventJoinedByAdminQuery(),
				"userExistsEventJoined": qs.GetUserExistEventJoinedQuery(),
				// EventRegister
				"eventRegisterUsersByAdmin": qs.GetEventRegisteredUsersByAdminQuery(),
				"userExistsEventRegistered": qs.GetUserExistEventRegisteredQuery(),
				// Circle
				"circlesByAdmin":              qs.GetCirclesByAdminQuery(),
				"notifyMatchedCirclesByAdmin": qs.NotifyMatchedCirclesByAdminQuery(),
				"circle":                      qs.GetCircleByIDQuery(),
				"circlesByUser":               qs.GetCirclesByUserQuery(),
				// Message
				"messages":        qs.GetMessagesQuery(),
				"messagesByAdmin": qs.GetMessagesByAdminQuery(),
				// Question
				"questions": qs.GetAllQuestionsQuery(),
				"question":  qs.GetQuestionByIDQuery(),
				// User answer
				"readUserAnswers":         qs.GetUserAnswersQuery(),
				"readEventAnswersMatches": qs.GetAllEventAnswersMatch(),
				// Interest
				"interests": qs.GetAllInterestsQuery(),
				"interest":  qs.GetInterestQuery(),
				//Updated Version
				"updatedVersion": qs.UpdatedVersionQuery(),
			},
		},
	)
}
