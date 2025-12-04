import React, { useState } from 'react';
import { Typography,
         Box,
         AppBar,
         Toolbar,
         Tab,
         Tabs,
         IconButton, 
         Grid,
         Drawer,
         List,
         ListItem,
         ListItemText,
         InputBase,
         useMediaQuery,} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function HomePage() {
    return (
        <div style={{ width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, borderRadius: 10, scrollbarWidth: "none", msOverflowStyle: "none", "&::-webkit-scrollbar": {display: "none",}, }}>
            <Box sx={{ backgroundColor: 'primary.main', height: 300, width: '100%', overflow: 'hidden', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="https://github.com/soda2611/demo/blob/main/public/banner.png?raw=true" alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute', color: 'white', textAlign: 'center', padding: 2, borderRadius: 5, height: 300, width: 'calc(90% - 25px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <Typography variant='h4' component='div' sx={{ fontWeight: 'bold', marginBottom: 1, color: 'white' }}>
                    Chào mừng đến với GreenFarm!
                    </Typography>
                    <Typography variant='body1' color='white' sx={{ textAlign: 'center', marginBottom: 2 }}>
                    Khám phá nông sản tươi sạch, an toàn và chất lượng cao từ các trang trại uy tín. Mua sắm dễ dàng và nhanh chóng ngay hôm nay!
                    </Typography>
                </Box>
            </Box>

            <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', marginTop: 10, marginBottom: 1, color: 'text.primary' }}>Siêu giảm giá</Typography>
            <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 2, sm: 4, md: 4 }} sx={{ justifyContent: 'center' }}>
                {Array.from({ length: 20 }).map((_, i) => (
                    <Grid container spacing={2} key={i} sx={{ padding: 1,  display: 'flex', alignItems: 'center' }}>
                    <Grid item>
                        <Box sx={{ backgroundColor: '#f1f1f1', width: 250, height: 400, borderRadius: 2.5 }}>
                            <div style={{ backgroundColor: '#e0e0e0', width: '100%', height: '60%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                            <Box sx={{ padding: 2, height: '40%' }}>
                                <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                Sản phẩm {i + 1}
                                </Typography>
                                <Typography variant='body1' color='text.secondary' sx={{ marginBottom: 2 }}>
                                {`Mô tả ngắn về sản phẩm ${i + 1}`.length > 24 ? `Mô tả ngắn về sản phẩm ${i + 1}`.substring(0, 22) + "..." : `Mô tả ngắn về sản phẩm ${i + 1}`}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    0₫
                                    </Typography>
                                    <Typography variant='body2' component='div' sx={{ fontWeight: 'bold', color: 'gray', textDecoration: 'line-through' }}>
                                    100.000₫
                                    </Typography>
                                </Box>
                                <IconButton sx={{ position: 'relative', bottom: 13, left: 190 }} aria-label='favorite'>
                                    <ShoppingCartIcon/>
                                </IconButton>
                                <IconButton sx={{ position: 'relative', bottom: 360, left: -50 }} aria-label='favorite'>
                                    <FavoriteBorderIcon/>
                                </IconButton>
                                <Box sx={{ position: 'relative', top: -395, left: 170, fontWeight: 'bold', color: 'white', backgroundColor: 'primary.main', padding: 0.5, borderRadius: 2, fontSize: 12, textAlign: 'center', width: 55 }}>-100%</Box>
                            </Box>
                        </Box>
                    </Grid>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}