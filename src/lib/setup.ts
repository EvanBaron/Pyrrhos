import { ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import { config } from 'dotenv';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

config({ path: '.env' });
