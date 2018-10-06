local ESX      = nil
local open 		 = false
local inMarker = false

-- ESX
Citizen.CreateThread(function()
	while ESX == nil do
		TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
		Citizen.Wait(0)
	end
end)

-- Notification
function hintToDisplay(text)
	SetTextComponentFormat("STRING")
	AddTextComponentString(text)
	DisplayHelpTextFromStringLabel(0, 0, 1, -1)
end

-- Display marker and Enter/Exit events
Citizen.CreateThread(function ()
  while true do
    Wait(0)
		v = Config.Marker
    if( v.Type ~= -1 and GetDistanceBetweenCoords(GetEntityCoords(GetPlayerPed(-1)), v.Pos.x, v.Pos.y, v.Pos.z, true) < 50 ) then
      DrawMarker(v.Type, v.Pos.x, v.Pos.y, v.Pos.z, 0.0, 0.0, 0.0, 0, 0.0, 0.0, v.Size.x, v.Size.y, v.Size.z, v.Color.r, v.Color.g, v.Color.b, 100, false, true, 2, false, false, false, false)
    end
		if( v.Type ~= -1 and GetDistanceBetweenCoords(GetEntityCoords(GetPlayerPed(-1)), v.Pos.x, v.Pos.y, v.Pos.z, true) < v.Size.x ) then
      inMarker = true
			hintToDisplay(v.Hint)
		else
			inMarker = false
    end
	end
end)

-- Key event
Citizen.CreateThread(function()
	while true do
		Wait(0)
		if IsControlJustReleased(0, 38) and inMarker then
			ESX.TriggerServerCallback('jsfour-criminalrecord:fetch', function( d )
				SetNuiFocus(true, true)
				open = true

				SendNUIMessage({
				  action = "open",
					array  = d
				})
		  end, data, 'start')
		end
	end
end)

-- Disable movements when the NUI is open
Citizen.CreateThread(function()
	SetNuiFocus(false, false)
  while true do
    if open then
      DisableControlAction(0, 1, true) -- LookLeftRight
      DisableControlAction(0, 2, true) -- LookUpDown
      DisableControlAction(0, 24, true) -- Attack
      DisablePlayerFiring(GetPlayerPed(-1), true) -- Disable weapon firing
      DisableControlAction(0, 142, true) -- MeleeAttackAlternate
      DisableControlAction(0, 106, true) -- VehicleMouseControlOverride
    end
    Citizen.Wait(0)
  end
end)

-- NUI Callback - Close
RegisterNUICallback('escape', function(data, cb)
	SetNuiFocus(false, false)
	open = false
	cb('ok')
end)

-- NUI Callback - Fetch
RegisterNUICallback('fetch', function(data, cb)
	ESX.TriggerServerCallback('jsfour-criminalrecord:fetch', function( d )
    cb(d)
  end, data, data.type)
end)

-- NUI Callback - Search
RegisterNUICallback('search', function(data, cb)
	ESX.TriggerServerCallback('jsfour-criminalrecord:search', function( d )
    cb(d)
  end, data)
end)

-- NUI Callback - Add
RegisterNUICallback('add', function(data, cb)
	ESX.TriggerServerCallback('jsfour-criminalrecord:add', function( d )
    cb(d)
  end, data)
end)

-- NUI Callback - Update
RegisterNUICallback('update', function(data, cb)
	ESX.TriggerServerCallback('jsfour-criminalrecord:update', function( d )
    cb(d)
  end, data)
end)

-- NUI Callback - Remove
RegisterNUICallback('remove', function(data, cb)
	ESX.TriggerServerCallback('jsfour-criminalrecord:remove', function( d )
    cb(d)
  end, data)
end)
