package main

import (
	"github.com/erneap/metrics3/metrics-api/controllers"
	"github.com/erneap/models/v2/config"
	"github.com/erneap/models/v2/svcs"
	"github.com/gin-gonic/gin"
)

func main() {
	// run database
	config.ConnectDB()

	// add routes
	router := gin.Default()
	api := router.Group("/api/v2/metrics")
	{
		api.GET("/system", controllers.GetSystemInfo)
		msns := api.Group("/missions")
		{
			msns.GET("/:msndate", svcs.CheckJWT("metrics"),
				controllers.GetMissionsByDate)
			msns.GET("/:msndate/:platform", svcs.CheckJWT("metrics"),
				controllers.GetMissionsByDateAndPlatform)
			msns.GET("/:msndate/:platform/:sortie", svcs.CheckJWT("metrics"),
				controllers.GetMissionByDatePlatformAndSortie)
		}
		msn := api.Group("/mission")
		{
			msn.GET("/:id", svcs.CheckJWT("metrics"), controllers.GetMissionByID)
			msn.GET("/dates/:startdate/:enddate", svcs.CheckJWT("metrics"),
				controllers.GetMissionsByDates)
			msn.POST("/", svcs.CheckJWT("metrics"), controllers.CreateMission)
			msn.PUT("/", svcs.CheckJWT("metrics"), controllers.UpdateMission)
			msn.PUT("/sensor", svcs.CheckJWT("metrics"), controllers.UpdateMissionSensor)
			msn.PUT("/sensor/image", svcs.CheckJWT("metrics"),
				controllers.UpdateMissionSensorImages)
			msn.DELETE("/:id", svcs.CheckJWT("metrics"), controllers.DeleteMission)
			msn.DELETE("/purge/:msndate", svcs.CheckRole("metrics", "ADMIN"),
				controllers.PurgeMissions)
		}
		outages := api.Group("/outage")
		{
			outages.GET("/", svcs.CheckJWT("metrics"), controllers.GetAllOutages)
			outages.GET("/bydate/:date", svcs.CheckJWT("metrics"),
				controllers.GetAllOutagesByDate)
			outages.GET("/byweek/:start", svcs.CheckJWT("metrics"),
				controllers.GetAllOutagesByWeek)
			outages.GET("/byperiod/:start/:end", svcs.CheckJWT("metrics"),
				controllers.GetAllOutagesByPeriod)
			outages.GET("/bysystem/:system", svcs.CheckJWT("metrics"),
				controllers.GetAllOutagesBySystem)
			outages.GET("/:id", svcs.CheckJWT("metrics"), controllers.GetOutage)
			outages.POST("/", svcs.CheckJWT("metrics"), controllers.CreateOutage)
			outages.PUT("/", svcs.CheckJWT("metrics"), controllers.UpdateOutage)
			outages.DELETE("/:id", svcs.CheckJWT("metrics"), controllers.DeleteOutage)
			outages.DELETE("/purge/:msndate", svcs.CheckRole("metrics", "ADMIN"),
				controllers.PurgeOutages)
		}
		api.POST("/reports", svcs.CheckJWT("metrics"), controllers.CreateReport)
	}

	// listen on port 3000
	router.Run(":7010")
}
