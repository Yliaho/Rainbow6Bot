module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: "r6bot",
      script: "index.js",
      watch: true,
      out_file: '../r6bot-logs.log',
    }
  ],
};
