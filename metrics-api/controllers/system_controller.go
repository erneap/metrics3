package controllers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/erneap/models/v2/systemdata"
	"github.com/gin-gonic/gin"
)

func GetSystemInfo(c *gin.Context) {
	jsonFile, err := os.Open("/data/initial/initial.json")
	if err != nil {
		jsonFile, err = os.Open("./initial.json")
		if err != nil {
			c.JSON(http.StatusBadRequest, &systemdata.SystemInfoResponse{
				Exception: err.Error(),
			})
		}
	}

	log.Println("Opened Initial Data JSON File")
	defer jsonFile.Close()

	// read all the data of the jsonFile into a byteArray
	byteArray, err := io.ReadAll(jsonFile)
	if err != nil {
		c.JSON(http.StatusBadRequest, &systemdata.SystemInfoResponse{
			Exception: err.Error(),
		})
	}
	jsonString := string(byteArray)

	// set a variable for the system info
	var systemInfo systemdata.SystemInfo

	// unmarshall the json data into the system info struct
	err = json.Unmarshal([]byte(jsonString), &systemInfo)
	if err != nil {
		c.JSON(http.StatusBadRequest, &systemdata.SystemInfoResponse{
			Exception: err.Error(),
		})
	}

	c.JSON(http.StatusOK, &systemdata.SystemInfoResponse{
		SystemInfo: systemInfo,
	})
}
