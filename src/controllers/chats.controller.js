import { Chats } from 'api/collections';
import { Controller } from 'angular-ecmascript/module-helpers';

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
    this.callMethod('removeChat', chat._id);
  }
}

ChatsCtrl.$name = 'ChatsCtrl';
