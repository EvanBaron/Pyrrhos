import { PyrrhosClient } from './client';
import './lib/setup';

const client = new PyrrhosClient();

const main = async () => {
    try {
        client.logger.info('Logging in...');
        return client.login(
            process.env.NODE_ENV == 'dev' ? process.env.TEST_CLIENT_TOKEN : process.env.CLIENT_TOKEN
        );
    } catch (error) {
        client.logger.fatal(error);
        client.destroy();
        process.exit(1);
    }
};

void main();
