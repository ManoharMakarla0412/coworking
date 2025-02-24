const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Assistant API',
      version: '1.0.0',
      description: 'API documentation for managing assistants',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/assistantRoute.js'], // Adjust the path based on your folder structure
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpecs };
