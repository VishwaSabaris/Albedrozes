# Connecting AWS EC2 Frontend to Raspberry Pi Backend using Tailscale

This guide walks you through connecting your **AWS EC2 instance** to your **Raspberry Pi onboard the rover** using **Tailscale WireGuard VPN**.

---

## 🎯 Architecture

```text
  [User's Web Browser / Phone]
               │ (Standard Public Internet / Port 80/443)
               ▼
   [AWS EC2 Instance (Public IP)]
   ├── Hosts Built React Frontend (Nginx)
   └── Tailscale Client (IP: 100.x.y.A)
               │
               │ Secure Encrypted Tailscale Tunnel
               │ (Bypasses LTE/NAT/Firewalls with zero port-forwarding)
               ▼
   [Raspberry Pi on Surface Rover]
   ├── Tailscale Client (IP: 100.x.y.B)
   └── FastAPI Backend (Port 8000)
       ├── /camera (MJPEG Video Stream)
       ├── /api/telemetry (Sensors & GPS)
       └── /activate (Rover ID Control)
```

---

## 📋 Step 1: Install Tailscale on the Raspberry Pi

Run on the Raspberry Pi:

```bash
# 1. Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 2. Authenticate and connect to your Tailscale network
sudo tailscale up

# 3. Check the Raspberry Pi's Tailscale IP address:
tailscale ip -4
# Example output: 100.126.160.71
```

*Note down this IP (e.g. `100.126.160.71`).*

---

## 📋 Step 2: Install Tailscale on your AWS EC2 Instance

SSH into your AWS EC2 instance:

```bash
# 1. Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 2. Authenticate to the same Tailscale account
sudo tailscale up

# 3. Verify you can ping the Raspberry Pi from EC2:
ping 100.126.160.71
```

---

## 📋 Step 3: Test API Access from EC2 to Raspberry Pi

On the EC2 instance, query the Raspberry Pi API directly over the Tailscale IP:

```bash
curl http://100.126.160.71:8000/status
# Returns: {"rover_id":"1853RV1","rover_active":false,...}
```

---

## 📋 Step 4: Configure Nginx on EC2 (Reverse Proxy)

Because public web browsers viewing the website cannot directly access internal `100.x.y.z` Tailscale IPs unless they have the Tailscale app installed, **Nginx on EC2 acts as a reverse proxy**:

1. Install Nginx on EC2:
   ```bash
   sudo apt update
   sudo apt install -y nginx
   ```

2. Copy the configuration file:
   ```bash
   sudo cp aws-deploy/nginx-tailscale-ec2.conf /etc/nginx/sites-available/albedrozes
   ```

3. Edit `/etc/nginx/sites-available/albedrozes` and replace `100.126.160.71` with your Raspberry Pi's exact Tailscale IP.

4. Enable the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/albedrozes /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. Make sure the AWS EC2 **Security Group** allows inbound traffic on **Port 80 (HTTP)** and **Port 443 (HTTPS)** from `0.0.0.0/0`.

---

## 📋 Step 5: Test the Website

Open your EC2 public IP or domain in your web browser:
`http://<EC2-PUBLIC-IP>/`

* The frontend loads from EC2.
* Telemetry, camera streams, and rover activation calls automatically route through the encrypted Tailscale tunnel to the Raspberry Pi.
