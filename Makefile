dev:
	docker-compose up --build alpine

deploy:
	docker-compose up -d --build alpine
	docker-compose exec alpine /app/reload.py

stop:
	docker-compose down

format:
	black .
	prettier --write .
