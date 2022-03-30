import { IHttp, IModify, IRead, IUserRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

// List of emoji
// https://github.com/RocketChat/Rocket.Chat/blob/a729aaa2baffea9338e1b0443cbac1780813bdd6/packages/rocketchat-emoji-emojione/emojiPicker.js

export class HelpCommand implements ISlashCommand {
    public static CommandName = 'aiuto';

    public command: string = HelpCommand.CommandName;
    public i18nParamsExample: string = '';
    public i18nDescription: string = '';
    public providesPreview: boolean = false;

    public static usernameAlias: string = "Kid Actions Help";
    public static sender: string = "kid_actions";

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const url = "http://dh-hetzner.fbk.eu:8001/test.php";
        const message = context.getArguments().join(" ");

        const roomname = context.getRoom().displayName;
        if (roomname === undefined) {
            await this.sendNotification("Error: unable to call /aiuto from direct message chat", ":warning:", modify, context, read);
            return;
        }

        const data = {
            "message": message,
            "roomid": context.getRoom().id,
            "roomname": roomname,
            "userid": context.getSender().id,
            "username": context.getSender().username,
        };
        const response = await http.post(url, {query: "data=" + encodeURIComponent(JSON.stringify(data))});

        if (response === undefined) {
            await this.sendNotification("Error: unable to reach server", ":warning:", modify, context, read);
            return;
        }
        if (response.statusCode !== 200) {
            await this.sendNotification("Error: wrong status code: " + response.statusCode.toString(), ":warning:", modify, context, read);
            return;
        }
        if (response.content === undefined) {
            await this.sendNotification("Error: empty message", ":warning:", modify, context, read);
            return;
        }

        await this.sendNotification(response.content, ":sos:", modify, context, read);
    }

    public async sendNotification(text: string, icon: string, modify: IModify, context: SlashCommandContext, read: IRead): Promise<void> {
        let user = await read.getUserReader().getByUsername(HelpCommand.sender);
        const msg = modify.getCreator().startMessage()
            .setText(text)
            .setUsernameAlias(HelpCommand.usernameAlias)
            .setEmojiAvatar(icon)
            .setRoom(context.getRoom())
            .setSender(user)
            .getMessage();
        await modify.getNotifier().notifyUser(context.getSender(), msg);
    }
}
