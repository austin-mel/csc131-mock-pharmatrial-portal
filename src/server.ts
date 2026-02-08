import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: 'environment/.back-end.env' });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
