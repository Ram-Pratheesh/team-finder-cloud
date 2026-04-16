# ============================================================
# Azure Container Registry (ACR)
# ============================================================
# Stores Docker images for the Team Finder application.
# Images are pushed here via CI/CD and pulled by App Service / AKS.
# ============================================================

resource "azurerm_container_registry" "main" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = var.acr_sku
  admin_enabled       = true

  tags = azurerm_resource_group.main.tags
}

# Output the ACR login server for use in CI/CD
output "acr_login_server" {
  value       = azurerm_container_registry.main.login_server
  description = "The login server URL for ACR"
}

output "acr_admin_username" {
  value       = azurerm_container_registry.main.admin_username
  description = "ACR admin username"
  sensitive   = true
}

output "acr_admin_password" {
  value       = azurerm_container_registry.main.admin_password
  description = "ACR admin password"
  sensitive   = true
}
