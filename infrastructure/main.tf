import {
  to = azurerm_resource_group.waitlist
  id = "/subscriptions/b7af0852-b4f7-462e-9352-fc94e43a5278/resourceGroups/quick-waitlist"
}

import {
  to = azurerm_static_web_app.waitlistswa
  id = "/subscriptions/b7af0852-b4f7-462e-9352-fc94e43a5278/resourceGroups/quick-waitlist/providers/Microsoft.Web/staticSites/quick-waitlist-static-web-app"
}

resource "azurerm_resource_group" "waitlist" {
  name     = "quick-waitlist"
  location = local.location
  tags     = local.default_tags
}


resource "azurerm_static_web_app" "waitlistswa" {
  name                = "quick-waitlist-static-web-app" # Choose a unique name
  resource_group_name = azurerm_resource_group.waitlist.name
  location            = "westeurope"
  sku_tier            = "Free" # Or "Free"
  sku_size            = "Free" # Or "Free"
  tags                = local.default_tags
  lifecycle {
    ignore_changes = [
      repository_token,
      repository_branch,
      repository_url
    ]
  }
}

# output "static_web_app_url" {
#   description = "The default hostname of the Static Web App."
#   value       = azurerm_static_web_app.internaldocsswa.default_host_name
# }

# output "static_web_app_id" {
#   description = "The ID of the Static Web App."
#   value       = azurerm_static_web_app.internaldocsswa.id
# }
