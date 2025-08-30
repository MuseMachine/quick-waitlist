terraform {
  backend "azurerm" {
    use_oidc             = true
    use_azuread_auth     = true
    resource_group_name  = "shared-rg"
    storage_account_name = "tfstatebbkll"
    container_name       = "basetfstate"
    key                  = "quickWaitList.tfstate"
  }
}
