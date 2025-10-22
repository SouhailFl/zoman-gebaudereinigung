terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80"
    }
  }

  # Uncomment this after you set up blob storage for state
  # backend "azurerm" {
  #   resource_group_name  = "rg-zoman-terraform"
  #   storage_account_name = "zomanterraformstate"
  #   container_name       = "tfstate"
  #   key                  = "prod.tfstate"
  # }
}

provider "azurerm" {
  features {}
  subscription_id = var.azure_subscription_id
}
