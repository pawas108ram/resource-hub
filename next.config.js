/** @type {import('next').NextConfig} */
const nextConfig = {

    
  webpack: (config, { dev, isServer }) => {
    // Use raw-loader to handle HTML files
    config.module.rules.push({
      test: /\.html$/,
      use: 'raw-loader',
    });

    return config;
  },


    images: {
        domains:['avatars.githubusercontent.com','lh3.googleusercontent.com','res.cloudinary.com','img.freepik.com','cdn-icons-png.flaticon.com']
    }
}

module.exports = nextConfig
