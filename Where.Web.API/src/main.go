package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/ipinfo/go/v2/ipinfo"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func tryGetCityByGeocode(lat string, lon string) Mensage {
	var url = "http://www.mapquestapi.com/geocoding/v1/reverse?key=" + os.Getenv("MAP_TOKEN") + "&location=" + lat + "," + lon
	fmt.Println(url)
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	return Mensage{
		Status:  1,
		Mensage: string(body),
	}
}

func tryGetCity() Mensage {
	city, err := ipinfo.GetIPCity(nil)
	if err != nil {
		return Mensage{
			Status:  0,
			Mensage: "erro",
		}
	}

	return Mensage{
		Status:  1,
		Mensage: city,
	}
}
func main() {

	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/getByIP", func(c echo.Context) error {

		return c.JSON(http.StatusOK, tryGetCity())
	})

	e.GET("/getByGeocode", func(c echo.Context) error {

		lat := c.QueryParam("lat")
		lon := c.QueryParam("lon")
		return c.JSON(http.StatusOK, tryGetCityByGeocode(lat, lon))

	})

	httpPort := os.Getenv("HTTP_PORT")
	if httpPort == "" {
		httpPort = "8081"
	}

	e.Logger.Fatal(e.Start(":" + httpPort))
}
