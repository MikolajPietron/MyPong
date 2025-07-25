export default {
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000' // for local dev only
    }
  }
}
