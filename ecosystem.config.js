module.exports = {
  apps: [
    {
      name: "r6bot",
      script: "index.js",
      watch: true,
      log_type: "json",
      out_file: './logs.json',
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],
};
