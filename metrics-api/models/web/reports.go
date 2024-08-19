package web

type ReportRequest struct {
	Report       string `json:"report"`
	ReportType   string `json:"reportType"`
	ReportPeriod uint   `json:"reportPeriod"`
	StartDate    string `json:"startDate"`
	EndDate      string `json:"endDate,omitempty"`
	IncludeDaily bool   `json:"includeDaily"`
}
