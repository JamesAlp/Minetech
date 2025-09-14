return {
  host = "172.25.51.148",  -- LAN IP (or localhost if Docker Desktop)
  port = 3001,
  path = "/ingest"
}

/*

james@DESKTOP-LPNET1J:~/Projects/minetech2$ ip addr | grep eth0 -nA2
7:2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
8-    link/ether 00:15:5d:66:34:70 brd ff:ff:ff:ff:ff:ff
9:    inet 172.25.51.148/20 brd 172.25.63.255 scope global eth0
10-       valid_lft forever preferred_lft forever
11-    inet6 fe80::215:5dff:fe66:3470/64 scope link 

*/