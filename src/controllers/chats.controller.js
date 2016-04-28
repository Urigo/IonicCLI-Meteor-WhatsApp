import { Chats } from 'api/collections';
import { Controller } from '../entities';

export default class ChatsCtrl extends Controller {
  static $inject = ['NewChat']

  constructor() {
    super(...arguments);

    this.helpers({
      data() {
        return Chats.find();
      }
    });
  }

  showNewChatModal() {
    this.NewChat.showModal();
  }

  remove(chat) {
    this.data.remove(chat);
  }
}