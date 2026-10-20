# Hello API

A small Node.js HTTP service that returns a greeting as JSON. It is packaged as a Docker image, listens on port **8989**, and includes Terraform for a public AWS ECS Fargate deployment behind an Application Load Balancer.

## API

- `GET /Hola/Bubietii` → `{"message":"Hello Fantomitze from Linkedin Learning"}`
- `GET /health` → `{"status":"ok"}`
- Other paths return a JSON 404.

## Requirements

- Node.js 22+ and npm for running the tests
- Docker for container build/run
- Terraform 1.5+ and AWS CLI for AWS deployment
- AWS credentials configured using an AWS profile, environment variables, or another supported AWS credential provider

Do not put AWS access keys in Terraform files or commit credentials. The Terraform examples default to `eu-north-1`; change `aws_region` when needed.

## Test and run locally

From this directory:

```sh
make test
make build
```

Start the container in the foreground, mapping host port 8989 to container port 8989:

```sh
make run
```

In another terminal, test the endpoint:

```sh
curl -i http://localhost:8989/Hola/Bubietii
curl -i http://localhost:8989/health
```

Stop the foreground container with Ctrl+C. To run it detached instead, use `docker run -d --rm --name hello-api -p 8989:8989 hello-api:local`, then stop it with `make stop`.

You can override the local port with `make run HOST_PORT=9000` and then call `http://localhost:9000/Hola/Bubietii`.

## Deploy to AWS with Terraform

Terraform creates an ECR repository, VPC and two public subnets, an internet gateway, an internet-facing Application Load Balancer, an ECS cluster, an ECS Fargate task and service, an execution role, and a CloudWatch log group. The load balancer accepts public HTTP on port 80 and routes to tasks on port 8989. This sample is intended for demonstration; for production, configure HTTPS with an ACM certificate and tighten network and operational controls.

The first step bootstraps only the ECR repository, so the application image can be pushed before ECS attempts to launch tasks. Then push the image and apply the complete infrastructure:

```sh
make ecr
make push
make deploy
```

The bootstrap target uses Terraform's `-target` option solely to create the ECR repository before the first full apply. Subsequent infrastructure changes should use the normal `make deploy` workflow.

After deployment, Terraform prints `api_base_url` and `greeting_url`. Test the deployed service with:

```sh
curl "$(cd terraform && terraform output -raw greeting_url)"
```

To remove the AWS resources when finished:

```sh
make destroy
```

This deletes the ECR repository and its images as well as the other managed resources. AWS charges may apply while resources exist, especially for the public load balancer, Fargate tasks, and networking. Review `terraform plan` before applying changes.

## Useful Make targets

- `make test` — run the Node.js API tests.
- `make build` — build `hello-api:local`.
- `make run` — run the local container on host port 8989.
- `make stop` — stop a detached container named `hello-api`.
- `make ecr` — initialize Terraform and bootstrap the ECR repository.
- `make push` — build, tag, and push the image to ECR.
- `make deploy` — plan and apply the AWS infrastructure.
- `make outputs` — show Terraform outputs.
- `make destroy` — destroy the AWS infrastructure.
- `make fmt` / `make validate` — format and validate Terraform configuration.

Set `AWS_REGION=...` to override the default region. Terraform resource settings can also be overridden with `TF_VAR_...` environment variables.
