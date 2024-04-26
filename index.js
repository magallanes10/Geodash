const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const routesDir = path.join(__dirname, 'routes');

fs.readdirSync(routesDir).forEach(file => {
    if (file.endsWith('.js')) {
        const routePath = path.join(routesDir, file);
        const route = require(routePath);
        app.use('/api', route);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
