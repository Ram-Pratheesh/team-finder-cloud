# ============================================================
# Outputs - Important values after terraform apply
# ============================================================

output "resource_group_name" {
  value       = azurerm_resource_group.main.name
  description = "The name of the resource group"
}

output "backend_app_url" {
  value       = "https://${azurerm_linux_web_app.backend.default_hostname}"
  description = "The URL of the backend App Service"
}

output "cosmosdb_connection_string" {
  value       = azurerm_cosmosdb_account.main.primary_mongodb_connection_string
  description = "Cosmos DB MongoDB connection string"
  sensitive   = true
}
