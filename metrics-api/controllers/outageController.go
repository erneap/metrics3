package controllers

import (
	"context"
	"net/http"
	"sort"
	"strings"
	"time"

	"github.com/erneap/metrics3/metrics-api/models/web"
	"github.com/erneap/models/v2/config"
	"github.com/erneap/models/v2/metrics"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetAllOutages(c *gin.Context) {
	var toutages []metrics.GroundOutage

	cursor, err := config.GetCollection(config.DB, "metrics2", "outages").Find(context.TODO(),
		bson.M{})
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutagesResponse{Exception: err.Error()})
		return
	}

	if err = cursor.All(context.TODO(), &toutages); err != nil {
		c.JSON(http.StatusNotFound, web.OutagesResponse{Exception: err.Error()})
		return
	}

	var outages []metrics.GroundOutage
	for _, outage := range toutages {
		//outage.Decrypt()
		outages = append(outages, outage)
	}

	c.JSON(http.StatusOK, web.OutagesResponse{Outages: outages})
}

func GetAllOutagesByDate(c *gin.Context) {
	outDate := c.Param("date")

	startDate, err := time.ParseInLocation("2006-01-02", outDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutagesResponse{Exception: err.Error()})
		return
	}
	endDate := startDate.Add(24 * time.Hour)

	filter := bson.M{"outageDate": bson.M{"$gte": startDate, "$lt": endDate}}

	var tOutages, outages []metrics.GroundOutage
	cursor, err := config.GetCollection(config.DB, "metrics2", "outages").Find(context.TODO(),
		filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutagesResponse{Exception: err.Error()})
		return
	}

	if err = cursor.All(context.TODO(), &tOutages); err != nil {
		c.JSON(http.StatusNotFound, web.OutagesResponse{Exception: err.Error()})
		return
	}

	for _, outage := range tOutages {
		//outage.Decrypt()
		outages = append(outages, outage)
	}

	c.JSON(http.StatusOK, web.OutagesResponse{Outages: outages})
}

func GetAllOutagesByWeek(c *gin.Context) {
	sDate := c.Param("start")

	startDate, err := time.ParseInLocation("2006-01-02", sDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutagesResponse{Exception: err.Error()})
		return
	}
	endDate := startDate.AddDate(0, 0, 7)

	filter := bson.M{"outageDate": bson.M{"$gte": startDate, "$lt": endDate}}

	var tOutages, outages []metrics.GroundOutage
	cursor, err := config.GetCollection(config.DB, "metrics2", "outages").Find(context.TODO(),
		filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutagesResponse{Exception: err.Error()})
		return
	}

	if err = cursor.All(context.TODO(), &tOutages); err != nil {
		c.JSON(http.StatusNotFound, web.OutagesResponse{Exception: err.Error()})
		return
	}

	for _, outage := range tOutages {
		//outage.Decrypt()
		outages = append(outages, outage)
	}

	c.JSON(http.StatusOK, web.OutagesResponse{Outages: outages})
}

func GetAllOutagesByPeriod(c *gin.Context) {
	sDate := c.Param("start")
	eDate := c.Param("end")

	startDate, err := time.ParseInLocation("2006-01-02", sDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutagesResponse{Exception: err.Error()})
		return
	}
	endDate, err := time.ParseInLocation("2006-01-02 15:04:05", eDate+" 23:59:59",
		time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutagesResponse{Exception: err.Error()})
		return
	}

	filter := bson.M{"outageDate": bson.M{"$gte": startDate, "$lte": endDate}}

	var tOutages, outages []metrics.GroundOutage
	cursor, err := config.GetCollection(config.DB, "metrics2", "outages").Find(context.TODO(),
		filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutagesResponse{Exception: err.Error()})
		return
	}

	if err = cursor.All(context.TODO(), &tOutages); err != nil {
		c.JSON(http.StatusNotFound, web.OutagesResponse{Exception: err.Error()})
		return
	}

	for _, outage := range tOutages {
		//outage.Decrypt()
		outages = append(outages, outage)
	}

	sort.Sort(metrics.ByOutage(outages))

	c.JSON(http.StatusOK, web.OutagesResponse{Outages: outages})
}

