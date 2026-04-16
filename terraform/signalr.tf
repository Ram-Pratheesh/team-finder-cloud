# ============================================================
# Azure SignalR Service - Real-time Chat Communication
# ============================================================
# Provides real-time WebSocket communication for the chat
# feature in Team Finder. Messages are pushed to connected
# clients instantly via SignalR hubs.
# ============================================================

resource "azurerm_signalr_service" "main" {
  name                = var.signalr_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  sku {
    name     = var.signalr_sku
    capacity = 1
  }

  # Enable Serverless mode (our backend manages connections)
  service_mode = "Serverless"

  # CORS configuration
  cors {
    allowed_origins = ["*"]
  }

  # Connectivity logs for debugging
  connectivity_logs_enabled = true
  messaging_logs_enabled    = true

  tags = azurerm_resource_group.main.tags
}

# Outputs
output "signalr_connection_string" {
  value       = azurerm_signalr_service.main.primary_connection_string
  description = "SignalR primary connection string"
  sensitive   = true
}

output "signalr_hostname" {
  value       = azurerm_signalr_service.main.hostname
  description = "SignalR service hostname"
}
