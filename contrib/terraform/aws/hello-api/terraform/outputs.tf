output "api_base_url" {
  description = "Public HTTP endpoint for Hello API."
  value       = "http://${aws_lb.hello_api.dns_name}"
}

output "greeting_url" {
  description = "Full URL for the greeting endpoint."
  value       = "http://${aws_lb.hello_api.dns_name}/Hola/Bubietii"
}

output "ecr_repository_url" {
  description = "ECR repository URI for pushing a built Hello API image."
  value       = aws_ecr_repository.hello_api.repository_url
}
