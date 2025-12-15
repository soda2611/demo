// app/components/SearchPopper.js
import React, { useCallback } from "react";
import {
  Popper,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
  Box,
  Typography,
} from "@mui/material";

const POPPER_Z_INDEX = 1300;
const LIST_WIDTH = 360;
const LIST_MAX_HEIGHT = 360;

function formatPriceVnd(value) {
  const n = Number(value);
  return `${(Number.isFinite(n) ? n : 0).toLocaleString("vi-VN")}₫`;
}

function isValidSale(sale) {
  const n = Number(sale);
  return Number.isFinite(n) && n > 0;
}

export default function SearchPopper({ open, anchorEl, suggestions = [], onPick, onClose }) {
  const handlePick = useCallback(
    (sug) => {
      onPick?.(sug);
      onClose?.();
    },
    [onPick, onClose]
  );

  return (
    <Popper open={open} anchorEl={anchorEl} placement="auto" style={{ zIndex: POPPER_Z_INDEX }}>
      <Paper
        elevation={3}
        sx={{ width: LIST_WIDTH, maxHeight: LIST_MAX_HEIGHT, overflowY: "auto", overflowX: "hidden" }}
      >
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {suggestions.length} sản phẩm phù hợp
          </Typography>
        </Box>
        <Divider />

        <List dense disablePadding>
          {suggestions.map((sug) => {
            const hasSale = isValidSale(sug.sale);

            return (
              <ListItemButton
                key={`${sug.category}-${sug.name}`}
                onMouseDown={(e) => e.preventDefault()} // giữ focus input, tránh đóng sớm
                onClick={() => handlePick(sug)}
                sx={{ py: 0.75 }}
              >
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Avatar
                    variant="rounded"
                    src={sug.thumbnail || undefined}
                    alt={sug.name}
                    sx={{ width: 40, height: 40, bgcolor: "grey.200", fontSize: 12 }}
                    imgProps={{
                      referrerPolicy: "no-referrer",
                      onError: (e) => {
                        // fallback: ẩn ảnh lỗi, giữ nền xám
                        e.currentTarget.style.visibility = "hidden";
                        const parent = e.currentTarget.parentElement;
                        if (parent) parent.style.background = "#eee";
                      },
                    }}
                  >
                    {sug.name?.slice(0, 2).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                      <Typography variant="body2" noWrap title={sug.name}>
                        {sug.name}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {hasSale ? (
                          <>
                            <Typography variant="body2" fontWeight={700} color="success.main" noWrap>
                              {formatPriceVnd(sug.sale)}
                            </Typography>

                            {sug.price !== sug.sale && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                                noWrap
                              >
                                {formatPriceVnd(sug.price)}
                              </Typography>
                            )}
                          </>
                        ) : (
                          <Typography variant="body2" fontWeight={700} color="text.primary" noWrap>
                            {formatPriceVnd(sug.displayPrice)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {sug.category}
                    </Typography>
                  }
                  sx={{ ml: 0.5 }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    </Popper>
  );
}
