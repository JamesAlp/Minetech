-- Auto-detect peripherals and stream typed datapoints to WS
-- Depends on: /minetech/config.lua  (host, port, path, interval_sec)

local cfg = require("config")

local PERIPHERAL_TYPE = {
  RF_STORAGE = "RF Storage",
}

local function ws_url()
  return ("ws://%s:%d%s"):format(cfg.host, cfg.port, cfg.path)
end

local function now_ms() return os.epoch("utc") end

-- helpers to read energy from many mods
local ENERGY_GETTERS = { "getEnergyStored", "getStored", "getEnergy", "energy" }
local CAP_GETTERS    = { "getMaxEnergyStored", "getCapacity", "getMaxEnergy", "capacity" }

local function firstMethod(p, names)
  for _, n in ipairs(names) do
    if type(p[n]) == "function" then return n end
  end
end

local function safeCall(fn)
  local ok, res = pcall(fn)
  if ok then return res end
  return nil
end

local function readEnergyPair(p)
  local g = firstMethod(p, ENERGY_GETTERS)
  local c = firstMethod(p, CAP_GETTERS)
  local stored = g and safeCall(function() return p[g](p) end) or nil
  local cap    = c and safeCall(function() return p[c](p) end) or nil
  if stored ~= nil or cap ~= nil then
    return tonumber(cap or 0), tonumber(stored or 0)
  end
  return nil, nil
end

local function computerInfo()
  local id = os.getComputerID()
  local label = os.getComputerLabel()
  return { id = id, name = label or ("computer-" .. id) }
end

-- Build one datapoint for a given peripheral name (side or modem-attached name)
local function buildDatapointFor(name)
  -- Wrap and get metadata
  local meta = nil
  local p = peripheral.wrap(name)
  if not p then return nil end

  -- getMetadata is not guaranteed; guard it
  if peripheral.getMetadata then
    local ok, md = pcall(peripheral.getMetadata, name)
    if ok then meta = md end
  end

  -- Ender IO Capacitor Bank (basic/others share the block name)
  if meta and meta.name == "enderio:block_cap_bank" then
    local cap, stored = readEnergyPair(p)
    local dp = {
      computer  = computerInfo(),
      peripheral = {
        location = name,                         -- e.g. "left", "right", or a modem name
        type     = PERIPHERAL_TYPE.RF_STORAGE,   -- server enum will match this
        data     = {
          RFCapacity = cap or 0,
          RFStored   = stored or 0,
        }
      },
      ts = now_ms(),
    }
    return dp
  end

  -- You can add more detectors here:
  -- if meta and meta.name == "some:other_block" then ... end

  return nil
end

local function connectWs()
  local u = ws_url()
  print("WS connect -> " .. u)
  local ws, err = http.websocket(u)
  if not ws then
    print("WS error: " .. tostring(err))
    return nil
  end
  return ws
end

local function main()
  local interval = tonumber(cfg.interval_sec or 1.0)
  local backoff = 1

  while true do
    local ws = connectWs()
    if ws then
      backoff = 1
      while true do
        -- scan all peripherals
        for _, name in ipairs(peripheral.getNames()) do
          local dp = buildDatapointFor(name)
          if dp then
            ws.send(textutils.serializeJSON(dp))
          end
        end

        -- wait interval or break on close
        local t = os.startTimer(interval)
        while true do
          local ev, a = os.pullEvent()
          if ev == "timer" and a == t then break end
          if ev == "websocket_closed" then
            print("WS closed; reconnecting...")
            ws.close(); ws = nil
            break
          end
        end
        if not ws then break end
      end
    end
    sleep(backoff)
    backoff = math.min(backoff * 2, 30) -- simple reconnect backoff
  end
end

main()
