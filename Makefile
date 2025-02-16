dev:
	docker compose up -d --build;

stop:
	docker compose down;

build:
	docker compose -f docker-compose-prod.yml up --build;
	docker cp my-tag-lk-prod:/app/dist/ ./;
	chown -R www-data:www-data ./;
	chmod -R ug+w ./dist;
	docker compose -f docker-compose-prod.yml down;

deploy:
	git pull;
	make build;

exec: # str=
	docker exec -it assistant-lk $(str)

sh:
	docker exec -it assistant-lk sh