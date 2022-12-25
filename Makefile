dev:
	docker-compose up --build alpine

deploy:
	docker-compose up -d alpine
	docker-compose exec alpine /app/reload.py

stop:
	docker-compose down