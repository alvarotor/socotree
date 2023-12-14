package muts

import (
	"errors"
	"time"

	"github.com/graphql-go/graphql"
	uuid "github.com/satori/go.uuid"
	dal "github.com/socotree/backend-circle-app/DAL"
	types "github.com/socotree/backend-circle-app/GraphQL/Types"
	models "github.com/socotree/backend-circle-app/Models"
	utils "github.com/socotree/backend-circle-app/Utils"
)

//CreateEvent Create Event
func CreateEvent() *graphql.Field {
	return &graphql.Field{
		Type:        types.EventType("Create"),
		Description: "Create event",
		Args: graphql.FieldConfigArgument{
			"name": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"location": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"description": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"smalldescription": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"year": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"month": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"day": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"hour": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"minute": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"addrestusers": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"recircle": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"circlesize": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"age": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"prematch": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"lang": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"notify": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"type": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"questionsweight": &graphql.ArgumentConfig{
				Type: graphql.Float,
			},
			"link": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can create events")
			}

			var description string
			if val, ok := p.Args["description"]; ok {
				description = val.(string)
			}

			var smalldescription string
			if val, ok := p.Args["smalldescription"]; ok {
				smalldescription = val.(string)
			}

			var link string
			if val, ok := p.Args["link"]; ok {
				link = val.(string)
			}

			loc, err := time.LoadLocation("Europe/Berlin") //p.Args["location"].(string)
			if err != nil {
				return nil, err
			}
			t := time.Date(p.Args["year"].(int), time.Month(p.Args["month"].(int)), p.Args["day"].(int), p.Args["hour"].(int), p.Args["minute"].(int), 0, 0, loc)
			tUTC := t.UTC()

			event := models.Event{
				Name:             p.Args["name"].(string),
				Location:         p.Args["location"].(string),
				Description:      description,
				SmallDescription: smalldescription,
				Link:             link,
				EventTime: &models.EventTime{
					Year:   p.Args["year"].(int),
					Month:  p.Args["month"].(int),
					Day:    p.Args["day"].(int),
					Hour:   tUTC.Hour(),
					Minute: p.Args["minute"].(int),
				},
				AddRestUsers:    p.Args["addrestusers"].(bool),
				ReCircle:        p.Args["recircle"].(bool),
				CircleSize:      p.Args["circlesize"].(int),
				Type:            p.Args["type"].(int),
				Age:             p.Args["age"].(bool),
				PreMatch:        p.Args["prematch"].(bool),
				Lang:            p.Args["lang"].(bool),
				Notify:          p.Args["notify"].(bool),
				QuestionsWeight: float32(p.Args["questionsweight"].(float64)),
			}
			err = dal.AddEvent(&event)
			if err != nil {
				return nil, err
			}

			event.UUID = event.ID.String()
			event.Created = event.CreatedAt.String()

			return event, nil
		},
	}
}

//DeleteEvent Delete Event
func DeleteEvent() *graphql.Field {
	return &graphql.Field{
		Type:        graphql.String,
		Description: "Delete event by id",
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can delete events")
			}

			uuid, err := uuid.FromString(p.Args["id"].(string))
			if err != nil {
				return nil, err
			}

			circles, err := dal.ReadCirclesByEvent(p.Args["id"].(string))
			if err != nil {
				return nil, err
			}
			if len(circles) > 0 {
				return nil, errors.New("cannot delete events with circles created")
			}

			model, err := dal.ReadEvent(&uuid)
			if err != nil {
				return nil, err
			}

			err = dal.DeleteEvent(&model.ID)
			if err != nil {
				return nil, err
			}
			return "Bye " + uuid.String(), nil
		},
	}
}

//UpdateEvent Update Event
func UpdateEvent() *graphql.Field {
	return &graphql.Field{
		Type:        types.EventType("Update"),
		Description: "Update event by uuid",
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"name": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"location": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"description": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"smalldescription": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
			"year": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"month": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"day": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"hour": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"minute": &graphql.ArgumentConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"addrestusers": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"recircle": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"circlesize": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"age": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"prematch": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"lang": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"notify": &graphql.ArgumentConfig{
				Type: graphql.Boolean,
			},
			"type": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
			"questionsweight": &graphql.ArgumentConfig{
				Type: graphql.Float,
			},
			"link": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			if !utils.IsAdminFromHeader(p.Context.Value("Authentication").(string)) {
				return nil, errors.New("only admins can update events")
			}

			uuid, err := uuid.FromString(p.Args["id"].(string))
			if err != nil {
				return nil, err
			}

			event, err := dal.ReadEventWithTime(&uuid)
			if err != nil {
				return nil, err
			}

			if event.EventTime == nil {
				event.EventTime = &models.EventTime{EventID: event.ID}
			}

			if val, ok := p.Args["name"]; ok {
				event.Name = val.(string)
			}
			if val, ok := p.Args["location"]; ok {
				event.Location = val.(string)
			}
			if val, ok := p.Args["description"]; ok {
				event.Description = val.(string)
			}
			if val, ok := p.Args["smalldescription"]; ok {
				event.SmallDescription = val.(string)
			}
			if val, ok := p.Args["year"]; ok {
				event.EventTime.Year = val.(int)
			}
			if val, ok := p.Args["month"]; ok {
				event.EventTime.Month = val.(int)
			}
			if val, ok := p.Args["day"]; ok {
				event.EventTime.Day = val.(int)
			}
			if val, ok := p.Args["hour"]; ok {
				event.EventTime.Hour = val.(int)
			}
			if val, ok := p.Args["minute"]; ok {
				event.EventTime.Minute = val.(int)
			}
			if val, ok := p.Args["addrestusers"]; ok {
				event.AddRestUsers = val.(bool)
			}
			if val, ok := p.Args["recircle"]; ok {
				event.ReCircle = val.(bool)
			}
			if val, ok := p.Args["circlesize"]; ok {
				event.CircleSize = val.(int)
			}
			if val, ok := p.Args["age"]; ok {
				event.Age = val.(bool)
			}
			if val, ok := p.Args["prematch"]; ok {
				event.PreMatch = val.(bool)
			}
			if val, ok := p.Args["notify"]; ok {
				event.Notify = val.(bool)
			}
			if val, ok := p.Args["lang"]; ok {
				event.Lang = val.(bool)
			}
			if val, ok := p.Args["type"]; ok {
				event.Type = val.(int)
			}
			if val, ok := p.Args["questionsweight"]; ok {
				event.QuestionsWeight = float32(val.(float64))
			}
			if val, ok := p.Args["link"]; ok {
				event.Link = val.(string)
			}

			loc, err := time.LoadLocation("Europe/Berlin") //p.Args["location"].(string)
			if err != nil {
				return nil, err
			}
			t := time.Date(event.EventTime.Year, time.Month(event.EventTime.Month), event.EventTime.Day, event.EventTime.Hour, event.EventTime.Minute, 0, 0, loc)
			tUTC := t.UTC()
			event.EventTime.Hour = tUTC.Hour()

			err = dal.UpdateEvent(&event)
			if err != nil {
				return nil, err
			}

			event.UUID = event.ID.String()
			event.Created = event.CreatedAt.String()
			event.Updated = event.UpdatedAt.String()

			return event, nil
		},
	}
}
