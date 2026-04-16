# ============================================================
# Azure Cosmos DB - MongoDB API Database
# ============================================================
# Stores all application data: users, profiles, messages.
# Uses the MongoDB API for compatibility with Mongoose ODM.
# ============================================================

resource "azurerm_cosmosdb_account" "main" {
  name                = var.cosmosdb_account_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  offer_type = "Standard"
  kind       = "MongoDB"

  # Enable MongoDB API
  capabilities {
    name = "EnableMongo"
  }

  # Free tier (only one per subscription)
  capabilities {
    name = "EnableServerless"
  }

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  # Backup policy
  backup {
    type                = "Periodic"
    interval_in_minutes = 240
    retention_in_hours  = 8
  }

  tags = azurerm_resource_group.main.tags
}

# MongoDB Database
resource "azurerm_cosmosdb_mongo_database" "main" {
  name                = var.cosmosdb_database_name
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
}

# Collections
resource "azurerm_cosmosdb_mongo_collection" "users" {
  name                = "users"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_mongo_database.main.name

  index {
    keys   = ["_id"]
    unique = true
  }

  index {
    keys   = ["email"]
    unique = true
  }
}

resource "azurerm_cosmosdb_mongo_collection" "profiles" {
  name                = "profiles"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_mongo_database.main.name

  index {
    keys   = ["_id"]
    unique = true
  }

  index {
    keys   = ["userId"]
    unique = true
  }

  index {
    keys   = ["collegeMail"]
    unique = true
  }
}

resource "azurerm_cosmosdb_mongo_collection" "messages" {
  name                = "messages"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_mongo_database.main.name

  index {
    keys   = ["_id"]
    unique = true
  }

  index {
    keys = ["senderId", "receiverId"]
  }
}
