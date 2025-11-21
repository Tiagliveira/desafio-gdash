package main

import (
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

const urlRabbit = "amqp://guest:guest@localhost:5672/"
const nomeFila = "weather_data"

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func main() {
	conn, err := amqp.Dial(urlRabbit)
	failOnError(err, "Falha ao conectar no RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Falha ao abrir canal")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		nomeFila,
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao declarar fila")

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Falha ao registrar consumidor")

	forever := make(chan struct{})

	go func() {
		for d := range msgs {
			log.Printf("[RECEBIDO DO PYTHON]: %s", d.Body)
		}
	}()

	log.Printf("Worker Go rodando! Esperando mensagens na fila %s...", nomeFila)
	log.Printf("Aperta CRTL+C para sair")

	<-forever
}
