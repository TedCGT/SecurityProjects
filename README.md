# SecurityProjects
A repository storing all personal security projects I am working on.

I am starting out this project by working on an initial simple C2 framework that I can build upon as I learn more.
Once the C2 server reaches a baseline acceptable functional level I plan on further investigating into agents/malware I can create to interact with the C2.

======================================================================================================================
Basic File Structure:
======================================================================================================================

/C2-Server
│
├── /agent                  # Agent-related files and components
│   ├── agent.py            # Main agent logic (or agent binary)
│   ├── persistence.py      # Code for persistence mechanisms (e.g., startup)
│   ├── beacon.py           # Beaconing mechanism (periodic check-in to server)
│   ├── communications.py   # Handles communication (e.g., HTTP/HTTPS requests)
│   └── encrypt.py          # Encryption methods for data exchange (optional)
│
├── /server                 # C2 server components
│   ├── server.py           # Main server logic (handles incoming requests)
│   ├── commands.py         # Command handling (e.g., execute, upload, download)
│   ├── config.py           # Configuration settings (server address, ports)
│   ├── db.py               # Database to store agent info, logs, etc.
│   ├── logs.py             # Logging utility (e.g., track commands, errors)
│   └── update.py           # Code to update agents dynamically
│
├── /tools                  # Additional utility tools (e.g., for obfuscation or packing)
│   ├── obfuscator.py       # Custom obfuscation or packing script (optional)
│   └── updater.py          # Script to update C2 server and agents
│
├── /network                # Networking and communication-related components
│   ├── dns_tunneling.py    # DNS tunneling (optional)
│   ├── proxy.py            # Proxy or VPN setup (optional)
│   └── dga.py              # Domain Generation Algorithm (optional)
│
├── /configs                # Configuration files
│   ├── server_config.json  # C2 server config (IP, port, protocols)
│   ├── agent_config.json   # Agent configuration (e.g., beacon interval)
│   └── encryption_keys.json # Keys or settings for encryption (optional)
│
├── /logs                   # Log files for debugging, tracking, etc.
│   ├── agent_logs.txt      # Logs of agent activity
│   ├── server_logs.txt     # Logs of server activity
│   └── error_logs.txt      # Errors and debug logs
│
└── /README.md              # Documentation for setup and usage


======================================================================================================================
Future Plan/Implementation ideas
======================================================================================================================

1. THIS C2 SERVER IS BEING CREATED FOR MY OWN LEARNING AND AS A PORTFOLIO TO TRACK MY PROGRESS. IF ANY THIRD PARTY THAT IS NOT MYSELF OR AN INDIVIDUAL I HAVE PERSONALLY AUTHORISED TO USE THE SERVER, I DO NOT TAKE ANY ACCOUNTABILITY FOR ANY MALICIOUS OR NON-MALICIOUS USE OF THIS SERVER OR AGENTS/MALWARE I CREATE TO INTERACT WITH IT.

Purpose: Learning about persistence mechanisms in malware, post-exploitation techniques, network stealth.
Baseline Features: Agent communication via HTTP, File Transfer via SFTP, Remote Shell Access, Infostealing, Creating a botnet // Add more as I discover

2. Build server to accept connections from agents. Check requests headers and other details to ensure connections are coming from my own agents
Implement a back-end DB to track active agents, and build a daily healthcheck that runs to ensure these agents remain live. DB will store agent status, details (IP, Fingerprinting of victim device), agent log locations, transfers etc.

3. Build commands that can be executed by agents, starting out simple with simple process injection and the like. Learn more about persistence via creating registry keys, modifying startup scripts, or scheduling jobs to run etc.

4. Stealth and Evasion: Mimic normal traffic patterns, Antivirus evasion using obfuscasion and API unhooking, DNS tunnelling for stealthy comms or fallback, ecrypt data in transit.

5.
Advanced:
- Dynamic Domain Generation: Create new server addresses for agents to connect to to reduce odds of blacklisting.
- Create a Honeypot server that will redirect legitimate requests from Agents to the real C2, and keep individuals attempting to connect to my server or request things thinking they can gain access and monitor their activity.
- Dynamic Command Channels: Change agent's C2 server address periodically to make it harder to track and block.
- Proxy/Relay to anonymize traffic and hide C2 origin.
- Potentially add update mechanism to update malware code while it remains active.