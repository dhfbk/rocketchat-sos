import { HelpCommand } from './HelpCommand';
import {
    IAppAccessors,
    ILogger,
    IConfigurationExtend,
    IEnvironmentRead,
    IRead,
    IHttp,
    IPersistence,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IPostMessageSent, IMessage } from '@rocket.chat/apps-engine/definition/messages';

export class HelpAppApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        this.getLogger().debug('Constructor is called and I logged debug.');
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(new HelpCommand());
    }
}
