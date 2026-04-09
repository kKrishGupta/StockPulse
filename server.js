import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { ENV } from './src/config/env.js';

const startServer = async() =>{
  await connectDB();
  app.listen(ENV.PORT, () =>{
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
}
startServer();