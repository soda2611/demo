import './style.css';

export const metadata = {
  title: 'GreenFarm',
  description: 'Website bán nông sản - rau củ sạch',
  icons: {
    icon: 'https://github.com/soda2611/tkw/blob/main/public/demo/images/image.png?raw=true',
    shortcut: 'https://github.com/soda2611/tkw/blob/main/public/demo/images/image.png?raw=true',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        {children}
      </body>
    </html>
  );
}
