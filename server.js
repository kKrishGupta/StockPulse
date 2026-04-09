import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { ENV } from './src/config/env.js';

const startServer = async () => {
  try {
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server running on port http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();