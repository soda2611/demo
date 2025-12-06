import { Box, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite"
import CommentIcon from "@mui/icons-material/Comment"

export default function BlogCard(){
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 800, width: '90%', borderRadius: 5, border: "2px solid #37be3cff", overflow: 'hidden', backgroundColor: '#f1f1f1', }}>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '95%', height: 90, gap: 2 }}>
                    <Box component='img' src="https://github.com/soda2611/demo/blob/main/public/image.png?raw=true" alt='avt' sx={{ backgroundColor: 'green', borderRadius: 10, width: 50, height: 50, objectFit: "cover", }}/>
                    <Box>
                        <Typography sx={{ width: '100%' }}>GreenFarm</Typography>
                        <Typography variant='caption' sx={{ width: '100%' }}>00:00, 1 tháng 1 năm 2026</Typography>
                    </Box>
                </Box>
                <Typography variant="body1" sx={{ width: '95%', mb: 2, mt: 2 }}>[content]</Typography>
                <Box component='img' src="https://github.com/soda2611/demo/blob/main/public/banner.png?raw=true" alt='img' sx={{ backgroundColor: '#ffffffff', width: '95%', height: '100%', borderRadius: 5, mb: 2 }}></Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '10%', backgroundColor: '#37be3cff', color: 'white', padding: 2, gap: 2 }}>
                <div style={{ display: 'flex', gap: 5 }}><FavoriteIcon/>{Math.floor(Math.random() * 1000) + 100}</div>
                <div style={{ display: 'flex', gap: 5 }}><CommentIcon/>{Math.floor(Math.random() * 100)}</div>
            </Box>
        </Box>
    )
}