.PHONY: install migrate seed dev test

install:
	pip install -r backend/requirements.txt
	cd frontend && npm install

migrate:
	cd backend && python manage.py migrate

seed:
	cd backend && python manage.py seed

dev:
	@echo "Run in two separate terminals:"
	@echo "  Terminal 1: cd backend && python manage.py runserver"
	@echo "  Terminal 2: cd frontend && npm run dev"

test:
	cd backend && python manage.py test
