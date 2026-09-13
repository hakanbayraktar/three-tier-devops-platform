variable "aws_region" {
  description = "AWS Bölgesi (Varsayılan: us-east-1)"
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "EKS Küme Adı"
  type        = string
  default     = "three-tier-eks-cluster"
}

variable "environment" {
  description = "Ortam Adı"
  type        = string
  default     = "training"
}

variable "vpc_cidr" {
  description = "VPC CIDR Bloğu"
  type        = string
  default     = "10.0.0.0/16"
}

variable "node_instance_types" {
  description = "Maliyet dostu standart EKS Worker Node tipi"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "desired_nodes" {
  description = "İstenen Worker Node sayısı"
  type        = number
  default     = 2
}

variable "min_nodes" {
  description = "Minimum Worker Node sayısı"
  type        = number
  default     = 2
}

variable "max_nodes" {
  description = "Maksimum Worker Node sayısı"
  type        = number
  default     = 3
}
