output "cluster_name" {
  description = "EKS Küme Adı"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS API Endpoint Adresi"
  value       = module.eks.cluster_endpoint
}

output "region" {
  description = "AWS Bölgesi"
  value       = var.aws_region
}

output "kubeconfig_connect_command" {
  description = "Ubuntu Sunucusundan EKS Kümesine Bağlanma Komutu"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}
