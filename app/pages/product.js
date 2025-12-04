import React from 'react';
import { Typography,
         Box,
         IconButton, 
         Grid,} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function ProductPage() {
    return (
        <div style={{ width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, backgroundColor: 'primary.light' }}>
            <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', marginBottom: 1, color: 'text.primary' }}>
            Rau
            </Typography>
            <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 2, sm: 4, md: 4 }} sx={{ justifyContent: 'center' }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <Grid container spacing={2} key={i} sx={{ padding: 1,  display: 'flex', alignItems: 'center' }}>
                <Grid item>
                    <Box sx={{ backgroundColor: '#f1f1f1', width: 250, height: 400, borderRadius: 2.5 }}>
                    <div style={{ backgroundColor: '#e0e0e0', width: '100%', height: '60%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                    <Box sx={{ padding: 2, height: '40%' }}>
                        <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        Sản phẩm {i + 1}
                        </Typography>
                        <Typography variant='body1' color='text.secondary' sx={{ marginBottom: 2 }}>
                        Mô tả ngắn về sản phẩm {i + 1}.
                        </Typography>
                        <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        100.000₫
                        </Typography>
                        <IconButton sx={{ position: 'relative', bottom: 13, left: 190 }} aria-label='favorite'>
                        <ShoppingCartIcon/>
                        </IconButton>
                        <IconButton sx={{ position: 'relative', bottom: 360, left: -50 }} aria-label='favorite'>
                        <FavoriteBorderIcon/>
                        </IconButton>
                    </Box>
                    </Box>
                </Grid>
                </Grid>
            ))}
            </Grid>

            <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', marginTop: 10, marginBottom: 1, color: 'text.primary' }}>
            Củ
            </Typography>
            <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 2, sm: 4, md: 4 }} sx={{ justifyContent: 'center' }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <Grid container spacing={2} key={i} sx={{ padding: 1,  display: 'flex', alignItems: 'center' }}>
                <Grid item>
                    <Box sx={{ backgroundColor: '#f1f1f1', width: 250, height: 400, borderRadius: 2.5 }}>
                    <div style={{ backgroundColor: '#e0e0e0', width: '100%', height: '60%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                    <Box sx={{ padding: 2, height: '40%' }}>
                        <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        Sản phẩm {i + 1}
                        </Typography>
                        <Typography variant='body1' color='text.secondary' sx={{ marginBottom: 2 }}>
                        Mô tả ngắn về sản phẩm {i + 1}.
                        </Typography>
                        <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        100.000₫
                        </Typography>
                        <IconButton sx={{ position: 'relative', bottom: 13, left: 190 }} aria-label='favorite'>
                        <ShoppingCartIcon/>
                        </IconButton>
                        <IconButton sx={{ position: 'relative', bottom: 360, left: -50 }} aria-label='favorite'>
                        <FavoriteBorderIcon/>
                        </IconButton>
                    </Box>
                    </Box>
                </Grid>
                </Grid>
            ))}
            </Grid>

            <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', marginTop: 10, marginBottom: 1, color: 'text.primary' }}>
            Trái cây
            </Typography>
            <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 2, sm: 4, md: 4 }} sx={{ justifyContent: 'center' }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <Grid container spacing={2} key={i} sx={{ padding: 1,  display: 'flex', alignItems: 'center' }}>
                <Grid item>
                    <Box sx={{ backgroundColor: '#f1f1f1', width: 250, height: 400, borderRadius: 2.5 }}>
                    <div style={{ backgroundColor: '#e0e0e0', width: '100%', height: '60%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                    <Box sx={{ padding: 2, height: '40%' }}>
                        <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                        Sản phẩm {i + 1}
                        </Typography>
                        <Typography variant='body1' color='text.secondary' sx={{ marginBottom: 2 }}>
                        Mô tả ngắn về sản phẩm {i + 1}.
                        </Typography>
                        <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        100.000₫
                        </Typography>
                        <IconButton sx={{ position: 'relative', bottom: 13, left: 190 }} aria-label='favorite'>
                        <ShoppingCartIcon/>
                        </IconButton>
                        <IconButton sx={{ position: 'relative', bottom: 360, left: -50 }} aria-label='favorite'>
                        <FavoriteBorderIcon/>
                        </IconButton>
                    </Box>
                    </Box>
                </Grid>
                </Grid>
            ))}
            </Grid>
        </div>
    );
}