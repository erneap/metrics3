package web

import "github.com/erneap/models/v2/metrics"

type OutageResponse struct {
	Outage    metrics.GroundOutage `json:"outage,omitempty"`
	Exception string               `json:"exception,omitempty"`
}

type OutagesResponse struct {
	Outages   []metrics.GroundOutage `json:"outages,omitempty"`
	Exception string                 `json:"exception,omitempty"`
}
