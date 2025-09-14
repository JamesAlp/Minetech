local manUrl = "https://raw.githubusercontent.com/JamesAlp/Minetech/master/cc-scripts/manifest.json"

local function get(url)
  local h, err = http.get(url, {["Cache-Control"]="no-cache"})
  if not h then error("GET "..url.." failed: "..tostring(err)) end
  local s = h.readAll() h.close() return s
end

local ok, man = pcall(function() return textutils.unserializeJSON(get(manUrl)) end)
if not ok or type(man) ~= "table" then error("Bad manifest") end

local base = man.base
local destDir = "/minetech"  -- keep files in their own folder
if not fs.exists(destDir) then fs.makeDir(destDir) end

for _, file in ipairs(man.files or {}) do
  local url = base .. file .. "?t=" .. tostring(os.epoch("utc")) -- cache-bust
  local body = get(url)
  local fh = fs.open(fs.combine(destDir, file), "w")
  fh.write(body) fh.close()
  print("Downloaded "..file)
end

-- make simple runner aliases
local aliasPath = "/.aliases"
local function ensureAlias(name, target)
  local entry = ("alias %s=%s\n"):format(name, target)
  local content = ""
  if fs.exists(aliasPath) then local f=fs.open(aliasPath,"r"); content=f.readAll(); f.close() end
  if not content:find("alias "..name.."=") then
    local f=fs.open(aliasPath,"a"); f.write(entry); f.close()
  end
end
ensureAlias("ingest", "/minetech/ingest.lua")
print("Done. Run: ingest")
