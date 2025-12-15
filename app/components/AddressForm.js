// app/components/AddressForm.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TextField, Box, Typography, MenuItem, Divider } from "@mui/material";

const LOCATIONS_JSON_PATH = "data/locations.json";

async function fetchJson(path, signal) {
  const res = await fetch(path, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function AddressForm({ value = {}, onChange }) {
  const [locations, setLocations] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const { province = "", district = "", ward = "", street = "" } = value;

  const updateField = useCallback(
    (patch) => {
      onChange?.({ ...value, ...patch });
    },
    [onChange, value]
  );

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const data = await fetchJson(LOCATIONS_JSON_PATH, controller.signal);
        setLocations(Array.isArray(data) ? data : []);
      } catch (err) {
        // Không throw ra UI để tránh crash, chỉ log để debug
        if (err?.name !== "AbortError") {
          console.error("Lỗi khi tải locations.json:", err);
        }
      }
    })();

    return () => controller.abort();
  }, []);

  const selectedProvince = useMemo(
    () => locations.find((p) => p.Name === province) || null,
    [locations, province]
  );

  useEffect(() => {
    if (!province || !selectedProvince) {
      setDistricts([]);
      setWards([]);
      return;
    }

    setDistricts(selectedProvince?.Districts || []);
    setWards([]); // reset danh sách phường khi đổi tỉnh
  }, [province, selectedProvince]);

  useEffect(() => {
    if (!district) {
      setWards([]);
      return;
    }

    const selectedDistrict = districts.find((d) => d.Name === district);
    setWards(selectedDistrict?.Wards || []);
  }, [district, districts]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography fontSize={16} fontWeight={600}>
        Địa chỉ giao hàng
      </Typography>

      <TextField
        label="Số nhà, tên đường"
        fullWidth
        value={street}
        onChange={(e) => updateField({ street: e.target.value })}
      />

      <Divider sx={{ my: 1 }} />

      <TextField
        select
        label="Tỉnh / TP"
        value={province}
        onChange={(e) =>
          updateField({
            province: e.target.value,
            district: "",
            ward: "",
          })
        }
        fullWidth
      >
        {locations.map((p) => (
          <MenuItem key={p.Id} value={p.Name}>
            {p.Name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Quận / Huyện"
        value={district}
        onChange={(e) =>
          updateField({
            district: e.target.value,
            ward: "",
          })
        }
        fullWidth
        disabled={!province}
      >
        {districts.map((d) => (
          <MenuItem key={d.Id} value={d.Name}>
            {d.Name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Phường / Xã"
        value={ward}
        onChange={(e) => updateField({ ward: e.target.value })}
        fullWidth
        disabled={!district}
      >
        {wards.map((w) => (
          <MenuItem key={w.Id} value={w.Name}>
            {w.Name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
