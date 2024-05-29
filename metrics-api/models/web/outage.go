package web

import (
	"github.com/erneap/metrics3/metrics-api/models/interfaces"
)

type OutageResponse struct {
	Outage    interfaces.GroundOutage `json:"outage,omitempty"`
	Exception string                  `json:"exception,omitempty"`
}

type OutagesResponse struct {
	Outages   []interfaces.GroundOutage `json:"outages,omitempty"`
	Exception string                    `json:"exception,omitempty"`
}
