package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"net"

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

func tryGetCity(c echo.Context) Mensage {
	IPAddress := c.Request().Header.Get("X-Real-Ip")
    if IPAddress == "" {
        IPAddress = c.Request().Header.Get("X-Forwarded-For")
    }
    if IPAddress == "" {
        IPAddress = c.Request().RemoteAddr
    }
	city, err := ipinfo.GetIPCity(net.ParseIP(IPAddress))
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
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))

	e.GET("/getByIP", func(c echo.Context) error {

		return c.JSON(http.StatusOK, tryGetCity(c))
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
