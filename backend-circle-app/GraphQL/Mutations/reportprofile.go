package muts

import (
	"errors"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	utils "github.com/socotree/backend-circle-app/Utils"
	"github.com/socotree/backend-circle-app/grpc"
)

//ReportProfile Report Profile
func ReportProfile() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.Boolean,
		Description: "Report Profile",
		Args: graphql.FieldConfigArgument{
			"reportedid": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			userDecoded, err := utils.GetUserFromHeader(p.Context.Value("Authentication").(string))
			if err != nil {
				return false, err
			}
			utils.SegmentPage("ReportProfile", userDecoded.ID, "reportProfile")

			if val, ok := p.Args["reportedid"]; ok {
				IDReported := val.(string)
				if len(IDReported) == 0 {
					return false, errors.New("reportedid cant be empty")
				}

				userReporterID, err := uuid.FromString(userDecoded.ID)
				if err != nil {
					return nil, err
				}
				userReporter, err := dal.ReadUserWithProfile(&userReporterID)
				if err != nil {
					return nil, err
				}

				userReportedID, err := uuid.FromString(IDReported)
				if err != nil {
					return nil, err
				}
				userReported, err := dal.ReadUserWithProfile(&userReportedID)
				if err != nil {
					return nil, err
				}

				utils.SegmentTrack("Report Profile", userDecoded.ID)

				return grpc.ConnectNotificationsReportProfileEmail(
					userReporter.Profile.Name, userDecoded.ID, userReported.Profile.Name, IDReported), nil
			}
			return false, errors.New("reportedid cant be empty")
		},
	}
}
