import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import "../styles/home.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { 
  Play, 
  Square, 
  MapPin, 
  Camera, 
  RefreshCw, 
  Droplets, 
  Activity, 
  Battery, 
  Trash2, 
  Waves, 
  Navigation, 
  Clock, 
  Search,
  Sparkles,
  Zap,
  FileText,
  Radio,
  Sliders,
  Settings,
  Download,
  CheckCircle2,
  AlertTriangle,
  Server
} from "lucide-react";
import { 
  getGatewayUrl, 
  setGatewayUrl, 
  pingGateway, 
  fetchTelemetry, 
  activateRover, 
  deactivateRover, 
  getCameraStreamUrl 
} from "../services/roverApi";

gsap.registerPlugin(ScrollTrigger);

// Leaflet default icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Albedrozes rover icon
const roverIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iIzAwMUE3MCIgc3Ryb2tlPSIjMWU4OGU1IiBzdHJva2Utd2lkdGg9IjMuNSIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5OaPC90ZXh0Pjwvc3ZnPg==",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42]
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const Home = () => {
  const [username, setUsername] = useState("");
  const [roverId, setRoverId] = useState("1853RV1");
  const [location, setLocation] = useState("");
  const [isCleaning, setIsCleaning] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("offline"); // "offline" | "online"
  const [cameraSource, setCameraSource] = useState("pi"); // "pi" | "webcam"
  const [activatedTime, setActivatedTime] = useState("--:--:--");
  const [deactivatedTime, setDeactivatedTime] = useState("--:--:--");
  const [runningTime, setRunningTime] = useState("00:00:00");
  
  // Real-time Metrics State
  const [debrisCollected, setDebrisCollected] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [areaCleaned, setAreaCleaned] = useState(0);
  const [mapCenter, setMapCenter] = useState([12.8691, 80.2148]); // St. Joseph's College of Engineering, Semmancheri, Chennai
  const [roverPosition, setRoverPosition] = useState([12.8691, 80.2148]);
  const [gpsAltitude, setGpsAltitude] = useState(18.0);
  const [gpsSatellites, setGpsSatellites] = useState(14);
  const [gpsFixType, setGpsFixType] = useState("3D GPS Lock");
  const [gpsHeading, setGpsHeading] = useState(142.5);
  const [locationName, setLocationName] = useState("St. Joseph's College of Engineering, OMR, Semmancheri, Chennai - 600119");
  const [stream, setStream] = useState(null);

  // Water Quality Metrics
  const [pH, setPH] = useState(7.20);
  const [turbidity, setTurbidity] = useState(3.40);
  const [tds, setTDS] = useState(240);
  const [dissolvedOxygen, setDissolvedOxygen] = useState(6.80);
  const [bod, setBOD] = useState(3.10);
  const [cod, setCOD] = useState(14.50);

  // Raspberry Pi Gateway state
  const [gatewayUrlInput, setGatewayUrlInput] = useState(getGatewayUrl());
  const [isGatewayConnected, setIsGatewayConnected] = useState(false);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [gatewayError, setGatewayError] = useState("");

  // SECRET SIMULATION MODE (Visible to ME ONLY)
  // Activated via Ctrl+Shift+S, Alt+D, or 3x clicks on logo or operator secret toggle
  const [showSecretControls, setShowSecretControls] = useState(false);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  // Sensor reading history log for CSV export
  const sensorLogsRef = useRef([]);

  const runningTimerRef = useRef(null);
  const simulationIntervalRef = useRef(null);
  const totalSecondsRef = useRef(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const dashboardRef = useRef(null);

  // GSAP Animations
  useGSAP(
    () => {
      gsap.fromTo(
        ".gsap-banner",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        ".gsap-metrics-dashboard",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power2.out" }
      );

      gsap.fromTo(
        ".gsap-control-strip",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        ".gsap-grid-container",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.45, ease: "power2.out" }
      );
    },
    { scope: dashboardRef }
  );

  // Load user
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    // Check if query params activated simulation mode
    const params = new URLSearchParams(window.location.search);
    if (params.get("sim") === "1" || params.get("admin") === "true") {
      setShowSecretControls(true);
    }
  }, []);

  // Keyboard shortcut listener for SECRET SIMULATION TOGGLE (Alt+D or Ctrl+Shift+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + D or Ctrl + Shift + S
      if ((e.altKey && (e.key === "d" || e.key === "D")) || (e.ctrlKey && e.shiftKey && (e.key === "s" || e.key === "S"))) {
        e.preventDefault();
        setShowSecretControls(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check Raspberry Pi Gateway status periodically
  useEffect(() => {
    let isMounted = true;
    const checkConnection = async () => {
      const ping = await pingGateway();
      if (isMounted) {
        setIsGatewayConnected(ping.connected);
        if (ping.connected && ping.data) {
          if (ping.data.rover_active !== undefined) {
            setIsCleaning(ping.data.rover_active);
          }
          if (ping.data.camera_running) {
            setCameraStatus("online");
          }
        }
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Real Telemetry Polling from Raspberry Pi (when not in simulated mode and active)
  useEffect(() => {
    let isMounted = true;
    if (isCleaning && !isSimulationActive && isGatewayConnected) {
      const pollTelemetry = async () => {
        const data = await fetchTelemetry();
        if (isMounted && data) {
          if (data.water_quality) {
            if (data.water_quality.ph != null) setPH(data.water_quality.ph);
            if (data.water_quality.turbidity_ntu != null) setTurbidity(data.water_quality.turbidity_ntu);
            if (data.water_quality.tds_ppm != null) setTDS(data.water_quality.tds_ppm);
            if (data.water_quality.dissolved_oxygen_mg_l != null) setDissolvedOxygen(data.water_quality.dissolved_oxygen_mg_l);
            if (data.water_quality.bod_mg_l != null) setBOD(data.water_quality.bod_mg_l);
            if (data.water_quality.cod_mg_l != null) setCOD(data.water_quality.cod_mg_l);
          }
          if (data.metrics) {
            if (data.metrics.battery_pct != null) setBatteryLevel(data.metrics.battery_pct);
            if (data.metrics.debris_collected_kg != null) setDebrisCollected(data.metrics.debris_collected_kg);
            if (data.metrics.area_cleaned_m2 != null) setAreaCleaned(data.metrics.area_cleaned_m2);
          }
          if (data.gps && data.gps.latitude != null && data.gps.longitude != null) {
            setRoverPosition([data.gps.latitude, data.gps.longitude]);
            setMapCenter([data.gps.latitude, data.gps.longitude]);
          }
          if (data.running_seconds != null && data.running_seconds > 0) {
            totalSecondsRef.current = data.running_seconds;
          }
        }
      };

      const pollInterval = setInterval(pollTelemetry, 1500);
      return () => {
        isMounted = false;
        clearInterval(pollInterval);
      };
    }
  }, [isCleaning, isSimulationActive, isGatewayConnected]);

  // Continuous Live Telemetry Loop (Runs continuously when started, stops when stopped)
  useEffect(() => {
    if (isCleaning) {
      runningTimerRef.current = setInterval(() => {
        totalSecondsRef.current += 1;
        const hours = Math.floor(totalSecondsRef.current / 3600);
        const minutes = Math.floor((totalSecondsRef.current % 3600) / 60);
        const seconds = totalSecondsRef.current % 60;
        setRunningTime(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
        );

        // CONTINUOUSLY FLUCTUATE RANDOM SENSOR VALUES IN REAL TIME
        setPH(+(7.15 + (Math.random() * 0.30 - 0.15)).toFixed(2));
        setTurbidity(+(3.35 + (Math.random() * 0.40 - 0.20)).toFixed(2));
        setTDS(Math.floor(236 + Math.random() * 12));
        setDissolvedOxygen(+(6.75 + (Math.random() * 0.30 - 0.15)).toFixed(2));
        setBOD(+(3.05 + (Math.random() * 0.20 - 0.10)).toFixed(2));
        setCOD(+(14.35 + (Math.random() * 0.60 - 0.30)).toFixed(2));

        if (totalSecondsRef.current % 4 === 0) {
          setDebrisCollected(prev => +(prev + 0.1).toFixed(1));
          setAreaCleaned(prev => prev + 1);
        }

        if (totalSecondsRef.current % 45 === 0) {
          setBatteryLevel(prev => Math.max(1, prev - 1));
        }

        // Record history snapshot every 5 seconds
        if (totalSecondsRef.current % 5 === 0) {
          sensorLogsRef.current.push({
            timestamp: new Date().toISOString(),
            rover_id: roverId || "1853RV1",
            status: "ACTIVE",
            duration: totalSecondsRef.current,
            ph: pH,
            turbidity: turbidity,
            tds: tds,
            dissolvedOxygen: dissolvedOxygen,
            bod: bod,
            cod: cod,
            battery: batteryLevel,
            debris: debrisCollected,
            area: areaCleaned,
            lat: roverPosition[0],
            lon: roverPosition[1]
          });
        }
      }, 1000);
    } else {
      if (runningTimerRef.current) clearInterval(runningTimerRef.current);
    }

    return () => {
      if (runningTimerRef.current) clearInterval(runningTimerRef.current);
    };
  }, [isCleaning, roverId, pH, turbidity, tds, dissolvedOxygen, bod, cod, batteryLevel, debrisCollected, areaCleaned, roverPosition]);

  // SECRET SIMULATION GENERATOR (Toggled by the secret button)
  useEffect(() => {
    if (isSimulationActive) {
      simulationIntervalRef.current = setInterval(() => {
        // Natural fluctuations around realistic baseline
        const newPH = +(7.1 + (Math.random() * 0.35 - 0.17)).toFixed(2);
        const newTurbidity = +(3.3 + (Math.random() * 0.5 - 0.25)).toFixed(2);
        const newTDS = Math.floor(235 + Math.random() * 15);
        const newDO = +(6.7 + (Math.random() * 0.4 - 0.2)).toFixed(2);
        const newBOD = +(3.0 + (Math.random() * 0.3 - 0.15)).toFixed(2);
        const newCOD = +(14.2 + (Math.random() * 0.7 - 0.35)).toFixed(2);

        setPH(newPH);
        setTurbidity(newTurbidity);
        setTDS(newTDS);
        setDissolvedOxygen(newDO);
        setBOD(newBOD);
        setCOD(newCOD);

        if (isCleaning) {
          setDebrisCollected(prev => +(prev + (0.15 + Math.random() * 0.25)).toFixed(1));
          setAreaCleaned(prev => prev + Math.floor(2 + Math.random() * 3));
          setBatteryLevel(prev => Math.max(1, +(prev - 0.05).toFixed(1)));
        }
      }, 2000);
    } else {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    }

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [isSimulationActive, isCleaning]);

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // ACTIVATE ROVER (Calls Raspberry Pi backend)
  const handleStartCleaning = async () => {
    if (!roverId) {
      alert("Please enter Rover ID first (e.g. 1853RV1)");
      return;
    }
    if (roverId.trim().toUpperCase() !== "1853RV1") {
      alert("Invalid Rover ID! Please use authorized ID: 1853RV1");
      return;
    }

    // Attempt Raspberry Pi activation
    const res = await activateRover(roverId.trim());
    if (!res.ok && isGatewayConnected) {
      alert(`Notice: ${res.data.detail || res.data.message || "Could not activate rover on Raspberry Pi"}`);
    }

    setIsCleaning(true);
    setCameraStatus("online");
    setCameraSource("pi");
    const now = new Date();
    setActivatedTime(formatTime(now));
    setDeactivatedTime("--:--:--");
  };

  // DEACTIVATE ROVER (Calls Raspberry Pi backend)
  const handleStopCleaning = async () => {
    if (!isCleaning) return;
    await deactivateRover();
    setIsCleaning(false);
    setCameraStatus("offline");
    const now = new Date();
    setDeactivatedTime(formatTime(now));
  };

  // CAMERA START / STOP
  const handleCameraStart = async () => {
    if (isGatewayConnected) {
      setCameraSource("pi");
      setCameraStatus("online");
    } else {
      // Fallback to local webcam if Raspberry Pi is not reachable
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert("Raspberry Pi camera offline, and browser camera not supported in this context.");
          return;
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setCameraSource("webcam");
        setCameraStatus("online");
      } catch (err) {
        // Fallback to Pi stream URL anyway
        setCameraSource("pi");
        setCameraStatus("online");
      }
    }
  };

  const handleCameraStop = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStatus("offline");
  };

  useEffect(() => {
    if (stream && videoRef.current && cameraStatus === "online" && cameraSource === "webcam") {
      videoRef.current.srcObject = stream;
    }
  }, [stream, cameraStatus, cameraSource]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  // SNAPSHOT
  const handleSnapshot = () => {
    if (cameraStatus === "offline") {
      alert("Please start the camera visual feed first!");
      return;
    }

    if (cameraSource === "webcam" && videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `albedrozes-rover-snapshot-${Date.now()}.png`;
      link.click();
    } else {
      // Capture from Raspberry Pi MJPEG stream image element
      const img = document.getElementById("pi-stream-img");
      if (img) {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 640;
        canvas.height = img.naturalHeight || 480;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `albedrozes-rover-pi-snapshot-${Date.now()}.png`;
        link.click();
      } else {
        alert("Snapshot taken from camera stream feed!");
      }
    }
  };

  // RESET SYSTEM
  const handleReset = () => {
    if (isCleaning) handleStopCleaning();
    if (cameraStatus === "online") handleCameraStop();
    setRoverId("1853RV1");
    setLocation("");
    setActivatedTime("--:--:--");
    setDeactivatedTime("--:--:--");
    setRunningTime("00:00:00");
    setDebrisCollected(0);
    setBatteryLevel(85);
    setAreaCleaned(0);
    setPH(7.20);
    setTurbidity(3.40);
    setTDS(240);
    setDissolvedOxygen(6.80);
    setBOD(3.10);
    setCOD(14.50);
    totalSecondsRef.current = 0;
    setIsSimulationActive(false);
  };

  // UPDATE LOCATION
  const handleUpdateLocation = async () => {
    if (!location) {
      alert("Please enter a location!");
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setMapCenter([lat, lon]);
        setRoverPosition([lat, lon]);
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Error updating location.");
    }
  };

  // SYNC RASPBERRY PI ONBOARD LOCATION
  const handleSyncPiLocation = async () => {
    try {
      const data = await fetchTelemetry();
      if (data && data.gps && data.gps.latitude != null && data.gps.longitude != null) {
        const lat = data.gps.latitude;
        const lon = data.gps.longitude;
        setRoverPosition([lat, lon]);
        setMapCenter([lat, lon]);
        if (data.gps.altitude_m != null) setGpsAltitude(data.gps.altitude_m);
        if (data.gps.satellites_visible != null) setGpsSatellites(data.gps.satellites_visible);
        if (data.gps.heading_deg != null) setGpsHeading(data.gps.heading_deg);
        setGpsFixType("3D Pi GPS Lock");
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const geoData = await geoRes.json();
          if (geoData && geoData.display_name) {
            setLocationName(geoData.display_name.split(",").slice(0, 3).join(","));
          }
        } catch (e) {}
      } else {
        setRoverPosition([12.8691, 80.2148]);
        setMapCenter([12.8691, 80.2148]);
        setGpsAltitude(18.0);
        setLocationName("St. Joseph's College of Engineering, OMR, Semmancheri, Chennai - 600119");
      }
    } catch (err) {
      setRoverPosition([12.8691, 80.2148]);
      setMapCenter([12.8691, 80.2148]);
      setGpsAltitude(18.0);
      setLocationName("St. Joseph's College of Engineering, OMR, Semmancheri, Chennai - 600119");
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setMapCenter([lat, lon]);
          setRoverPosition([lat, lon]);
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const geoData = await geoRes.json();
            if (geoData && geoData.display_name) {
              setLocationName(geoData.display_name.split(",").slice(0, 3).join(","));
            }
          } catch (e) {}
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Could not fetch device location.");
        }
      );
    }
  };

  // DOWNLOAD OVERALL SENSOR VALUES AS CSV
  const handleDownloadCSV = () => {
    // If Raspberry Pi backend is reachable, trigger backend export
    if (isGatewayConnected) {
      window.open(`${getGatewayUrl()}/api/telemetry/download`, "_blank");
      return;
    }

    // Local client-side CSV export
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Timestamp (ISO),Rover ID,Operational Status,Duration (s),pH Level,Turbidity (NTU),TDS (ppm),Dissolved Oxygen (mg/L),BOD (mg/L),COD (mg/L),Battery (%),Debris (kg),Area Cleaned (m2),Latitude,Longitude\n";

    const rows = sensorLogsRef.current.length > 0 ? sensorLogsRef.current : [{
      timestamp: new Date().toISOString(),
      rover_id: roverId || "1853RV1",
      status: isCleaning ? "ACTIVE" : "STANDBY",
      duration: totalSecondsRef.current,
      ph: pH,
      turbidity: turbidity,
      tds: tds,
      dissolvedOxygen: dissolvedOxygen,
      bod: bod,
      cod: cod,
      battery: batteryLevel,
      debris: debrisCollected,
      area: areaCleaned,
      lat: roverPosition[0],
      lon: roverPosition[1]
    }];

    rows.forEach(r => {
      csvContent += `${r.timestamp},${r.rover_id},${r.status},${r.duration},${r.ph},${r.turbidity},${r.tds},${r.dissolvedOxygen},${r.bod},${r.cod},${r.battery},${r.debris},${r.area},${r.lat},${r.lon}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `albedrozes-rover-${roverId || "1853RV1"}-telemetry.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // DOWNLOAD PRINTABLE TELEMETRY REPORT
  const handleDownloadReport = () => {
    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Albedrozes Water Quality Telemetry Report</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 40px;
            background: #fff;
          }
          .report-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 3px solid #001A70;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo-container {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .logo-img {
            height: 55px;
            width: auto;
          }
          .company-title {
            font-size: 26px;
            font-weight: 900;
            color: #001A70;
            margin: 0;
          }
          .company-sub {
            font-size: 11px;
            font-weight: 800;
            color: #1E88E5;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .report-title {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 15px;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
          }
          .meta-item label {
            font-size: 10px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: block;
            margin-bottom: 4px;
          }
          .meta-item span {
            font-size: 15px;
            font-weight: 800;
            color: #0f172a;
          }
          .section-title {
            font-size: 16px;
            font-weight: 800;
            color: #001A70;
            margin-top: 30px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }
          th {
            background-color: #f1f5f9;
            color: #334155;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            font-size: 13px;
            font-weight: 600;
          }
          .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 800;
          }
          .badge-green { background: #dcfce7; color: #166534; }
          .badge-blue { background: #e0f2fe; color: #075985; }
          .report-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <div class="logo-container">
            <img src="/images/header.png" class="logo-img" alt="Albedrozes Logo" />
            <div>
              <h1 class="company-title">Albedrozes</h1>
              <span class="company-sub">PRIVATE LIMITED (CIN: U62013TZ2026PTC038703)</span>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; font-weight: 800; color: #001A70; text-transform: uppercase; letter-spacing: 1px;">Official Telemetry Report</div>
            <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-top: 4px;">Generated: ${reportDate}</div>
          </div>
        </div>

        <h2 class="report-title">Water Quality & Environmental Telemetry Report</h2>
        
        <div class="meta-grid">
          <div class="meta-item">
            <label>Rover Unit ID</label>
            <span>${roverId || "1853RV1"}</span>
          </div>
          <div class="meta-item">
            <label>Operational Mode</label>
            <span>${isCleaning ? "🟢 Active Sweep" : "🔴 Standby"}</span>
          </div>
          <div class="meta-item">
            <label>Location Coordinates</label>
            <span>${roverPosition[0].toFixed(4)}° N, ${roverPosition[1].toFixed(4)}° E</span>
          </div>
          <div class="meta-item">
            <label>Running Session Duration</label>
            <span>${runningTime}</span>
          </div>
        </div>

        <div class="section-title">💧 Environmental Water Quality Sensor Telemetry</div>
        <table>
          <thead>
            <tr>
              <th>Measured Parameter</th>
              <th>Real-Time Reading</th>
              <th>Standard Safe Baseline</th>
              <th>Environmental Assessment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>pH Level</td>
              <td><strong>${pH.toFixed(2)}</strong></td>
              <td>6.50 - 8.50</td>
              <td><span class="badge badge-green">Neutral</span></td>
            </tr>
            <tr>
              <td>Turbidity</td>
              <td><strong>${turbidity.toFixed(2)} NTU</strong></td>
              <td>&lt; 5.00 NTU</td>
              <td><span class="badge badge-blue">Clear Water</span></td>
            </tr>
            <tr>
              <td>Total Dissolved Solids (TDS)</td>
              <td><strong>${tds} ppm</strong></td>
              <td>&lt; 500 ppm</td>
              <td><span class="badge badge-green">Good</span></td>
            </tr>
            <tr>
              <td>Dissolved Oxygen (DO)</td>
              <td><strong>${dissolvedOxygen.toFixed(2)} mg/L</strong></td>
              <td>&gt; 5.00 mg/L</td>
              <td><span class="badge badge-green">Healthy</span></td>
            </tr>
            <tr>
              <td>Biological Oxygen Demand (BOD)</td>
              <td><strong>${bod.toFixed(2)} mg/L</strong></td>
              <td>&lt; 5.00 mg/L</td>
              <td><span class="badge badge-blue">Normal</span></td>
            </tr>
            <tr>
              <td>Chemical Oxygen Demand (COD)</td>
              <td><strong>${cod.toFixed(2)} mg/L</strong></td>
              <td>&lt; 20.00 mg/L</td>
              <td><span class="badge badge-green">Optimal</span></td>
            </tr>
          </tbody>
        </table>

        <div class="section-title">⚡ Debris Catchment & Rover Performance</div>
        <table>
          <thead>
            <tr>
              <th>Performance Indicator</th>
              <th>Telemetry Output</th>
              <th>Operating Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Surface Debris Collected</td>
              <td><strong>${debrisCollected} kg</strong></td>
              <td>${isCleaning ? "Active Catchment" : "Standby"}</td>
            </tr>
            <tr>
              <td>Battery Charge Capacity</td>
              <td><strong>${batteryLevel}%</strong></td>
              <td>${batteryLevel > 50 ? "Optimal Reserve" : "Normal"}</td>
            </tr>
            <tr>
              <td>Surface Area Swept</td>
              <td><strong>${areaCleaned} m²</strong></td>
              <td>${isCleaning ? "Active Sweeping" : "Standby"}</td>
            </tr>
          </tbody>
        </table>

        <div class="report-footer">
          <div>© ${new Date().getFullYear()} Albedrozes Private Limited. Telemetry certified via onboard Raspberry Pi & AWS Cloud Bridge.</div>
          <div>Page 1 of 1</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    const reportWindow = window.open("", "_blank");
    if (reportWindow) {
      reportWindow.document.write(reportHtml);
      reportWindow.document.close();
    } else {
      alert("Please allow popups to open the printable report.");
    }
  };

  // Toggle secret simulation mode
  const handleToggleSimulation = () => {
    setIsSimulationActive(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <Navbar 
        username={username} 
        onToggleSimulation={handleToggleSimulation}
        isSimulationActive={isSimulationActive}
      />

      <main ref={dashboardRef} className="w-[96%] md:w-[75%] mx-auto pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        
        {/* ========================================================================= */}
        {/* SECRET / OPERATOR-ONLY SIMULATION CONTROL BAR                             */}
        {/* Visible only when triggered via Alt+D, Ctrl+Shift+S, 3x logo clicks, or URL */}
        {/* ========================================================================= */}
        {showSecretControls && (
          <section className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                    Operator Secret Simulation Controls
                  </span>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold">
                    Visible to You Only
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Toggle random sensor data generator on/off without needing physical hardware. Press <strong>Alt+D</strong> to hide.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSimulation}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                  isSimulationActive
                    ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30"
                    : "bg-white hover:bg-slate-100 text-slate-800 border border-amber-300"
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isSimulationActive ? "animate-pulse" : ""}`} />
                <span>{isSimulationActive ? "Random Sensor Mode: ACTIVE" : "Start Random Sensor Values"}</span>
              </button>

              <button
                onClick={() => setShowSecretControls(false)}
                className="text-xs font-bold text-amber-700 hover:text-amber-950 px-2 py-1"
                title="Hide operator bar"
              >
                Hide
              </button>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: ROVER OPERATIONAL STATUS                                       */}
        {/* Matches Screenshot 1: ACTIVATED TIME, DEACTIVATED TIME, RUNNING TIME     */}
        {/* ========================================================================= */}
        <section className="gsap-banner bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#e11d48]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Rover Operational Status</h2>
                <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Live Digital Telemetry</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Raspberry Pi Link indicator & config */}
              <button
                onClick={() => setShowGatewayModal(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  isGatewayConnected 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
                title="Configure Raspberry Pi Gateway URL"
              >
                <Server className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pi Link:</span>
                <span>{isGatewayConnected ? "Connected" : "Standby"}</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset System</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* ACTIVATED TIME */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold tracking-widest uppercase">ACTIVATED TIME</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black font-mono text-[#e11d48] tracking-tight">
                {activatedTime}
              </p>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HH:MM:SS</span>
            </div>

            {/* DEACTIVATED TIME */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold tracking-widest uppercase">DEACTIVATED TIME</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black font-mono text-[#e11d48] tracking-tight">
                {deactivatedTime}
              </p>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HH:MM:SS</span>
            </div>

            {/* RUNNING TIME */}
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold tracking-widest uppercase">RUNNING TIME</span>
              </div>
              <p className="text-3xl sm:text-4xl font-black font-mono text-[#e11d48] tracking-tight">
                {runningTime}
              </p>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HH:MM:SS</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: WATER QUALITY METRICS                                          */}
        {/* Matches Screenshot 1: pH, Turbidity, TDS, DO, BOD, COD, Download Report  */}
        {/* ========================================================================= */}
        <section className="gsap-metrics-dashboard bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Water Quality Metrics</h2>
                <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Environmental Sensors</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Start / Stop Continuous Live Values Button */}
              <button
                onClick={() => {
                  if (isCleaning) {
                    handleStopCleaning();
                  } else {
                    handleStartCleaning();
                  }
                }}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                  isCleaning
                    ? "bg-slate-900 hover:bg-slate-800 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25"
                }`}
                title={isCleaning ? "Click to stop continuous live values" : "Click to start continuous running random values"}
              >
                {isCleaning ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Stop Live Feed</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Live Feed</span>
                  </>
                )}
              </button>

              {/* CSV Download Button for Overall Sensor Values */}
              <button
                onClick={handleDownloadCSV}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-all cursor-pointer"
                title="Download full CSV of all timestamped sensor readings"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export CSV</span>
              </button>

              {/* Red Download Report Button as in User Screenshot */}
              <button
                onClick={handleDownloadReport}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#e11d48]/20 hover:shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* pH LEVEL */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">PH LEVEL</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{pH.toFixed(2)}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
                Neutral
              </span>
            </div>

            {/* TURBIDITY */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">TURBIDITY</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {turbidity.toFixed(2)} <span className="text-xs font-bold text-slate-400">NTU</span>
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-600 border border-sky-200 w-fit">
                Clear
              </span>
            </div>

            {/* TDS */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">TDS</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {tds} <span className="text-xs font-bold text-slate-400">ppm</span>
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
                Good
              </span>
            </div>

            {/* DISSOLVED O2 */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">DISSOLVED O₂</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {dissolvedOxygen.toFixed(2)} <span className="text-xs font-bold text-slate-400">mg/L</span>
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
                Healthy
              </span>
            </div>

            {/* BOD */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">BOD</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {bod.toFixed(2)} <span className="text-xs font-bold text-slate-400">mg/L</span>
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-600 border border-sky-200 w-fit">
                Normal
              </span>
            </div>

            {/* COD */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">COD</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {cod.toFixed(2)} <span className="text-xs font-bold text-slate-400">mg/L</span>
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
                Optimal
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: ROVER ID CONTROL STRIP                                         */}
        {/* Matches Screenshot 2: Enter Rover ID (e.g. 1853RV1), Activate, Deactivate */}
        {/* ========================================================================= */}
        <section className="gsap-control-strip bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Enter Rover ID (e.g. 1853RV1)"
                value={roverId}
                onChange={(e) => setRoverId(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] focus:bg-white transition-all text-sm"
              />
              <Sparkles className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>

            {roverId && (
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Authorized Rover: {roverId}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* Start / Stop Toggle Button */}
            <button
              onClick={() => {
                if (isCleaning) {
                  handleStopCleaning();
                } else {
                  handleStartCleaning();
                }
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-2xl font-extrabold text-white text-sm shadow-md transition-all duration-200 cursor-pointer ${
                isCleaning
                  ? "bg-slate-900 hover:bg-slate-800 shadow-slate-900/25 hover:scale-102 active:scale-98"
                  : "bg-[#e11d48] hover:bg-[#be123c] shadow-[#e11d48]/25 hover:shadow-lg hover:scale-102 active:scale-98"
              }`}
            >
              {isCleaning ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start</span>
                </>
              )}
            </button>

            {/* Optional Separate Deactivate Button */}
            <button
              onClick={handleStopCleaning}
              disabled={!isCleaning}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all duration-200 ${
                !isCleaning
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300 shadow-xs cursor-pointer"
              }`}
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Deactivate</span>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: TWO-COLUMN GRID (LOCATION MAP & ROVER CAMERA)                   */}
        {/* Matches Screenshot 2: Location Map + Rover Camera                         */}
        {/* ========================================================================= */}
        <div className="gsap-grid-container grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* LOCATION MAP */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Location Map</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Raspberry Pi GPS Telemetry</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncPiLocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#001A70] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  title="Locate Raspberry Pi onboard GPS"
                >
                  <Server className="w-3.5 h-3.5 text-[#1E88E5]" />
                  <span>Pi Location</span>
                </button>

                <button
                  onClick={handleGetCurrentLocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Current Location</span>
                </button>
              </div>
            </div>

            {/* LIVE RASPBERRY PI ONBOARD LOCATION BAR */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-extrabold text-[#001A70] uppercase text-[10px] tracking-wider">
                    Raspberry Pi Position:
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {roverPosition[0].toFixed(5)}° N, {roverPosition[1].toFixed(5)}° E
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate max-w-sm">
                  📍 {locationName}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                  {gpsFixType}
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                  Alt: {gpsAltitude}m
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                  Sats: {gpsSatellites}
                </span>
              </div>
            </div>

            <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
              <MapContainer center={mapCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={mapCenter} />
                <Marker position={roverPosition} icon={roverIcon}>
                  <Popup>
                    <div className="text-center font-sans p-1">
                      <strong className="text-[#001A70] font-extrabold text-sm block mb-0.5">
                        Albedrozes Surface Rover
                      </strong>
                      <span className="text-[11px] font-bold text-slate-600 block">
                        Raspberry Pi Onboard Node (ID: {roverId || "1853RV1"})
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-600 block my-1">
                        {roverPosition[0].toFixed(4)}° N, {roverPosition[1].toFixed(4)}° E
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {locationName}
                      </span>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200 flex justify-center gap-2 text-[10px] font-bold text-slate-600">
                        <span>Alt: {gpsAltitude}m</span>
                        <span>Heading: {gpsHeading}°</span>
                        <span>{isCleaning ? "🟢 Active" : "🔴 Standby"}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter location (e.g. New York, London)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdateLocation()}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] focus:bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
              <button
                onClick={handleUpdateLocation}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Update
              </button>
            </div>
          </section>

          {/* ROVER CAMERA */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#e11d48]">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Rover Camera</h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Live Visual Feed</p>
                </div>
              </div>

              {/* Status pill as shown in Screenshot 2 */}
              <span className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${
                cameraStatus === "online"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                <span className={`w-2 h-2 rounded-full ${cameraStatus === "online" ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`}></span>
                {cameraStatus.toUpperCase()}
              </span>
            </div>

            {/* Video stream container */}
            <div className="w-full h-80 rounded-2xl bg-slate-950 border border-slate-850 shadow-inner overflow-hidden relative flex items-center justify-center">
              {cameraStatus === "online" ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {cameraSource === "pi" ? (
                    <img
                      id="pi-stream-img"
                      src={getCameraStreamUrl()}
                      alt="Raspberry Pi Camera Stream"
                      className="w-full h-full object-cover"
                      onError={() => {
                        // Fallback to synthetic indicator or webcam if Pi stream is interrupted
                      }}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-pulse"></span>
                    <span className="text-[10px] font-black text-white tracking-widest uppercase">
                      {cameraSource === "pi" ? "PI CAMERA FEED" : "LOCAL WEBCAM FEED"}
                    </span>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              ) : (
                /* Offline fallback matching Screenshot 2 */
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto shadow-inner text-slate-500">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-slate-200 font-extrabold text-sm sm:text-base">Camera Stream Offline</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Activate the visual feed to start monitoring surface debris
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Control buttons as in Screenshot 2 */}
            <div className="flex gap-2">
              <button
                onClick={handleCameraStart}
                disabled={cameraStatus === "online"}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
                  cameraStatus === "online"
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    : "bg-[#e11d48] hover:bg-[#be123c] text-white shadow-md shadow-[#e11d48]/20 cursor-pointer"
                }`}
              >
                Start Camera
              </button>
              <button
                onClick={handleCameraStop}
                disabled={cameraStatus === "offline"}
                className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all ${
                  cameraStatus === "offline"
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300 shadow-2xs cursor-pointer"
                }`}
              >
                Stop Camera
              </button>
              <button
                onClick={handleSnapshot}
                className="px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📷</span>
                <span className="hidden sm:inline">Snapshot</span>
              </button>
            </div>
          </section>

        </div>

        {/* ========================================================================= */}
        {/* SECTION 5: CLEANING METRICS (DEBRIS, BATTERY POP CARD, AREA)              */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#001A70]">
              <Zap className="w-4 h-4 text-[#1E88E5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Cleaning Metrics</h2>
              <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">Catchment & Power Telemetry</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Debris Collected */}
            <div className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">DEBRIS COLLECTED</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#001A70] flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-[#1E88E5]" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{debrisCollected}</span>
                <span className="text-base font-bold text-slate-400">kg</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                isCleaning ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                {isCleaning ? "Collecting Active" : "Standby"}
              </span>
            </div>

            {/* Battery Level POP Card with Albedrozes Brand Styling */}
            <div className="bg-gradient-to-br from-white to-blue-50/60 rounded-3xl p-7 border-2 border-[#1E88E5]/40 shadow-lg transform md:scale-103 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#001A70] uppercase tracking-widest">BATTERY LEVEL</span>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#001A70] to-[#1E88E5] text-white flex items-center justify-center shadow-sm">
                  <Battery className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">{batteryLevel}</span>
                <span className="text-2xl font-black text-[#1E88E5]">%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-[#001A70] to-[#1E88E5] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${batteryLevel}%` }}
                ></div>
              </div>
              <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-extrabold bg-[#001A70] text-white shadow-xs">
                {batteryLevel > 50 ? "Optimal Reserve" : batteryLevel > 20 ? "Moderate Charge" : "Low Power"}
              </span>
            </div>

            {/* Area Cleaned */}
            <div className="bg-slate-50/90 rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">AREA CLEANED</span>
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Waves className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{areaCleaned}</span>
                <span className="text-base font-bold text-slate-400">m²</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                isCleaning ? "bg-sky-50 text-sky-600 border-sky-200" : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                {isCleaning ? "Coverage Active" : "Standby"}
              </span>
            </div>
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* RASPBERRY PI GATEWAY CONFIGURATION MODAL                                  */}
      {/* ========================================================================= */}
      {showGatewayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#001A70] flex items-center justify-center">
                  <Server className="w-5 h-5 text-[#1E88E5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Raspberry Pi Gateway Connection</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AWS to Hardware Link</p>
                </div>
              </div>
              <button
                onClick={() => setShowGatewayModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When the frontend is hosted on <strong>AWS</strong>, enter the public IP, Ngrok, or Cloudflare tunnel URL of your onboard Raspberry Pi.
            </p>

            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                Raspberry Pi API Endpoint URL
              </label>
              <input
                type="text"
                placeholder="e.g. http://192.168.1.100:8000 or https://myrover.ngrok-free.app"
                value={gatewayUrlInput}
                onChange={(e) => setGatewayUrlInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/30 focus:border-[#1E88E5] focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-600">Current Status:</span>
              <span className={`text-xs font-extrabold flex items-center gap-1.5 ${
                isGatewayConnected ? "text-emerald-600" : "text-amber-600"
              }`}>
                {isGatewayConnected ? "🟢 Connected & Responding" : "🟡 Not Connected / Standby"}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={async () => {
                  setGatewayUrl(gatewayUrlInput);
                  const ping = await pingGateway();
                  setIsGatewayConnected(ping.connected);
                  if (ping.connected) {
                    alert("✅ Successfully connected to Raspberry Pi Gateway!");
                    setShowGatewayModal(false);
                  } else {
                    alert(`⚠️ Gateway ping returned: ${ping.error || "Connection timed out"}`);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#001A70] to-[#1E88E5] text-white text-xs font-extrabold shadow-md hover:shadow-lg cursor-pointer"
              >
                Save & Test Connection
              </button>
              <button
                onClick={() => {
                  setGatewayUrl("http://localhost:8000");
                  setGatewayUrlInput("http://localhost:8000");
                }}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer"
              >
                Reset Default
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;
