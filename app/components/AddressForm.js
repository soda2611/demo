// AddressForm.js
import React, { useEffect, useState } from "react";
import { TextField, Box, Typography, MenuItem, Divider } from "@mui/material";

export default function AddressForm({ value = {}, onChange }) {
  const [locations, setLocations] = useState([]);

  // Lấy từ value truyền xuống (nếu có), fallback thành ""
  const province = value.province || "";
  const district = value.district || "";
  const ward = value.ward || "";
  const street = value.street || "";

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetch("data/locations.json")
      .then((res) => res.json())
      .then((data) => setLocations(data));
  }, []);

  // Khi chọn Tỉnh
  useEffect(() => {
    if (!province) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const selected = locations.find((p) => p.Name === province);
    setDistricts(selected?.Districts || []);
  }, [province, locations]);

  // Khi chọn Quận
  useEffect(() => {
    if (!district) {
      setWards([]);
      return;
    }

    const selectedDistrict = districts.find((d) => d.Name === district);
    setWards(selectedDistrict?.Wards || []);
  }, [district, districts]);

  const updateField = (patch) => {
    // Gộp vào value hiện tại và báo ra ngoài
    onChange?.({ ...value, ...patch });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography fontSize={16} fontWeight={600}>
        Địa chỉ giao hàng
      </Typography>

      {/* Địa chỉ, tên đường */}
      <TextField
        label="Số nhà, tên đường"
        fullWidth
        value={street}
        onChange={(e) => updateField({ street: e.target.value })}
      />

      <Divider sx={{ my: 1 }} />

      {/* Tỉnh / TP */}
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

      {/* Quận / Huyện */}
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

      {/* Phường / Xã */}
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
