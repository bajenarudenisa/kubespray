variable "aws_region" {
  description = "AWS region for the Hello API resources."
  type        = string
  default     = "eu-north-1"
}

variable "image_tag" {
  description = "Tag of the Hello API image in the ECR repository."
  type        = string
  default     = "latest"
}

variable "container_port" {
  description = "Port the API listens on inside the container."
  type        = number
  default     = 8989
}

variable "task_cpu" {
  description = "Fargate task CPU units."
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Fargate task memory in MiB."
  type        = number
  default     = 512
}

variable "name_prefix" {
  description = "Prefix for names created for Hello API."
  type        = string
  default     = "hello-api"
}
