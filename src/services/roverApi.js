// ==============================================================================
// Albedrozes Autonomous Rover - Raspberry Pi API Client
// ==============================================================================

const DEFAULT_GATEWAY = import.meta.env.VITE_ROVER_API_URL || "http://localhost:8000";

export const getGatewayUrl = () => {
  return localStorage.getItem("albedrozes_rover_gateway") || DEFAULT_GATEWAY;
};

export const setGatewayUrl = (url) => {
  if (!url) {
    localStorage.removeItem("albedrozes_rover_gateway");
  } else {
    // Normalize URL
    let clean = url.trim();
    if (clean.endsWith("/")) clean = clean.slice(0, -1);
    localStorage.setItem("albedrozes_rover_gateway", clean);
  }
};

export const pingGateway = async () => {
  const url = getGatewayUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${url}/status`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { connected: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    return { connected: true, data };
  } catch (err) {
    return { connected: false, error: err.message };
  }
};

export const fetchTelemetry = async () => {
  const url = getGatewayUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${url}/api/telemetry`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Telemetry failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const activateRover = async (roverId) => {
  const url = getGatewayUrl();
  try {
    const res = await fetch(`${url}/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rover_id: roverId }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { success: false, message: err.message } };
  }
};

export const deactivateRover = async () => {
  const url = getGatewayUrl();
  try {
    const res = await fetch(`${url}/deactivate`, {
      method: "POST",
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return { ok: false, data: { success: false, message: err.message } };
  }
};

export const getCameraStreamUrl = () => {
  return `${getGatewayUrl()}/camera`;
};

export const getDownloadCsvUrl = () => {
  return `${getGatewayUrl()}/api/telemetry/download`;
};
