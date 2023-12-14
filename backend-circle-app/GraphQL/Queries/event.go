package qs

import (
	"errors"
	"log"
	"sort"
	"time"

	"github.com/graphql-go/graphql"
	ast "github.com/graphql-go/graphql/language/ast"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//GetEventsQuery Get Events Query
func GetEventsQuery() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.NewList(types.EventType("")),
		Description: "Get all Events",
		Args: graphql.FieldConfigArgument{
			"filterOlds": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			filter, ok := p.Args["filterOlds"].(bool)
			if !ok {
				return nil, errors.New("Must provide filterOlds")
			}

			var events []models.Event
			var err error
			valuesQuery := getSelectedFields([]string{"events"}, p)
			if utils.ArrayContains(valuesQuery, "eventtime") && len(getSelectedFields([]string{"events", "eventtime"}, p)) > 0 {
				events, err = dal.ReadEvents()

				if filter {
					//filter events removing old ones
					loc, err := time.LoadLocation("UTC") //p.Args["location"].(string)
					if err != nil {
						return nil, err
					}
					now := time.Now().UTC()
					myFilter := func(s models.Event) bool {
						t := time.Date(s.EventTime.Year, time.Month(s.EventTime.Month), s.EventTime.Day, s.EventTime.Hour, s.EventTime.Minute, 0, 0, loc)
						sUTC := t.UTC()
						// log.Println(s.EventTime.Year, time.Month(s.EventTime.Month), s.EventTime.Day, s.EventTime.Hour, s.EventTime.Minute, sUTC.After(now))
						return sUTC.After(now)
					}
					actualEvents := filterOldEvents(events, myFilter)
					events = actualEvents
				}

				//order the events
				sort.SliceStable(events, func(i, j int) bool {
					if events[i].EventTime.Year < events[j].EventTime.Year {
						return true
					}
					if events[i].EventTime.Year > events[j].EventTime.Year {
						return false
					}
					if events[i].EventTime.Month < events[j].EventTime.Month {
						return true
					}
					if events[i].EventTime.Month > events[j].EventTime.Month {
						return false
					}
					if events[i].EventTime.Day < events[j].EventTime.Day {
						return true
					}
					if events[i].EventTime.Day > events[j].EventTime.Day {
						return false
					}
					if events[i].EventTime.Hour < events[j].EventTime.Hour {
						return true
					}
					if events[i].EventTime.Hour > events[j].EventTime.Hour {
						return false
					}
					return events[i].EventTime.Minute < events[j].EventTime.Minute
				})
			} else {
				events, err = dal.ReadEventsNoTime()
			}
			if err != nil {
				return nil, err
			}

			for key, value := range events {
				events[key].Created = value.CreatedAt.Format(time.RFC3339)
				events[key].Updated = value.UpdatedAt.Format(time.RFC3339)
				events[key].UUID = value.ID.String()
			}

			return events, nil
		},
	}
}

//GetEventByIDQuery Get Event By ID Query
func GetEventByIDQuery() *graphql.Field {
	return &graphql.Field{
		Type:        types.EventType("Single"),
		Description: "Get a single event by id",
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			id, ok := p.Args["id"].(string)
			if !ok {
				return nil, errors.New("must provide id")
			}

			var err error
			u, err := uuid.FromString(id)
			if err != nil {
				return nil, err
			}

			var event models.Event
			valuesQuery := getSelectedFields([]string{"event"}, p)
			if utils.ArrayContains(valuesQuery, "eventtime") ||
				utils.ArrayContains(valuesQuery, "eventjoin") ||
				utils.ArrayContains(valuesQuery, "eventquestion") ||
				utils.ArrayContains(valuesQuery, "eventregister") {
				event, err = dal.ReadEvent(&u)
				log.Println("all fields")
			} else {
				event, err = dal.ReadEventNoTime(&u)
				log.Println("no fields")
			}
			if err != nil {
				return nil, err
			}

			for key, value := range event.EventQuestion {
				for keyQ, valueQ := range value.Question.Answers {
					event.EventQuestion[key].Question.Answers[keyQ].UUID = valueQ.ID.String()
				}
			}

			event.Created = event.CreatedAt.Format(time.RFC3339)
			event.Updated = event.UpdatedAt.Format(time.RFC3339)
			event.UUID = event.ID.String()

			return event, nil
		},
	}
}

// []string{"events"} Would give you the direct names of root children
// []string{"events", "time"} Would give you the direct names of the children of "time"
func getSelectedFields(selectionPath []string, resolveParams graphql.ResolveParams) []string {
	fields := resolveParams.Info.FieldASTs
	for _, propName := range selectionPath {
		found := false
		for _, field := range fields {
			if field.Name.Value == propName {
				selections := field.SelectionSet.Selections
				fields = make([]*ast.Field, 0)
				for _, selection := range selections {
					fields = append(fields, selection.(*ast.Field))
				}
				found = true
				break
			}
		}
		if !found {
			return []string{}
		}
	}
	var collect []string
	for _, field := range fields {
		collect = append(collect, field.Name.Value)
	}
	return collect
}

func filterOldEvents(ss []models.Event, test func(models.Event) bool) (ret []models.Event) {
	for _, s := range ss {
		if test(s) {
			ret = append(ret, s)
		}
	}
	return
}
