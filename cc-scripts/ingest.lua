local cfg = require("config")
local URL = ("ws://%s:%d%s"):format(cfg.host, cfg.port, cfg.path)

local function now_ms() return os.epoch("utc") end

print("Connecting "..URL)
local ws, err = http.websocket(URL)
if not ws then print("WS error:", err) return end

ws.send(textutils.serializeJSON({
  deviceId = os.getComputerID(),
  source   = "basic_cap_bank_1",
  metric   = "rf_stored",
  value    = 123456,
  unit     = "RF",
  ts       = now_ms(),
}))

ws.close()
print("Sent one frame, done.")