func GetAllOutagesBySystem(c *gin.Context) {
	system := c.Param("system")

	filter := bson.M{"groundSystem": system}

	var tOutages, outages []metrics.GroundOutage
	cursor, err := config.GetCollection(config.DB, "metrics2", "outages").Find(context.TODO(),
		filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutagesResponse{Exception: err.Error()})
		return
	}

	if err = cursor.All(context.TODO(), &tOutages); err != nil {
		c.JSON(http.StatusNotFound, web.OutagesResponse{Exception: err.Error()})
		return
	}

	for _, outage := range tOutages {
		//outage.Decrypt()
		outages = append(outages, outage)
	}

	c.JSON(http.StatusOK, outages)
}

func GetOutage(c *gin.Context) {
	id := c.Param("id")
	oId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutageResponse{Exception: err.Error()})
		return
	}

	filter := bson.M{"_id": oId}

	var outage metrics.GroundOutage
	err = config.GetCollection(config.DB, "metrics2", "outages").FindOne(context.TODO(),
		filter).Decode(&outage)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutageResponse{Exception: err.Error()})
		return
	}
	//outage.Decrypt()

	c.JSON(http.StatusOK, web.OutageResponse{Outage: outage})
}

func CreateOutage(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var data metrics.GroundOutage
	defer cancel()

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.Message{Message: "Trouble with request"})
		return
	}
	data.ID = primitive.NewObjectID()
	//data.Encrypt()

	_, err := config.GetCollection(config.DB, "metrics2", "outages").InsertOne(ctx, data)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutageResponse{Exception: err.Error()})
		return
	}
	c.JSON(http.StatusOK, web.OutageResponse{Outage: data})
}

func UpdateOutage(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var data web.UpdateRequest
	defer cancel()

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.OutageResponse{Exception: "Trouble with request"})
		return
	}

	oId, err := primitive.ObjectIDFromHex(data.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			web.OutageResponse{Exception: "Trouble with request: " + err.Error()})
		return
	}

	filter := bson.M{"_id": oId}
	var outage metrics.GroundOutage
	err = config.GetCollection(config.DB, "metrics2", "outages").FindOne(ctx, filter).
		Decode(&outage)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			web.OutageResponse{Exception: "Database Problem: " + err.Error()})
		return
	}
	//outage.Decrypt()

	switch strings.ToLower(data.Field) {
	case "date", "outagedate":
		outage.OutageDate, _ = time.ParseInLocation("2006-01-02",
			data.StringValue(), time.UTC)
	case "ground", "system", "groundsystem":
		outage.GroundSystem = data.StringValue()
	case "classification", "enclave":
		outage.Classification = data.StringValue()
	case "number", "outagenumber":
		outage.OutageNumber = data.NumberValue()
	case "minutes", "outageminutes":
		outage.OutageMinutes = data.NumberValue()
	case "subsystem":
		outage.Subsystem = data.StringValue()
	case "reference", "referenceid", "serena":
		outage.ReferenceID = data.StringValue()
	case "major", "majorsystem":
		outage.MajorSystem = data.StringValue()
	case "problem":
		outage.Problem = data.StringValue()
	case "fixaction":
		outage.FixAction = data.StringValue()
	case "mission", "missionoutage":
		outage.MissionOutage = data.BooleanValue()
	case "capability":
		outage.Capability = data.StringValue()
	default:
		c.JSON(http.StatusBadRequest, web.OutageResponse{Exception: "Unknown Field"})
		return
	}
	//outage.Encrypt()

	_, err = config.GetCollection(config.DB, "metrics2", "outages").ReplaceOne(ctx,
		filter, outage)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.OutageResponse{Exception: err.Error()})
		return
	}
	c.JSON(http.StatusOK, web.OutageResponse{Outage: outage})
}

func DeleteOutage(c *gin.Context) {
	id := c.Param("id")
	oId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			web.OutageResponse{Exception: "Trouble with request: " + err.Error()})
		return
	}

	filter := bson.M{"_id": oId}

	_, err = config.GetCollection(config.DB, "metrics2", "outages").DeleteOne(
		context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			web.OutageResponse{Exception: "Trouble with request: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, web.OutageResponse{Exception: "Outage deleted"})
}
