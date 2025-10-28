output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.zoman.name
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = azurerm_resource_group.zoman.id
}

output "vm_public_ips" {
  description = "Public IP addresses of the VMs"
  value       = azurerm_public_ip.zoman[*].ip_address
}

output "vm_private_ips" {
  description = "Private IP addresses of the VMs"
  value       = azurerm_network_interface.zoman[*].private_ip_address
}

output "vm_ids" {
  description = "IDs of the VMs"
  value       = azurerm_linux_virtual_machine.zoman[*].id
}

output "key_vault_id" {
  description = "ID of the Key Vault"
  value       = azurerm_key_vault.zoman.id
}

output "key_vault_name" {
  description = "Name of the Key Vault"
  value       = azurerm_key_vault.zoman.name
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.zoman.vault_uri
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = azurerm_storage_account.zoman.name
}

output "vnet_id" {
  description = "ID of the virtual network"
  value       = azurerm_virtual_network.zoman.id
}

output "terraform_commands" {
  description = "Useful Terraform commands"
  value = {
    validate = "terraform validate"
    plan     = "terraform plan -out=tfplan"
    apply    = "terraform apply tfplan"
    destroy  = "terraform destroy"
  }
}
