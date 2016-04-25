import { Chats, Messages } from 'api/collections';
import { Controller } from 'angular-ecmascript/module-helpers';

export default class ChatCtrl extends Controller {
  static $inject = ['$stateParams']

  constructor() {
    super(...arguments);

    this.chatId = this.$stateParams.chatId;

    this.helpers({
      messages() {
        return Messages.find({ chatId: this.chatId });
      },
      data() {
        return Chats.findOne(this.chatId);
      }
    });
  }
}

ChatCtrl.$name = 'ChatCtrl';