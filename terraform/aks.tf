# ============================================================
# Azure Kubernetes Service (AKS)
# ============================================================
# Manages containerized deployments of the Team Finder app.
# Provides auto-scaling, self-healing, and rolling updates.
# ============================================================

resource "azurerm_kubernetes_cluster" "main" {
  name                = var.aks_cluster_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = var.aks_cluster_name

  # Default node pool configuration
  default_node_pool {
    name       = "default"
    node_count = var.aks_node_count
    vm_size    = var.aks_vm_size

    # Enable auto-scaling
    enable_auto_scaling = true
    min_count           = 1
    max_count           = 5
  }

  # Managed identity for AKS
  identity {
    type = "SystemAssigned"
  }

  # Network configuration
  network_profile {
    network_plugin = "azure"
    dns_service_ip = "10.0.64.10"
    service_cidr   = "10.0.64.0/19"
  }

  tags = azurerm_resource_group.main.tags
}

# Grant AKS access to pull images from ACR
resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                = azurerm_container_registry.main.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
}

# Outputs
output "aks_cluster_name" {
  value       = azurerm_kubernetes_cluster.main.name
  description = "AKS cluster name"
}

output "aks_kube_config" {
  value       = azurerm_kubernetes_cluster.main.kube_config_raw
  description = "Kubeconfig for connecting to AKS"
  sensitive   = true
}
