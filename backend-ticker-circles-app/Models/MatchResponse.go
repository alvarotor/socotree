package models

type MatchResponse struct {
	Circles    int    `json:"circles"`
	Success    bool   `json:"success"`
	TotalUsers int    `json:"total_users"`
	Message    string `json:"message"`
}
