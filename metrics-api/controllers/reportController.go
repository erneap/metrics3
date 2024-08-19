package controllers

import (
	"bytes"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	systemdata "github.com/erneap/metrics3/metrics-api/models/systemData"
	"github.com/erneap/metrics3/metrics-api/models/web"
	"github.com/erneap/metrics3/metrics-api/reports"
	"github.com/gin-gonic/gin"
)

func CreateReport(c *gin.Context) {
	reportBase := os.Getenv("REPORT_DIR")
	var data web.ReportRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.Message{Message: "Trouble with request: " + err.Error()})
		return
	}

	rptType := systemdata.ALL
	switch strings.ToLower(data.ReportType) {
	case "geoint":
		rptType = systemdata.GEOINT
	case "syers":
		rptType = systemdata.SYERS
	case "ddsa":
		rptType = systemdata.MIST
	case "xint":
		rptType = systemdata.XINT
	}
	start, err := time.ParseInLocation("2006|01|02", data.StartDate, time.UTC)
	if err != nil {
		c.JSON(http.StatusBadRequest, "Start Date Problem: "+err.Error())
		fmt.Println(err)
		return
	}
	var end time.Time
	if data.EndDate != "" {
		end, err = time.ParseInLocation("2006|01|02", data.EndDate, time.UTC)
		if err != nil {
			c.JSON(http.StatusBadRequest, "End Date Problem: "+err.Error())
			fmt.Println(err)
			return
		}
	}

	switch strings.ToLower(data.Report) {
	case "mission summary":
		msnsum := reports.MissionSummary{
			ReportType:   rptType,
			ReportPeriod: data.ReportPeriod,
			StartDate:    start,
			EndDate:      end,
			Daily:        data.IncludeDaily,
		}
		workbook, err := msnsum.Create()
		if err != nil {
			c.JSON(http.StatusInternalServerError,
				web.Message{Message: "Error during creation: " + err.Error()})
		}
		// save workbook to directory storage for recall
		// Add structure for report to include msnsummary/date/MsnSummary-Filter-date.xlsx
		now := time.Now()
		sDate := now.Format("2006-01-02")
		path := filepath.Join(reportBase, "msnsummary", sDate)
		if err := os.MkdirAll(path, 0755); err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		path = filepath.Join(path, "MsnSummary-"+data.ReportType+"-"+
			now.Format("200601021504")+".xlsx")
		if err := workbook.SaveAs(path); err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		var b bytes.Buffer
		if err := workbook.Write(&b); err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		downloadName := "Msn_Summary.xlsx"
		c.Header("Content-Description", "File Transfer")
		c.Header("Content-Disposition", "attachment; filename="+downloadName)
		c.Data(http.StatusOK,
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			b.Bytes())
	case "draw summary":
		draw := reports.DrawSummary{
			ReportType:   rptType,
			ReportPeriod: data.ReportPeriod,
			StartDate:    start,
			EndDate:      end,
			Daily:        data.IncludeDaily,
		}
		workbook, err := draw.Create()

		if err != nil {
			c.JSON(http.StatusInternalServerError,
				web.Message{Message: "Error during creation: " + err.Error()})
		}

		// save workbook to directory storage for recall
		// Add structure for report to include msnsummary/date/MsnSummary-Filter-date.xlsx
		now := time.Now()
		sDate := now.Format("2006-01-02")
		path := filepath.Join(reportBase, "drawreport", sDate)
		if err := os.MkdirAll(path, 0755); err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		path = filepath.Join(path, "DrawReport-"+data.ReportType+"-"+
			now.Format("200601021504")+".xlsx")
		if err := workbook.SaveAs(path); err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		var b bytes.Buffer
		if err := workbook.Write(&b); err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
		}
		drawName := "DrawReport.xlsx"
		c.Header("Content-Description", "File Transfer")
		c.Header("Content-Disposition", "attachment; filename="+drawName)
		c.Data(http.StatusOK,
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			b.Bytes())
	case "xint":
		c.JSON(http.StatusNotFound, web.Message{Message: "XINT Report Not Available"})
	}
}
