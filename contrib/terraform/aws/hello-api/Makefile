IMAGE_NAME ?= hello-api
CONTAINER_NAME ?= hello-api
HOST_PORT ?= 8989
AWS_REGION ?= eu-north-1
TF_DIR := terraform
ECR_URL = $(shell terraform -chdir=$(TF_DIR) output -raw ecr_repository_url 2>/dev/null)

.PHONY: test build run stop ecr push deploy outputs destroy fmt validate

test:
	npm test

build:
	docker build -t $(IMAGE_NAME):local .

run:
	docker run --rm --name $(CONTAINER_NAME) -p $(HOST_PORT):8989 $(IMAGE_NAME):local

stop:
	-docker stop $(CONTAINER_NAME)

ecr:
	terraform -chdir=$(TF_DIR) init
	terraform -chdir=$(TF_DIR) apply -target=aws_ecr_repository.hello_api -var="aws_region=$(AWS_REGION)"

push: ecr
	@test -n "$(ECR_URL)" || (echo "ECR repository not found; run 'make ecr' first." >&2; exit 1)
	docker build --platform linux/amd64 -t $(IMAGE_NAME):local .
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin "$$(dirname $(ECR_URL))"
	docker tag $(IMAGE_NAME):local $(ECR_URL):latest
	docker push $(ECR_URL):latest

deploy:
	terraform -chdir=$(TF_DIR) init
	terraform -chdir=$(TF_DIR) plan -var="aws_region=$(AWS_REGION)" -out=hello-api.tfplan
	terraform -chdir=$(TF_DIR) apply hello-api.tfplan

outputs:
	terraform -chdir=$(TF_DIR) output

destroy:
	terraform -chdir=$(TF_DIR) destroy -var="aws_region=$(AWS_REGION)"

fmt:
	terraform fmt -recursive $(TF_DIR)

validate:
	terraform -chdir=$(TF_DIR) init -backend=false
	terraform -chdir=$(TF_DIR) validate
