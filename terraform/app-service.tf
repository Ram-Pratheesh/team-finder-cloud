# ============================================================
# Azure App Service - Backend NestJS Application (Docker)
# ============================================================
# Hosts the NestJS backend as a Docker container.
# The container image is pulled from Azure Container Registry.
# ============================================================

# App Service Plan - Defines the compute resources
resource "azurerm_service_plan" "main" {
  name                = "${var.backend_app_name}-plan"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  os_type             = "Linux"
  sku_name            = var.app_service_plan_sku

  tags = azurerm_resource_group.main.tags
}

# App Service - The actual web app running the Docker container
resource "azurerm_linux_web_app" "backend" {
  name                = var.backend_app_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = true

    application_stack {
      docker_registry_url      = "https://${azurerm_container_registry.main.login_server}"
      docker_registry_username = azurerm_container_registry.main.admin_username
      docker_registry_password = azurerm_container_registry.main.admin_password
      docker_image_name        = "${azurerm_container_registry.main.login_server}/teamfinder-backend:latest"
    }

    # Health check endpoint
    health_check_path = "/health"
  }

  app_settings = {
    "PORT"                                  = "8080"
    "WEBSITES_PORT"                         = "8080"
    "MONGO_URI"                             = azurerm_cosmosdb_account.main.primary_mongodb_connection_string
    "AZURE_SIGNALR_CONNECTION_STRING"       = azurerm_signalr_service.main.primary_connection_string
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = "InstrumentationKey=${azurerm_resource_group.main.id}"
    "NODE_ENV"                              = var.environment
  }

  tags = azurerm_resource_group.main.tags
}
