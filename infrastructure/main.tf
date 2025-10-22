# Resource Group
resource "azurerm_resource_group" "zoman" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.azure_region

  tags = {
    project     = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }
}

# Virtual Network
resource "azurerm_virtual_network" "zoman" {
  name                = "vnet-${var.project_name}-${var.environment}"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.zoman.location
  resource_group_name = azurerm_resource_group.zoman.name

  tags = {
    project = var.project_name
  }
}

# Subnet
resource "azurerm_subnet" "zoman" {
  name                 = "subnet-${var.project_name}-${var.environment}"
  resource_group_name  = azurerm_resource_group.zoman.name
  virtual_network_name = azurerm_virtual_network.zoman.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Network Security Group
resource "azurerm_network_security_group" "zoman" {
  name                = "nsg-${var.project_name}-${var.environment}"
  location            = azurerm_resource_group.zoman.location
  resource_group_name = azurerm_resource_group.zoman.name

  tags = {
    project = var.project_name
  }
}

# NSG Rules
resource "azurerm_network_security_rule" "allow_ssh" {
  name                        = "AllowSSH"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "22"
  source_address_prefixes     = var.allowed_ssh_cidrs
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.zoman.name
  network_security_group_name = azurerm_network_security_group.zoman.name
}

resource "azurerm_network_security_rule" "allow_http" {
  name                        = "AllowHTTP"
  priority                    = 110
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "80"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.zoman.name
  network_security_group_name = azurerm_network_security_group.zoman.name
}

resource "azurerm_network_security_rule" "allow_https" {
  name                        = "AllowHTTPS"
  priority                    = 120
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "443"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.zoman.name
  network_security_group_name = azurerm_network_security_group.zoman.name
}

resource "azurerm_network_security_rule" "allow_prometheus" {
  name                        = "AllowPrometheus"
  priority                    = 130
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "9090"
  source_address_prefix       = "10.0.0.0/16"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.zoman.name
  network_security_group_name = azurerm_network_security_group.zoman.name
}

resource "azurerm_network_security_rule" "allow_grafana" {
  name                        = "AllowGrafana"
  priority                    = 140
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "3000"
  source_address_prefix       = "10.0.0.0/16"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.zoman.name
  network_security_group_name = azurerm_network_security_group.zoman.name
}

# Associate NSG with Subnet
resource "azurerm_subnet_network_security_group_association" "zoman" {
  subnet_id                 = azurerm_subnet.zoman.id
  network_security_group_id = azurerm_network_security_group.zoman.id
}

# Public IPs for VMs
resource "azurerm_public_ip" "zoman" {
  count               = var.vm_count
  name                = "pip-${var.project_name}-${var.environment}-${count.index + 1}"
  location            = azurerm_resource_group.zoman.location
  resource_group_name = azurerm_resource_group.zoman.name
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = {
    project = var.project_name
    vm_id   = count.index + 1
  }
}

# Network Interfaces
resource "azurerm_network_interface" "zoman" {
  count               = var.vm_count
  name                = "nic-${var.project_name}-${var.environment}-${count.index + 1}"
  location            = azurerm_resource_group.zoman.location
  resource_group_name = azurerm_resource_group.zoman.name

  ip_configuration {
    name                          = "testconfiguration1"
    subnet_id                     = azurerm_subnet.zoman.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.zoman[count.index].id
  }

  tags = {
    project = var.project_name
  }
}

# Linux Virtual Machines
resource "azurerm_linux_virtual_machine" "zoman" {
  count               = var.vm_count
  name                = "vm-${var.project_name}-${var.environment}-${count.index + 1}"
  location            = azurerm_resource_group.zoman.location
  resource_group_name = azurerm_resource_group.zoman.name
  size                = var.vm_size

  admin_username = var.vm_admin_username

  admin_ssh_key {
    username   = var.vm_admin_username
    public_key = file(var.ssh_public_key_path)
  }

  network_interface_ids = [
    azurerm_network_interface.zoman[count.index].id,
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts-gen2"
    version   = "latest"
  }

  tags = {
    project = var.project_name
    vm_id   = count.index + 1
  }
}

# Storage Account for Key Vault backups
resource "azurerm_storage_account" "zoman" {
  name                     = "st${replace(var.project_name, "-", "")}${var.environment}"
  resource_group_name      = azurerm_resource_group.zoman.name
  location                 = azurerm_resource_group.zoman.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    project = var.project_name
  }
}

# Key Vault for secrets management
resource "azurerm_key_vault" "zoman" {
  name                        = "kv-${var.project_name}-${var.environment}"
  location                    = azurerm_resource_group.zoman.location
  resource_group_name         = azurerm_resource_group.zoman.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Get",
    ]

    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete",
    ]
  }

  tags = {
    project = var.project_name
  }
}

# Data source for current Azure context
data "azurerm_client_config" "current" {}
