package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/erneap/metrics3/metrics-api/models/web"
	"github.com/erneap/models/v2/config"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

// methods for purging old mission and outage data
func PurgeMissions(c *gin.Context) {
	mDate := c.Param("msndate")
	msndate, err := time.ParseInLocation("2006-01-02", mDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Problem with purge date: " + err.Error()})
		return
	}
	filter := bson.M{"missionDate": bson.M{"$lt": msndate}}
	_, err = config.GetCollection(config.DB, "metrics2", "missions").DeleteMany(
		context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Problem Purging Records: " +
			err.Error()})
		return
	}
	c.JSON(http.StatusOK, web.Message{Message: "Mission Purge complete"})
}

func PurgeOutages(c *gin.Context) {
	mDate := c.Param("msndate")
	msndate, err := time.ParseInLocation("2006-01-02", mDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Problem with purge date: " + err.Error()})
		return
	}
	filter := bson.M{"missionDate": bson.M{"$lt": msndate}}
	_, err = config.GetCollection(config.DB, "metrics2", "outages").DeleteMany(
		context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.Message{Message: "Problem Purging Records: " +
			err.Error()})
		return
	}
	c.JSON(http.StatusOK, web.Message{Message: "Ground Outage Purge complete"})
}
