package main

import (
	"context"
	"log"
	"strings"
	"time"

	v1metrics "github.com/erneap/go-models/metrics"
	v1sysdata "github.com/erneap/go-models/systemdata"
	v2config "github.com/erneap/models/v2/config"
	v2metrics "github.com/erneap/models/v2/metrics"
	v2sysdata "github.com/erneap/models/v2/systemdata"
	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	// run database
	v2config.ConnectDB()

	// get version 1 missions
	var missions1 []v1metrics.Mission
	filter := bson.M{}
	cursor, err := v2config.GetCollection(v2config.DB, "metrics", "missions").Find(context.TODO(),
		filter)
	if err != nil {
		log.Fatalln(err)
	}

	if err = cursor.All(context.TODO(), &missions1); err != nil {
		log.Fatalln(err)
	}

	// convert to version 2 missions
	apsPlusDate := time.Date(2025, 1, 1, 9, 0, 0, 0, time.UTC)
	missions2 := make([]v2metrics.Mission, 0)
	for _, msn := range missions1 {
		msn.Decrypt()
		msn2 := new(v2metrics.Mission)
		msn2.ID = msn.ID
		msn2.MissionDate = msn.MissionDate
		msn2.PlatformID = msn.PlatformID
		msn2.SortieID = msn.SortieID
		msn2.Exploitation = msn.MissionData.Exploitation
		msn2.TailNumber = msn.MissionData.TailNumber
		msn2.Communications = msn.MissionData.Communications
		msn2.PrimaryDCGS = msn.MissionData.PrimaryDCGS
		msn2.Cancelled = msn.MissionData.Cancelled
		msn2.Executed = msn.MissionData.Executed
		msn2.Aborted = msn.MissionData.Aborted
		msn2.IndefDelay = msn.MissionData.IndefDelay
		msn2.MissionOverlap = msn.MissionData.MissionOverlap
		msn2.Comments = msn.MissionData.Comments

		for _, sensor := range msn.MissionData.Sensors {
			sen := new(v2metrics.MissionSensor)
			sen.SensorID = sensor.SensorID
			sen.SensorType = v2sysdata.GeneralTypes(sensor.SensorType)
			sen.PreflightMinutes = sensor.PreflightMinutes
			sen.ScheduledMinutes = sensor.ScheduledMinutes
			sen.ExecutedMinutes = sensor.ExecutedMinutes
			sen.PostflightMinutes = sensor.PostflightMinutes
			sen.AdditionalMinutes = sensor.AdditionalMinutes
			sen.FinalCode = sensor.FinalCode
			sen.KitNumber = sensor.KitNumber
			sen.SensorOutage = v2metrics.MissionSensorOutage{
				TotalOutageMinutes:     sensor.SensorOutage.TotalOutageMinutes,
				PartialLBOutageMinutes: sensor.SensorOutage.PartialLBOutageMinutes,
				PartialHBOutageMinutes: sensor.SensorOutage.PartialHBOutageMinutes,
			}
			sen.GroundOutage = sensor.GroundOutage
			sen.HasHap = sensor.HasHap
			sen.TowerID = sensor.TowerID
			sen.SortID = sensor.SortID
			sen.Comments = sensor.Comments
			for _, imgType := range sensor.Images {
				img := getImageType(imgType)
				sen.Images = append(sen.Images, img)
			}
			sen.CheckedEquipment = append(sen.CheckedEquipment, "aps")
			if msn2.MissionDate.After(apsPlusDate) && strings.EqualFold(sen.SensorID, "pme3") {
				sen.CheckedEquipment = append(sen.CheckedEquipment, "aps+")
			}
			msn2.Sensors = append(msn2.Sensors, *sen)
		}
		missions2 = append(missions2, *msn2)
	}

	// write to version 2 database (metrics2)
	//var tmsn v2metrics.Mission
	for _, msn := range missions2 {
		filter := bson.M{"_id": msn.ID}
		result := v2config.GetCollection(v2config.DB, "metrics2", "missions").FindOne(context.TODO(),
			filter)
		if result.Err() == nil {
			// replace mission
			_, err := v2config.GetCollection(v2config.DB, "metrics2", "missions").ReplaceOne(
				context.TODO(), filter, msn)
			if err != nil {
				log.Printf("%s Replace: %s\n", msn.ID.Hex(), err.Error())
			}
		} else {
			// create mission
			_, err := v2config.GetCollection(v2config.DB, "metrics2", "missions").InsertOne(
				context.TODO(), msn)
			if err != nil {
				log.Printf("%s Insert: %s\n", msn.ID.Hex(), err.Error())
			}
		}
	}

	// get all the v1 outages
	var toutages []v1metrics.GroundOutage

	cursor, err = v2config.GetCollection(v2config.DB, "metrics", "groundoutages").Find(context.TODO(),
		bson.M{})
	if err != nil {
		log.Fatalln(err)
	}

	if err = cursor.All(context.TODO(), &toutages); err != nil {
		log.Fatalln(err)
	}

	// convert all the v1 outages to v2 outages
	outages := make([]v2metrics.GroundOutage, 0)
	for _, outage := range toutages {
		outage.Decrypt()
		out2 := v2metrics.GroundOutage{
			ID:             outage.ID,
			OutageDate:     outage.OutageDate,
			GroundSystem:   outage.GroundSystem,
			Classification: outage.Classification,
			OutageNumber:   outage.OutageNumber,
			OutageMinutes:  outage.OutageMinutes,
			Subsystem:      outage.Subsystem,
			ReferenceID:    outage.ReferenceID,
			MajorSystem:    outage.MajorSystem,
			Problem:        outage.Problem,
			FixAction:      outage.FixAction,
			MissionOutage:  outage.MissionOutage,
			Capability:     outage.Capability,
		}
		outages = append(outages, out2)
	}

	// write the v2 outages to the database
	for _, outage := range outages {
		filter := bson.M{"_id": outage.ID}
		result := v2config.GetCollection(v2config.DB, "metrics2", "outages").FindOne(
			context.TODO(), filter)
		if result.Err() == nil {
			// replace mission
			_, err := v2config.GetCollection(v2config.DB, "metrics2", "outages").ReplaceOne(
				context.TODO(), filter, outage)
			if err != nil {
				log.Printf("%s Replace: %s\n", outage.ID.Hex(), err.Error())
			}
		} else {
			// create mission
			_, err := v2config.GetCollection(v2config.DB, "metrics2", "outages").InsertOne(
				context.TODO(), outage)
			if err != nil {
				log.Printf("%s Insert: %s\n", outage.ID.Hex(), err.Error())
			}
		}
	}
}

func getImageType(imgType v1sysdata.ImageType) v2sysdata.ImageType {
	img := v2sysdata.ImageType{
		ID:           imgType.ID,
		Collected:    imgType.Collected,
		NotCollected: imgType.NotCollected,
		SortID:       imgType.SortID,
	}
	if len(imgType.Subtypes) > 0 {
		for _, sType := range imgType.Subtypes {
			subType := getImageType(sType)
			img.Subtypes = append(img.Subtypes, subType)
		}
	}
	return img
}
