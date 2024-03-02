dev:
	docker compose up -d --build;

stop:
	docker compose down;

build:
	docker compose -f docker-compose-prod.yml up --build;
	docker cp my-tag-lk-prod:/app/dist/ ./;
	chown -R alvcode:www-data ./dist;
	chmod -R ug+w ./dist;
	docker compose down;