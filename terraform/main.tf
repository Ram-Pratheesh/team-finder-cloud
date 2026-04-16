# ============================================================
# TeamX - Team Finder Application
# Terraform Infrastructure as Code - Main Configuration
# ============================================================
# This configuration provisions the complete Azure infrastructure
# for the Team Finder application using Infrastructure as Code.
# ============================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90"
    }
  }

  # Remote state storage in Azure Blob Storage (optional)
  # backend "azurerm" {
  #   resource_group_name  = "terraform-state-rg"
  #   storage_account_name = "teamxtfstate"
  #   container_name       = "tfstate"
  #   key                  = "teamfinder.terraform.tfstate"
  # }
}

# Configure the Azure Provider
provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_delete_on_destroy = true
    }
  }
  subscription_id = var.subscription_id
}

# ============================================================
# Resource Group - Central container for all Azure resources
# ============================================================
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "TeamFinder"
    ManagedBy   = "Terraform"
    Team        = "TeamX"
  }
}
