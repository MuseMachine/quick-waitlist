# We strongly recommend using the required_providers block to set the
# Azure Provider source and version being used
terraform {
  required_version = "~>1.9.1"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>4.27.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~>3.7.2"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  use_oidc            = true
  storage_use_azuread = true
  subscription_id     = local.subscription_id
  features {
  }
}