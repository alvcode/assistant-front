dev:
	docker-compose up -d --build;

stop:
	docker-compose down;

build:
	docker-compose -f docker-compose-prod.yml up --build && \
	docker cp my-tag-lk-prod:/app/dist/ ./dist;