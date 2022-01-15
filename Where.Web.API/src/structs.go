package main

type Mensage struct {
	Status  int
	Mensage string
}

type ResponseMap struct {
	result []result
}
type result struct {
	locations locations
}
type locations struct {
	adminArea5 string
}
