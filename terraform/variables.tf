# ============================================================
# Variables - Configurable parameters for all environments
# ============================================================

variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "teamfinder-rg"
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "Central India"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# App Service Variables
variable "app_service_plan_sku" {
  description = "SKU for the App Service Plan"
  type        = string
  default     = "B1"
}

variable "backend_app_name" {
  description = "Name of the backend App Service"
  type        = string
  default     = "teamfinder"
}

# Cosmos DB Variables
variable "cosmosdb_account_name" {
  description = "Name of the Cosmos DB account"
  type        = string
  default     = "ppr"
}

variable "cosmosdb_database_name" {
  description = "Name of the Cosmos DB database"
  type        = string
  default     = "teamfinder-db"
}

# Container Registry Variables
variable "acr_name" {
  description = "Name of the Azure Container Registry"
  type        = string
  default     = "teamfinderacr"
}

variable "acr_sku" {
  description = "SKU for Azure Container Registry"
  type        = string
  default     = "Basic"
}

# AKS Variables
variable "aks_cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
  default     = "teamfinder-aks"
}

variable "aks_node_count" {
  description = "Number of nodes in the AKS cluster"
  type        = number
  default     = 2
}

variable "aks_vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_B2s"
}

# SignalR Variables
variable "signalr_name" {
  description = "Name of the Azure SignalR Service"
  type        = string
  default     = "teamfinder-chat"
}

variable "signalr_sku" {
  description = "SKU for Azure SignalR Service"
  type        = string
  default     = "Free_F1"
}
