terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "key_name" {
  type = string
}

variable "allowed_ssh_cidr" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_security_group" "api_sg" {
  name        = "lactenovo-api-sg"
  description = "Acceso a la API, Grafana y SSH"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  ingress {
    from_port   = 3000
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "api_host" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.small"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.api_sg.id]

  user_data = templatefile("${path.module}/user_data.sh.tftpl", {
    db_password = var.db_password
  })

  tags = {
    Name    = "lactenovo-api"
    Project = "Ingenieria Web II"
  }
}

output "public_ip" {
  value = aws_instance.api_host.public_ip
}
