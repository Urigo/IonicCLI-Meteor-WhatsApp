import { Meteor } from 'meteor/meteor';
import { check as Check } from 'meteor/check';
import { Cahts, Messages } from './collections';

Meteor.methods({
  newMessage(message) {
    Check(message, {
      text: String,
      chatId: String
    });

    message.timestamp = new Date();

    const messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  }
});